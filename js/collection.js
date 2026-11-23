import { state } from './state.js';
import { FISH, REGIONS, RARITIES, MESSAGES } from './data.js';
import { formatGold } from './utils.js';
import { showToast } from './ui.js';

export function renderCollection() {
  const screen = document.getElementById('screen-collection');
  if (!screen) return;

  const collectedCount = Object.keys(state.collection || {}).length;
  const percent = Math.round((collectedCount / 20) * 100);

  screen.innerHTML = `
    <div class="color-block block-lime">
      <div class="t-eyebrow">COLLECTION</div>
      <div class="t-headline">도감</div>
      <div class="t-subhead">달성률 ${collectedCount}/20 (${percent}%)</div>
      <div class="collection-progress-bar">
        <div class="collection-progress-fill" style="width: ${percent}%;"></div>
      </div>
    </div>

    <div class="collection-body">
      ${REGIONS.map((region) => renderRegionSection(region)).join('')}
    </div>
  `;

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
          <span class="collection-region-count tabular-nums">${caughtInRegion}/5</span>
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
        <div class="collection-card-emoji">❔</div>
        <div class="collection-card-name t-body-sm">???</div>
      </div>
    `;
  }

  const rarity = RARITIES[fish.rarity] || RARITIES.common;
  return `
    <div class="collection-card is-known" data-fish-id="${fish.id}">
      <div class="collection-card-emoji">${fish.emoji}</div>
      <div class="collection-card-name t-body-sm">${fish.name}</div>
      <span class="badge-rarity rarity-${fish.rarity}">${rarity.name}</span>
    </div>
  `;
}

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
      <div class="modal-dialog">
        <div class="modal-content" style="padding: var(--space-xl) var(--space-lg); text-align: center;">
          <div style="font-size: 56px; line-height: 1; margin-bottom: var(--space-xs);">${fish.emoji}</div>
          <div class="t-display" style="font-size: 24px;">${fish.name}</div>
          <div style="margin: 4px 0 var(--space-xs) 0;">
            <span class="badge-rarity rarity-${fish.rarity}">${rarity.name}</span>
          </div>
          <div class="t-body-sm" style="color: var(--color-ink); margin-bottom: var(--space-md); opacity: 0.8;">
            ${fish.desc}
          </div>

          <div class="modal-info-list" style="text-align: left;">
            <div class="modal-info-row">
              <span class="t-body-sm">사는 곳</span>
              <span class="t-body-sm" style="font-weight: 600;">${region.name}</span>
            </div>
            <div class="modal-info-row">
              <span class="t-body-sm">낚은 수</span>
              <span class="t-body-sm tabular-nums" style="font-weight: 600;">${record.count}마리</span>
            </div>
            <div class="modal-info-row">
              <span class="t-body-sm">최대 크기</span>
              <span class="t-body-sm tabular-nums" style="font-weight: 600;">${record.maxSize.toFixed(1)}cm</span>
            </div>
            <div class="modal-info-row">
              <span class="t-body-sm">크기 범위</span>
              <span class="t-body-sm tabular-nums">${fish.minSize} ~ ${fish.maxSize}cm</span>
            </div>
            <div class="modal-info-row">
              <span class="t-body-sm">처음 낚은 날</span>
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
          <div class="t-display" style="font-size: 26px; margin-bottom: var(--space-xs);">낚시왕 달성!</div>
          <div class="t-body" style="margin-bottom: var(--space-lg);">
            20종의 물고기를 모두 모았어요.<br />당신은 진정한 물결 낚시터의 전설입니다!
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
