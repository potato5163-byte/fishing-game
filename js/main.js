import { updateTopbar, switchTab, showToast } from './ui.js';
import { state, loadGame, resetGame, exportSaveCode, importSaveCode, toggleSpeedMode, exchangeEcoReward } from './state.js';
import {
  handleMainActionPress,
  handleMainActionRelease,
  isModalOpen,
  closeModal,
  initFishing,
  updateFishingIndicators,
  updateFishingScene,
} from './fishing.js';
import { setReelHolding, isQTEActive, handleQTEInput, setAimDirection, setAimDirectPosition, trySmashAction, isReelingActive } from './reel.js';
import { initDebug } from './debug.js';
import { formatGold } from './utils.js';
import { toggleSound, isSoundEnabled, playSound } from './sound.js';
import { cycleWeather, updateWeatherVisual } from './weather.js';

import { showRatesModal } from './collection.js';
import { showRankingModal } from './ranking.js';
import { showSlotMachineModal } from './minigame.js';

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
  const quickBaitBtn = document.getElementById('btn-quick-buy-bait');

  if (quickBaitBtn) {
    quickBaitBtn.addEventListener('click', () => {
      const baitId = state.selectedBait || 'basic';
      if (baitId === 'basic') {
        showToast('기본 미끼는 무제한입니다!');
        return;
      }
      import('./state.js').then((s) => {
        const res = s.buyBait(baitId, 10);
        if (res.ok) {
          showToast(`🍞 미끼 10개를 즉시 구매했습니다!`);
          updateFishingIndicators();
        } else {
          showToast('골드가 부족하거나 최대 소지량을 초과했습니다.');
        }
      });
    });
  }

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

  // 3D 낚시 화면 위에서 마우스 드래그 / 터치 스와이프로 낚싯대 즉각 조준
  const oceanView = document.getElementById('reel-ocean-view');
  if (oceanView) {
    let isDragging = false;

    const handlePointerAim = (e) => {
      if (!isReelingActive()) return;
      const rect = oceanView.getBoundingClientRect();
      if (rect.width > 0) {
        const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const percentX = ((clientX - rect.left) / rect.width) * 100;
        setAimDirectPosition(percentX);
      }
    };

    oceanView.addEventListener('pointerdown', (e) => {
      // 터치 버튼 클릭 시 중복 이벤트 방지
      if (e.target && (e.target.classList.contains('qte-btn') || e.target.closest('.qte-btn'))) return;
      isDragging = true;
      handlePointerAim(e);
    });

    window.addEventListener('pointermove', (e) => {
      if (isDragging) {
        handlePointerAim(e);
      }
    });

    window.addEventListener('pointerup', () => {
      isDragging = false;
    });

    window.addEventListener('pointercancel', () => {
      isDragging = false;
    });
  }

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

function showDailyQuestModal() {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const quests = state.dailyQuests || [];

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="modal-quest-scrim">
      <div class="modal-dialog">
        <div class="modal-top-block block-lime" style="padding: var(--space-lg) var(--space-md);">
          <div class="t-eyebrow">DAILY MISSION</div>
          <div class="t-headline">📜 오늘의 낚시 의뢰소</div>
        </div>
        <div class="modal-content" style="padding: var(--space-md); width: 100%;">
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${quests.map((q) => `
              <div style="padding: 10px; background: var(--color-surface-soft); border-radius: 8px; border: 1px solid var(--color-hairline); display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 700; font-size: 13px;">${q.title}</div>
                  <div style="font-size: 11px; color: var(--color-subtext);">진행도: ${q.current}/${q.target} · 보상: ${formatGold(q.reward)}G</div>
                </div>
                <div>
                  ${q.completed ? '<span style="color: #10b981; font-weight: 900; font-size: 13px;">✅ 완료!</span>' : '<span style="color: #ea580c; font-weight: 700; font-size: 12px;">진행 중</span>'}
                </div>
              </div>
            `).join('')}
          </div>
          <button id="btn-close-quest" class="btn-primary modal-action-btn" style="margin-top: var(--space-md);">확인</button>
        </div>
      </div>
    </div>
  `;

  const btnClose = document.getElementById('btn-close-quest');
  if (btnClose) {
    btnClose.addEventListener('click', () => { modalRoot.innerHTML = ''; });
  }
}

function initSettings() {
  const slotBtn = document.getElementById('btn-slot-machine');
  if (slotBtn) {
    slotBtn.addEventListener('click', showSlotMachineModal);
  }

  const rankingBtn = document.getElementById('btn-ranking');
  if (rankingBtn) {
    rankingBtn.addEventListener('click', showRankingModal);
  }

  const questBtn = document.getElementById('btn-daily-quest');
  if (questBtn) {
    questBtn.addEventListener('click', showDailyQuestModal);
  }

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

          <!-- 스피드 파밍 모드 토글 -->
          <div style="margin-top: var(--space-sm); padding: var(--space-sm); background: var(--color-surface-soft); border-radius: var(--radius-sm); border: 1px solid var(--color-hairline); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div class="t-card-title" style="font-size: 13px;">⚡ 스피드 파밍 모드</div>
              <div class="t-body-sm" style="font-size: 11px; color: var(--color-subtext);">물고기 결과창을 1.2초 후 자동으로 닫습니다.</div>
            </div>
            <button id="btn-toggle-speed-mode" class="btn-secondary" style="height: 32px; padding: 0 12px; font-size: 12px; font-weight: 700; ${state.speedMode ? 'background: #10b981; color: #fff; border: none;' : ''}">
              ${state.speedMode ? 'ON 🟢' : 'OFF ⚪'}
            </button>
          </div>

          <!-- 해양 환경 정화 마일리지 센터 -->
          <div style="margin-top: var(--space-sm); padding: var(--space-sm); background: #ecfdf5; border-radius: var(--radius-sm); border: 1px solid #a7f3d0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <div class="t-card-title" style="font-size: 13px; color: #065f46;">🌱 환경 정화 마일리지 센터</div>
              <span style="font-size: 12px; font-weight: 800; color: #047857;" class="tabular-nums">${state.ecoPoints || 0} P</span>
            </div>
            <div class="t-body-sm" style="font-size: 11px; color: #047857; margin-bottom: 8px;">
              낚시 중 건져올린 바다 쓰레기 마일리지로 친환경 보상을 교환하세요.
            </div>
            <div style="display: flex; gap: 6px;">
              <button id="btn-eco-rod" class="btn-primary" style="flex: 1; height: 32px; font-size: 11px; background: #059669;" ${state.hasEcoRod ? 'disabled' : ''}>
                ${state.hasEcoRod ? '🌿 에코 낚싯대 (보유중)' : '🌿 에코 낚싯대 (50P)'}
              </button>
              <button id="btn-eco-bait" class="btn-secondary" style="flex: 1; height: 32px; font-size: 11px;">
                🌱 에코 미끼 20개 (20P)
              </button>
            </div>
          </div>

          <!-- 기기 간 저장 데이터 이동 (클라우드리스 동기화) -->
          <div style="margin-top: var(--space-md); padding: var(--space-sm); background: var(--color-surface-soft); border-radius: var(--radius-sm); border: 1px solid var(--color-hairline);">
            <div class="t-card-title" style="font-size: 13px; margin-bottom: 4px;">📲 기기 간 저장 코드 동기화</div>
            <div class="t-body-sm" style="font-size: 11px; margin-bottom: 8px; color: var(--color-subtext);">
              코드를 복사하여 다른 PC나 휴대폰에서 그대로 이어할 수 있습니다.
            </div>
            <div style="display: flex; gap: 6px;">
              <button id="btn-export-code" class="btn-primary" style="flex: 1; height: 36px; font-size: 12px; background: #0284c7;">
                📋 저장코드 복사
              </button>
              <button id="btn-import-code" class="btn-secondary" style="flex: 1; height: 36px; font-size: 12px;">
                📥 코드 불러오기
              </button>
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
  const btnExport = document.getElementById('btn-export-code');
  const btnImport = document.getElementById('btn-import-code');
  const btnToggleSpeed = document.getElementById('btn-toggle-speed-mode');
  const btnEcoRod = document.getElementById('btn-eco-rod');
  const btnEcoBait = document.getElementById('btn-eco-bait');

  if (btnToggleSpeed) {
    btnToggleSpeed.addEventListener('click', () => {
      const isSpeed = toggleSpeedMode();
      showToast(isSpeed ? '⚡ 스피드 파밍 모드가 켜졌습니다!' : '스피드 파밍 모드가 꺼졌습니다.');
      showSettingsModal();
    });
  }

  if (btnEcoRod) {
    btnEcoRod.addEventListener('click', () => {
      const res = exchangeEcoReward('eco_rod');
      if (res.ok) {
        showToast('🌿 [자연의 수호자 에코 낚싯대]를 획득했습니다! (조준각 영구 보너스)');
        showSettingsModal();
      } else {
        showToast(res.error);
      }
    });
  }

  if (btnEcoBait) {
    btnEcoBait.addEventListener('click', () => {
      const res = exchangeEcoReward('eco_bait');
      if (res.ok) {
        showToast('🌱 생분해 친환경 미끼 20개를 수령했습니다!');
        showSettingsModal();
      } else {
        showToast(res.error);
      }
    });
  }

  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const code = exportSaveCode();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
          showToast('📋 저장 코드가 클립보드에 복사되었습니다!');
        }).catch(() => {
          prompt('아래 저장 코드를 복사하세요:', code);
        });
      } else {
        prompt('아래 저장 코드를 복사하세요:', code);
      }
    });
  }

  if (btnImport) {
    btnImport.addEventListener('click', () => {
      const code = prompt('다른 기기에서 복사한 저장 코드를 붙여넣으세요:');
      if (code) {
        const res = importSaveCode(code);
        if (res.ok) {
          showToast('🎉 저장 데이터를 성공적으로 불러왔습니다!');
          modalRoot.innerHTML = '';
          switchTab('fishing');
        } else {
          showToast(res.error);
        }
      }
    });
  }

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
