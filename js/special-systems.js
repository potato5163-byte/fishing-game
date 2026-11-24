/**
 * js/special-systems.js
 * 
 * 1. 🌀 차원 소용돌이 포탈 보스 낚시 (Vortex Boss Raid)
 * 2. 🧬 심해 생체 융합 연구소 (Bio-Fusion Lab)
 * 3. 🏗️ 침몰선 보물 인양 크레인 (Shipwreck Salvage Crane)
 */

import { VORTEX_BOSSES, HYBRID_FISH, SALVAGE_ITEMS, FISH } from './data.js';
import { state, addGold, saveGame, addFishToBag } from './state.js';
import { showToast, updateTopbar } from './ui.js';
import { startReelGame } from './reel.js';
import { playSound } from './sound.js';

// ========================================================
// 1. 🌀 차원 소용돌이 포탈 보스 시스템
// ========================================================

export function showVortexBossModal() {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const availableBosses = VORTEX_BOSSES.map((boss) => {
    const isUnlocked = state.unlockedRegions.includes(boss.region);
    return `
      <div class="shop-item-row" style="padding: 12px; margin-bottom: 8px; border-radius: var(--radius-md); background: ${isUnlocked ? '#f5f3ff' : '#f1f5f9'}; border: 1.5px solid ${isUnlocked ? '#c4b5fd' : '#cbd5e1'};">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
          <div>
            <div style="font-weight: 800; font-size: 15px; color: ${isUnlocked ? '#5b21b6' : '#64748b'};">${boss.emoji} ${boss.name}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">${boss.desc}</div>
            <div style="font-size: 12px; font-weight: 700; color: #d97706; margin-top: 4px;">격퇴 보상: +${boss.rewardGold.toLocaleString()}G</div>
          </div>
          <div>
            ${
              isUnlocked
                ? `<button class="btn-primary btn-vortex-summon" data-boss-id="${boss.id}" style="height: 36px; padding: 0 14px; font-size: 13px; background: #7c3aed; color: #fff;">소환 (20,000G)</button>`
                : `<span style="font-size: 12px; color: #94a3b8; font-weight: 700;">해당 지역 미해금</span>`
            }
          </div>
        </div>
      </div>
    `;
  }).join('');

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="vortex-modal-scrim">
      <div class="modal-content color-block block-lilac" style="max-height: 85vh; overflow-y: auto;">
        <div class="color-block-header">
          <div class="t-eyebrow">RAID BOSS</div>
          <button id="btn-close-vortex" class="btn-icon" style="background: rgba(0,0,0,0.1);">✕</button>
        </div>
        <div class="t-headline" style="color: #4c1d95;">🌀 차원 소용돌이 포탈</div>
        <div class="t-subhead">심연과 우주의 거대 네임드 보스를 소환하여 결전을 치릅니다!</div>
        <div style="margin-top: 14px;">
          ${availableBosses}
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-close-vortex')?.addEventListener('click', () => {
    modalRoot.innerHTML = '';
  });
  document.getElementById('vortex-modal-scrim')?.addEventListener('click', (e) => {
    if (e.target.id === 'vortex-modal-scrim') modalRoot.innerHTML = '';
  });

  modalRoot.querySelectorAll('.btn-vortex-summon').forEach((btn) => {
    btn.addEventListener('click', () => {
      const bossId = btn.dataset.bossId;
      summonVortexBoss(bossId);
    });
  });
}

function summonVortexBoss(bossId) {
  const boss = VORTEX_BOSSES.find((b) => b.id === bossId);
  if (!boss) return;

  const cost = 20000;
  if (state.gold < cost) {
    showToast('보스를 소환하기 위한 차원 에너지(20,000G)가 부족합니다.');
    return;
  }

  state.gold -= cost;
  saveGame();
  updateTopbar();

  const modalRoot = document.getElementById('modal-root');
  if (modalRoot) modalRoot.innerHTML = '';

  showToast(`🌀 [경고] ${boss.name}이(가) 차원 소용돌이를 뚫고 출현했습니다!`);
  playSound('bite');

  // 보스 릴 파이팅 오브젝트 생성
  const bossFishObj = {
    id: boss.id,
    name: boss.name,
    emoji: boss.emoji,
    rarity: 'mythic',
    size: 999.9,
    price: boss.rewardGold,
    difficulty: 5,
    isBoss: true,
  };

  // 릴 배틀 돌입
  const reelPanel = document.getElementById('reel-panel');
  if (reelPanel) reelPanel.hidden = false;

  startReelGame(bossFishObj, state.equippedRod, (result) => {
    if (result === 'success') {
      addGold(boss.rewardGold);
      playSound('legendary');
      showToast(`🎉 ${boss.name}을(를) 제압했습니다! 보상 +${boss.rewardGold.toLocaleString()}G!`);
    } else {
      showToast(`${boss.name}이(가) 차원 너머로 도주했습니다...`);
    }
  });
}

// ========================================================
// 2. 🧬 심해 생체 융합 연구소 시스템
// ========================================================

let selectedFusion1 = null;
let selectedFusion2 = null;

export function showBioFusionModal() {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  selectedFusion1 = null;
  selectedFusion2 = null;

  renderFusionContent();
}

function renderFusionContent() {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const bagFish = state.bag.map((item, idx) => {
    const fishInfo = FISH.find((f) => f.id === item.fishId) || { name: '물고기', emoji: '🐟' };
    const isSel1 = selectedFusion1 === idx;
    const isSel2 = selectedFusion2 === idx;
    return `
      <div class="fusion-card ${isSel1 || isSel2 ? 'is-selected' : ''}" data-idx="${idx}" style="cursor: pointer; padding: 8px; border-radius: var(--radius-md); background: ${isSel1 ? '#bbf7d0' : isSel2 ? '#fed7aa' : '#ffffff'}; border: 2px solid ${isSel1 ? '#16a34a' : isSel2 ? '#ea580c' : '#e2e8f0'}; display: flex; align-items: center; justify-content: space-between;">
        <div style="font-size: 14px; font-weight: 700;">${fishInfo.emoji} ${fishInfo.name} (${item.size.toFixed(1)}cm)</div>
        <div style="font-size: 12px; color: #059669; font-weight: 700;">${item.price.toLocaleString()}G</div>
      </div>
    `;
  }).join('');

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="fusion-modal-scrim">
      <div class="modal-content color-block block-mint" style="max-height: 85vh; overflow-y: auto;">
        <div class="color-block-header">
          <div class="t-eyebrow">BIO-FUSION LAB</div>
          <button id="btn-close-fusion" class="btn-icon" style="background: rgba(0,0,0,0.1);">✕</button>
        </div>
        <div class="t-headline" style="color: #065f46;">🧬 심해 생체 융합 연구소</div>
        <div class="t-subhead">물고기 2마리의 유전자를 결합해 신화 돌연변이 어종을 탄생시킵니다! (비용 15,000G)</div>

        <!-- 융합 슬롯 2개 -->
        <div style="display: flex; gap: 12px; margin: 16px 0; justify-content: center;">
          <div style="flex: 1; padding: 12px; background: #fff; border-radius: var(--radius-md); text-align: center; border: 2px dashed #16a34a;">
            <div style="font-size: 12px; font-weight: 800; color: #16a34a;">[DNA 슬롯 1]</div>
            <div id="fusion-slot-1-text" style="font-size: 14px; font-weight: 700; margin-top: 6px;">
              ${selectedFusion1 !== null ? (FISH.find(f => f.id === state.bag[selectedFusion1]?.fishId)?.name || '선택됨') : '물고기 선택'}
            </div>
          </div>
          <div style="align-self: center; font-size: 20px;">⚡</div>
          <div style="flex: 1; padding: 12px; background: #fff; border-radius: var(--radius-md); text-align: center; border: 2px dashed #ea580c;">
            <div style="font-size: 12px; font-weight: 800; color: #ea580c;">[DNA 슬롯 2]</div>
            <div id="fusion-slot-2-text" style="font-size: 14px; font-weight: 700; margin-top: 6px;">
              ${selectedFusion2 !== null ? (FISH.find(f => f.id === state.bag[selectedFusion2]?.fishId)?.name || '선택됨') : '물고기 선택'}
            </div>
          </div>
        </div>

        <button id="btn-do-fusion" class="btn-primary" style="width: 100%; height: 48px; background: #059669; font-weight: 800;">
          🧬 유전자 융합 실행 (15,000G)
        </button>

        <div style="margin-top: 16px;">
          <div style="font-size: 13px; font-weight: 700; color: #047857; margin-bottom: 8px;">가방 속 물고기 목록 (${state.bag.length}마리):</div>
          <div style="display: flex; flex-direction: column; gap: 6px; max-height: 220px; overflow-y: auto;">
            ${bagFish || '<div style="text-align: center; color: #64748b; padding: 20px;">가방에 물고기가 없습니다.</div>'}
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-close-fusion')?.addEventListener('click', () => {
    modalRoot.innerHTML = '';
  });
  document.getElementById('fusion-modal-scrim')?.addEventListener('click', (e) => {
    if (e.target.id === 'fusion-modal-scrim') modalRoot.innerHTML = '';
  });

  modalRoot.querySelectorAll('.fusion-card').forEach((card) => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.idx, 10);
      if (selectedFusion1 === null) {
        selectedFusion1 = idx;
      } else if (selectedFusion2 === null && selectedFusion1 !== idx) {
        selectedFusion2 = idx;
      } else if (selectedFusion1 === idx) {
        selectedFusion1 = null;
      } else if (selectedFusion2 === idx) {
        selectedFusion2 = null;
      } else {
        selectedFusion2 = idx;
      }
      renderFusionContent();
    });
  });

  document.getElementById('btn-do-fusion')?.addEventListener('click', doFusion);
}

function doFusion() {
  if (selectedFusion1 === null || selectedFusion2 === null) {
    showToast('융합할 물고기 2마리를 먼저 선택해주세요.');
    return;
  }
  const cost = 15000;
  if (state.gold < cost) {
    showToast('생체 융합 연구비(15,000G)가 부족합니다.');
    return;
  }

  // 재료 물고기 제거 (뒤 인덱스부터 제거)
  const idx1 = selectedFusion1;
  const idx2 = selectedFusion2;
  const larger = Math.max(idx1, idx2);
  const smaller = Math.min(idx1, idx2);

  state.bag.splice(larger, 1);
  state.bag.splice(smaller, 1);

  state.gold -= cost;

  // 하이브리드 어종 무작위 획득
  const hybrid = HYBRID_FISH[Math.floor(Math.random() * HYBRID_FISH.length)];

  const newBagItem = {
    uid: 'hyb_' + Date.now(),
    fishId: hybrid.id,
    size: 250.0,
    price: hybrid.basePrice,
    isCrown: true,
    caughtAt: new Date().toISOString(),
  };

  addFishToBag(newBagItem);
  saveGame();
  updateTopbar();

  playSound('legendary');
  showToast(`🎉 융합 대성공! 돌연변이 신화 어종 [${hybrid.name}] 탄생! (+${hybrid.basePrice.toLocaleString()}G 가치)`);

  const modalRoot = document.getElementById('modal-root');
  if (modalRoot) modalRoot.innerHTML = '';
}

// ========================================================
// 3. 🏗️ 침몰선 보물 인양 크레인 시스템
// ========================================================

export function showSalvageCraneModal() {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const cost = 30000;

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="salvage-modal-scrim">
      <div class="modal-content color-block block-coral" style="max-height: 85vh; overflow-y: auto;">
        <div class="color-block-header">
          <div class="t-eyebrow">DEEP-SEA SALVAGE</div>
          <button id="btn-close-salvage" class="btn-icon" style="background: rgba(0,0,0,0.1);">✕</button>
        </div>
        <div class="t-headline" style="color: #9a3412;">🏗️ 침몰선 보물 인양 크레인</div>
        <div class="t-subhead">심해 바닥에 가라앉은 고대 침몰선의 황금 궤짝과 유물을 와이어 크레인으로 인양합니다!</div>

        <div style="background: #ffffff; padding: 16px; border-radius: var(--radius-md); margin: 16px 0; border: 2px solid #fdba74; text-align: center;">
          <div style="font-size: 48px; animation: bounce 1s infinite alternate;">⚓</div>
          <div style="font-size: 15px; font-weight: 800; color: #c2410c; margin-top: 8px;">심해 1,000m 바닥 탐사 준비 완료</div>
          <div style="font-size: 12px; color: #78716c; margin-top: 4px;">인양 1회 비용: 30,000G (최소 5,000G ~ 최대 800,000G 상당 유물 인양)</div>
        </div>

        <button id="btn-start-salvage" class="btn-primary" style="width: 100%; height: 52px; background: #ea580c; font-size: 16px; font-weight: 800;">
          🏗️ 와이어 투하 & 인양 시작 (30,000G)
        </button>

        <div style="margin-top: 16px; font-size: 12px; color: #78716c;">
          <div style="font-weight: 700; color: #9a3412; margin-bottom: 4px;">출현 가능 유물 목록:</div>
          ${SALVAGE_ITEMS.map(item => `<div>• ${item.name} (${item.price.toLocaleString()}G) - ${item.desc}</div>`).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-close-salvage')?.addEventListener('click', () => {
    modalRoot.innerHTML = '';
  });
  document.getElementById('salvage-modal-scrim')?.addEventListener('click', (e) => {
    if (e.target.id === 'salvage-modal-scrim') modalRoot.innerHTML = '';
  });

  document.getElementById('btn-start-salvage')?.addEventListener('click', () => {
    if (state.gold < cost) {
      showToast('인양 작업비(30,000G)가 부족합니다.');
      return;
    }

    state.gold -= cost;
    saveGame();
    updateTopbar();

    const pickedItem = SALVAGE_ITEMS[Math.floor(Math.random() * SALVAGE_ITEMS.length)];
    addGold(pickedItem.price);

    playSound('legendary');
    showToast(`🏗️ 침몰선 인양 성공! [${pickedItem.name}] 획득! (+${pickedItem.price.toLocaleString()}G)`);

    modalRoot.innerHTML = '';
  });
}
