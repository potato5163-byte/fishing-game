import { state, collectAquariumRevenue, getAquariumPendingGold, releaseFishFromAquarium, sellFishFromAquarium } from './state.js';
import { FISH, REGIONS, RARITIES, MESSAGES, BAITS } from './data.js';
import { formatGold } from './utils.js';
import { showToast } from './ui.js';
import { getFishSvg } from './fish-icons.js';

export function renderCollection() {
  const screen = document.getElementById('screen-collection');
  if (!screen) return;

  const collectedCount = Object.keys(state.collection || {}).length;
  const percent = Math.round((collectedCount / 100) * 100);
  const crownTotal = state.stats && state.stats.crownCount ? state.stats.crownCount : 0;
  const pendingRevenue = getAquariumPendingGold();
  const aquariumList = state.aquarium || [];

  screen.innerHTML = `
    <div class="color-block block-lime">
      <div class="t-eyebrow">COLLECTION · AQUARIUM</div>
      <div class="color-block-header">
        <div>
          <div class="t-headline">수족관 & 도감</div>
          <div class="t-subhead">도감 ${collectedCount}/100 · 👑 황금 왕관 ${crownTotal}개</div>
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
                  const meta = FISH.find((item) => item.id === f.fishId) || f;
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
      ${REGIONS.map((region) => renderRegionSection(region)).join('')}
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

  let rewardBadge = '';
  if (isClaimed) {
    rewardBadge = `<span class="collection-reward-tag is-claimed">✅ 보상 받음</span>`;
  } else {
    rewardBadge = `<span class="collection-reward-tag">완성 보상 ${formatGold(region.completeReward)}G</span>`;
  }

  return `
    <div class="collection-region-group">
      <div class="collection-region-header">
        <div class="t-card-title">
          ${region.name} ${!isUnlocked ? '🔒' : ''}
          <span class="collection-region-count tabular-nums">${caughtInRegion}/10</span>
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
        <div class="collection-card-emoji-box" style="opacity: 0.35;">❔</div>
        <div class="collection-card-name t-body-sm">???</div>
      </div>
    `;
  }

  const rarity = RARITIES[fish.rarity] || RARITIES.common;
  const cardClass = fish.rarity === 'mythic' ? 'rarity-mythic-card' : fish.rarity === 'legendary' ? 'rarity-legendary-card' : '';
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
        ${getFishSvg(fish.id, 46)}
      </div>
      <div class="collection-card-name t-body-sm" style="font-weight: 700;">${fish.name}</div>
      <span class="fish-family-tag">${familyTag}</span>
      <span class="badge-rarity rarity-${fish.rarity}" style="margin-top: 2px;">${rarity.name}</span>
    </div>
  `;
}

// 럭셔리 수족관 상세 모달
function showFishDetailModal(fishId) {
  const fish = FISH.find((f) => f.id === fishId);
  const record = state.collection ? state.collection[fishId] : null;
  if (!fish || !record) return;

  const region = REGIONS.find((r) => r.id === fish.region) || REGIONS[0];
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

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="modal-detail-scrim">
      <div class="modal-dialog ${fish.rarity === 'mythic' ? 'is-mythic' : fish.rarity === 'legendary' ? 'is-legendary' : ''}">
        <div class="modal-content" style="padding: var(--space-xl) var(--space-lg); text-align: center;">
          <div style="display: flex; justify-content: center; align-items: center; margin-bottom: var(--space-sm); filter: drop-shadow(0 6px 14px rgba(0,0,0,0.18));">
            ${getFishSvg(fish.id, 100)}
          </div>
          <div class="t-display" style="font-size: 26px; font-weight: 700;">${fish.name}</div>
          <div style="margin: 6px 0 var(--space-xs) 0;">
            <span class="badge-rarity rarity-${fish.rarity}">${rarity.name}</span>
          </div>
          <div class="t-body-sm" style="color: var(--color-ink); margin-bottom: var(--space-md); opacity: 0.85;">
            ${fish.desc}
          </div>

          <div class="modal-info-list" style="text-align: left; width: 100%;">
            <div class="modal-info-row">
              <span class="t-body-sm">서식지</span>
              <span class="t-body-sm" style="font-weight: 600;">${region.name}</span>
            </div>
            <div class="modal-info-row">
              <span class="t-body-sm">총 낚은 횟수</span>
              <span class="t-body-sm tabular-nums" style="font-weight: 600;">${record.count}마리</span>
            </div>
            <div class="modal-info-row">
              <span class="t-body-sm">최대 기록 크기</span>
              <span class="t-body-sm tabular-nums" style="font-weight: 700; color: var(--color-ink);">${record.maxSize.toFixed(1)}cm</span>
            </div>
            <div class="modal-info-row">
              <span class="t-body-sm">크기 범위</span>
              <span class="t-body-sm tabular-nums">${fish.minSize} ~ ${fish.maxSize}cm</span>
            </div>
            <div class="modal-info-row">
              <span class="t-body-sm">최초 발견일</span>
              <span class="t-body-sm tabular-nums">${dateStr}</span>
            </div>
          </div>

          <button id="btn-close-detail" class="btn-primary modal-action-btn" style="margin-top: var(--space-md);">닫기</button>
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

  const meta = FISH.find((f) => f.id === target.fishId) || target;
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
