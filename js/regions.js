import {
  state,
  canUnlockRegion,
  unlockRegion,
  moveRegion,
} from './state.js';
import { REGIONS, FISH, MESSAGES } from './data.js';
import { formatGold, formatMessage } from './utils.js';
import { showToast, switchTab } from './ui.js';
import { updateFishingScene } from './fishing.js';

export function renderRegions() {
  const screen = document.getElementById('screen-regions');
  if (!screen) return;

  const unlockedCount = state.unlockedRegions.length;

  screen.innerHTML = `
    <div class="color-block block-cream">
      <div class="t-eyebrow">MAP</div>
      <div class="t-headline">지역</div>
      <div class="t-subhead">해금 ${unlockedCount}/4</div>
    </div>

    <div class="regions-list">
      ${REGIONS.map((region, idx) => renderRegionCard(region, idx)).join('')}
    </div>
  `;

  bindRegionEvents(screen);
}

function renderRegionCard(region, idx) {
  const status = canUnlockRegion(region.id);
  const regionFish = FISH.filter((f) => f.region === region.id);
  const collectedInRegion = regionFish.filter((f) => state.collection && state.collection[f.id]).length;

  let btnHtml = '';
  switch (status) {
    case 'current':
      btnHtml = `<button class="btn-primary" style="background-color: var(--color-ink); color: var(--color-inverse-ink); cursor: default;" disabled>현재 지역</button>`;
      break;

    case 'unlocked':
      btnHtml = `<button class="btn-secondary btn-move-region" data-region-id="${region.id}">이동하기</button>`;
      break;

    case 'needCollection':
      btnHtml = `<button class="btn-secondary btn-need-collection" data-region-id="${region.id}" style="opacity: 0.7;">🔒 도감 ${region.requiredCollection}종 필요</button>`;
      break;

    case 'needPrevious': {
      const prevRegion = REGIONS[idx - 1];
      btnHtml = `<button class="btn-secondary" disabled>🔒 ${prevRegion ? prevRegion.name : ''} 먼저</button>`;
      break;
    }

    case 'available':
      btnHtml = `<button class="btn-secondary btn-unlock-region" data-region-id="${region.id}">해금 ${formatGold(region.unlockPrice)}G</button>`;
      break;
  }

  return `
    <div class="region-card region-${region.id}">
      <div class="region-card-body">
        <div class="t-headline" style="color: var(--color-inverse-ink); text-shadow: 0 1px 3px rgba(0,0,0,0.4);">${region.name}</div>
        <div class="t-body" style="color: var(--color-inverse-ink); text-shadow: 0 1px 3px rgba(0,0,0,0.4); opacity: 0.9;">${region.desc}</div>
        <div class="t-body-sm tabular-nums" style="color: var(--color-inverse-ink); text-shadow: 0 1px 3px rgba(0,0,0,0.4); margin-top: 4px;">
          도감 ${collectedInRegion}/5
        </div>
      </div>
      <div class="region-card-action">
        ${btnHtml}
      </div>
    </div>
  `;
}

function bindRegionEvents(screen) {
  // 이동하기 버튼
  const moveBtns = screen.querySelectorAll('.btn-move-region');
  moveBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const regionId = btn.dataset.regionId;
      const region = REGIONS.find((r) => r.id === regionId);
      moveRegion(regionId);
      showToast(formatMessage(MESSAGES.REGION_MOVE, { regionName: region.name }));
      updateFishingScene();
      switchTab('fishing');
    });
  });

  // 도감 조건 부족 클릭 시 E04 토스트
  const needColBtns = screen.querySelectorAll('.btn-need-collection');
  needColBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const regionId = btn.dataset.regionId;
      const region = REGIONS.find((r) => r.id === regionId);
      const totalCollected = Object.keys(state.collection || {}).length;
      showToast(
        formatMessage(MESSAGES.E04, {
          required: region.requiredCollection,
          regionName: region.name,
          count: totalCollected,
        })
      );
    });
  });

  // 해금 버튼
  const unlockBtns = screen.querySelectorAll('.btn-unlock-region');
  unlockBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const regionId = btn.dataset.regionId;
      const region = REGIONS.find((r) => r.id === regionId);
      if (!region) return;

      if (state.gold < region.unlockPrice) {
        showToast(
          formatMessage(MESSAGES.E02, {
            price: formatGold(region.unlockPrice),
            gold: formatGold(state.gold),
          })
        );
        return;
      }

      showUnlockConfirmModal(region, () => {
        const res = unlockRegion(regionId);
        if (res.ok) {
          showToast(formatMessage(MESSAGES.REGION_UNLOCK, { regionName: region.name }));
          renderRegions();
        }
      });
    });
  });
}

function showUnlockConfirmModal(region, onConfirm) {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="modal-unlock-scrim">
      <div class="modal-dialog">
        <div class="modal-content" style="padding: var(--space-xl) var(--space-lg); text-align: center;">
          <div class="t-headline" style="margin-bottom: var(--space-sm);">지역 해금</div>
          <div class="t-body" style="margin-bottom: var(--space-lg);">
            ${region.name}을(를) ${formatGold(region.unlockPrice)}G에 해금할까요?
          </div>
          <div style="display: flex; gap: var(--space-xs); width: 100%;">
            <button id="btn-cancel-unlock" class="btn-secondary" style="flex: 1;">취소</button>
            <button id="btn-confirm-unlock" class="btn-primary" style="flex: 1;">해금</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const btnCancel = document.getElementById('btn-cancel-unlock');
  const btnConfirm = document.getElementById('btn-confirm-unlock');

  const close = () => {
    modalRoot.innerHTML = '';
  };

  btnCancel.addEventListener('click', close);
  btnConfirm.addEventListener('click', () => {
    close();
    onConfirm();
  });
}
