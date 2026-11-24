/**
 * js/special-systems.js
 * 
 * 1. 🌀 차원 소용돌이 포탈 보스 낚시 (Vortex Boss Raid)
 * 2. 🧬 심해 생체 융합 연구소 (Bio-Fusion Lab)
 * 3. 🏗️ 침몰선 보물 인양 크레인 (Shipwreck Salvage Crane)
 */

import { VORTEX_BOSSES, HYBRID_FISH, SALVAGE_ITEMS, FISH, HIDDEN_FISH } from './data.js';
import { state, addGold, saveGame, addFishToBag } from './state.js';
import { showToast, updateTopbar } from './ui.js';
import { startReelGame } from './reel.js';
import { playSound } from './sound.js';
import { getFishMeta } from './utils.js';

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

      // 보스 도감 기록 갱신
      if (!state.defeatedBosses) state.defeatedBosses = {};
      if (!state.defeatedBosses[boss.id]) {
        state.defeatedBosses[boss.id] = {
          count: 1,
          firstDefeatedAt: new Date().toISOString(),
        };
      } else {
        state.defeatedBosses[boss.id].count = (state.defeatedBosses[boss.id].count || 0) + 1;
      }
      saveGame();
      updateTopbar();

      showBossVictoryModal(boss);
    } else {
      showToast(`${boss.name}이(가) 차원 너머로 도주했습니다...`);
    }
  });
}

// 👑 보스 격퇴 전용 대형 승리 모달
export function showBossVictoryModal(boss) {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="boss-victory-scrim">
      <div class="modal-content color-block block-navy" style="max-height: 85vh; text-align: center; padding: 28px 18px; border: 3px solid #f59e0b; box-shadow: 0 0 40px rgba(245, 158, 11, 0.4);">
        <div class="t-eyebrow" style="color: #fbbf24; font-size: 13px; letter-spacing: 2px;">⚡ RAID BOSS DEFEATED ⚡</div>
        <div class="t-headline" style="color: #ffffff; font-size: 26px; margin-top: 4px;">
          ${boss.name} 토벌 완료!
        </div>

        <div style="margin: 20px 0; padding: 20px; background: rgba(15, 23, 42, 0.8); border-radius: var(--radius-lg); border: 2px solid #38bdf8;">
          <div style="font-size: 72px; filter: drop-shadow(0 0 25px #38bdf8); animation: bounce 1s infinite alternate;">
            ${boss.emoji}
          </div>
          <div style="font-size: 14px; color: #cbd5e1; margin-top: 12px; line-height: 1.5;">
            ${boss.desc}
          </div>
          <div style="margin-top: 14px; padding: 8px 16px; background: rgba(245, 158, 11, 0.15); border-radius: var(--radius-pill); display: inline-block; border: 1.5px solid #f59e0b;">
            <span style="font-size: 13px; font-weight: 800; color: #fde68a;">📖 보스 레이드 도감에 영구 등록되었습니다!</span>
          </div>
          <div style="font-size: 26px; font-weight: 900; color: #fbbf24; margin-top: 16px;" class="tabular-nums">
            현상금 +${boss.rewardGold.toLocaleString()}G 지급!
          </div>
        </div>

        <button id="btn-close-boss-victory" class="btn-primary" style="width: 100%; height: 50px; background: #7c3aed; font-size: 16px; font-weight: 800;">
          확인 및 보상 수령
        </button>
      </div>
    </div>
  `;

  document.getElementById('btn-close-boss-victory')?.addEventListener('click', () => {
    modalRoot.innerHTML = '';
  });
  document.getElementById('boss-victory-scrim')?.addEventListener('click', (e) => {
    if (e.target.id === 'boss-victory-scrim') modalRoot.innerHTML = '';
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
    const fishInfo = getFishMeta(item.fishId, FISH, HIDDEN_FISH, HYBRID_FISH, VORTEX_BOSSES);
    const isSel1 = selectedFusion1 === idx;
    const isSel2 = selectedFusion2 === idx;
    return `
      <div class="fusion-card ${isSel1 || isSel2 ? 'is-selected' : ''}" data-idx="${idx}" style="cursor: pointer; padding: 8px; border-radius: var(--radius-md); background: ${isSel1 ? '#bbf7d0' : isSel2 ? '#fed7aa' : '#ffffff'}; border: 2px solid ${isSel1 ? '#16a34a' : isSel2 ? '#ea580c' : '#e2e8f0'}; display: flex; align-items: center; justify-content: space-between;">
        <div style="font-size: 14px; font-weight: 700;">${fishInfo.emoji} ${fishInfo.name} (${item.size ? item.size.toFixed(1) : '0.0'}cm)</div>
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
        <div class="t-subhead">물고기 2마리의 유전자를 결합해 신화 돌연변이 어종을 탄생시킵니다!</div>

        <!-- 융합 슬롯 2개 -->
        <div style="display: flex; gap: 12px; margin: 16px 0; justify-content: center;">
          <div style="flex: 1; padding: 12px; background: #fff; border-radius: var(--radius-md); text-align: center; border: 2px dashed #16a34a;">
            <div style="font-size: 12px; font-weight: 800; color: #16a34a;">[DNA 슬롯 1]</div>
            <div id="fusion-slot-1-text" style="font-size: 14px; font-weight: 700; margin-top: 6px;">
              ${selectedFusion1 !== null ? (getFishMeta(state.bag[selectedFusion1]?.fishId, FISH, HIDDEN_FISH, HYBRID_FISH, VORTEX_BOSSES)?.name || '선택됨') : '물고기 선택'}
            </div>
            ${selectedFusion1 !== null ? `<div style="font-size: 12px; color: #059669; font-weight: 700;">${(state.bag[selectedFusion1]?.price || 0).toLocaleString()}G</div>` : ''}
          </div>
          <div style="align-self: center; font-size: 20px;">⚡</div>
          <div style="flex: 1; padding: 12px; background: #fff; border-radius: var(--radius-md); text-align: center; border: 2px dashed #ea580c;">
            <div style="font-size: 12px; font-weight: 800; color: #ea580c;">[DNA 슬롯 2]</div>
            <div id="fusion-slot-2-text" style="font-size: 14px; font-weight: 700; margin-top: 6px;">
              ${selectedFusion2 !== null ? (getFishMeta(state.bag[selectedFusion2]?.fishId, FISH, HIDDEN_FISH, HYBRID_FISH, VORTEX_BOSSES)?.name || '선택됨') : '물고기 선택'}
            </div>
            ${selectedFusion2 !== null ? `<div style="font-size: 12px; color: #ea580c; font-weight: 700;">${(state.bag[selectedFusion2]?.price || 0).toLocaleString()}G</div>` : ''}
          </div>
        </div>

        ${(() => {
          const item1 = selectedFusion1 !== null ? state.bag[selectedFusion1] : null;
          const item2 = selectedFusion2 !== null ? state.bag[selectedFusion2] : null;
          const fusionCost = (item1 && item2) ? Math.max(500, Math.round((item1.price + item2.price) * 0.4)) : 5000;
          return `
            <div style="text-align: center; margin-bottom: 8px; font-size: 13px; font-weight: 700; color: #047857;">
              필요 연구비: <span style="font-size: 16px; color: #d97706;" class="tabular-nums">${fusionCost.toLocaleString()}G</span>
            </div>
            <button id="btn-do-fusion" class="btn-primary" style="width: 100%; height: 48px; background: #059669; font-weight: 800;">
              🧬 유전자 융합 실행 (${fusionCost.toLocaleString()}G)
            </button>
          `;
        })()}

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

  const fishItem1 = state.bag[selectedFusion1];
  const fishItem2 = state.bag[selectedFusion2];
  if (!fishItem1 || !fishItem2) return;

  const cost = Math.max(300, Math.round((fishItem1.price + fishItem2.price) * 0.25));
  if (state.gold < cost) {
    showToast(`생체 융합 연구비(${cost.toLocaleString()}G)가 부족합니다.`);
    return;
  }

  const name1 = getFishMeta(fishItem1.fishId, FISH, HIDDEN_FISH, HYBRID_FISH, VORTEX_BOSSES)?.name || '물고기1';
  const name2 = getFishMeta(fishItem2.fishId, FISH, HIDDEN_FISH, HYBRID_FISH, VORTEX_BOSSES)?.name || '물고기2';

  // 재료 물고기 제거 (뒤 인덱스부터 제거)
  const idx1 = selectedFusion1;
  const idx2 = selectedFusion2;
  const larger = Math.max(idx1, idx2);
  const smaller = Math.min(idx1, idx2);

  state.bag.splice(larger, 1);
  state.bag.splice(smaller, 1);

  state.gold -= cost;

  // 🎲 100종 돌연변이 등급별 확률 룰 적용 (일반 45%, 희귀 30%, 영웅 15%, 전설 8%, 신화 2%)
  const rand = Math.random() * 100;
  let targetRarity = 'common';
  if (rand < 2) {
    targetRarity = 'mythic'; // 2% 초대박
  } else if (rand < 10) {
    targetRarity = 'legendary'; // 8% 대성공
  } else if (rand < 25) {
    targetRarity = 'epic'; // 15% 성공
  } else if (rand < 55) {
    targetRarity = 'rare'; // 30% 중박
  } else {
    targetRarity = 'common'; // 45% 기본
  }

  // 해당 등급의 돌연변이 풀에서 무작위 선택
  const pool = HYBRID_FISH.filter(f => f.rarity === targetRarity);
  const hybrid = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : HYBRID_FISH[0];

  // 등급별 합리적 판매가 밸런싱 (골드 인플레이션 방지 및 등급별 차등 수익)
  const baseCombined = fishItem1.price + fishItem2.price;
  let finalPrice = hybrid.basePrice;

  if (targetRarity === 'mythic') {
    finalPrice = Math.round(hybrid.basePrice * 1.5 + baseCombined * 1.5);
  } else if (targetRarity === 'legendary') {
    finalPrice = Math.round(hybrid.basePrice * 1.3 + baseCombined * 1.2);
  } else if (targetRarity === 'epic') {
    finalPrice = Math.round(hybrid.basePrice * 1.2 + baseCombined * 0.8);
  } else if (targetRarity === 'rare') {
    finalPrice = Math.round(hybrid.basePrice * 1.1 + baseCombined * 0.5);
  } else {
    finalPrice = Math.round(hybrid.basePrice * 1.0 + baseCombined * 0.3);
  }

  const newBagItem = {
    uid: 'hyb_' + Date.now(),
    fishId: hybrid.id,
    size: 150.0 + Math.random() * 100,
    price: finalPrice,
    isCrown: targetRarity === 'mythic' || targetRarity === 'legendary',
    caughtAt: new Date().toISOString(),
  };

  addFishToBag(newBagItem);

  // 돌연변이 도감 등록
  if (!state.mutationCollection) state.mutationCollection = {};
  state.mutationCollection[hybrid.id] = (state.mutationCollection[hybrid.id] || 0) + 1;

  saveGame();
  updateTopbar();

  // 🧬 화려한 생체 합성 가속 연출 시작 후 결과 팝업 표시
  playFusionAnimationSequence(hybrid, finalPrice, name1, name2, targetRarity);
}

// 🧬 생체 융합 가속 애니메이션 시퀀스 (1.5초)
function playFusionAnimationSequence(hybrid, finalPrice, name1, name2, targetRarity) {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  playSound('reel');

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="fusion-anim-scrim" style="background: rgba(6, 15, 25, 0.92); z-index: 10000; display: flex; justify-content: center; align-items: center;">
      <div style="text-align: center; color: #fff; max-width: 320px; padding: 20px;">
        <div class="fusion-anim-dna" style="font-size: 64px; margin-bottom: 16px;">
          🧬
        </div>
        <div class="fusion-anim-energy" style="font-size: 20px; font-weight: 800; color: #34d399; letter-spacing: 1px;">
          GENETIC SYNTHESIS...
        </div>
        <div style="font-size: 13px; color: #94a3b8; margin-top: 8px;">
          [${name1}] × [${name2}]<br>염색체 재조합 및 세포 가속 중...
        </div>
        <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 999px; margin-top: 18px; overflow: hidden; position: relative;">
          <div style="width: 100%; height: 100%; background: linear-gradient(90deg, #10b981, #06b6d4, #a855f7); animation: bounce 0.6s infinite alternate;"></div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    if (targetRarity === 'mythic' || targetRarity === 'legendary') {
      playSound('legendary');
    } else {
      playSound('catch');
    }
    showFusionResultModal(hybrid, finalPrice, name1, name2);
  }, 1400);
}

// 🧬 생체 융합 결과 전용 팝업창
function showFusionResultModal(hybrid, finalPrice, parent1, parent2) {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const rarityMeta = RARITIES[hybrid.rarity] || RARITIES.common;
  const isMythic = hybrid.rarity === 'mythic';
  const isLegendary = hybrid.rarity === 'legendary';
  const isEpic = hybrid.rarity === 'epic';

  const modalBorderClass = isMythic
    ? 'fusion-modal-mythic'
    : isLegendary
    ? 'fusion-modal-legendary'
    : '';

  const rarityBadgeText = isMythic
    ? '🌟 초월적 신화 돌연변이 (황금 왕관)'
    : isLegendary
    ? '👑 전설의 돌연변이 (황금 왕관)'
    : isEpic
    ? '💎 영웅 돌연변이'
    : hybrid.rarity === 'rare'
    ? '✨ 희귀 돌연변이'
    : '🧬 일반 돌연변이';

  const titleText = isMythic
    ? '🌌 신화급 초월 키메라 탄생!! 🌌'
    : isLegendary
    ? '✨ 전설 돌연변이 합성 대성공! ✨'
    : '🧬 생체 융합 완료!';

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="fusion-result-scrim">
      <div class="modal-content color-block ${isMythic ? 'block-navy' : 'block-mint'} ${modalBorderClass}" style="max-height: 85vh; text-align: center; padding: 24px 18px; border: 2.5px solid ${isMythic ? '#a855f7' : isLegendary ? '#f59e0b' : '#10b981'}; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);">
        <div class="t-eyebrow" style="color: ${isMythic ? '#c084fc' : '#047857'}; letter-spacing: 1px;">GENETIC SYNTHESIS COMPLETE</div>
        <div class="t-headline" style="color: ${isMythic ? '#fbbf24' : '#065f46'}; font-size: 22px; margin-top: 4px;">
          ${titleText}
        </div>

        <div style="font-size: 13px; color: ${isMythic ? '#94a3b8' : '#047857'}; margin-top: 6px;">
          [${parent1}] + [${parent2}] 의 유전자가 융합되었습니다!
        </div>

        <div style="margin: 18px 0; padding: 20px; background: ${isMythic ? '#0f172a' : '#ffffff'}; border-radius: var(--radius-lg); border: 2px solid ${isMythic ? '#7c3aed' : isLegendary ? '#fbbf24' : '#a7f3d0'};">
          <div style="font-size: 68px; filter: drop-shadow(0 6px 16px rgba(0,0,0,0.3)); animation: bounce 1s infinite alternate;">
            ${hybrid.emoji}
          </div>
          <div style="font-size: 20px; font-weight: 900; margin-top: 10px; color: ${isMythic ? '#ffffff' : '#065f46'};">
            ${hybrid.name}
          </div>
          <div style="display: inline-block; margin-top: 6px; padding: 4px 14px; background: ${isMythic ? 'rgba(168, 85, 247, 0.2)' : '#ecfdf5'}; border-radius: var(--radius-pill); border: 1px solid ${isMythic ? '#a855f7' : '#10b981'};">
            <span style="font-size: 12px; font-weight: 800; color: ${isMythic ? '#e9d5ff' : '#059669'};">${rarityBadgeText}</span>
          </div>
          <div style="font-size: 13px; color: ${isMythic ? '#cbd5e1' : '#64748b'}; margin-top: 10px; line-height: 1.4;">
            ${hybrid.desc}
          </div>
          <div style="font-size: 24px; font-weight: 900; color: ${isMythic ? '#38bdf8' : isLegendary ? '#f59e0b' : '#059669'}; margin-top: 14px;" class="tabular-nums">
            가치: +${finalPrice.toLocaleString()}G
          </div>
        </div>

        <div style="display: flex; gap: 8px;">
          <button id="btn-fusion-again" class="btn-primary" style="flex: 1; height: 48px; background: ${isMythic ? '#7c3aed' : '#059669'}; font-weight: 800;">
            한 번 더 융합하기
          </button>
          <button id="btn-close-fusion-result" class="btn-secondary" style="flex: 1; height: 48px; font-weight: 700;">
            가방에 보관
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-close-fusion-result')?.addEventListener('click', () => {
    modalRoot.innerHTML = '';
  });
  document.getElementById('fusion-result-scrim')?.addEventListener('click', (e) => {
    if (e.target.id === 'fusion-result-scrim') modalRoot.innerHTML = '';
  });

  document.getElementById('btn-fusion-again')?.addEventListener('click', () => {
    showBioFusionModal();
  });
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

    const startBtn = document.getElementById('btn-start-salvage');
    if (startBtn) {
      startBtn.disabled = true;
      startBtn.textContent = '⏳ 심해 와이어 인양 중... (3초 소요)';
    }

    playSound('cast');
    showToast('⚓ 초고강도 와이어가 심해 1,000m 바닥으로 내려갑니다...');

    setTimeout(() => {
      const pickedItem = SALVAGE_ITEMS[Math.floor(Math.random() * SALVAGE_ITEMS.length)];
      addGold(pickedItem.price);
      playSound('legendary');

      showSalvageResultModal(pickedItem);
    }, 1200);
  });
}

function showSalvageResultModal(item) {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const isJackpot = item.price >= 100000;

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="salvage-result-scrim">
      <div class="modal-content color-block ${isJackpot ? 'block-navy' : 'block-cream'}" style="max-height: 85vh; text-align: center; padding: 24px 16px;">
        <div class="t-eyebrow" style="${isJackpot ? 'color: #38bdf8;' : ''}">SALVAGE SUCCESS</div>
        <div class="t-headline" style="${isJackpot ? 'color: #fbbf24;' : 'color: #9a3412;'}">
          ${isJackpot ? '✨ 대박 유물 건져올림!! ✨' : '🏗️ 침몰선 보물 인양 완료!'}
        </div>

        <div style="margin: 20px 0; padding: 20px; background: ${isJackpot ? '#0f172a' : '#ffffff'}; border-radius: var(--radius-lg); border: 2px solid ${isJackpot ? '#f59e0b' : '#fed7aa'}; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
          <div style="font-size: 60px; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3)); animation: bounce 1s infinite alternate;">
            ${item.id.includes('anchor') ? '⚓' : item.id.includes('goblet') ? '🏆' : item.id.includes('crown') ? '👑' : item.id.includes('artifact') ? '🛸' : item.id.includes('tablet') ? '📜' : '🪙'}
          </div>
          <div style="font-size: 20px; font-weight: 900; margin-top: 12px; color: ${isJackpot ? '#ffffff' : '#1e293b'};">
            ${item.name}
          </div>
          <div style="font-size: 13px; color: ${isJackpot ? '#94a3b8' : '#64748b'}; margin-top: 6px;">
            ${item.desc}
          </div>
          <div style="font-size: 24px; font-weight: 900; color: #f59e0b; margin-top: 14px;" class="tabular-nums">
            +${item.price.toLocaleString()}G 획득!
          </div>
        </div>

        <div style="display: flex; gap: 8px;">
          <button id="btn-salvage-again" class="btn-primary" style="flex: 1; height: 48px; background: #ea580c; font-weight: 800;">
            한 번 더 인양 (30,000G)
          </button>
          <button id="btn-close-salvage-result" class="btn-secondary" style="flex: 1; height: 48px; font-weight: 700;">
            확인
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-close-salvage-result')?.addEventListener('click', () => {
    modalRoot.innerHTML = '';
  });
  document.getElementById('salvage-result-scrim')?.addEventListener('click', (e) => {
    if (e.target.id === 'salvage-result-scrim') modalRoot.innerHTML = '';
  });

  document.getElementById('btn-salvage-again')?.addEventListener('click', () => {
    showSalvageCraneModal();
    setTimeout(() => {
      document.getElementById('btn-start-salvage')?.click();
    }, 100);
  });
}
