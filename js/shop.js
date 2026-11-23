import {
  state,
  buyRod,
  equipRod,
  buyBait,
  buyBagUpgrade,
  buySpecialItem,
} from './state.js';
import {
  RODS,
  ROD_ORDER,
  BAITS,
  BAIT_ORDER,
  BAG_UPGRADES,
  SPECIAL_ITEMS,
  MESSAGES,
} from './data.js';
import { formatGold, formatMessage } from './utils.js';
import { showToast } from './ui.js';
import { updateFishingIndicators } from './fishing.js';

let activeShopTab = 'rod'; // 'rod', 'bait', 'bag'

export function renderShop() {
  const screen = document.getElementById('screen-shop');
  if (!screen) return;

  screen.innerHTML = `
    <div class="color-block block-lilac">
      <div class="t-eyebrow">SHOP</div>
      <div class="t-headline">상점</div>
      <div class="t-subhead">🪙 보유 ${formatGold(state.gold)}G</div>
    </div>

    <!-- 상점 탭 토글 (알약 4개) -->
    <div class="shop-tab-group">
      <button class="shop-tab-pill ${activeShopTab === 'rod' ? 'is-active' : ''}" data-shoptab="rod">낚싯대</button>
      <button class="shop-tab-pill ${activeShopTab === 'bait' ? 'is-active' : ''}" data-shoptab="bait">미끼</button>
      <button class="shop-tab-pill ${activeShopTab === 'special' ? 'is-active' : ''}" data-shoptab="special">특수 아이템</button>
      <button class="shop-tab-pill ${activeShopTab === 'bag' ? 'is-active' : ''}" data-shoptab="bag">가방</button>
    </div>

    <div class="shop-content-pane" id="shop-content">
      ${activeShopTab === 'rod'
      ? renderRodTab()
      : activeShopTab === 'bait'
        ? renderBaitTab()
        : activeShopTab === 'special'
          ? renderSpecialTab()
          : renderBagTab()
    }
    </div>
  `;

  // 탭 토글 이벤트
  const tabPills = screen.querySelectorAll('.shop-tab-pill');
  tabPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      activeShopTab = pill.dataset.shoptab;
      renderShop();
    });
  });

  // 버튼 이벤트 바인딩
  bindShopEvents(screen);
}

function renderRodTab() {
  return `
    <div class="shop-list">
      ${ROD_ORDER.map((id) => {
    const rod = RODS[id];
    const isOwned = state.ownedRods.includes(id);
    const isEquipped = state.equippedRod === id;

    let btnHtml = '';
    if (isEquipped) {
      btnHtml = `<button class="btn-secondary" disabled>장착 중</button>`;
    } else if (isOwned) {
      btnHtml = `<button class="btn-secondary btn-equip-rod" data-rod-id="${id}">장착</button>`;
    } else {
      btnHtml = `<button class="btn-primary btn-buy-rod" data-rod-id="${id}" style="height: 44px; padding: 0 var(--space-md); font-size: 14px;">구매 ${formatGold(rod.price)}G</button>`;
    }

    return `
          <div class="shop-item-row">
            <div class="shop-item-emoji">${rod.emoji}</div>
            <div class="shop-item-info">
              <div class="t-card-title">${rod.name}</div>
              <div class="t-body-sm">${rod.desc}</div>
              <div class="t-body-sm" style="color: var(--color-ink); opacity: 0.7;">
                잡기 영역 +${rod.zoneBonus} · 감기 속도 ×${rod.reelMultiplier.toFixed(2)}
              </div>
            </div>
            <div class="shop-item-action">
              ${btnHtml}
            </div>
          </div>
        `;
  }).join('')}
    </div>
  `;
}

function renderBaitTab() {
  const shopBaits = BAIT_ORDER.filter((id) => !BAITS[id].infinite);

  return `
    <div class="shop-list">
      ${shopBaits.map((id) => {
    const bait = BAITS[id];
    const ownedCount = state.baits[id] || 0;
    const price1 = bait.price;
    const price10 = bait.price * 10;

    return `
          <div class="shop-item-row">
            <div class="shop-item-emoji">${bait.emoji}</div>
            <div class="shop-item-info">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="t-card-title">${bait.name}</span>
                <span class="t-body-sm tabular-nums" style="font-weight: 600;">보유 ${ownedCount}개</span>
              </div>
              <div class="t-body-sm">${bait.desc}</div>
            </div>
            <div class="shop-item-action" style="flex-direction: column; gap: 4px;">
              <button class="btn-secondary btn-buy-bait" data-bait-id="${id}" data-qty="1" style="height: 36px; font-size: 13px; width: 100%;">
                1개 ${formatGold(price1)}G
              </button>
              <button class="btn-secondary btn-buy-bait" data-bait-id="${id}" data-qty="10" style="height: 36px; font-size: 13px; width: 100%;">
                10개 ${formatGold(price10)}G
              </button>
            </div>
          </div>
        `;
  }).join('')}
    </div>
  `;
}

function renderSpecialTab() {
  const items = Object.values(SPECIAL_ITEMS);
  return `
    <div class="shop-list">
      ${items.map((item) => {
        let statusStr = '';
        let btnDisabled = false;
        let btnText = `구매 ${formatGold(item.price)}G`;

        if (item.isPermanent) {
          const owned = state.specialItems && state.specialItems.magnet_gold;
          if (owned) {
            statusStr = '<span class="collection-reward-tag is-claimed">영구 적용 중</span>';
            btnDisabled = true;
            btnText = '보유 중';
          } else {
            statusStr = '<span class="collection-reward-tag">영구 패시브</span>';
          }
        } else {
          const count = (state.specialItems && state.specialItems[item.id]) || 0;
          statusStr = `<span class="t-body-sm tabular-nums" style="font-weight: 700;">남은 횟수: ${count}회</span>`;
        }

        return `
          <div class="shop-item-row">
            <div class="shop-item-emoji">${item.emoji}</div>
            <div class="shop-item-info">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="t-card-title">${item.name}</span>
                ${statusStr}
              </div>
              <div class="t-body-sm">${item.desc}</div>
            </div>
            <div class="shop-item-action">
              <button class="btn-primary btn-buy-special" data-item-id="${item.id}" style="height: 44px; padding: 0 var(--space-md); font-size: 14px;" ${btnDisabled ? 'disabled' : ''}>
                ${btnText}
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderBagTab() {
  const currentCap = state.bagCapacity;
  const upgrade = BAG_UPGRADES.find((u) => u.from === currentCap);
  const isMax = currentCap >= 50 || !upgrade;

  return `
    <div class="shop-list">
      <div class="shop-item-row">
        <div class="shop-item-emoji">🎒</div>
        <div class="shop-item-info">
          <div class="t-card-title">가방 확장</div>
          <div class="t-body-sm">
            ${isMax ? '가방이 최대 크기예요 (50마리)' : `현재 ${currentCap}마리 → ${upgrade.to}마리`}
          </div>
        </div>
        <div class="shop-item-action">
          ${isMax
      ? `<button class="btn-secondary" disabled>최대 용량이에요</button>`
      : `<button class="btn-primary btn-buy-bag" style="height: 44px; padding: 0 var(--space-md); font-size: 14px;">구매 ${formatGold(upgrade.price)}G</button>`
    }
        </div>
      </div>
    </div>
  `;
}

function bindShopEvents(screen) {
  // 낚싯대 구매
  const buyRodBtns = screen.querySelectorAll('.btn-buy-rod');
  buyRodBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const rodId = btn.dataset.rodId;
      const rod = RODS[rodId];
      if (!rod) return;

      if (rod.price >= 1000) {
        showHighPriceConfirmModal(`${rod.name}을(를) ${formatGold(rod.price)}G에 살까요?`, () => {
          executeBuyRod(rodId);
        });
      } else {
        executeBuyRod(rodId);
      }
    });
  });

  // 낚싯대 장착
  const equipRodBtns = screen.querySelectorAll('.btn-equip-rod');
  equipRodBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const rodId = btn.dataset.rodId;
      const rod = RODS[rodId];
      equipRod(rodId);
      showToast(formatMessage(MESSAGES.EQUIP_ROD, { rodName: rod.name }));
      updateFishingIndicators();
      renderShop();
    });
  });

  // 특수 아이템 구매 이벤트
  const buySpecialBtns = screen.querySelectorAll('.btn-buy-special');
  buySpecialBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const itemId = btn.dataset.itemId;
      const item = SPECIAL_ITEMS[itemId];
      if (!item) return;

      if (item.price >= 1000) {
        showHighPriceConfirmModal(`${item.name}을(를) ${formatGold(item.price)}G에 살까요?`, () => {
          executeBuySpecial(itemId);
        });
      } else {
        executeBuySpecial(itemId);
      }
    });
  });

  // 미끼 구매
  const buyBaitBtns = screen.querySelectorAll('.btn-buy-bait');
  buyBaitBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const baitId = btn.dataset.baitId;
      const qty = parseInt(btn.dataset.qty, 10);
      const bait = BAITS[baitId];
      const totalPrice = bait.price * qty;

      if (totalPrice >= 1000) {
        showHighPriceConfirmModal(`${bait.name} ${qty}개를 ${formatGold(totalPrice)}G에 살까요?`, () => {
          executeBuyBait(baitId, qty);
        });
      } else {
        executeBuyBait(baitId, qty);
      }
    });
  });

  // 가방 확장 구매
  const buyBagBtn = screen.querySelector('.btn-buy-bag');
  if (buyBagBtn) {
    buyBagBtn.addEventListener('click', () => {
      const currentCap = state.bagCapacity;
      const upgrade = BAG_UPGRADES.find((u) => u.from === currentCap);
      if (!upgrade) return;

      if (upgrade.price >= 1000) {
        showHighPriceConfirmModal(`가방 확장을 ${formatGold(upgrade.price)}G에 살까요?`, () => {
          executeBuyBagUpgrade();
        });
      } else {
        executeBuyBagUpgrade();
      }
    });
  }
}

function executeBuyRod(rodId) {
  const rod = RODS[rodId];
  const res = buyRod(rodId);
  if (!res.ok) {
    if (res.error === 'E02') {
      showToast(formatMessage(MESSAGES.E02, { price: formatGold(rod.price), gold: formatGold(state.gold) }));
    }
    return;
  }

  showToast(formatMessage(MESSAGES.BUY_ROD, { rodName: rod.name }));
  updateFishingIndicators();
  renderShop();
}

function executeBuyBait(baitId, qty) {
  const bait = BAITS[baitId];
  const res = buyBait(baitId, qty);
  if (!res.ok) {
    if (res.error === 'E02') {
      showToast(formatMessage(MESSAGES.E02, { price: formatGold(bait.price * qty), gold: formatGold(state.gold) }));
    } else if (res.error === 'BAIT_MAX_LIMIT') {
      showToast(MESSAGES.BAIT_MAX_LIMIT);
    }
    return;
  }

  showToast(formatMessage(MESSAGES.BUY_ITEM, { itemName: `${bait.name} ${qty}개` }));
  updateFishingIndicators();
  renderShop();
}

function executeBuySpecial(itemId) {
  const item = SPECIAL_ITEMS[itemId];
  const res = buySpecialItem(itemId);
  if (!res.ok) {
    if (res.error === 'E02') {
      showToast(formatMessage(MESSAGES.E02, { price: formatGold(item.price), gold: formatGold(state.gold) }));
    }
    return;
  }
  showToast(`✨ ${item.name} 구매 완료!`);
  renderShop();
}

function executeBuyBagUpgrade() {
  const currentCap = state.bagCapacity;
  const upgrade = BAG_UPGRADES.find((u) => u.from === currentCap);
  const res = buyBagUpgrade();
  if (!res.ok) {
    if (res.error === 'E02' && upgrade) {
      showToast(formatMessage(MESSAGES.E02, { price: formatGold(upgrade.price), gold: formatGold(state.gold) }));
    }
    return;
  }

  showToast(formatMessage(MESSAGES.BAG_EXPAND, { capacity: res.newCapacity }));
  renderShop();
}

function showHighPriceConfirmModal(message, onConfirm) {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="modal-confirm-scrim">
      <div class="modal-dialog">
        <div class="modal-content" style="padding: var(--space-xl) var(--space-lg); text-align: center;">
          <div class="t-headline" style="margin-bottom: var(--space-sm);">구매 확인</div>
          <div class="t-body" style="margin-bottom: var(--space-lg);">${message}</div>
          <div style="display: flex; gap: var(--space-xs); width: 100%;">
            <button id="btn-cancel-buy" class="btn-secondary" style="flex: 1;">취소</button>
            <button id="btn-confirm-buy" class="btn-primary" style="flex: 1;">구매</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const btnCancel = document.getElementById('btn-cancel-buy');
  const btnConfirm = document.getElementById('btn-confirm-buy');

  const close = () => {
    modalRoot.innerHTML = '';
  };

  btnCancel.addEventListener('click', close);
  btnConfirm.addEventListener('click', () => {
    close();
    onConfirm();
  });
}
