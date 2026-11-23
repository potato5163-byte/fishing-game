import { addGold, state } from './state.js';
import { BAITS } from './data.js';
import { weightedPick } from './utils.js';
import { showToast } from './ui.js';

let isDebugVisible = false;
let isInstantBite = false;

export function isInstantBiteEnabled() {
  return isInstantBite;
}

export function initDebug() {
  checkDebugHash();
  window.addEventListener('hashchange', checkDebugHash);
}

function checkDebugHash() {
  const shouldShow = window.location.hash === '#debug';
  if (shouldShow && !isDebugVisible) {
    showDebugPanel();
  } else if (!shouldShow && isDebugVisible) {
    hideDebugPanel();
  }
}

function showDebugPanel() {
  isDebugVisible = true;
  let panel = document.getElementById('debug-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'debug-panel';
    panel.className = 'debug-panel';
    document.body.appendChild(panel);
  }

  panel.innerHTML = `
    <div class="debug-header">
      <span>🛠️ 디버그 패널</span>
      <button id="btn-debug-toggle" class="debug-btn-sm">접기</button>
    </div>
    <div class="debug-body" id="debug-body">
      <button id="btn-debug-gold" class="debug-btn">+1,000G</button>
      <button id="btn-debug-gold-mega" class="debug-btn" style="color: #FFD166;">+100,000G</button>
      <button id="btn-debug-mythic" class="debug-btn" style="color: #FF007F; font-weight: 700;">다음 물고기 신화 확정</button>
      <button id="btn-debug-legend" class="debug-btn">다음 물고기 전설 확정</button>
      <button id="btn-debug-bite" class="debug-btn">입질 바로 오기: OFF</button>
      <button id="btn-debug-stats" class="debug-btn">등급 통계 (1,000회)</button>
      <div id="debug-stats-result" style="font-size: 11px; margin-top: 4px; color: var(--color-surface-soft);" hidden></div>
    </div>
  `;

  // 이벤트 바인딩
  const btnGold = document.getElementById('btn-debug-gold');
  btnGold.addEventListener('click', () => {
    addGold(1000);
    showToast('🪙 디버그: +1,000G 지급 완료');
  });

  const btnGoldMega = document.getElementById('btn-debug-gold-mega');
  if (btnGoldMega) {
    btnGoldMega.addEventListener('click', () => {
      addGold(100000);
      showToast('💰 디버그: +100,000G 대량 지급 완료');
    });
  }

  const btnMythic = document.getElementById('btn-debug-mythic');
  if (btnMythic) {
    btnMythic.addEventListener('click', () => {
      window.__forceMythicOnce = true;
      showToast('🔥 디버그: 다음 물고기가 [신화]로 확정됩니다.');
    });
  }

  const btnLegend = document.getElementById('btn-debug-legend');
  btnLegend.addEventListener('click', () => {
    window.__forceLegendaryOnce = true;
    showToast('🌟 디버그: 다음 물고기가 전설로 확정됩니다.');
  });

  const btnBite = document.getElementById('btn-debug-bite');
  btnBite.addEventListener('click', () => {
    isInstantBite = !isInstantBite;
    btnBite.textContent = `입질 바로 오기: ${isInstantBite ? 'ON' : 'OFF'}`;
    showToast(`⚡ 디버그: 입질 바로 오기 ${isInstantBite ? '켜짐' : '꺼짐'}`);
  });

  const btnStats = document.getElementById('btn-debug-stats');
  const statsResult = document.getElementById('debug-stats-result');
  btnStats.addEventListener('click', () => {
    const bait = BAITS[state.selectedBait] || BAITS.basic;
    const counts = { common: 0, rare: 0, epic: 0, legendary: 0 };
    for (let i = 0; i < 1000; i++) {
      const picked = weightedPick(bait.weights);
      counts[picked] = (counts[picked] || 0) + 1;
    }
    statsResult.hidden = false;
    statsResult.innerHTML = `[${bait.name} 1,000회]<br/>일반: ${(counts.common / 10).toFixed(1)}% | 희귀: ${(counts.rare / 10).toFixed(1)}%<br/>영웅: ${(counts.epic / 10).toFixed(1)}% | 전설: ${(counts.legendary / 10).toFixed(1)}%`;
  });

  const btnToggle = document.getElementById('btn-debug-toggle');
  const debugBody = document.getElementById('debug-body');
  btnToggle.addEventListener('click', () => {
    const isHidden = debugBody.hidden;
    debugBody.hidden = !isHidden;
    btnToggle.textContent = isHidden ? '접기' : '펼치기';
  });
}

function hideDebugPanel() {
  isDebugVisible = false;
  const panel = document.getElementById('debug-panel');
  if (panel) {
    panel.remove();
  }
}
