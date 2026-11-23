import { state, sellFish, sellAllFish } from './state.js';
import { FISH, RARITIES, MESSAGES } from './data.js';
import { formatGold, formatMessage } from './utils.js';
import { showToast, switchTab } from './ui.js';

export function renderBag() {
  const screen = document.getElementById('screen-bag');
  if (!screen) return;

  const count = state.bag.length;
  const totalValue = state.bag.reduce((sum, item) => sum + (item.price || 0), 0);

  screen.innerHTML = `
    <div class="color-block block-mint">
      <div class="t-eyebrow">BAG</div>
      <div class="color-block-header">
        <div>
          <div class="t-headline">가방</div>
          <div class="t-subhead">${count}마리 · 총 ${formatGold(totalValue)}G</div>
        </div>
        <button id="btn-sell-all" class="btn-primary" style="height: 40px; font-size: 14px; padding: 0 var(--space-md);" ${count === 0 ? 'disabled' : ''}>
          모두 팔기
        </button>
      </div>
    </div>

    <div class="bag-list-container" id="bag-list">
      ${
        count === 0
          ? `
          <div class="bag-empty">
            <div style="font-size: 48px; margin-bottom: var(--space-sm);">🎣</div>
            <div class="t-body" style="margin-bottom: var(--space-md); text-align: center;">
              아직 낚은 물고기가 없어요.<br />낚시하러 가볼까요?
            </div>
            <button id="btn-goto-fishing" class="btn-primary">낚시하러 가기</button>
          </div>
        `
          : `
          <div class="bag-items">
            ${state.bag
              .map((item) => {
                const fishMeta = FISH.find((f) => f.id === item.fishId) || FISH[0];
                const rarityMeta = RARITIES[fishMeta.rarity] || RARITIES.common;
                return `
                <div class="bag-item-row" data-uid="${item.uid}">
                  <div class="bag-item-emoji">${fishMeta.emoji}</div>
                  <div class="bag-item-info">
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <span class="t-card-title">${fishMeta.name}</span>
                      <span class="badge-rarity rarity-${fishMeta.rarity}">${rarityMeta.name}</span>
                    </div>
                    <div class="t-body-sm tabular-nums">${item.size.toFixed(1)}cm</div>
                  </div>
                  <div class="bag-item-price tabular-nums t-card-title">${formatGold(item.price)}G</div>
                  <button class="btn-secondary btn-sell-one" data-uid="${item.uid}">팔기</button>
                </div>
              `;
              })
              .join('')}
          </div>
        `
      }
    </div>
  `;

  // 이벤트 바인딩
  const btnGotoFishing = document.getElementById('btn-goto-fishing');
  if (btnGotoFishing) {
    btnGotoFishing.addEventListener('click', () => {
      switchTab('fishing');
    });
  }

  const btnSellAll = document.getElementById('btn-sell-all');
  if (btnSellAll && count > 0) {
    btnSellAll.addEventListener('click', () => {
      showSellAllConfirmModal(count, totalValue);
    });
  }

  const sellOneBtns = screen.querySelectorAll('.btn-sell-one');
  sellOneBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const uid = btn.dataset.uid;
      const target = state.bag.find((item) => item.uid === uid);
      if (!target) return;

      const fishMeta = FISH.find((f) => f.id === target.fishId);
      const earned = sellFish(uid);
      showToast(
        formatMessage(MESSAGES.SELL_ONE, {
          fishName: fishMeta ? fishMeta.name : '물고기',
          price: formatGold(earned),
        })
      );
      renderBag();
    });
  });
}

function showSellAllConfirmModal(count, total) {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="modal-sell-all-scrim">
      <div class="modal-dialog">
        <div class="modal-content" style="padding: var(--space-xl) var(--space-lg); text-align: center;">
          <div class="t-headline" style="margin-bottom: var(--space-sm);">모두 팔기</div>
          <div class="t-body" style="margin-bottom: var(--space-lg);">
            물고기 ${count}마리를 모두 ${formatGold(total)}G에 팔까요?
          </div>
          <div style="display: flex; gap: var(--space-xs); width: 100%;">
            <button id="btn-sell-cancel" class="btn-secondary" style="flex: 1;">취소</button>
            <button id="btn-sell-confirm" class="btn-primary" style="flex: 1;">팔기</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const btnCancel = document.getElementById('btn-sell-cancel');
  const btnConfirm = document.getElementById('btn-sell-confirm');

  const close = () => {
    modalRoot.innerHTML = '';
  };

  btnCancel.addEventListener('click', close);
  btnConfirm.addEventListener('click', () => {
    const result = sellAllFish();
    close();
    showToast(
      formatMessage(MESSAGES.SELL_ALL, {
        count: result.count,
        total: formatGold(result.total),
      })
    );
    renderBag();
  });
}
