import {
  FISHING_CONFIG,
  BAITS,
  BAIT_ORDER,
  RODS,
  FISH,
  MESSAGES,
  REGIONS,
  TRASH_ITEMS,
  BOATS,
  HIDDEN_FISH,
} from './data.js';
import {
  randomRange,
  randomChoice,
  weightedPick,
  formatGold,
  formatMessage,
  clamp,
} from './utils.js';
import {
  state,
  setFishingActive,
  addFishToBag,
  recordCatch,
  checkRegionCompletion,
  claimRegionReward,
  checkKingAchievement,
  addFeverGauge,
  deactivateFever,
  addGold,
  getEffectiveBagCapacity,
} from './state.js';
import { showToast, updateTopbar } from './ui.js';
import { startReelGame, setReelHolding, isReelingActive } from './reel.js';
import { isInstantBiteEnabled } from './debug.js';
import { showKingCelebrationModal, triggerLotteryClaim } from './collection.js';
import { playSound } from './sound.js';
import { getCurrentWeather, updateWeatherVisual, cycleWeather, WEATHERS } from './weather.js';
import { getFishSvg } from './fish-icons.js';

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

  // 실시간 낚싯줄 및 파티클 연출 갱신
  updateMainFishingLine(next);
  if (next === FishingState.BITE) {
    triggerWaterSplash(45, 45, 12);
  } else if (next === FishingState.WAITING) {
    triggerWaterSplash(45, 45, 6);
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
  if (state.bag.length >= getEffectiveBagCapacity()) {
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

  playSound('cast');

  const finalPower = Math.round(chargePower);

  // 미끼 소모 (특수 미끼면 -1)
  const currentBait = BAITS[state.selectedBait] || BAITS.basic;
  if (!currentBait.infinite && (state.baits[state.selectedBait] || 0) > 0) {
    state.baits[state.selectedBait] -= 1;
  }

  state.stats.totalCasts = (state.stats.totalCasts || 0) + 1;

  // 대기 시간 계산
  let waitSec = 4.0;
  if (state.isFeverActive) {
    // 피버 중에는 초고속 입질! (0.6초)
    waitSec = 0.6;
  } else if (isInstantBiteEnabled()) {
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

  // 🐟 상용 낚시 게임 스타일: 입질 0.8초 전 수면 아래 그림자 접근 & 찌 톡톡(Nibble) 전조 연출!
  const nibbleDelay = Math.max(100, (waitSec - 0.9) * 1000);
  setTimeout(() => {
    if (currentState === FishingState.WAITING) {
      triggerBiteNibbleForeshadow();
    }
  }, nibbleDelay);
}

// 🌊 입질 직전 찌 건드리기(Nibble) 및 그림자 접근 전조 효과
function triggerBiteNibbleForeshadow() {
  const bobber = document.getElementById('fishing-bobber');
  const shadow = document.getElementById('fishing-underwater-shadow');
  if (bobber) {
    bobber.style.transform = 'translate(-50%, -50%) translateY(4px) scale(0.95)';
    triggerWaterSplash(45, 45, 3);
    setTimeout(() => {
      if (currentState === FishingState.WAITING) {
        bobber.style.transform = 'translate(-50%, -50%) translateY(0px)';
      }
    }, 250);
  }

  if (shadow) {
    shadow.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
    shadow.style.left = '42%';
    shadow.style.top = '44%';
    shadow.style.transform = 'scale(1.35) rotate(-15deg)';
    shadow.style.opacity = '0.9';
    setTimeout(() => {
      shadow.style.transition = '';
    }, 850);
  }
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
  playSound('bite');

  // 화면 흔들림 효과
  const app = document.getElementById('app');
  if (app) {
    app.classList.remove('screen-shake');
    void app.offsetWidth;
    app.classList.add('screen-shake');
  }

  biteTimerId = setTimeout(() => {
    // 1.0초 초과 시 놓침 (E06)
    biteTimerId = null;
    showToast(MESSAGES.E06);
    setState(FishingState.IDLE);
  }, FISHING_CONFIG.BITE_WINDOW_SEC * 1000);
}

// 물고기 결정 규칙
function determineFish() {
  // 0. 해양 쓰레기 낚기 체크 (5% 확률, 피버 중에는 쓰레기 대신 고기!)
  if (!state.isFeverActive && Math.random() < 0.05) {
    const trash = randomChoice(TRASH_ITEMS);
    pendingFish = {
      id: trash.id,
      name: trash.name,
      rarity: 'common',
      emoji: trash.emoji,
      size: 15.0,
      price: 10,
      difficulty: 1,
      isTrash: true,
      ecoPoint: trash.point,
      desc: trash.desc,
    };
    return;
  }

  // 1-1. 🤫 개발자만 아는 20종 비밀 히든 물고기 돌발 출현 체크 (조건 충족 시 약 8% 확률로 강림!)
  const currentWeather = getCurrentWeather();
  const eligibleHiddenFish = HIDDEN_FISH.filter((hf) => {
    switch (hf.condition) {
      case 'weather_rainy': return currentWeather === 'rainy';
      case 'weather_foggy': return currentWeather === 'foggy';
      case 'weather_night': return currentWeather === 'night';
      case 'weather_sunny': return currentWeather === 'sunny';
      case 'boat_wood_raft': return state.equippedBoat === 'wood_raft';
      case 'boat_speed': return ['fishing_boat', 'speed_boat'].includes(state.equippedBoat);
      case 'boat_yacht': return state.equippedBoat === 'luxury_yacht';
      case 'rod_bamboo': return state.equippedRod === 'bamboo';
      case 'fever_active': return state.isFeverActive;
      case 'perfect_cast': return chargePower >= 95;
      case 'bait_golden': return state.selectedBait === 'golden';
      case 'bait_rainbow': return state.selectedBait === 'rainbow';
      case 'region_abyss': return state.currentRegion === 'abyss';
      case 'region_glacier': return state.currentRegion === 'glacier';
      case 'region_palace': return state.currentRegion === 'palace';
      case 'region_nebula': return state.currentRegion === 'nebula';
      case 'region_volcano': return state.currentRegion === 'volcano';
      case 'region_timewarp': return state.currentRegion === 'timewarp';
      case 'region_sky_ocean': return state.currentRegion === 'sky_ocean';
      case 'endgame_secret': return Object.keys(state.collection || {}).length >= 50;
      default: return false;
    }
  });

  if (eligibleHiddenFish.length > 0 && Math.random() < 0.08) {
    const hf = randomChoice(eligibleHiddenFish);
    const size = randomRange(hf.minSize, hf.maxSize);
    pendingFish = {
      id: hf.id,
      name: hf.name,
      rarity: hf.rarity,
      emoji: hf.emoji,
      size: Number(size.toFixed(1)),
      price: hf.basePrice,
      difficulty: hf.difficulty,
      desc: hf.desc,
      isHiddenFish: true,
    };
    return;
  }

  // 1. 보물상자 이벤트 체크 (7% 확률, 피버 중에는 15%)
  const chestChance = state.isFeverActive ? 0.15 : 0.07;
  if (Math.random() < chestChance) {
    const isGoldChest = Math.random() < 0.3;

    // 현재 스테이지(지역) 레벨에 비례하여 적정 수준의 보물상자 상금 지급 (인플레이션 방지 밸런스)
    // 1지역 300G ~ 10지역 25만G 수준 (최고가 낚싯대 1000만G 및 물고기 시세 고려)
    const regionIdx = Math.max(0, REGIONS.findIndex((r) => r.id === state.currentRegion));
    const stageMultiplier = [
      1,     // 1. lake (황금: 800 ~ 1,500G / 일반: 300 ~ 600G)
      2,     // 2. river (황금: 1,600 ~ 3,000G / 일반: 600 ~ 1,200G)
      4,     // 3. sea (황금: 3,200 ~ 6,000G / 일반: 1,200 ~ 2,400G)
      8,     // 4. abyss (황금: 6,400 ~ 12,000G / 일반: 2,400 ~ 4,800G)
      16,    // 5. glacier (황금: 12,800 ~ 24,000G / 일반: 4,800 ~ 9,600G)
      32,    // 6. palace (황금: 25,600 ~ 48,000G / 일반: 9,600 ~ 19,200G)
      60,    // 7. nebula (황금: 48,000 ~ 90,000G / 일반: 18,000 ~ 36,000G)
      100,   // 8. volcano (황금: 80,000 ~ 150,000G / 일반: 30,000 ~ 60,000G)
      150,   // 9. timewarp (황금: 120,000 ~ 225,000G / 일반: 45,000 ~ 90,000G)
      200,   // 10. sky_ocean (황금: 160,000 ~ 300,000G / 일반: 60,000 ~ 120,000G)
    ][regionIdx] || (1 + regionIdx * 15);

    const baseMin = isGoldChest ? 800 : 300;
    const baseMax = isGoldChest ? 1500 : 600;
    const goldReward = Math.round(randomRange(baseMin * stageMultiplier, baseMax * stageMultiplier));

    pendingFish = {
      id: isGoldChest ? 'chest_gold' : 'chest_silver',
      name: isGoldChest ? `👑 [신화] 황금 해적 보물상자 (Lv.${regionIdx + 1})` : `📦 [전설] 바다 보물상자 (Lv.${regionIdx + 1})`,
      rarity: isGoldChest ? 'mythic' : 'legendary',
      emoji: isGoldChest ? '👑' : '📦',
      size: isGoldChest ? 99.9 : 50.0,
      price: goldReward,
      difficulty: isGoldChest ? 4 : 3,
      isChest: true,
      rewardGold: goldReward,
    };
    return;
  }

  const bait = BAITS[state.selectedBait] || BAITS.basic;
  let weights = { ...bait.weights };

  // 피버 타임 중에는 희귀/영웅/전설/신화 확률 대폭 상승!
  if (state.isFeverActive) {
    weights.rare = (weights.rare || 0) * 1.5;
    weights.epic = (weights.epic || 0) * 2;
    weights.legendary = (weights.legendary || 0) * 3;
    weights.mythic = (weights.mythic || 0) * 4;
  }

  // 행운의 부적 발동 시 전설/신화 확률 대폭 부스트
  if (state.specialItems && state.specialItems.charm_luck > 0) {
    weights.legendary = (weights.legendary || 0) * 2;
    weights.mythic = (weights.mythic || 0) * 2.5;
  }

  let rarity = weightedPick(weights);

  // 디버그 옵션 체크
  if (window.__forceMythicOnce) {
    rarity = 'mythic';
    window.__forceMythicOnce = false;
  } else if (window.__forceLegendaryOnce) {
    rarity = 'legendary';
    window.__forceLegendaryOnce = false;
  }

  // 현재 지역 물고기 필터링
  let availableFish = FISH.filter(
    (f) => f.region === state.currentRegion && f.rarity === rarity
  );

  if (availableFish.length === 0) {
    // 해당 등급이 없는 경우 그 지역의 가장 높은 등급 선택
    availableFish = FISH.filter((f) => f.region === state.currentRegion);
  }

  const selectedFish = availableFish.length > 0 ? randomChoice(availableFish) : FISH[0];
  const size = Math.round(randomRange(selectedFish.minSize, selectedFish.maxSize) * 10) / 10;
  const ratio = (size - selectedFish.minSize) / (selectedFish.maxSize - selectedFish.minSize || 1);
  let price = Math.round(selectedFish.basePrice * (0.8 + 0.4 * ratio));

  // 95% 이상 초대형 크기(황금 왕관급)이면 판매가 1.5배 보너스!
  const isCrownSize = size >= (selectedFish.minSize + (selectedFish.maxSize - selectedFish.minSize) * 0.95);
  if (isCrownSize) {
    price = Math.round(price * 1.5);
  }

  pendingFish = {
    ...selectedFish,
    size,
    price,
    isCrown: isCrownSize,
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
    // 부적 횟수 차감
    if (state.specialItems) {
      if (state.specialItems.charm_luck > 0) state.specialItems.charm_luck--;
      if (state.specialItems.hourglass_time > 0) state.specialItems.hourglass_time--;
      if (state.specialItems.potion_zone > 0) state.specialItems.potion_zone--;
    }

    if (fish.isHiddenFish) {
      playSound('legendary');
      triggerGachaCatchCutscene(fish, true);
      triggerMythicConfetti();
    } else if (fish.rarity === 'mythic') {
      playSound('legendary');
      triggerGachaCatchCutscene(fish, false);
      triggerMythicConfetti();
    } else if (fish.rarity === 'legendary') {
      playSound('legendary');
      triggerGachaCatchCutscene(fish, false);
      triggerConfetti();
    } else {
      playSound('catch');
    }
    // 피버 게이지 상승 (완벽 캐스팅 + 잡기 성공 시 +25)
    addFeverGauge(20);

    // 보물상자인 경우 바로 골드 지급
    if (fish.isChest) {
      addGold(fish.rewardGold);
      state.stats.chestsFound = (state.stats.chestsFound || 0) + 1;
      showResultModal(fish, { isChest: true });
      return;
    }

    if (fish.isTrash) {
      import('./state.js').then((s) => {
        s.addEcoPoints(fish.ecoPoint);
      });
      showResultModal(fish, { isTrash: true });
      return;
    }

    // 신규 종결 낚싯대 특수 효과: 창세의 에테르 낚싯대 (더블 캐치 35% & 골드 1.5배)
    let isDoubleCatch = false;
    if (state.equippedRod === 'genesis_infinity_rod') {
      fish.price = Math.round(fish.price * 1.5);
      if (Math.random() < 0.35 && state.bag.length + 1 < getEffectiveBagCapacity()) {
        isDoubleCatch = true;
      }
    }

    // 가방 아이템 생성 및 추가 (docs/05 1-1)
    const bagItem = {
      uid: 'f_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
      fishId: fish.id,
      size: fish.size,
      price: fish.price,
      isCrown: fish.isCrown,
      caughtAt: new Date().toISOString(),
    };
    addFishToBag(bagItem);

    if (isDoubleCatch) {
      const extraItem = {
        ...bagItem,
        uid: 'f_double_' + Date.now(),
      };
      addFishToBag(extraItem);
      showToast(`🔱 [창세의 에테르] 더블 캐치 발동! ${fish.name} 2마리 동시 획득!`);
    }

    // 도감 기록 갱신 (docs/06 2장)
    const recordResult = recordCatch(fish.id, fish.size);

    // 퀘스트 진행도 갱신
    import('./state.js').then((s) => {
      s.updateDailyQuestProgress('catch', 1);
      if (['rare', 'epic', 'legendary', 'mythic'].includes(fish.rarity)) {
        s.updateDailyQuestProgress('rare_catch', 1);
      }
    });

    // 결과 모달 노출 (NEW!, 최대 기록!, 왕관! 전달)
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
    fish.rarity === 'mythic'
      ? 'block-mythic'
      : fish.rarity === 'legendary'
      ? 'block-navy'
      : fish.rarity === 'epic'
        ? 'block-lilac'
        : fish.rarity === 'rare'
          ? 'block-mint'
          : 'block-cream';

  let badgeHtml = '';
  if (fish.isHiddenFish) {
    badgeHtml = '<span class="badge-new" style="background: linear-gradient(135deg, #a855f7, #ec4899); color: #fff;">🤫 비밀 히든 발견!</span>';
  } else if (recordResult.isChest) {
    badgeHtml = '<span class="badge-new" style="background: #eab308; color: #000;">보물 획득!</span>';
  } else if (recordResult.isTrash) {
    badgeHtml = `<span class="badge-new" style="background: #10b981; color: #fff;">에코 포인트 +${fish.ecoPoint}P</span>`;
  } else if (recordResult.isCrown) {
    badgeHtml = '<span class="topbar-king-badge" style="background: #fbbf24; color: #000;">👑 황금 왕관 기록!</span>';
  } else if (recordResult.isNew) {
    badgeHtml = '<span class="badge-new">NEW!</span>';
  } else if (recordResult.isRecord) {
    badgeHtml = '<span class="topbar-king-badge">최대 기록!</span>';
  }

  const rarityName =
    fish.isTrash ? '해양 쓰레기' :
    fish.rarity === 'mythic' ? '신화' :
    fish.rarity === 'legendary' ? '전설' :
    fish.rarity === 'epic' ? '영웅' :
    fish.rarity === 'rare' ? '희귀' : '일반';

  const infoListHtml = fish.isTrash
    ? `
      <div class="modal-info-list">
        <div class="modal-info-row">
          <span class="t-body">설명</span>
          <span class="t-card-title">${fish.desc || '바다에서 건져 올린 쓰레기'}</span>
        </div>
        <div class="modal-info-row">
          <span class="t-body">환경 정화 보상</span>
          <span class="t-card-title tabular-nums" style="color: #10b981; font-weight: 700;">+${fish.ecoPoint} 에코 포인트</span>
        </div>
      </div>
    `
    : `
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
    `;

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="modal-result-scrim">
      <div class="modal-dialog ${fish.rarity === 'mythic' ? 'is-mythic' : fish.rarity === 'legendary' ? 'is-legendary' : ''}">
        <div class="modal-top-block ${fish.isTrash ? 'block-mint' : blockClass}">
          <div class="modal-badge-group">
            ${badgeHtml}
          </div>
          <div class="modal-fish-emoji" style="display: flex; align-items: center; justify-content: center;">
            ${fish.isChest || fish.isTrash ? fish.emoji : getFishSvg(fish.id, 90)}
          </div>
        </div>
        <div class="modal-content">
          <div class="t-display modal-fish-name">${fish.name}</div>
          <div style="margin-top: 4px;">
            <span class="badge-rarity ${fish.isTrash ? 'rarity-common' : 'rarity-' + fish.rarity}" style="${fish.isTrash ? 'background: #059669; color: #fff;' : ''}">${rarityName}</span>
          </div>
          ${infoListHtml}
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

  // 스피드 파밍 모드 활성화 시 1.2초 후 자동 닫기
  if (state.speedMode) {
    setTimeout(() => {
      if (currentState === FishingState.RESULT) {
        closeModal();
      }
    }, 1200);
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

  // 스피드 파밍 모드 활성화 시 1.2초 후 자동 닫기
  if (state.speedMode) {
    setTimeout(() => {
      if (currentState === FishingState.RESULT) {
        closeModal();
      }
    }, 1200);
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
  if (completedRegions.length > 0) {
    const firstRegion = completedRegions[0];
    setTimeout(() => {
      triggerLotteryClaim(firstRegion.id);
    }, 300);
  }

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
  updateFeverUI();

  // 피버 타이머 1초 인터벌
  setInterval(() => {
    if (state.isFeverActive) {
      state.feverTimeLeft = Math.max(0, state.feverTimeLeft - 1);
      state.feverGauge = Math.round((state.feverTimeLeft / 18) * 100);
      if (state.feverTimeLeft <= 0) {
        deactivateFever();
        showToast('피버 버스트가 종료되었습니다.');
      }
      updateFeverUI();
    }
  }, 1000);
}

export function updateFeverUI() {
  if (typeof document === 'undefined') return;
  const fill = document.getElementById('fever-fill');
  const pctText = document.getElementById('fever-percent');
  const scene = document.getElementById('fishing-scene');

  if (fill) {
    fill.style.width = `${state.feverGauge || 0}%`;
  }
  if (pctText) {
    if (state.isFeverActive) {
      pctText.textContent = `🔥 ACTIVE (${Math.ceil(state.feverTimeLeft)}s)`;
      pctText.style.color = '#e11d48';
    } else {
      pctText.textContent = `${Math.round(state.feverGauge || 0)}%`;
      pctText.style.color = '#ea580c';
    }
  }
  if (scene) {
    if (state.isFeverActive) {
      scene.classList.add('is-fever-active');
    } else {
      scene.classList.remove('is-fever-active');
    }
  }
}

// 🎣 실시간 메인 낚싯줄 베지어 곡선 및 낚싯대 휨새 연출
function updateMainFishingLine(state) {
  if (typeof document === 'undefined') return;
  const path = document.getElementById('fishing-main-line-path');
  const bobber = document.getElementById('fishing-bobber');
  const rod = document.getElementById('fishing-rod-visual');
  const scene = document.querySelector('.fishing-scene');
  if (!path) return;

  if (scene) {
    scene.classList.remove('is-charging', 'is-waiting', 'is-biting', 'is-reeling-pull');
    if (state === FishingState.CHARGING) scene.classList.add('is-charging');
    else if (state === FishingState.WAITING) scene.classList.add('is-waiting');
    else if (state === FishingState.BITE) scene.classList.add('is-biting');
    else if (state === FishingState.REELING) scene.classList.add('is-reeling-pull');
  }

  if (state === FishingState.IDLE) {
    path.setAttribute('d', '');
    return;
  }

  // 벡터 낚싯대 초릿대(팁 가이드) 끝 좌표(viewBox 480x320 기준)
  let startX = 425;
  let startY = 65;

  if (state === FishingState.BITE || state === FishingState.REELING) {
    startX = 385;
    startY = 95; // 강하게 아래로 휘어진 초릿대 위치
  } else if (state === FishingState.CHARGING) {
    startX = 445;
    startY = 85;
  }

  const endX = 216; // 45% of 480 (찌 중심)
  const endY = 144; // 45% of 320 (찌 중심)

  let controlX = (startX + endX) / 2;
  let controlY = (startY + endY) / 2;

  if (state === FishingState.BITE) {
    // 팽팽하게 당겨져 떨리는 강렬한 붉은 텐션 라인
    controlY -= 8;
    path.setAttribute('stroke', '#ef4444');
    path.setAttribute('stroke-width', '2.5');
    path.style.filter = 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.8))';
  } else if (state === FishingState.WAITING) {
    // 자연스러운 중력 현수선 베지어 곡선
    controlY += 38;
    path.setAttribute('stroke', 'rgba(255, 255, 255, 0.85)');
    path.setAttribute('stroke-width', '1.6');
    path.style.filter = 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.4))';
  } else {
    controlY += 12;
    path.setAttribute('stroke', 'rgba(255, 255, 255, 0.7)');
    path.setAttribute('stroke-width', '1.6');
    path.style.filter = 'none';
  }

  path.setAttribute('d', `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`);
}

// 💦 물방울 스플래시 파티클 연출
function triggerWaterSplash(centerXPercent = 45, centerYPercent = 45, count = 8) {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('water-splash-container');
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const drop = document.createElement('div');
    drop.className = 'water-drop';
    drop.style.left = `${centerXPercent}%`;
    drop.style.top = `${centerYPercent}%`;

    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const distance = Math.random() * 35 + 20;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance * 0.7 - 25; // 위쪽으로 튀어오름

    drop.style.setProperty('--dx', `${dx}px`);
    drop.style.setProperty('--dy', `${dy}px`);

    container.appendChild(drop);
    setTimeout(() => drop.remove(), 700);
  }
}

// ✨ 찬란한 갓챠(Gacha) 획득 컷씬 (고화질 벡터 일러스트 적용)
function triggerGachaCatchCutscene(fish, isHidden = false) {
  if (typeof document === 'undefined') return;
  const overlay = document.createElement('div');
  overlay.className = `gacha-cutscene-overlay ${isHidden ? 'is-hidden-fish' : ''}`;

  const rarityColor =
    fish.rarity === 'mythic' ? '#ff0055' :
    fish.rarity === 'legendary' ? '#eab308' :
    fish.rarity === 'epic' ? '#a855f7' : '#0ea5e9';

  const badgeText = isHidden ? '🤫 비밀 히든 강림' :
    fish.rarity === 'mythic' ? '✨ 신화(MYTHIC)' :
    fish.rarity === 'legendary' ? '👑 전설(LEGENDARY)' : '⭐ 희귀 획득';

  overlay.innerHTML = `
    <div class="gacha-god-rays"></div>
    <div class="gacha-fish-card">
      <div class="gacha-fish-avatar" style="display: flex; justify-content: center; align-items: center; width: 120px; height: 120px; margin: 0 auto 12px auto; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));">
        ${getFishSvg(fish.id, 110)}
      </div>
      <div class="gacha-fish-title">${fish.name}</div>
      <span class="gacha-fish-rarity" style="background: ${rarityColor}; color: #fff;">${badgeText}</span>
      <div style="font-size: 14px; color: #cbd5e1; font-weight: 700; margin-top: 6px;">${fish.size.toFixed(1)}cm · +${fish.price.toLocaleString()}G</div>
    </div>
    <div class="gacha-click-hint">화면을 터치하여 획득하기 탭</div>
  `;

  document.body.appendChild(overlay);

  const dismiss = () => {
    overlay.removeEventListener('click', dismiss);
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 400);
  };

  overlay.addEventListener('click', dismiss);
  setTimeout(dismiss, 3500); // 3.5초 후 자동 닫힘
}

function triggerMythicVictoryCutscene(fish) {
  if (typeof document === 'undefined') return;
  const overlay = document.createElement('div');
  overlay.className = 'mythic-victory-cutscene';
  overlay.innerHTML = `
    <div class="mythic-cutscene-halo"></div>
    <div class="mythic-cutscene-content">
      <div class="mythic-cutscene-banner">✨ MYTHIC CATCH!! ✨</div>
      <div class="mythic-cutscene-fish">${fish.emoji}</div>
      <div class="mythic-cutscene-name">${fish.name}</div>
      <div class="mythic-cutscene-sub">바다의 신화가 손끝에 걸렸습니다!</div>
    </div>
  `;
  document.body.appendChild(overlay);
  setTimeout(() => {
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.remove(), 400);
  }, 2200);
}

function triggerMythicConfetti() {
  if (typeof document === 'undefined') return;
  const container = document.createElement('div');
  container.className = 'confetti-container';
  const colors = ['#FF007F', '#7928CA', '#00DFD8', '#FFD166', '#FFFFFF'];

  for (let i = 0; i < 70; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = Math.random() * 8 + 8 + 'px';
    piece.style.height = Math.random() * 8 + 8 + 'px';
    piece.style.animationDuration = Math.random() * 1.5 + 2 + 's';
    piece.style.animationDelay = Math.random() * 0.3 + 's';
    container.appendChild(piece);
  }

  document.body.appendChild(container);
  setTimeout(() => container.remove(), 4000);
}

function triggerConfetti() {
  if (typeof document === 'undefined') return;
  const container = document.createElement('div');
  container.className = 'confetti-container';
  const colors = ['#FFD166', '#FF3D8B', '#06D6A0', '#118AB2', '#9B5DE5', '#F15BB5'];

  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 0.5 + 's';
    piece.style.transform = `scale(${Math.random() * 0.8 + 0.5})`;
    container.appendChild(piece);
  }

  document.body.appendChild(container);
  setTimeout(() => {
    container.remove();
  }, 3000);
}

export function updateFishingScene() {
  if (typeof document === 'undefined') return;
  const scene = document.getElementById('fishing-scene');
  const eyebrow = document.getElementById('fishing-eyebrow');
  const decoContainer = document.getElementById('fishing-deco-container');
  const backdrop = document.getElementById('fishing-scenery-backdrop');

  const current = REGIONS.find((r) => r.id === state.currentRegion) || REGIONS[0];

  if (eyebrow) {
    eyebrow.textContent = `FISHING · ${current.name}`;
  }

  if (scene) {
    scene.className = `fishing-scene region-${current.id}`;
  }

  if (backdrop) {
    backdrop.className = `fishing-scenery-backdrop scenery-${current.id}`;
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
      case 'glacier':
        decoHtml = '<span class="deco-item deco-glacier">🧊 ❄️ 🧊</span>';
        break;
      case 'palace':
        decoHtml = '<span class="deco-item deco-palace">🏯 🫧 🪸</span>';
        break;
      case 'nebula':
        decoHtml = '<span class="deco-item deco-nebula">🪐 🛸 🌠</span>';
        break;
    }
    decoContainer.innerHTML = decoHtml;
  }
  updateWeatherVisual();
}

export function updateFishingIndicators() {
  if (typeof document === 'undefined') return;
  const rodEl = document.getElementById('fishing-rod-indicator');
  const baitSelect = document.getElementById('fishing-bait-select');

  if (rodEl) {
    const rod = RODS[state.equippedRod] || RODS.bamboo;
    const enhanceLevel = state.rodEnhancements ? (state.rodEnhancements[state.equippedRod] || 0) : 0;
    const enhanceTag = enhanceLevel > 0 ? ` (+${enhanceLevel}강)` : '';
    const boat = BOATS[state.equippedBoat] || BOATS.wood_raft;
    rodEl.textContent = `${rod.emoji} ${rod.name}${enhanceTag} · ${boat.emoji} ${boat.name}`;
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
