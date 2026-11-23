import { state, sellFish, sellAllFish, addFishToAquarium, autoAddBestFishToAquarium } from './state.js';
import { FISH, RARITIES, MESSAGES } from './data.js';
import { formatGold, formatMessage } from './utils.js';
import { showToast, switchTab } from './ui.js';

let bagFilterRarity = 'all'; // 'all', 'common', 'rare', 'epic', 'legendary', 'mythic'
let bagSortBy = 'latest'; // 'latest', 'price', 'size'

export function renderBag() {
  const screen = document.getElementById('screen-bag');
  if (!screen) return;

  const count = state.bag.length;
  const totalValue = state.bag.reduce((sum, item) => sum + (item.price || 0), 0);

  // 필터링 및 정렬 적용
  let filteredItems = [...state.bag];
  if (bagFilterRarity !== 'all') {
    filteredItems = filteredItems.filter((item) => {
      const meta = FISH.find((f) => f.id === item.fishId) || FISH[0];
      return meta.rarity === bagFilterRarity;
    });
  }

  if (bagSortBy === 'price') {
    filteredItems.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (bagSortBy === 'size') {
    filteredItems.sort((a, b) => (b.size || 0) - (a.size || 0));
  }

  screen.innerHTML = `
    <div class="color-block block-mint">
      <div class="t-eyebrow">BAG</div>
      <div class="color-block-header">
        <div>
          <div class="t-headline">가방</div>
          <div class="t-subhead">${count}마리 · 총 ${formatGold(totalValue)}G</div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button id="btn-auto-aquarium" class="btn-primary" style="height: 40px; font-size: 13px; padding: 0 12px; background: #0284c7;" ${count === 0 ? 'disabled' : ''}>
            🐠 최고물고기 일괄입주
          </button>
          <button id="btn-sell-all" class="btn-primary" style="height: 40px; font-size: 14px; padding: 0 var(--space-md);" ${count === 0 ? 'disabled' : ''}>
            모두 팔기
          </button>
        </div>
      </div>
    </div>

    <!-- 가방 필터 & 정렬 바 -->
    <div class="bag-filter-bar" style="padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; background: #fff; border-bottom: 1px solid var(--color-hairline); gap: 6px; overflow-x: auto;">
      <div style="display: flex; gap: 4px; overflow-x: auto;">
        <button class="shop-tab-pill ${bagFilterRarity === 'all' ? 'is-active' : ''} btn-bag-filter" data-rarity="all">전체</button>
        <button class="shop-tab-pill ${bagFilterRarity === 'common' ? 'is-active' : ''} btn-bag-filter" data-rarity="common">일반</button>
        <button class="shop-tab-pill ${bagFilterRarity === 'rare' ? 'is-active' : ''} btn-bag-filter" data-rarity="rare">희귀</button>
        <button class="shop-tab-pill ${bagFilterRarity === 'epic' ? 'is-active' : ''} btn-bag-filter" data-rarity="epic">영웅</button>
        <button class="shop-tab-pill ${bagFilterRarity === 'legendary' ? 'is-active' : ''} btn-bag-filter" data-rarity="legendary">전설</button>
        <button class="shop-tab-pill ${bagFilterRarity === 'mythic' ? 'is-active' : ''} btn-bag-filter" data-rarity="mythic">신화</button>
      </div>
      <select id="bag-sort-select" class="pill-select" style="font-size: 12px; height: 32px; padding: 0 8px;">
        <option value="latest" ${bagSortBy === 'latest' ? 'selected' : ''}>최신순</option>
        <option value="price" ${bagSortBy === 'price' ? 'selected' : ''}>가격 높은순</option>
        <option value="size" ${bagSortBy === 'size' ? 'selected' : ''}>크기 큰순</option>
      </select>
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
            ${filteredItems
              .map((item) => {
                const fishMeta = FISH.find((f) => f.id === item.fishId) || FISH[0];
                const rarityMeta = RARITIES[fishMeta.rarity] || RARITIES.common;
                return `
                <div class="bag-item-row" data-uid="${item.uid}">
                  <div class="bag-item-emoji">${fishMeta.emoji}</div>
                  <div class="bag-item-info">
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <span class="t-card-title">${fishMeta.name}</span>
                      ${item.isCrown ? '<span style="font-size: 13px;" title="황금 왕관 초대형 크기">👑</span>' : ''}
                      <span class="badge-rarity rarity-${fishMeta.rarity}">${rarityMeta.name}</span>
                    </div>
                    <div class="t-body-sm tabular-nums">${item.size.toFixed(1)}cm ${item.isCrown ? '<strong style="color: #ca8a04;">(1.5배 보너스!)</strong>' : ''}</div>
                  </div>
                  <div class="bag-item-price tabular-nums t-card-title">${formatGold(item.price)}G</div>
                  <div style="display: flex; gap: 4px;">
                    <button class="btn-secondary btn-aquarium-one" data-uid="${item.uid}" title="수족관에 넣기" style="padding: 0 8px; font-size: 12px; background: #e0f2fe; color: #0369a1; border-color: #bae6fd;">🐠 수족관</button>
                    <button class="btn-secondary btn-sell-one" data-uid="${item.uid}">팔기</button>
                  </div>
                </div>
              `;
              })
              .join('')}
          </div>
        `
      }
    </div>
  `;

  // 필터 버튼 이벤트
  const filterBtns = screen.querySelectorAll('.btn-bag-filter');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      bagFilterRarity = btn.dataset.rarity;
      renderBag();
    });
  });

  // 정렬 선택 이벤트
  const sortSelect = document.getElementById('bag-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      bagSortBy = e.target.value;
      renderBag();
    });
  }

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

  const btnAutoAquarium = document.getElementById('btn-auto-aquarium');
  if (btnAutoAquarium && count > 0) {
    btnAutoAquarium.addEventListener('click', () => {
      const res = autoAddBestFishToAquarium();
      if (!res.ok) {
        showToast(res.error);
      } else {
        showToast(`🐠 최고 등급 물고기 ${res.count}마리를 수족관에 입주시켰습니다!`);
        renderBag();
      }
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

  const aquariumOneBtns = screen.querySelectorAll('.btn-aquarium-one');
  aquariumOneBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const uid = btn.dataset.uid;
      const index = state.bag.findIndex((item) => item.uid === uid);
      if (index === -1) return;

      const result = addFishToAquarium(index);
      if (!result.ok) {
        showToast(result.error);
      } else {
        showToast(`🐠 [${result.fish.name}]을(를) 수족관에 넣었습니다!`);
        renderBag();
      }
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
