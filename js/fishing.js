import {
  FISHING_CONFIG,
  BAITS,
  BAIT_ORDER,
  RODS,
  FISH,
  MESSAGES,
  REGIONS,
} from './data.js';
import {
  randomRange,
  randomChoice,
  weightedPick,
  formatGold,
  formatMessage,
  clamp,
} from './utils.js';
import { state, setFishingActive, addFishToBag, recordCatch, checkRegionCompletion, claimRegionReward, checkKingAchievement } from './state.js';
import { showToast, updateTopbar } from './ui.js';
import { startReelGame, setReelHolding, isReelingActive } from './reel.js';
import { isInstantBiteEnabled } from './debug.js';
import { showKingCelebrationModal } from './collection.js';

export const FishingState = {
  IDLE: 'IDLE',
  CHARGING: 'CHARGING',
  WAITING: 'WAITING',
  BITE: 'BITE',
  REELING: 'REELING',
  RESULT: 'RESULT',
};

let currentState = FishingState.IDLE;
let chargePower = 0;
let chargeDir = 1; // 1: 증가, -1: 감소
let chargeFrameId = null;
let waitTimerId = null;
let biteTimerId = null;
let pendingFish = null;
let resultData = null;

export function getCurrentState() {
  return currentState;
}

export function setState(next) {
  currentState = next;
  const isBusy = next !== FishingState.IDLE;
  setFishingActive(isBusy);

  // 상단바 및 탭바 비활성화 상태 반영
  const tabbar = document.getElementById('tabbar');
  if (tabbar) {
    if (isBusy) {
      tabbar.classList.add('is-disabled');
    } else {
      tabbar.classList.remove('is-disabled');
    }
  }

  const baitSelect = document.getElementById('fishing-bait-select');
  if (baitSelect) {
    baitSelect.disabled = isBusy;
  }

  const statusText = document.getElementById('fishing-status-text');
  const mainBtn = document.getElementById('btn-main-action');
  const mainBtnText = document.getElementById('btn-main-action-text');
  const bobber = document.getElementById('fishing-bobber');
  const biteAlert = document.getElementById('fishing-bite-alert');
  const chargeBarContainer = document.getElementById('charge-bar-container');

  if (chargeBarContainer) {
    chargeBarContainer.hidden = next !== FishingState.CHARGING;
  }

  if (bobber) {
    bobber.hidden = next === FishingState.IDLE;
    if (next === FishingState.BITE) {
      bobber.classList.add('is-biting');
    } else {
      bobber.classList.remove('is-biting');
    }
  }

  if (biteAlert) {
    biteAlert.hidden = next !== FishingState.BITE;
  }

  // 상태 문구 및 메인 버튼 라벨 갱신
  switch (next) {
    case FishingState.IDLE:
      if (statusText) statusText.textContent = '낚싯대를 던져보세요';
      if (mainBtnText) mainBtnText.textContent = '낚싯대 던지기 (Space)';
      if (mainBtn) mainBtn.disabled = false;
      break;

    case FishingState.CHARGING:
      if (statusText) statusText.textContent = '좋은 타이밍에 멈추세요!';
      if (mainBtnText) mainBtnText.textContent = '던지기! (Space)';
      if (mainBtn) mainBtn.disabled = false;
      break;

    case FishingState.WAITING:
      if (statusText) statusText.textContent = '물고기를 기다리는 중…';
      if (mainBtnText) mainBtnText.textContent = '기다리는 중…';
      if (mainBtn) mainBtn.disabled = false;
      break;

    case FishingState.BITE:
      if (statusText) statusText.textContent = '지금이에요! 당기세요!';
      if (mainBtnText) mainBtnText.textContent = '챔질! (Space)';
      if (mainBtn) mainBtn.disabled = false;
      break;

    case FishingState.REELING:
      if (statusText) statusText.textContent = '물고기를 잡기 영역 안에 두세요';
      if (mainBtnText) mainBtnText.textContent = '꾹 눌러서 감기 (Space)';
      if (mainBtn) mainBtn.disabled = false;
      break;

    case FishingState.RESULT:
      if (mainBtn) mainBtn.disabled = true;
      break;
  }
}

// 2-1. 던지기 시작 (IDLE -> CHARGING)
function startCharging() {
  if (state.bag.length >= state.bagCapacity) {
    showToast(MESSAGES.E01);
    return;
  }

  // 미끼 확인
  const bait = BAITS[state.selectedBait] || BAITS.basic;
  if (!bait.infinite && (state.baits[state.selectedBait] || 0) <= 0) {
    showToast(formatMessage(MESSAGES.E03, { baitName: bait.name }));
    state.selectedBait = 'basic';
    const baitSelect = document.getElementById('fishing-bait-select');
    if (baitSelect) baitSelect.value = 'basic';
  }

  chargePower = 0;
  chargeDir = 1;
  setState(FishingState.CHARGING);

  let lastTime = performance.now();
  const speed = 100 / (FISHING_CONFIG.POWER_CYCLE_SEC / 2); // 100 / 0.8s = 125/sec

  function stepCharge(currentTime) {
    if (currentState !== FishingState.CHARGING) return;
    const dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    chargePower += chargeDir * speed * dt;
    if (chargePower >= 100) {
      chargePower = 100;
      chargeDir = -1;
    } else if (chargePower <= 0) {
      chargePower = 0;
      chargeDir = 1;
    }

    const fill = document.getElementById('charge-fill');
    if (fill) {
      fill.style.width = `${chargePower}%`;
    }

    chargeFrameId = requestAnimationFrame(stepCharge);
  }

  chargeFrameId = requestAnimationFrame(stepCharge);
}

// 2-2. 힘 멈추기 (CHARGING -> WAITING)
function stopCharging() {
  if (chargeFrameId) {
    cancelAnimationFrame(chargeFrameId);
    chargeFrameId = null;
  }

  const finalPower = Math.round(chargePower);

  // 미끼 소모 (특수 미끼면 -1)
  const currentBait = BAITS[state.selectedBait] || BAITS.basic;
  if (!currentBait.infinite && (state.baits[state.selectedBait] || 0) > 0) {
    state.baits[state.selectedBait] -= 1;
  }

  state.stats.totalCasts = (state.stats.totalCasts || 0) + 1;

  // 대기 시간 계산
  let waitSec = 4.0;
  if (isInstantBiteEnabled()) {
    waitSec = 0.5;
  } else if (finalPower >= 90) {
    showToast(MESSAGES.PERFECT_CAST);
    waitSec = randomRange(FISHING_CONFIG.WAIT_TIME.perfect.min, FISHING_CONFIG.WAIT_TIME.perfect.max);
  } else if (finalPower >= 40) {
    waitSec = randomRange(FISHING_CONFIG.WAIT_TIME.normal.min, FISHING_CONFIG.WAIT_TIME.normal.max);
  } else {
    waitSec = randomRange(FISHING_CONFIG.WAIT_TIME.weak.min, FISHING_CONFIG.WAIT_TIME.weak.max);
  }

  setState(FishingState.WAITING);

  waitTimerId = setTimeout(() => {
    triggerBite();
  }, waitSec * 1000);
}

// 2-3. WAITING 중 너무 일찍 당김 (E05)
function handleEarlyPull() {
  if (waitTimerId) {
    clearTimeout(waitTimerId);
    waitTimerId = null;
  }
  showToast(MESSAGES.E05);
  setState(FishingState.IDLE);
}

// 2-4. 입질 발생 (WAITING -> BITE)
function triggerBite() {
  waitTimerId = null;
  determineFish();
  setState(FishingState.BITE);

  biteTimerId = setTimeout(() => {
    // 1.0초 초과 시 놓침 (E06)
    biteTimerId = null;
    showToast(MESSAGES.E06);
    setState(FishingState.IDLE);
  }, FISHING_CONFIG.BITE_WINDOW_SEC * 1000);
}

// 물고기 결정 규칙 (3장)
function determineFish() {
  const bait = BAITS[state.selectedBait] || BAITS.basic;
  let rarity = weightedPick(bait.weights);

  // 디버그 옵션 체크
  if (window.__forceLegendaryOnce) {
    rarity = 'legendary';
    window.__forceLegendaryOnce = false;
  }

  // 현재 지역 물고기 필터링
  const availableFish = FISH.filter(
    (f) => f.region === state.currentRegion && f.rarity === rarity
  );

  const selectedFish = availableFish.length > 0 ? randomChoice(availableFish) : FISH[0];
  const size = Math.round(randomRange(selectedFish.minSize, selectedFish.maxSize) * 10) / 10;
  const ratio = (size - selectedFish.minSize) / (selectedFish.maxSize - selectedFish.minSize || 1);
  const price = Math.round(selectedFish.basePrice * (0.8 + 0.4 * ratio));

  pendingFish = {
    ...selectedFish,
    size,
    price,
  };
}

// 2-5. 챔질 성공 (BITE -> REELING)
function hookFish() {
  if (biteTimerId) {
    clearTimeout(biteTimerId);
    biteTimerId = null;
  }

  window.__currentRodId = state.equippedRod;
  setState(FishingState.REELING);

  startReelGame(pendingFish, state.equippedRod, handleReelFinish);
}

// 2-6. 릴 미니게임 종료 콜백 (성공 / 실패)
function handleReelFinish(result, fish) {
  if (result === 'success') {
    // 가방 아이템 생성 및 추가 (docs/05 1-1)
    const bagItem = {
      uid: 'f_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
      fishId: fish.id,
      size: fish.size,
      price: fish.price,
      caughtAt: new Date().toISOString(),
    };
    addFishToBag(bagItem);

    // 도감 기록 갱신 (docs/06 2장)
    const recordResult = recordCatch(fish.id, fish.size);

    // 결과 모달 노출 (NEW!, 최대 기록! 전달)
    showResultModal(fish, recordResult);
  } else if (result === 'fail_escaped') {
    showFailModal(MESSAGES.E07);
  } else if (result === 'fail_timeout') {
    showFailModal(MESSAGES.E08);
  }
}

// 메인 버튼 액션 핸들러
export function handleMainActionPress() {
  switch (currentState) {
    case FishingState.IDLE:
      startCharging();
      break;
    case FishingState.CHARGING:
      stopCharging();
      break;
    case FishingState.WAITING:
      handleEarlyPull();
      break;
    case FishingState.BITE:
      hookFish();
      break;
    case FishingState.REELING:
      setReelHolding(true);
      break;
  }
}

export function handleMainActionRelease() {
  if (currentState === FishingState.REELING) {
    setReelHolding(false);
  }
}

// 결과 모달 렌더링
function showResultModal(fish, recordResult = {}) {
  setState(FishingState.RESULT);
  resultData = fish;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const blockClass =
    fish.rarity === 'legendary'
      ? 'block-navy'
      : fish.rarity === 'epic'
        ? 'block-lilac'
        : fish.rarity === 'rare'
          ? 'block-mint'
          : 'block-cream';

  let badgeHtml = '';
  if (recordResult.isNew) {
    badgeHtml = '<span class="badge-new">NEW!</span>';
  } else if (recordResult.isRecord) {
    badgeHtml = '<span class="topbar-king-badge">최대 기록!</span>';
  }

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="modal-result-scrim">
      <div class="modal-dialog ${fish.rarity === 'legendary' ? 'is-legendary' : ''}">
        <div class="modal-top-block ${blockClass}">
          <div class="modal-badge-group">
            ${badgeHtml}
          </div>
          <div class="modal-fish-emoji">${fish.emoji}</div>
        </div>
        <div class="modal-content">
          <div class="t-display modal-fish-name">${fish.name}</div>
          <div style="margin-top: 4px;">
            <span class="badge-rarity rarity-${fish.rarity}">${fish.rarity === 'legendary' ? '전설' : fish.rarity === 'epic' ? '영웅' : fish.rarity === 'rare' ? '희귀' : '일반'}</span>
          </div>
          <div class="modal-info-list">
            <div class="modal-info-row">
              <span class="t-body">크기</span>
              <span class="t-card-title tabular-nums">${fish.size.toFixed(1)}cm</span>
            </div>
            <div class="modal-info-row">
              <span class="t-body">판매가</span>
              <span class="t-card-title tabular-nums">${formatGold(fish.price)}G</span>
            </div>
          </div>
          <button id="btn-modal-confirm" class="btn-primary modal-action-btn">확인 (Space)</button>
        </div>
      </div>
    </div>
  `;

  const btnConfirm = document.getElementById('btn-modal-confirm');
  if (btnConfirm) {
    btnConfirm.addEventListener('click', closeModal);
    btnConfirm.focus();
  }
}

// 실패 모달
function showFailModal(message) {
  setState(FishingState.RESULT);

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="modal-result-scrim">
      <div class="modal-dialog">
        <div class="modal-top-block block-pink">
          <div class="modal-fish-emoji">💨</div>
        </div>
        <div class="modal-content">
          <div class="t-headline" style="text-align: center; margin: var(--space-md) 0;">${message}</div>
          <button id="btn-modal-confirm" class="btn-primary modal-action-btn">확인 (Space)</button>
        </div>
      </div>
    </div>
  `;

  const btnConfirm = document.getElementById('btn-modal-confirm');
  if (btnConfirm) {
    btnConfirm.addEventListener('click', closeModal);
    btnConfirm.focus();
  }
}

export function closeModal() {
  const modalRoot = document.getElementById('modal-root');
  if (modalRoot) {
    modalRoot.innerHTML = '';
  }
  setState(FishingState.IDLE);

  // 결과 모달 닫힌 후 지역 완성 보상 및 낚시왕 체크 (docs/06 3, 4장)
  const completedRegions = checkRegionCompletion();
  completedRegions.forEach((region) => {
    const reward = claimRegionReward(region.id);
    showToast(
      formatMessage(MESSAGES.COLLECTION_COMPLETE, {
        regionName: region.name,
        reward: formatGold(reward),
      })
    );
  });

  if (checkKingAchievement()) {
    setTimeout(() => {
      showKingCelebrationModal();
    }, 300);
  }
}

export function isModalOpen() {
  return currentState === FishingState.RESULT;
}

export function initFishing() {
  if (typeof document === 'undefined') return;
  const baitSelect = document.getElementById('fishing-bait-select');
  if (baitSelect) {
    baitSelect.addEventListener('change', (e) => {
      state.selectedBait = e.target.value;
    });
  }
  updateFishingIndicators();
  updateFishingScene();
}

export function updateFishingScene() {
  if (typeof document === 'undefined') return;
  const scene = document.getElementById('fishing-scene');
  const eyebrow = document.getElementById('fishing-eyebrow');
  const decoContainer = document.getElementById('fishing-deco-container');

  const current = REGIONS.find((r) => r.id === state.currentRegion) || REGIONS[0];

  if (eyebrow) {
    eyebrow.textContent = `FISHING · ${current.name}`;
  }

  if (scene) {
    scene.className = `fishing-scene region-${current.id}`;
  }

  if (decoContainer) {
    let decoHtml = '';
    switch (current.id) {
      case 'lake':
        decoHtml = '<span class="deco-item deco-lake">🌿 🌿</span>';
        break;
      case 'river':
        decoHtml = '<span class="deco-item deco-river">🪨 🪨</span>';
        break;
      case 'sea':
        decoHtml = '<span class="deco-item deco-sea">☁️</span>';
        break;
      case 'abyss':
        decoHtml = '<span class="deco-item deco-abyss">✨ ✨ ✨</span>';
        break;
    }
    decoContainer.innerHTML = decoHtml;
  }
}

export function updateFishingIndicators() {
  if (typeof document === 'undefined') return;
  const rodEl = document.getElementById('fishing-rod-indicator');
  const baitSelect = document.getElementById('fishing-bait-select');

  if (rodEl) {
    const rod = RODS[state.equippedRod] || RODS.bamboo;
    rodEl.textContent = `${rod.emoji} ${rod.name}`;
  }

  if (baitSelect) {
    const prevVal = state.selectedBait || 'basic';
    const availableBaits = [{ id: 'basic', name: '기본 미끼', emoji: '🍞', countStr: '∞' }];

    BAIT_ORDER.forEach((id) => {
      if (id !== 'basic' && state.baits[id] && state.baits[id] > 0) {
        const bait = BAITS[id];
        availableBaits.push({
          id,
          name: bait.name,
          emoji: bait.emoji,
          countStr: `${state.baits[id]}개`,
        });
      }
    });

    baitSelect.innerHTML = availableBaits
      .map((b) => `<option value="${b.id}">${b.emoji} ${b.name} (${b.countStr})</option>`)
      .join('');

    if (availableBaits.some((b) => b.id === prevVal)) {
      baitSelect.value = prevVal;
    } else {
      baitSelect.value = 'basic';
      state.selectedBait = 'basic';
    }
  }
}
