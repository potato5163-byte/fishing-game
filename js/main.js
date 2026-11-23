import { updateTopbar, switchTab } from './ui.js';
import { state, loadGame, resetGame } from './state.js';
import {
  handleMainActionPress,
  handleMainActionRelease,
  isModalOpen,
  closeModal,
  initFishing,
  updateFishingIndicators,
  updateFishingScene,
} from './fishing.js';
import { setReelHolding, isQTEActive, handleQTEInput, setAimDirection, trySmashAction } from './reel.js';
import { initDebug } from './debug.js';
import { formatGold } from './utils.js';
import { toggleSound, isSoundEnabled, playSound } from './sound.js';
import { cycleWeather, updateWeatherVisual } from './weather.js';

import { showRatesModal } from './collection.js';

function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-item');
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tabId = button.dataset.tab;
      if (tabId) {
        switchTab(tabId);
      }
    });
  });
}

function initFishingInput() {
  const mainBtn = document.getElementById('btn-main-action');
  const reelPanel = document.getElementById('reel-panel');
  const quickRatesBtn = document.getElementById('btn-quick-rates');

  if (quickRatesBtn) {
    quickRatesBtn.addEventListener('click', showRatesModal);
  }

  if (mainBtn) {
    mainBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      handleMainActionPress();
    });
    mainBtn.addEventListener('pointerup', (e) => {
      e.preventDefault();
      handleMainActionRelease();
    });
    mainBtn.addEventListener('pointerleave', (e) => {
      handleMainActionRelease();
    });
    mainBtn.addEventListener('pointercancel', (e) => {
      handleMainActionRelease();
    });
    // 모바일 롱프레스 시 컨텍스트 메뉴 방지
    mainBtn.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  // 릴 미니게임 패널을 누르고 있어도 잡기 영역 상승 처리
  if (reelPanel) {
    reelPanel.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      setReelHolding(true);
    });
    reelPanel.addEventListener('pointerup', (e) => {
      e.preventDefault();
      setReelHolding(false);
    });
    reelPanel.addEventListener('pointerleave', (e) => {
      setReelHolding(false);
    });
    reelPanel.addEventListener('pointercancel', (e) => {
      setReelHolding(false);
    });
    reelPanel.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  // Space 및 방향키 키보드 처리
  window.addEventListener('keydown', (e) => {
    // QTE 활성화 상태일 때 방향키 및 Space 커맨드 처리
    if (isQTEActive()) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
        handleQTEInput(e.code);
        return;
      }
    }

    // 낚시 파이팅 중 좌우 방향키로 낚싯대 조준 이동
    if (e.code === 'ArrowLeft') {
      setAimDirection(-1);
    } else if (e.code === 'ArrowRight') {
      setAimDirection(1);
    }

    if (e.code === 'Space') {
      // select 엘리먼트에 포커스가 있으면 Space 기본 동작 유지
      if (document.activeElement && document.activeElement.tagName === 'SELECT') {
        return;
      }
      e.preventDefault();

      if (isModalOpen()) {
        closeModal();
        return;
      }

      if (!e.repeat) {
        handleMainActionPress();
      }
    } else if (e.code === 'Escape') {
      if (isModalOpen()) {
        e.preventDefault();
        closeModal();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
      setAimDirection(0);
    }

    if (e.code === 'Space') {
      if (document.activeElement && document.activeElement.tagName === 'SELECT') {
        return;
      }
      e.preventDefault();
      handleMainActionRelease();
    }
  });

  // QTE 모바일 버튼 터치 이벤트 리스너 바인딩
  const qteMobileBtns = document.querySelectorAll('.qte-btn');
  qteMobileBtns.forEach((btn) => {
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const key = btn.dataset.key;
      if (key && isQTEActive()) {
        handleQTEInput(key);
      }
    });
  });

  // 모바일 터치 조준 패들 바인딩
  const touchLeft = document.getElementById('touch-left');
  const touchRight = document.getElementById('touch-right');
  const touchCenter = document.getElementById('touch-center');

  if (touchLeft) {
    touchLeft.addEventListener('pointerdown', (e) => { e.preventDefault(); setAimDirection(-1); });
    touchLeft.addEventListener('pointerup', (e) => { e.preventDefault(); setAimDirection(0); });
    touchLeft.addEventListener('pointerleave', () => setAimDirection(0));
  }
  if (touchRight) {
    touchRight.addEventListener('pointerdown', (e) => { e.preventDefault(); setAimDirection(1); });
    touchRight.addEventListener('pointerup', (e) => { e.preventDefault(); setAimDirection(0); });
    touchRight.addEventListener('pointerleave', () => setAimDirection(0));
  }
  if (touchCenter) {
    touchCenter.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      trySmashAction();
    });
  }
}

function initSettings() {
  const settingsBtn = document.getElementById('btn-settings');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', showSettingsModal);
  }

  const soundBtn = document.getElementById('btn-sound');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const enabled = toggleSound();
      soundBtn.textContent = enabled ? '🔊' : '🔇';
      if (enabled) playSound('gold');
    });
  }

  const weatherBtn = document.getElementById('btn-weather');
  if (weatherBtn) {
    weatherBtn.addEventListener('click', () => {
      const nextW = cycleWeather();
      weatherBtn.textContent = `${nextW.emoji} ${nextW.name}`;
      playSound('cast');
    });
  }
}

function showSettingsModal() {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const caught = state.stats ? state.stats.totalCaught || 0 : 0;
  const casts = state.stats ? state.stats.totalCasts || 0 : 0;
  const earned = state.stats ? state.stats.totalEarned || 0 : 0;

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="modal-settings-scrim">
      <div class="modal-dialog">
        <div class="modal-top-block block-cream" style="padding: var(--space-lg) var(--space-md);">
          <div class="t-eyebrow">SETTINGS</div>
          <div class="t-headline">설정</div>
        </div>
        <div class="modal-content" style="padding: var(--space-lg); width: 100%;">
          <div class="modal-info-list">
            <div class="modal-info-row">
              <span class="t-body">총 낚은 물고기</span>
              <span class="t-card-title tabular-nums">${caught}마리</span>
            </div>
            <div class="modal-info-row">
              <span class="t-body">총 던진 횟수</span>
              <span class="t-card-title tabular-nums">${casts}회</span>
            </div>
            <div class="modal-info-row">
              <span class="t-body">총 번 골드</span>
              <span class="t-card-title tabular-nums">${formatGold(earned)}G</span>
            </div>
          </div>

          <button id="btn-reset-data" class="btn-danger-outline" style="width: 100%; margin-top: var(--space-sm);">
            데이터 초기화
          </button>
          <button id="btn-close-settings" class="btn-secondary modal-action-btn" style="margin-top: var(--space-xs);">
            닫기
          </button>
        </div>
      </div>
    </div>
  `;

  const btnClose = document.getElementById('btn-close-settings');
  const btnReset = document.getElementById('btn-reset-data');

  btnClose.addEventListener('click', () => {
    modalRoot.innerHTML = '';
  });

  btnReset.addEventListener('click', showResetConfirmModal);
}

function showResetConfirmModal() {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="modal-reset-confirm-scrim">
      <div class="modal-dialog">
        <div class="modal-content" style="padding: var(--space-xl) var(--space-lg); text-align: center;">
          <div class="t-headline" style="margin-bottom: var(--space-sm);">초기화 확인</div>
          <div class="t-body" style="margin-bottom: var(--space-lg);">
            정말 처음부터 시작할까요?<br />모든 기록이 사라져요.
          </div>
          <div style="display: flex; gap: var(--space-xs); width: 100%;">
            <button id="btn-cancel-reset" class="btn-secondary" style="flex: 1;">취소</button>
            <button id="btn-do-reset" class="btn-danger-solid" style="flex: 1;">초기화</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const btnCancel = document.getElementById('btn-cancel-reset');
  const btnDoReset = document.getElementById('btn-do-reset');

  btnCancel.addEventListener('click', () => {
    showSettingsModal();
  });

  btnDoReset.addEventListener('click', () => {
    modalRoot.innerHTML = '';
    resetGame();
    updateFishingIndicators();
    updateFishingScene();
    switchTab('fishing');
  });
}

function init() {
  loadGame();
  updateTopbar();
  initTabs();
  initFishing();
  initFishingInput();
  initSettings();
  initDebug();
  switchTab(state.activeTab);
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', init);
}
