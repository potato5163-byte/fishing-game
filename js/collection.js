import { state, collectAquariumRevenue, getAquariumPendingGold, releaseFishFromAquarium, sellFishFromAquarium, claimRegionReward, claimMutationReward, claimBossReward } from './state.js';
import { FISH, REGIONS, RARITIES, MESSAGES, BAITS, HIDDEN_FISH, VORTEX_BOSSES, HYBRID_FISH, MUTATION_REWARDS, BOSS_REWARDS } from './data.js';
import { formatGold, getFishMeta } from './utils.js';
import { showToast } from './ui.js';
import { getFishSvg } from './fish-icons.js';

export function renderCollection() {
  const screen = document.getElementById('screen-collection');
  if (!screen) return;

  const collectedCount = Object.keys(state.collection || {}).length;
  const percent = Math.round((collectedCount / 150) * 100);
  const crownTotal = state.stats && state.stats.crownCount ? state.stats.crownCount : 0;
  const pendingRevenue = getAquariumPendingGold();
  const aquariumList = state.aquarium || [];

  screen.innerHTML = `
    <div class="color-block block-lime">
      <div class="t-eyebrow">COLLECTION · AQUARIUM</div>
      <div class="color-block-header">
        <div>
          <div class="t-headline">수족관 & 도감</div>
          <div class="t-subhead">도감 ${collectedCount}/150 · 👑 황금 왕관 ${crownTotal}개</div>
        </div>
        <button id="btn-show-rates" class="btn-primary" style="height: 38px; font-size: 13px; padding: 0 var(--space-md); background: #000; color: #fff;">
          📊 물고기 확률표
        </button>
      </div>
      <div class="collection-progress-bar">
        <div class="collection-progress-fill" style="width: ${percent}%;"></div>
      </div>
    </div>

    <!-- 나만의 수족관 라이브 뷰 -->
    <div class="aquarium-live-section">
      <div class="aquarium-header">
        <div>
          <div class="t-card-title">🐟 내 아쿠아리움 (${aquariumList.length}/20)</div>
          <div class="t-body-sm" style="color: var(--color-subtext); font-size: 11px;">물고기 클릭 시 판매 또는 방생</div>
        </div>
        <button id="btn-collect-revenue" class="btn-primary btn-aquarium-claim" ${pendingRevenue <= 0 ? 'disabled' : ''}>
          🪙 관람료 수령 (${formatGold(pendingRevenue)}G)
        </button>
      </div>
      <div class="aquarium-tank" id="aquarium-tank">
        <!-- 수조 장식: 산호초 및 해초 -->
        <div class="aquarium-seaweed seaweed-1">🌿</div>
        <div class="aquarium-seaweed seaweed-2">🪸</div>
        <div class="aquarium-seaweed seaweed-3">🌿</div>
        <div class="aquarium-bubbles-overlay"></div>

        ${
          aquariumList.length === 0
            ? `<div class="aquarium-empty-msg">가방 탭에서 잡은 물고기의 [🐠 수족관] 버튼을 눌러 넣어보세요!<br>물고기들이 헤엄치며 방치 관람료 골드를 생산합니다.</div>`
            : aquariumList
                .map((f, i) => {
                  const meta = getFishMeta(f.fishId, FISH, HIDDEN_FISH, HYBRID_FISH, VORTEX_BOSSES) || f;
                  const animDuration = 6 + (i % 5) * 1.5;
                  const animDelay = (i * 0.7) % 4;
                  const topPos = 12 + ((i * 22) % 65);
                  return `
                  <div class="aquarium-swimming-fish" style="top: ${topPos}%; animation-duration: ${animDuration}s; animation-delay: -${animDelay}s;" data-aq-id="${f.id}">
                    <span class="fish-sprite">${getFishSvg(meta.id || meta.fishId, 36)}</span>
                    <span class="fish-name-tag">${meta.name || '물고기'}</span>
                  </div>
                `;
                })
                .join('')
        }
      </div>
    </div>

    <div class="collection-body">
      ${renderBossRaidSection()}
      ${renderMutationSection()}
      ${REGIONS.map((region) => renderRegionSection(region)).join('')}
      ${renderHiddenFishSection()}
    </div>
  `;

  // 관람료 수령 버튼
  const btnCollect = document.getElementById('btn-collect-revenue');
  if (btnCollect) {
    btnCollect.addEventListener('click', () => {
      const earned = collectAquariumRevenue();
      if (earned > 0) {
        showToast(`🪙 수족관 관람료 +${formatGold(earned)}G를 수령했습니다!`);
        renderCollection();
      }
    });
  }

  // 수족관 물고기 클릭 시 액션 모달 (판매 또는 방생)
  const swimFishList = screen.querySelectorAll('.aquarium-swimming-fish');
  swimFishList.forEach((el) => {
    el.addEventListener('click', () => {
      const aqId = el.dataset.aqId;
      showAquariumFishActionModal(aqId);
    });
  });

  // 확률표 모달 버튼 이벤트
  const btnRates = document.getElementById('btn-show-rates');
  if (btnRates) {
    btnRates.addEventListener('click', showRatesModal);
  }

  // 도감 10개 완성 보상 받기 버튼 이벤트
  const claimBtns = screen.querySelectorAll('.btn-claim-region-reward');
  claimBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const regionId = btn.dataset.regionId;
      triggerLotteryClaim(regionId);
    });
  });

  // 🧬 돌연변이 마일스톤 보상 수령 이벤트
  const mutationClaimBtns = screen.querySelectorAll('.btn-claim-mutation-reward');
  mutationClaimBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const count = Number(btn.dataset.count);
      const res = claimMutationReward(count);
      if (res.ok) {
        showToast(`🎉 [${res.milestone.title}] 달성! +${formatGold(res.milestone.gold)}G 획득!`);
        renderCollection();
      } else {
        showToast('보상을 수령할 수 없습니다.');
      }
    });
  });

  // 🌀 보스 레이드 마일스톤 보상 수령 이벤트
  const bossClaimBtns = screen.querySelectorAll('.btn-claim-boss-reward');
  bossClaimBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const count = Number(btn.dataset.count);
      const res = claimBossReward(count);
      if (res.ok) {
        showToast(`👑 [${res.milestone.title}] 달성! +${formatGold(res.milestone.gold)}G 획득!`);
        renderCollection();
      } else {
        showToast('보상을 수령할 수 없습니다.');
      }
    });
  });

  // 미발견 카드 및 발견 카드 클릭 이벤트
  const unknownCards = screen.querySelectorAll('.collection-card.is-unknown');
  unknownCards.forEach((card) => {
    card.addEventListener('click', () => {
      showToast(MESSAGES.FISH_UNKNOWN);
    });
  });

  const knownCards = screen.querySelectorAll('.collection-card.is-known');
  knownCards.forEach((card) => {
    card.addEventListener('click', () => {
      const fishId = card.dataset.fishId;
      showFishDetailModal(fishId);
    });
  });
}

function renderRegionSection(region) {
  const isUnlocked = state.unlockedRegions && state.unlockedRegions.includes(region.id);
  const regionFish = FISH.filter((f) => f.region === region.id);
  const caughtInRegion = regionFish.filter((f) => state.collection && state.collection[f.id]).length;
  const isClaimed = state.claimedRegionRewards && state.claimedRegionRewards.includes(region.id);
  const isCompleted = caughtInRegion >= 10;

  let rewardBadge = '';
  if (isClaimed) {
    rewardBadge = `<span class="collection-reward-tag is-claimed">✅ 보상 수령 완료</span>`;
  } else if (isCompleted) {
    rewardBadge = `
      <button class="btn-primary btn-claim-region-reward" data-region-id="${region.id}" style="height: 32px; font-size: 12px; padding: 0 12px; background: linear-gradient(135deg, #f59e0b, #ef4444); border: none; font-weight: 700; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4); animation: pulse 1.5s infinite;">
        🎁 10종 완성! 보상+복권 받기
      </button>
    `;
  } else {
    rewardBadge = `<span class="collection-reward-tag">완성 시 ${formatGold(region.completeReward)}G + 🎟️ 복권</span>`;
  }

  return `
    <div class="collection-region-group">
      <div class="collection-region-header">
        <div class="t-card-title">
          ${region.name} ${!isUnlocked ? '🔒' : ''}
          <span class="collection-region-count tabular-nums" style="${isCompleted ? 'color: #10b981; font-weight: 800;' : ''}">${caughtInRegion}/10</span>
        </div>
        ${rewardBadge}
      </div>

      <div class="collection-grid">
        ${regionFish.map((fish) => renderFishCard(fish)).join('')}
      </div>
    </div>
  `;
}

function renderFishCard(fish) {
  const record = state.collection ? state.collection[fish.id] : null;

  if (!record) {
    return `
      <div class="collection-card is-unknown" data-fish-id="${fish.id}">
        <div class="collection-card-emoji-box" style="opacity: 0.35; background: #f8fafc;">❓</div>
        <div class="collection-card-name t-body-sm" style="color: #94a3b8;">???</div>
      </div>
    `;
  }

  const rarity = RARITIES[fish.rarity] || RARITIES.common;
  const cardClass = `rarity-${fish.rarity}-card`;
  const crownBadge = record.crown ? '<span class="collection-crown-badge" title="최대 크기 95% 이상 황금 왕관!">👑</span>' : '';
  const themeClass = `theme-${fish.region || 'lake'}`;

  // 어종 카테고리 태그 식별
  const familyTag =
    ['whale_shark', 'greenland_shark', 'sturgeon', 'magma_shark', 'galaxy_whale', 'white_whale'].includes(fish.id) ? '거대수' :
    ['squid', 'giant_octopus', 'vampire_squid', 'inferno_octopus'].includes(fish.id) ? '두족류' :
    ['glacier_crab', 'pearl_clam', 'ember_crab', 'mantis_shrimp'].includes(fish.id) ? '갑각/조개' :
    ['eel', 'gulper_eel', 'snakehead', 'lava_eel', 'blackhole_eel'].includes(fish.id) ? '장어/포식' :
    ['star_fish', 'plasma_jelly', 'supernova_fish', 'starlight_squid'].includes(fish.id) ? '성운 생명체' :
    ['blue_dragon', 'pulsar_beast', 'cosmic_leviathan', 'salamander_king'].includes(fish.id) ? '환상종' :
    ['minnow', 'crucian', 'bluegill', 'dace', 'pale_chub', 'icefish'].includes(fish.id) ? '소형 담수어' :
    '어류';

  return `
    <div class="collection-card is-known ${cardClass}" data-fish-id="${fish.id}">
      <span class="collection-card-count-badge tabular-nums">${record.count}회</span>
      ${crownBadge}
      <div class="collection-card-emoji-box ${themeClass}">
        ${getFishSvg(fish.id, 56)}
      </div>
      <div class="collection-card-name t-body-sm" style="font-weight: 800; text-align: center; margin: 2px 0;">${fish.name}</div>
      <div style="display: flex; gap: 4px; align-items: center; justify-content: center; width: 100%;">
        <span class="fish-family-tag">${familyTag}</span>
        <span class="badge-rarity rarity-${fish.rarity}" style="font-size: 10px; padding: 1px 6px;">${rarity.name}</span>
      </div>
    </div>
  `;
}

// 🌀 보스 레이드 도감 섹션 렌더링
function renderBossRaidSection() {
  const bosses = VORTEX_BOSSES || [];
  const defeatedCount = Object.keys(state.defeatedBosses || {}).length;

  return `
    <div class="collection-region-group" style="border: 2px solid #7c3aed; border-radius: var(--radius-lg); padding: var(--space-sm); background: linear-gradient(180deg, #f5f3ff 0%, #ffffff 100%); margin-bottom: var(--space-md);">
      <div class="collection-region-header" style="flex-wrap: wrap; gap: 8px;">
        <div class="t-card-title" style="color: #5b21b6; display: flex; align-items: center; gap: 6px;">
          🌀 차원 소용돌이 보스 도감
          <span class="collection-region-count tabular-nums" style="color: #7c3aed; font-weight: 800;">${defeatedCount}/${bosses.length}</span>
        </div>
        <span class="collection-reward-tag" style="background: #ede9fe; color: #6d28d9; border-color: #c4b5fd;">
          레이드 제압 증표 👑
        </span>
      </div>

      <!-- 보스 도감 마일스톤 달성 보상 패널 -->
      <div style="display: flex; gap: 8px; overflow-x: auto; padding: 10px 4px 12px 4px; margin-bottom: 8px; -webkit-overflow-scrolling: touch;">
        ${BOSS_REWARDS.map((rew) => {
          const isClaimed = state.claimedBossRewards && state.claimedBossRewards.includes(rew.count);
          const canClaim = defeatedCount >= rew.count && !isClaimed;
          return `
            <div style="flex: 0 0 160px; background: #ffffff; border-radius: 10px; border: 1.5px solid ${isClaimed ? '#cbd5e1' : canClaim ? '#7c3aed' : '#e2e8f0'}; padding: 8px 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); text-align: center;">
              <div style="font-size: 11px; font-weight: 800; color: #7c3aed;">보스 ${rew.count}종 토벌</div>
              <div style="font-size: 13px; font-weight: 700; color: #1e293b; margin: 2px 0;">${rew.title}</div>
              <div style="font-size: 11px; color: #d97706; font-weight: 800; margin-bottom: 6px;">+${formatGold(rew.gold)}G</div>
              ${
                isClaimed
                  ? `<span style="font-size: 11px; color: #94a3b8; font-weight: 700;">수령 완료</span>`
                  : canClaim
                  ? `<button class="btn-claim-boss-reward btn-primary" data-count="${rew.count}" style="height: 26px; font-size: 11px; padding: 0 8px; width: 100%; background: #7c3aed; animation: pulse 1.5s infinite;">수령하기</button>`
                  : `<span style="font-size: 11px; color: #94a3b8;">${defeatedCount}/${rew.count}</span>`
              }
            </div>
          `;
        }).join('')}
      </div>

      <div class="collection-grid">
        ${bosses.map((boss) => renderBossCard(boss)).join('')}
      </div>
    </div>
  `;
}

function renderBossCard(boss) {
  const record = state.defeatedBosses ? state.defeatedBosses[boss.id] : null;

  if (!record) {
    return `
      <div class="collection-card is-unknown" style="border: 1px dashed #c4b5fd; min-height: 145px;">
        <div class="collection-card-emoji-box" style="opacity: 0.35; background: #ede9fe; font-size: 32px;">❓</div>
        <div class="collection-card-name t-body-sm" style="color: #8b5cf6;">미확인 보스</div>
      </div>
    `;
  }

  return `
    <div class="collection-card is-known rarity-mythic-card" style="min-height: 145px; border: 2px solid #7c3aed; background: linear-gradient(180deg, #ffffff 60%, rgba(124, 58, 237, 0.1) 100%);">
      <span class="collection-card-count-badge tabular-nums" style="background: #7c3aed; color: #fff;">${record.count}회 격퇴</span>
      <div class="collection-card-emoji-box" style="background: radial-gradient(circle, #ede9fe 0%, #ddd6fe 100%);">
        ${getFishSvg(boss.id, 56)}
      </div>
      <div class="collection-card-name t-body-sm" style="font-weight: 800; color: #4c1d95; text-align: center;">${boss.name}</div>
      <span class="badge-rarity rarity-mythic" style="margin-top: 2px;">보스 레이드</span>
    </div>
  `;
}

// 🧬 100종 돌연변이 생체 도감 섹션 렌더링
function renderMutationSection() {
  const muts = HYBRID_FISH || [];
  const discoveredCount = Object.keys(state.mutationCollection || {}).length;

  return `
    <div class="collection-region-group" style="border: 2px solid #10b981; border-radius: var(--radius-lg); padding: var(--space-sm); background: linear-gradient(180deg, #ecfdf5 0%, #ffffff 100%); margin-bottom: var(--space-md);">
      <div class="collection-region-header" style="flex-wrap: wrap; gap: 8px;">
        <div class="t-card-title" style="color: #065f46; display: flex; align-items: center; gap: 6px;">
          🧬 돌연변이 생체 도감
          <span class="collection-region-count tabular-nums" style="color: #059669; font-weight: 800;">${discoveredCount}/100</span>
        </div>
        <span class="collection-reward-tag" style="background: #d1fae5; color: #047857; border-color: #6ee7b7;">
          생체 연구소 융합종 🔬
        </span>
      </div>

      <!-- 돌연변이 100종 마일스톤 달성 보상 패널 -->
      <div style="display: flex; gap: 8px; overflow-x: auto; padding: 10px 4px 12px 4px; margin-bottom: 8px; -webkit-overflow-scrolling: touch;">
        ${MUTATION_REWARDS.map((rew) => {
          const isClaimed = state.claimedMutationRewards && state.claimedMutationRewards.includes(rew.count);
          const canClaim = discoveredCount >= rew.count && !isClaimed;
          return `
            <div style="flex: 0 0 160px; background: #ffffff; border-radius: 10px; border: 1.5px solid ${isClaimed ? '#cbd5e1' : canClaim ? '#10b981' : '#e2e8f0'}; padding: 8px 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); text-align: center;">
              <div style="font-size: 11px; font-weight: 800; color: #059669;">변이 ${rew.count}종 수집</div>
              <div style="font-size: 13px; font-weight: 700; color: #1e293b; margin: 2px 0;">${rew.title}</div>
              <div style="font-size: 11px; color: #059669; font-weight: 800; margin-bottom: 6px;">+${formatGold(rew.gold)}G</div>
              ${
                isClaimed
                  ? `<span style="font-size: 11px; color: #94a3b8; font-weight: 700;">수령 완료</span>`
                  : canClaim
                  ? `<button class="btn-claim-mutation-reward btn-primary" data-count="${rew.count}" style="height: 26px; font-size: 11px; padding: 0 8px; width: 100%; background: #059669; animation: pulse 1.5s infinite;">수령하기</button>`
                  : `<span style="font-size: 11px; color: #94a3b8;">${discoveredCount}/${rew.count}</span>`
              }
            </div>
          `;
        }).join('')}
      </div>

      <div class="collection-grid">
        ${muts.map((mut) => renderMutationCard(mut)).join('')}
      </div>
    </div>
  `;
}

function renderMutationCard(mut) {
  const count = state.mutationCollection ? (state.mutationCollection[mut.id] || 0) : 0;

  if (count <= 0) {
    return `
      <div class="collection-card is-unknown" style="border: 1px dashed #a7f3d0; min-height: 145px;">
        <div class="collection-card-emoji-box" style="opacity: 0.35; background: #ecfdf5; font-size: 32px;">❓</div>
        <div class="collection-card-name t-body-sm" style="color: #10b981;">미발견 변이</div>
      </div>
    `;
  }

  const rarityMeta = RARITIES[mut.rarity] || RARITIES.common;
  const cardClass = `rarity-${mut.rarity}-card`;

  return `
    <div class="collection-card is-known ${cardClass}" style="min-height: 145px;">
      <span class="collection-card-count-badge tabular-nums" style="background: #059669; color: #fff;">${count}회 융합</span>
      <div class="collection-card-emoji-box" style="background: radial-gradient(circle, #ecfdf5 0%, #d1fae5 100%);">
        ${getFishSvg(mut.id, 50)}
      </div>
      <div class="collection-card-name t-body-sm" style="font-weight: 800; color: #065f46; text-align: center;">${mut.name}</div>
      <span class="badge-rarity rarity-${mut.rarity}" style="margin-top: 2px;">${rarityMeta.name}</span>
    </div>
  `;
}

// 🤫 40종 비밀 히든 도감 섹션 렌더링 (서식지/출현조건 철저히 비공개)
function renderHiddenFishSection() {
  const caughtHiddenCount = HIDDEN_FISH.filter((f) => state.collection && state.collection[f.id]).length;

  return `
    <div class="collection-region-group" style="border: 2px dashed #a855f7; border-radius: var(--radius-lg); padding: var(--space-sm); background: linear-gradient(180deg, #faf5ff 0%, #ffffff 100%);">
      <div class="collection-region-header">
        <div class="t-card-title" style="color: #7e22ce; display: flex; align-items: center; gap: 6px;">
          🤫 미지의 비밀 히든 도감
          <span class="collection-region-count tabular-nums" style="color: #9333ea; font-weight: 800;">${caughtHiddenCount}/40</span>
        </div>
        <span class="collection-reward-tag" style="background: #f3e8ff; color: #7e22ce; border-color: #d8b4fe;">
          출현 조건: 일급 비밀 🔒
        </span>
      </div>

      <div class="collection-grid">
        ${HIDDEN_FISH.map((fish) => renderHiddenFishCard(fish)).join('')}
      </div>
    </div>
  `;
}

function renderHiddenFishCard(fish) {
  const record = state.collection ? state.collection[fish.id] : null;

  if (!record) {
    return `
      <div class="collection-card is-unknown" data-fish-id="${fish.id}" style="border: 1px dashed #d8b4fe;">
        <div class="collection-card-emoji-box" style="opacity: 0.35; background: #faf5ff;">❓</div>
        <div class="collection-card-name t-body-sm" style="color: #a855f7;">비밀 생명체</div>
      </div>
    `;
  }

  const rarity = RARITIES[fish.rarity] || RARITIES.legendary;
  const cardClass = fish.rarity === 'mythic' ? 'rarity-mythic-card' : 'rarity-legendary-card';
  const crownBadge = record.crown ? '<span class="collection-crown-badge" title="최대 크기 95% 이상 황금 왕관!">👑</span>' : '';

  return `
    <div class="collection-card is-known ${cardClass}" data-fish-id="${fish.id}">
      <span class="collection-card-count-badge tabular-nums">${record.count}회</span>
      ${crownBadge}
      <div class="collection-card-emoji-box theme-timewarp">
        ${getFishSvg(fish.id, 46)}
      </div>
      <div class="collection-card-name t-body-sm" style="font-weight: 700; color: #6b21a8;">${fish.name}</div>
      <span class="fish-family-tag" style="background: #f3e8ff; color: #7e22ce;">비밀 히든</span>
      <span class="badge-rarity rarity-${fish.rarity}" style="margin-top: 2px;">${rarity.name}</span>
    </div>
  `;
}

// 럭셔리 수족관 상세 모달 (3D 아쿠아리움 뷰어 리마스터)
function showFishDetailModal(fishId) {
  let fish = getFishMeta(fishId, FISH, HIDDEN_FISH, HYBRID_FISH, VORTEX_BOSSES);
  let isHidden = HIDDEN_FISH.some((f) => f.id === fishId);
  const record = state.collection ? state.collection[fishId] : null;
  if (!fish || !record) return;

  const region = isHidden ? { name: '🤫 알 수 없음 (일급 비밀)' } : (REGIONS.find((r) => r.id === fish.region) || REGIONS[0]);
  const rarity = RARITIES[fish.rarity] || RARITIES.common;
  const dateStr = record.firstCaughtAt
    ? new Date(record.firstCaughtAt).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).replace(/\. /g, '.').replace(/\.$/, '')
    : '-';

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const crownText = record.crown ? '👑 황금 왕관 (최대치 달성!)' : '일반 등급';

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="modal-detail-scrim">
      <div class="modal-dialog ${fish.rarity === 'mythic' ? 'is-mythic' : fish.rarity === 'legendary' ? 'is-legendary' : ''}" style="max-width: 380px;">
        <div class="modal-content" style="padding: 0; text-align: center; border-radius: var(--radius-lg); overflow: hidden; background: #ffffff;">
          <!-- 아쿠아리움 수조 뷰어 헤더 -->
          <div style="background: radial-gradient(circle at 50% 40%, #0284c7 0%, #0369a1 50%, #0f172a 100%); padding: 36px 16px 24px 16px; position: relative; overflow: hidden; box-shadow: inset 0 -10px 20px rgba(0,0,0,0.3);">
            <div style="position: absolute; inset: 0; background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18) 0%, transparent 60%); pointer-events: none;"></div>
            <div style="display: flex; justify-content: center; align-items: center; filter: drop-shadow(0 12px 24px rgba(0,0,0,0.5)); animation: fish-swim-struggle 1.5s infinite alternate ease-in-out;">
              ${getFishSvg(fish.id, 140)}
            </div>
            ${record.crown ? '<span style="position: absolute; top: 12px; right: 14px; font-size: 24px; filter: drop-shadow(0 0 10px #f59e0b);">👑</span>' : ''}
          </div>

          <div style="padding: var(--space-lg);">
            <div class="t-display" style="font-size: 24px; font-weight: 800; color: #0f172a;">${fish.name}</div>
            <div style="margin: 8px 0 12px 0;">
              <span class="badge-rarity rarity-${fish.rarity}" style="font-size: 12px; padding: 3px 12px;">${rarity.name} 어종</span>
            </div>
            <div class="t-body-sm" style="color: #475569; margin-bottom: var(--space-md); line-height: 1.5; background: #f8fafc; padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid #e2e8f0;">
              ${fish.desc}
            </div>

            <div class="modal-info-list" style="text-align: left; width: 100%; border: 1px solid #e2e8f0; border-radius: var(--radius-md); padding: 8px 14px; background: #ffffff;">
              <div class="modal-info-row" style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">
                <span class="t-body-sm" style="color: #64748b;">주요 서식지</span>
                <span class="t-body-sm" style="font-weight: 700; color: #0284c7;">${region.name}</span>
              </div>
              <div class="modal-info-row" style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">
                <span class="t-body-sm" style="color: #64748b;">총 포획 수</span>
                <span class="t-body-sm tabular-nums" style="font-weight: 700;">${record.count} 마리</span>
              </div>
              <div class="modal-info-row" style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">
                <span class="t-body-sm" style="color: #64748b;">최대 크기 기록</span>
                <span class="t-body-sm tabular-nums" style="font-weight: 800; color: #ea580c;">${record.maxSize.toFixed(1)} cm</span>
              </div>
              <div class="modal-info-row" style="padding: 6px 0; border-bottom: 1px solid #f1f5f9;">
                <span class="t-body-sm" style="color: #64748b;">체급 등급</span>
                <span class="t-body-sm" style="font-weight: 700; color: #f59e0b;">${crownText}</span>
              </div>
              <div class="modal-info-row" style="padding: 6px 0;">
                <span class="t-body-sm" style="color: #64748b;">최초 낚은 일자</span>
                <span class="t-body-sm tabular-nums" style="color: #94a3b8;">${dateStr}</span>
              </div>
            </div>

            <button id="btn-close-detail" class="btn-primary modal-action-btn" style="margin-top: var(--space-md); width: 100%; height: 44px; font-weight: 800;">확인</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const btnClose = document.getElementById('btn-close-detail');
  btnClose.addEventListener('click', () => {
    modalRoot.innerHTML = '';
  });
}

// 실시간 미끼 등급별 출현 확률표 모달 (도감 스포일러 완벽 방지)
export function showRatesModal() {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const currentBait = BAITS[state.selectedBait] || BAITS.basic;
  const currentRegion = REGIONS.find((r) => r.id === state.currentRegion) || REGIONS[0];

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="modal-rates-scrim">
      <div class="modal-dialog" style="max-height: 85vh; display: flex; flex-direction: column;">
        <div class="modal-top-block block-lilac" style="padding: var(--space-md);">
          <div class="t-eyebrow">DROP RATES</div>
          <div class="t-headline" style="font-size: 20px;">등급별 출현 확률표</div>
          <div class="t-subhead" style="font-size: 13px;">현재: ${currentRegion.name} · ${currentBait.name}</div>
        </div>
        
        <div class="modal-content" style="padding: var(--space-md); overflow-y: auto; flex: 1;">
          <div style="width: 100%; margin-bottom: var(--space-md);">
            <div class="t-card-title" style="font-size: 14px; margin-bottom: 8px;">[미끼 등급별 확률]</div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--color-surface-soft); border-radius: 8px; border: 1px solid var(--color-hairline);">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="badge-rarity rarity-common">일반</span>
                  <span class="t-body-sm" style="font-weight: 700;">일반 등급 어종</span>
                </div>
                <span class="t-body tabular-nums" style="font-weight: 800; font-size: 15px;">${currentBait.weights.common}%</span>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--color-surface-soft); border-radius: 8px; border: 1px solid var(--color-hairline);">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="badge-rarity rarity-rare">희귀</span>
                  <span class="t-body-sm" style="font-weight: 700;">희귀 등급 어종</span>
                </div>
                <span class="t-body tabular-nums" style="font-weight: 800; font-size: 15px; color: #0284c7;">${currentBait.weights.rare}%</span>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--color-surface-soft); border-radius: 8px; border: 1px solid var(--color-hairline);">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="badge-rarity rarity-epic">영웅</span>
                  <span class="t-body-sm" style="font-weight: 700;">영웅 등급 어종</span>
                </div>
                <span class="t-body tabular-nums" style="font-weight: 800; font-size: 15px; color: #7c3aed;">${currentBait.weights.epic}%</span>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--color-surface-soft); border-radius: 8px; border: 1px solid var(--color-hairline);">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="badge-rarity rarity-legendary">전설</span>
                  <span class="t-body-sm" style="font-weight: 700;">전설 등급 어종</span>
                </div>
                <span class="t-body tabular-nums" style="font-weight: 800; font-size: 15px; color: #ca8a04;">${currentBait.weights.legendary}%</span>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: linear-gradient(90deg, rgba(255,0,127,0.1), rgba(0,223,216,0.1)); border-radius: 8px; border: 1px solid #f472b6;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="badge-rarity rarity-mythic">신화</span>
                  <span class="t-body-sm" style="font-weight: 800; color: #ec4899;">신화 등급 어종</span>
                </div>
                <span class="t-body tabular-nums" style="font-weight: 900; font-size: 16px; color: #ec4899;">${currentBait.weights.mythic || 0}%</span>
              </div>
            </div>
          </div>

          <div style="font-size: 12px; color: var(--color-subtext); text-align: center; margin-top: 8px; line-height: 1.5;">
            🔒 도감 수집의 기대감과 손맛을 위해 개별 물고기 이름은 직접 낚을 때까지 미공개 상태로 유지됩니다!
          </div>

          <button id="btn-close-rates" class="btn-primary modal-action-btn" style="margin-top: var(--space-md); width: 100%;">확인</button>
        </div>
      </div>
    </div>
  `;

  const btnClose = document.getElementById('btn-close-rates');
  btnClose.addEventListener('click', () => {
    modalRoot.innerHTML = '';
  });
}

export function showKingCelebrationModal() {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="modal-king-scrim">
      <div class="modal-dialog">
        <div class="modal-top-block block-navy">
          <div style="font-size: 72px; line-height: 1;">👑</div>
        </div>
        <div class="modal-content" style="padding: var(--space-lg); text-align: center;">
          <div class="t-display" style="font-size: 26px; margin-bottom: var(--space-xs);">전설의 낚시왕 달성!</div>
          <div class="t-body" style="margin-bottom: var(--space-lg);">
            10개 지역 100종의 물고기를 모두 정복하셨습니다!<br />당신은 시공간을 초월한 진정한 바다의 신입니다!
          </div>
          <button id="btn-confirm-king" class="btn-primary modal-action-btn">확인</button>
        </div>
      </div>
    </div>
  `;

  const btnConfirm = document.getElementById('btn-confirm-king');
  btnConfirm.addEventListener('click', () => {
    modalRoot.innerHTML = '';
  });
}

// 수족관 물고기 관리 모달 (판매하기 / 방생하기)
function showAquariumFishActionModal(aquariumId) {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const target = (state.aquarium || []).find((f) => f.id === aquariumId);
  if (!target) return;

  const meta = getFishMeta(target.fishId, FISH, HIDDEN_FISH, HYBRID_FISH, VORTEX_BOSSES) || target;
  const rarityMeta = RARITIES[target.rarity] || RARITIES.common;
  const price = target.price || 10;

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="modal-aquarium-action-scrim">
      <div class="modal-dialog">
        <div class="modal-top-block block-mint" style="display: flex; justify-content: center; align-items: center; padding: var(--space-md);">
          ${getFishSvg(target.fishId, 80)}
        </div>
        <div class="modal-content" style="padding: var(--space-lg); text-align: center;">
          <div class="t-headline" style="margin-bottom: 4px;">${meta.name}</div>
          <div style="margin-bottom: var(--space-sm);">
            <span class="badge-rarity rarity-${target.rarity}">${rarityMeta.name}</span>
            <span class="t-body-sm tabular-nums" style="margin-left: 6px;">${target.size ? target.size.toFixed(1) : '0.0'}cm</span>
          </div>

          <div class="modal-info-list" style="margin-bottom: var(--space-md); text-align: left;">
            <div class="modal-info-row">
              <span class="t-body-sm">판매 예상가</span>
              <span class="t-card-title tabular-nums" style="color: #0284c7;">+${formatGold(price)}G</span>
            </div>
            <div class="modal-info-row">
              <span class="t-body-sm">수족관 방출 효과</span>
              <span class="t-body-sm" style="color: var(--color-subtext);">수조 슬롯 1칸 확보</span>
            </div>
          </div>

          <div style="display: flex; gap: 8px; width: 100%; margin-bottom: 8px;">
            <button id="btn-aq-sell" class="btn-primary" style="flex: 1; height: 42px; background: #0284c7; border: none; font-size: 14px;">
              🪙 ${formatGold(price)}G에 판매
            </button>
            <button id="btn-aq-release" class="btn-secondary" style="flex: 1; height: 42px; font-size: 14px; background: #f1f5f9; color: #475569;">
              🌊 자연으로 방생
            </button>
          </div>
          <button id="btn-aq-cancel" class="btn-secondary modal-action-btn" style="width: 100%;">취소</button>
        </div>
      </div>
    </div>
  `;

  const btnSell = document.getElementById('btn-aq-sell');
  const btnRelease = document.getElementById('btn-aq-release');
  const btnCancel = document.getElementById('btn-aq-cancel');

  if (btnSell) {
    btnSell.addEventListener('click', () => {
      const res = sellFishFromAquarium(aquariumId);
      if (res.ok) {
        showToast(`🪙 ${meta.name}을(를) 수족관에서 꺼내 ${formatGold(res.price)}G에 판매했습니다!`);
        modalRoot.innerHTML = '';
        renderCollection();
      } else {
        showToast(res.error || '판매에 실패했습니다.');
      }
    });
  }

  if (btnRelease) {
    btnRelease.addEventListener('click', () => {
      releaseFishFromAquarium(aquariumId);
      showToast(`🌊 ${meta.name}을(를) 자연으로 돌려보냈습니다.`);
      modalRoot.innerHTML = '';
      renderCollection();
    });
  }

  if (btnCancel) {
    btnCancel.addEventListener('click', () => {
      modalRoot.innerHTML = '';
    });
  }
}

// 🎟️ 황금 행운 복권 스크래치 모달
export function triggerLotteryClaim(regionId) {
  const result = claimRegionReward(regionId);
  if (!result) return;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  const { regionName, baseGold, lottery, totalGold } = result;

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="modal-lottery-scrim">
      <div class="modal-dialog">
        <div class="modal-top-block block-gold" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; padding: var(--space-md); text-align: center;">
          <div style="font-size: 52px; line-height: 1; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));">🎟️</div>
          <div class="t-eyebrow" style="color: #fef08a; margin-top: 4px;">LUCKY GOLD LOTTERY</div>
          <div class="t-headline" style="color: #fff; font-size: 22px;">황금 스크래치 복권</div>
        </div>
        <div class="modal-content" style="padding: var(--space-lg); text-align: center;">
          <div class="t-body-sm" style="color: var(--color-subtext); margin-bottom: 8px;">
            🎉 [${regionName}] 10종 물고기 정복 축하 선물!
          </div>

          <!-- 복권 스크래치 카드 영역 -->
          <div class="lottery-scratch-card" id="lottery-card">
            <div class="lottery-hidden-content">
              <div class="lottery-rank-tag" style="color: ${lottery.color};">${lottery.name}</div>
              <div class="lottery-prize-gold tabular-nums">+${formatGold(lottery.gold)}G</div>
              <div class="lottery-prize-item">🎁 ${lottery.baitName} +${lottery.baitCount}개 추가 지급!</div>
            </div>
            <div class="lottery-scratch-cover" id="lottery-cover">
              <div class="scratch-finger-icon">✨</div>
              <div style="font-size: 14px; font-weight: 800; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.5);">
                여기를 터치하여 긁어보세요!
              </div>
            </div>
          </div>

          <!-- 기본 보상 내역 (긁기 전에는 합산 금액 스포 방지!) -->
          <div class="modal-info-list" style="margin-top: var(--space-md); text-align: left;">
            <div class="modal-info-row">
              <span class="t-body-sm">지역 도감 기본 상금</span>
              <span class="t-body-sm tabular-nums" style="font-weight: 700;">+${formatGold(baseGold)}G</span>
            </div>
            <div class="modal-info-row">
              <span class="t-body-sm">복권 당첨 상금</span>
              <span id="lottery-row-prize" class="t-body-sm tabular-nums" style="color: #64748b; font-weight: 700;">❓ 복권을 긁어 확인하세요</span>
            </div>
            <div class="modal-info-row">
              <span class="t-body-sm">최종 획득 합계</span>
              <span id="lottery-row-total" class="t-card-title tabular-nums" style="color: #10b981;">❓ ??? G</span>
            </div>
          </div>

          <button id="btn-lottery-confirm" class="btn-primary modal-action-btn" style="width: 100%; margin-top: var(--space-md); opacity: 0.5; pointer-events: none;">
            복권을 먼저 긁어주세요
          </button>
        </div>
      </div>
    </div>
  `;

  const cover = document.getElementById('lottery-cover');
  const btnConfirm = document.getElementById('btn-lottery-confirm');
  const rowPrize = document.getElementById('lottery-row-prize');
  const rowTotal = document.getElementById('lottery-row-total');
  let isScratched = false;

  if (cover) {
    cover.addEventListener('click', () => {
      if (isScratched) return;
      isScratched = true;
      cover.classList.add('is-scratched');

      // 스크래치 후에 비로소 당첨금과 총합 금액 공개!
      if (rowPrize) {
        rowPrize.style.color = lottery.color;
        rowPrize.textContent = `+${formatGold(lottery.gold)}G (${lottery.name})`;
      }
      if (rowTotal) {
        rowTotal.textContent = `+${formatGold(totalGold)}G`;
      }
      if (btnConfirm) {
        btnConfirm.style.opacity = '1';
        btnConfirm.style.pointerEvents = 'auto';
        btnConfirm.textContent = '보상 모두 받기';
      }

      showToast(`🎉 축하합니다! [${lottery.name}]에 당첨되었습니다!`);
    });
  }

  if (btnConfirm) {
    btnConfirm.addEventListener('click', () => {
      modalRoot.innerHTML = '';
      renderCollection();
    });
  }
}
