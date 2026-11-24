import { state, setActiveTab, getEffectiveBagCapacity } from './state.js';
import { REGIONS } from './data.js';
import { formatGold } from './utils.js';
import { renderBag } from './bag.js';
import { renderCollection } from './collection.js';
import { renderShop } from './shop.js';
import { renderRegions } from './regions.js';

export function updateTopbar() {
  if (typeof document === 'undefined') return;
  const goldEl = document.getElementById('topbar-gold');
  const regionEl = document.getElementById('topbar-region');
  const bagEl = document.getElementById('topbar-bag');
  const kingEl = document.getElementById('topbar-king');

  if (goldEl) {
    goldEl.textContent = `🪙 ${formatGold(state.gold)}G`;
  }

  if (regionEl) {
    const current = REGIONS.find((r) => r.id === state.currentRegion);
    regionEl.textContent = `📍 ${current ? current.name : ''}`;
  }

  if (bagEl) {
    const bagCount = state.bag.length;
    const effectiveCap = getEffectiveBagCapacity();
    bagEl.textContent = `🎒 ${bagCount}/${effectiveCap}`;
    if (bagCount >= effectiveCap) {
      bagEl.classList.add('is-full');
    } else {
      bagEl.classList.remove('is-full');
    }
  }

  if (kingEl) {
    const totalCollected = Object.keys(state.collection || {}).length;
    kingEl.hidden = !(state.kingAchieved || totalCollected >= 100);
  }
}

export function switchTab(tabId) {
  if (state.isFishingActive) {
    return; // 낚시 중에는 탭 전환 불가
  }

  setActiveTab(tabId);

  // 탭 버튼 스타일 갱신
  const tabButtons = document.querySelectorAll('.tab-item');
  tabButtons.forEach((btn) => {
    if (btn.dataset.tab === tabId) {
      btn.classList.add('is-active');
    } else {
      btn.classList.remove('is-active');
    }
  });

  // 화면 전환
  const screens = document.querySelectorAll('.screen');
  screens.forEach((screen) => {
    if (screen.id === `screen-${tabId}`) {
      screen.hidden = false;
      screen.classList.add('is-active');
    } else {
      screen.hidden = true;
      screen.classList.remove('is-active');
    }
  });

  // 해당 화면 렌더링 호출
  if (tabId === 'bag') {
    renderBag();
  } else if (tabId === 'collection') {
    renderCollection();
  } else if (tabId === 'shop') {
    renderShop();
  } else if (tabId === 'regions') {
    renderRegions();
  }

  // 상단바 동기화
  updateTopbar();
}

let toastTimer = null;

export function showToast(message) {
  if (typeof document === 'undefined') return;
  const toastRoot = document.getElementById('toast-root');
  if (!toastRoot) return;

  // 새 것이 오면 즉시 교체 (docs/02 6장)
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }
  toastRoot.innerHTML = '';

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  toastRoot.appendChild(toast);

  toastTimer = setTimeout(() => {
    toast.remove();
    toastTimer = null;
  }, 2500);
}
