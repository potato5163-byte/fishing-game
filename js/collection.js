import { state, collectAquariumRevenue, getAquariumPendingGold, releaseFishFromAquarium } from './state.js';
import { FISH, REGIONS, RARITIES, MESSAGES, BAITS } from './data.js';
import { formatGold } from './utils.js';
import { showToast } from './ui.js';

export function renderCollection() {
  const screen = document.getElementById('screen-collection');
  if (!screen) return;

  const collectedCount = Object.keys(state.collection || {}).length;
  const percent = Math.round((collectedCount / 100) * 100);
  const crownTotal = state.stats && state.stats.crownCount ? state.stats.crownCount : 0;
  const pendingRevenue = getAquariumPendingGold();
  const aquariumList = state.aquarium || [];

  screen.innerHTML = `
    <div class="color-block block-lime">
      <div class="t-eyebrow">COLLECTION · AQUARIUM</div>
      <div class="color-block-header">
        <div>
          <div class="t-headline">수족관 & 도감</div>
          <div class="t-subhead">도감 ${collectedCount}/100 · 👑 황금 왕관 ${crownTotal}개</div>
        </div>
        <button id="btn-show-rates" class="btn-primary" style="height: 38px; font-size: 13px; padding: 0 var(--space-md); background: #000; color: #fff;">
          📊 물고기 확률표
        </button>
      </div>
      <div class="collection-progress-bar">
        <div class="collection-progress-fill" style="width: ${percent}%;"></div>
      </div>
    </div>

    <!-- 나만의 수족관 라이브 뷰 -->
    <div class="aquarium-live-section">
      <div class="aquarium-header">
        <div class="t-card-title">🐟 내 아쿠아리움 (${aquariumList.length}/20)</div>
        <button id="btn-collect-revenue" class="btn-primary btn-aquarium-claim" ${pendingRevenue <= 0 ? 'disabled' : ''}>
          🪙 관람료 수령 (${formatGold(pendingRevenue)}G)
        </button>
      </div>
      <div class="aquarium-tank" id="aquarium-tank">
        ${
          aquariumList.length === 0
            ? `<div class="aquarium-empty-msg">가방에서 [🐠 수족관] 버튼을 눌러 물고기를 넣어보세요!<br>물고기가 헤엄치며 방치 관람료 골드를 생산합니다.</div>`
            : aquariumList
                .map((f, i) => {
                  const animDelay = (i * 0.4) % 3;
                  const animDuration = 4 + (i % 4);
                  const topPos = 15 + ((i * 19) % 65);
                  return `
                  <div class="aquarium-swimming-fish" style="top: ${topPos}%; animation-delay: -${animDelay}s; animation-duration: ${animDuration}s;" data-aq-id="${f.id}" title="${f.name} (${f.size.toFixed(1)}cm) - 방출하려면 클릭">
                    <span class="fish-sprite">${f.emoji}</span>
                    <span class="fish-name-tag">${f.name}</span>
                  </div>
                `;
                })
                .join('')
        }
      </div>
    </div>

    <div class="collection-body">
      ${REGIONS.map((region) => renderRegionSection(region)).join('')}
    </div>
  `;

  // 관람료 수령 버튼
  const btnCollect = document.getElementById('btn-collect-revenue');
  if (btnCollect) {
    btnCollect.addEventListener('click', () => {
      const earned = collectAquariumRevenue();
      if (earned > 0) {
        showToast(`🪙 수족관 관람료 +${formatGold(earned)}G를 수령했습니다!`);
        renderCollection();
      }
    });
  }

  // 수족관 물고기 클릭 시 방출 확인
  const swimFishList = screen.querySelectorAll('.aquarium-swimming-fish');
  swimFishList.forEach((el) => {
    el.addEventListener('click', () => {
      const aqId = el.dataset.aqId;
      if (confirm('이 물고기를 자연으로 방출하시겠습니까?')) {
        releaseFishFromAquarium(aqId);
        showToast('물고기를 자연으로 돌려보냈습니다.');
        renderCollection();
      }
    });
  });

  // 확률표 모달 버튼 이벤트
  const btnRates = document.getElementById('btn-show-rates');
  if (btnRates) {
    btnRates.addEventListener('click', showRatesModal);
  }

  // 미발견 카드 및 발견 카드 클릭 이벤트
  const unknownCards = screen.querySelectorAll('.collection-card.is-unknown');
  unknownCards.forEach((card) => {
    card.addEventListener('click', () => {
      showToast(MESSAGES.FISH_UNKNOWN);
    });
  });

  const knownCards = screen.querySelectorAll('.collection-card.is-known');
  knownCards.forEach((card) => {
    card.addEventListener('click', () => {
      const fishId = card.dataset.fishId;
      showFishDetailModal(fishId);
    });
  });
}

function renderRegionSection(region) {
  const isUnlocked = state.unlockedRegions && state.unlockedRegions.includes(region.id);
  const regionFish = FISH.filter((f) => f.region === region.id);
  const caughtInRegion = regionFish.filter((f) => state.collection && state.collection[f.id]).length;
  const isClaimed = state.claimedRegionRewards && state.claimedRegionRewards.includes(region.id);

  let rewardBadge = '';
  if (isClaimed) {
    rewardBadge = `<span class="collection-reward-tag is-claimed">✅ 보상 받음</span>`;
  } else {
    rewardBadge = `<span class="collection-reward-tag">완성 보상 ${formatGold(region.completeReward)}G</span>`;
  }

  return `
    <div class="collection-region-group">
      <div class="collection-region-header">
        <div class="t-card-title">
          ${region.name} ${!isUnlocked ? '🔒' : ''}
          <span class="collection-region-count tabular-nums">${caughtInRegion}/10</span>
        </div>
        ${rewardBadge}
      </div>

      <div class="collection-grid">
        ${regionFish.map((fish) => renderFishCard(fish)).join('')}
      </div>
    </div>
  `;
}

function renderFishCard(fish) {
  const record = state.collection ? state.collection[fish.id] : null;

  if (!record) {
    return `
      <div class="collection-card is-unknown" data-fish-id="${fish.id}">
        <div class="collection-card-emoji-box" style="opacity: 0.35;">❔</div>
        <div class="collection-card-name t-body-sm">???</div>
      </div>
    `;
  }

  const rarity = RARITIES[fish.rarity] || RARITIES.common;
  const cardClass = fish.rarity === 'mythic' ? 'rarity-mythic-card' : fish.rarity === 'legendary' ? 'rarity-legendary-card' : '';
  const crownBadge = record.crown ? '<span class="collection-crown-badge" title="최대 크기 95% 이상 황금 왕관!">👑</span>' : '';

  return `
    <div class="collection-card is-known ${cardClass}" data-fish-id="${fish.id}">
      <span class="collection-card-count-badge tabular-nums">${record.count}회</span>
      ${crownBadge}
      <div class="collection-card-emoji-box">
        <span>${fish.emoji}</span>
      </div>
      <div class="collection-card-name t-body-sm" style="font-weight: 700;">${fish.name}</div>
      <span class="badge-rarity rarity-${fish.rarity}">${rarity.name}</span>
    </div>
  `;
}

// 럭셔리 수족관 상세 모달
function showFishDetailModal(fishId) {
  const fish = FISH.find((f) => f.id === fishId);
  const record = state.collection ? state.collection[fishId] : null;
  if (!fish || !record) return;

  const region = REGIONS.find((r) => r.id === fish.region) || REGIONS[0];
  const rarity = RARITIES[fish.rarity] || RARITIES.common;
  const dateStr = record.firstCaughtAt
    ? new Date(record.firstCaughtAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).replace(/\. /g, '.').replace(/\.$/, '')
    : '-';

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="modal-detail-scrim">
      <div class="modal-dialog ${fish.rarity === 'mythic' ? 'is-mythic' : fish.rarity === 'legendary' ? 'is-legendary' : ''}">
        <div class="modal-content" style="padding: var(--space-xl) var(--space-lg); text-align: center;">
          <div style="font-size: 64px; line-height: 1; margin-bottom: var(--space-xs); filter: drop-shadow(0 4px 10px rgba(0,0,0,0.15));">
            ${fish.emoji}
          </div>
          <div class="t-display" style="font-size: 26px; font-weight: 700;">${fish.name}</div>
          <div style="margin: 6px 0 var(--space-xs) 0;">
            <span class="badge-rarity rarity-${fish.rarity}">${rarity.name}</span>
          </div>
          <div class="t-body-sm" style="color: var(--color-ink); margin-bottom: var(--space-md); opacity: 0.85;">
            ${fish.desc}
          </div>

          <div class="modal-info-list" style="text-align: left; width: 100%;">
            <div class="modal-info-row">
              <span class="t-body-sm">서식지</span>
              <span class="t-body-sm" style="font-weight: 600;">${region.name}</span>
            </div>
            <div class="modal-info-row">
              <span class="t-body-sm">총 낚은 횟수</span>
              <span class="t-body-sm tabular-nums" style="font-weight: 600;">${record.count}마리</span>
            </div>
            <div class="modal-info-row">
              <span class="t-body-sm">최대 기록 크기</span>
              <span class="t-body-sm tabular-nums" style="font-weight: 700; color: var(--color-ink);">${record.maxSize.toFixed(1)}cm</span>
            </div>
            <div class="modal-info-row">
              <span class="t-body-sm">크기 범위</span>
              <span class="t-body-sm tabular-nums">${fish.minSize} ~ ${fish.maxSize}cm</span>
            </div>
            <div class="modal-info-row">
              <span class="t-body-sm">최초 발견일</span>
              <span class="t-body-sm tabular-nums">${dateStr}</span>
            </div>
          </div>

          <button id="btn-close-detail" class="btn-primary modal-action-btn" style="margin-top: var(--space-md);">닫기</button>
        </div>
      </div>
    </div>
  `;

  const btnClose = document.getElementById('btn-close-detail');
  btnClose.addEventListener('click', () => {
    modalRoot.innerHTML = '';
  });
}

// 실시간 물고기 확률표 모달
export function showRatesModal() {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const currentBait = BAITS[state.selectedBait] || BAITS.basic;
  const currentRegion = REGIONS.find((r) => r.id === state.currentRegion) || REGIONS[0];
  const regionFish = FISH.filter((f) => f.region === state.currentRegion);

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="modal-rates-scrim">
      <div class="modal-dialog" style="max-height: 85vh; display: flex; flex-direction: column;">
        <div class="modal-top-block block-lilac" style="padding: var(--space-md);">
          <div class="t-eyebrow">DROP RATES</div>
          <div class="t-headline" style="font-size: 20px;">실시간 출현 확률표</div>
          <div class="t-subhead" style="font-size: 13px;">현재: ${currentRegion.name} · ${currentBait.name}</div>
        </div>
        
        <div class="modal-content" style="padding: var(--space-md); overflow-y: auto; flex: 1;">
          <div style="width: 100%; margin-bottom: var(--space-md);">
            <div class="t-card-title" style="font-size: 14px; margin-bottom: var(--space-xs);">[미끼 등급 확률]</div>
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; text-align: center;">
              <div style="background: var(--color-surface-soft); padding: 4px; border-radius: var(--radius-sm);">
                <div style="font-size: 11px;">일반</div>
                <div style="font-weight: 700; font-size: 12px;">${currentBait.weights.common}%</div>
              </div>
              <div style="background: var(--color-surface-soft); padding: 4px; border-radius: var(--radius-sm);">
                <div style="font-size: 11px;">희귀</div>
                <div style="font-weight: 700; font-size: 12px;">${currentBait.weights.rare}%</div>
              </div>
              <div style="background: var(--color-surface-soft); padding: 4px; border-radius: var(--radius-sm);">
                <div style="font-size: 11px;">영웅</div>
                <div style="font-weight: 700; font-size: 12px;">${currentBait.weights.epic}%</div>
              </div>
              <div style="background: var(--color-surface-soft); padding: 4px; border-radius: var(--radius-sm);">
                <div style="font-size: 11px;">전설</div>
                <div style="font-weight: 700; font-size: 12px;">${currentBait.weights.legendary}%</div>
              </div>
              <div style="background: var(--color-surface-soft); padding: 4px; border-radius: var(--radius-sm);">
                <div style="font-size: 11px; color: #FF007F; font-weight: 700;">신화</div>
                <div style="font-weight: 800; font-size: 12px; color: #FF007F;">${currentBait.weights.mythic || 0}%</div>
              </div>
            </div>
          </div>

          <div style="width: 100%;">
            <div class="t-card-title" style="font-size: 14px; margin-bottom: var(--space-xs);">[현재 지역 어종 목록]</div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              ${regionFish.map((f) => {
                const countOfRarity = regionFish.filter(rf => rf.rarity === f.rarity).length;
                const exactRate = ((currentBait.weights[f.rarity] || 0) / countOfRarity).toFixed(1);
                return `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; background: var(--color-surface-soft); border-radius: var(--radius-sm);">
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <span>${f.emoji}</span>
                      <span class="t-body-sm" style="font-weight: 600;">${f.name}</span>
                      <span class="badge-rarity rarity-${f.rarity}" style="font-size: 9px; padding: 1px 6px;">${RARITIES[f.rarity].name}</span>
                    </div>
                    <span class="t-body-sm tabular-nums" style="font-weight: 700;">${exactRate}%</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <button id="btn-close-rates" class="btn-primary modal-action-btn" style="margin-top: var(--space-md); width: 100%;">닫기</button>
        </div>
      </div>
    </div>
  `;

  const btnClose = document.getElementById('btn-close-rates');
  btnClose.addEventListener('click', () => {
    modalRoot.innerHTML = '';
  });
}

export function showKingCelebrationModal() {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="modal-king-scrim">
      <div class="modal-dialog">
        <div class="modal-top-block block-navy">
          <div style="font-size: 72px; line-height: 1;">👑</div>
        </div>
        <div class="modal-content" style="padding: var(--space-lg); text-align: center;">
          <div class="t-display" style="font-size: 26px; margin-bottom: var(--space-xs);">전설의 낚시왕 달성!</div>
          <div class="t-body" style="margin-bottom: var(--space-lg);">
            10개 지역 100종의 물고기를 모두 정복하셨습니다!<br />당신은 시공간을 초월한 진정한 바다의 신입니다!
          </div>
          <button id="btn-confirm-king" class="btn-primary modal-action-btn">확인</button>
        </div>
      </div>
    </div>
  `;

  const btnConfirm = document.getElementById('btn-confirm-king');
  btnConfirm.addEventListener('click', () => {
    modalRoot.innerHTML = '';
  });
}
