import { START, FISH, REGIONS, RODS, BAITS, BAG_UPGRADES, BAIT_MAX, MESSAGES } from './data.js';
import { updateTopbar, showToast } from './ui.js';

const STORAGE_KEY = 'mulgyeol-fishing-save';
const BROKEN_STORAGE_KEY = 'mulgyeol-fishing-save-broken';

let isStorageAvailable = true;
let lastSaveErrorTime = 0;

export function createNewState() {
  return {
    version: 1,
    gold: START.gold,
    currentRegion: START.region,
    unlockedRegions: [START.region],
    ownedRods: [START.rod],
    equippedRod: START.rod,
    baits: {
      worm: 0,
      shiny: 0,
      golden: 0,
      rainbow: 0,
      cosmic_bait: 0,
      phoenix: 0,
      celestial_star: 0,
    },
    selectedBait: START.bait,
    bagCapacity: START.bagCapacity,
    bag: [],
    collection: {},
    claimedRegionRewards: [],
    kingAchieved: false,
    specialItems: {
      charm_luck: 0,
      hourglass_time: 0,
      magnet_gold: false,
      potion_zone: 0,
    },
    // 신규 확장 기능 상태
    aquarium: [], // 수족관에 넣은 물고기 목록 [{ id, fishId, name, emoji, size, rarity, addedAt }]
    aquariumLastCollectedAt: Date.now(),
    feverGauge: 0, // 0 ~ 100 피버 게이지
    stats: {
      totalCaught: 0,
      totalCasts: 0,
      totalEarned: 0,
      chestsFound: 0,
      crownCount: 0,
    },
    // 비영속 런타임 상태
    activeTab: 'fishing',
    isFishingActive: false,
    isFeverActive: false,
    feverTimeLeft: 0,
  };
}

export let state = createNewState();

export function setActiveTab(tabId) {
  state.activeTab = tabId;
}

export function setFishingActive(active) {
  state.isFishingActive = active;
}

// ==========================================
// 7단계 저장 및 불러오기 (docs/08)
// ==========================================

export function checkStorageAvailability() {
  if (typeof localStorage === 'undefined') {
    isStorageAvailable = false;
    return false;
  }
  try {
    const testKey = '__test_storage__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    isStorageAvailable = true;
    return true;
  } catch (e) {
    isStorageAvailable = false;
    return false;
  }
}

export function saveGame() {
  if (!isStorageAvailable) return;
  if (typeof localStorage === 'undefined') return;

  const dataToSave = {
    version: 1,
    gold: state.gold,
    currentRegion: state.currentRegion,
    unlockedRegions: state.unlockedRegions,
    ownedRods: state.ownedRods,
    equippedRod: state.equippedRod,
    baits: state.baits,
    selectedBait: state.selectedBait,
    bagCapacity: state.bagCapacity,
    bag: state.bag,
    collection: state.collection,
    claimedRegionRewards: state.claimedRegionRewards,
    kingAchieved: state.kingAchieved,
    specialItems: state.specialItems,
    aquarium: state.aquarium || [],
    aquariumLastCollectedAt: state.aquariumLastCollectedAt || Date.now(),
    feverGauge: state.feverGauge || 0,
    stats: state.stats,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (err) {
    const now = Date.now();
    // 1분에 1번만 E11 표시
    if (now - lastSaveErrorTime > 60000) {
      lastSaveErrorTime = now;
      showToast(MESSAGES.E11);
    }
  }
}

export function loadGame() {
  const canUse = checkStorageAvailability();
  if (!canUse) {
    showStorageBanner();
    state = createNewState();
    return;
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    // 새 게임 시작
    state = createNewState();
    return;
  }

  let parsed = null;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    handleBrokenSave(raw);
    return;
  }

  // 무결성 검증
  if (!validateSavedData(parsed)) {
    handleBrokenSave(raw);
    return;
  }

  // 알 수 없는 항목 필터링 및 복원
  sanitizeSavedData(parsed);

  Object.assign(state, createNewState(), parsed, {
    activeTab: 'fishing',
    isFishingActive: false,
  });
}

function validateSavedData(d) {
  if (!d || typeof d !== 'object') return false;
  if (d.version !== 1) return false;

  // 필수 키 검사
  const requiredKeys = [
    'gold',
    'currentRegion',
    'unlockedRegions',
    'ownedRods',
    'equippedRod',
    'baits',
    'selectedBait',
    'bagCapacity',
    'bag',
    'collection',
    'claimedRegionRewards',
    'kingAchieved',
    'stats',
  ];
  for (const k of requiredKeys) {
    if (!(k in d)) return false;
  }

  if (typeof d.gold !== 'number' || d.gold < 0) return false;
  if (typeof d.bagCapacity !== 'number' || d.bagCapacity < 0) return false;
  if (!Array.isArray(d.unlockedRegions)) return false;
  if (!Array.isArray(d.ownedRods)) return false;
  if (!Array.isArray(d.bag)) return false;
  if (!Array.isArray(d.claimedRegionRewards)) return false;
  if (typeof d.collection !== 'object' || d.collection === null) return false;
  if (typeof d.baits !== 'object' || d.baits === null) return false;
  if (typeof d.stats !== 'object' || d.stats === null) return false;

  if (!d.unlockedRegions.includes(d.currentRegion)) return false;
  if (!d.ownedRods.includes(d.equippedRod)) return false;

  return true;
}

function sanitizeSavedData(d) {
  // 알 수 없는 물고기/지역/낚싯대 제거
  const validRegionIds = REGIONS.map((r) => r.id);
  d.unlockedRegions = d.unlockedRegions.filter((id) => validRegionIds.includes(id));
  if (d.unlockedRegions.length === 0) d.unlockedRegions = ['lake'];
  if (!d.unlockedRegions.includes(d.currentRegion)) {
    d.currentRegion = d.unlockedRegions[0];
  }

  const validRodIds = Object.keys(RODS);
  d.ownedRods = d.ownedRods.filter((id) => validRodIds.includes(id));
  if (d.ownedRods.length === 0) d.ownedRods = ['bamboo'];
  if (!d.ownedRods.includes(d.equippedRod)) {
    d.equippedRod = d.ownedRods[0];
  }

  const validFishIds = FISH.map((f) => f.id);
  d.bag = d.bag.filter((item) => validFishIds.includes(item.fishId));
  for (const fid of Object.keys(d.collection)) {
    if (!validFishIds.includes(fid)) {
      delete d.collection[fid];
    }
  }
}

function handleBrokenSave(raw) {
  try {
    localStorage.setItem(BROKEN_STORAGE_KEY, raw);
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}

  Object.assign(state, createNewState());
  showE10Modal();
}

function showStorageBanner() {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById('storage-banner');
  if (existing) return;

  const banner = document.createElement('div');
  banner.id = 'storage-banner';
  banner.className = 'storage-banner';
  banner.textContent = MESSAGES.E09;

  const app = document.getElementById('app');
  if (app) {
    app.insertBefore(banner, app.firstChild);
  }
}

function showE10Modal() {
  if (typeof document === 'undefined') return;
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return;

  modalRoot.innerHTML = `
    <div class="modal-scrim" id="modal-e10-scrim">
      <div class="modal-dialog">
        <div class="modal-content" style="padding: var(--space-xl) var(--space-lg); text-align: center;">
          <div class="t-headline" style="margin-bottom: var(--space-sm);">기록 불러오기 오류</div>
          <div class="t-body" style="margin-bottom: var(--space-lg);">${MESSAGES.E10}</div>
          <button id="btn-e10-confirm" class="btn-primary modal-action-btn">확인</button>
        </div>
      </div>
    </div>
  `;

  const btnConfirm = document.getElementById('btn-e10-confirm');
  btnConfirm.addEventListener('click', () => {
    modalRoot.innerHTML = '';
  });
}

export function resetGame() {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  Object.assign(state, createNewState());
  updateTopbar();
  showToast(MESSAGES.RESET_GAME);
}

// ==========================================
// 3단계 상태 변경 함수들 (docs/05 3장)
// ==========================================

export function addFishToBag(item) {
  state.bag.unshift(item);
  state.stats.totalCaught = (state.stats.totalCaught || 0) + 1;
  saveGame();
  updateTopbar();
}

export function sellFish(uid) {
  const index = state.bag.findIndex((item) => item.uid === uid);
  if (index === -1) return 0;

  const [fish] = state.bag.splice(index, 1);
  let amount = fish.price || 0;

  // 황금 자석 부적 보유 시 판매가 +30% 보너스
  if (state.specialItems && state.specialItems.magnet_gold) {
    amount = Math.round(amount * 1.3);
  }

  state.gold += amount;
  state.stats.totalEarned = (state.stats.totalEarned || 0) + amount;

  saveGame();
  updateTopbar();
  return amount;
}

export function sellAllFish() {
  const count = state.bag.length;
  if (count === 0) return { count: 0, total: 0 };

  const hasMagnet = state.specialItems && state.specialItems.magnet_gold;
  const total = state.bag.reduce((sum, item) => {
    let price = item.price || 0;
    return sum + (hasMagnet ? Math.round(price * 1.3) : price);
  }, 0);

  state.bag = [];
  state.gold += total;
  state.stats.totalEarned = (state.stats.totalEarned || 0) + total;

  saveGame();
  updateTopbar();
  return { count, total };
}

export function spendGold(amount) {
  if (state.gold < amount) {
    return false;
  }
  state.gold -= amount;
  saveGame();
  updateTopbar();
  return true;
}

export function addGold(amount) {
  state.gold += amount;
  saveGame();
  updateTopbar();
}

// ==========================================
// 4단계 도감 상태 함수들 (docs/06)
// ==========================================

export function recordCatch(fishId, size) {
  if (!state.collection) {
    state.collection = {};
  }

  const existing = state.collection[fishId];
  let isNew = false;
  let isRecord = false;

  const fishDef = FISH.find((f) => f.id === fishId);
  // 최대 크기의 95% 이상이면 황금 왕관(Crown) 부여!
  const crownThreshold = fishDef ? fishDef.minSize + (fishDef.maxSize - fishDef.minSize) * 0.95 : 999999;
  const isCrown = size >= crownThreshold;

  if (!existing) {
    isNew = true;
    state.collection[fishId] = {
      count: 1,
      maxSize: size,
      crown: isCrown,
      firstCaughtAt: new Date().toISOString(),
    };
    if (isCrown) {
      state.stats.crownCount = (state.stats.crownCount || 0) + 1;
    }
  } else {
    existing.count += 1;
    if (isCrown && !existing.crown) {
      existing.crown = true;
      state.stats.crownCount = (state.stats.crownCount || 0) + 1;
    }
    if (size > existing.maxSize) {
      existing.maxSize = size;
      isRecord = true;
    }
  }

  saveGame();
  updateTopbar();
  return { isNew, isRecord, isCrown };
}

// ==========================================
// 수족관 (Aquarium) 상태 관리 함수
// ==========================================

export function addFishToAquarium(bagIndex) {
  if (!state.aquarium) state.aquarium = [];
  if (state.aquarium.length >= 20) {
    return { ok: false, error: '수족관이 가득 찼습니다! (최대 20마리)' };
  }

  if (bagIndex < 0 || bagIndex >= state.bag.length) {
    return { ok: false, error: '존재하지 않는 물고기입니다.' };
  }

  const item = state.bag[bagIndex];
  state.bag.splice(bagIndex, 1);

  state.aquarium.push({
    id: `aq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    fishId: item.fishId,
    name: item.name,
    emoji: item.emoji,
    size: item.size,
    rarity: item.rarity,
    price: item.price,
    addedAt: Date.now(),
  });

  saveGame();
  updateTopbar();
  return { ok: true, fish: item };
}

export function releaseFishFromAquarium(aquariumId) {
  if (!state.aquarium) return false;
  const idx = state.aquarium.findIndex((f) => f.id === aquariumId);
  if (idx === -1) return false;

  state.aquarium.splice(idx, 1);
  saveGame();
  return true;
}

// 수족관 관람료(방치 수익) 계산 및 수령
export function collectAquariumRevenue() {
  if (!state.aquarium || state.aquarium.length === 0) {
    return 0;
  }

  const now = Date.now();
  const lastTime = state.aquariumLastCollectedAt || now;
  const elapsedSec = Math.max(0, Math.floor((now - lastTime) / 1000));
  state.aquariumLastCollectedAt = now;

  // 물고기 1마리당 등급에 따른 초당 수익 계산
  // common: 1G/min, rare: 3G/min, epic: 10G/min, legendary: 30G/min, mythic: 100G/min
  const rarityPerMinute = {
    common: 1,
    rare: 3,
    epic: 10,
    legendary: 30,
    mythic: 100,
  };

  let goldPerSec = 0;
  state.aquarium.forEach((f) => {
    const rate = rarityPerMinute[f.rarity] || 1;
    goldPerSec += rate / 60;
  });

  const totalGold = Math.min(100000, Math.floor(goldPerSec * elapsedSec)); // 최대 10만G 상한
  if (totalGold > 0) {
    state.gold += totalGold;
    state.stats.totalEarned = (state.stats.totalEarned || 0) + totalGold;
    saveGame();
    updateTopbar();
  }
  return totalGold;
}

export function getAquariumPendingGold() {
  if (!state.aquarium || state.aquarium.length === 0) return 0;
  const now = Date.now();
  const lastTime = state.aquariumLastCollectedAt || now;
  const elapsedSec = Math.max(0, Math.floor((now - lastTime) / 1000));

  const rarityPerMinute = {
    common: 1,
    rare: 3,
    epic: 10,
    legendary: 30,
    mythic: 100,
  };

  let goldPerSec = 0;
  state.aquarium.forEach((f) => {
    const rate = rarityPerMinute[f.rarity] || 1;
    goldPerSec += rate / 60;
  });

  return Math.min(100000, Math.floor(goldPerSec * elapsedSec));
}

// 피버 게이지 충전
export function addFeverGauge(amount) {
  state.feverGauge = Math.min(100, (state.feverGauge || 0) + amount);
  if (state.feverGauge >= 100 && !state.isFeverActive) {
    activateFever();
  }
  return state.feverGauge;
}

export function activateFever() {
  state.isFeverActive = true;
  state.feverTimeLeft = 18; // 18초 피버 지속
  state.feverGauge = 100;
}

export function deactivateFever() {
  state.isFeverActive = false;
  state.feverTimeLeft = 0;
  state.feverGauge = 0;
}

export function checkRegionCompletion() {
  const completedUnclaimed = [];
  REGIONS.forEach((region) => {
    if (state.claimedRegionRewards.includes(region.id)) {
      return;
    }
    const regionFish = FISH.filter((f) => f.region === region.id);
    const allCaught = regionFish.every((f) => state.collection && state.collection[f.id]);
    if (allCaught) {
      completedUnclaimed.push(region);
    }
  });

  return completedUnclaimed;
}

export function claimRegionReward(regionId) {
  const region = REGIONS.find((r) => r.id === regionId);
  if (!region || state.claimedRegionRewards.includes(regionId)) {
    return 0;
  }

  state.claimedRegionRewards.push(regionId);
  state.gold += region.completeReward;
  state.stats.totalEarned = (state.stats.totalEarned || 0) + region.completeReward;

  saveGame();
  updateTopbar();
  return region.completeReward;
}

export function checkKingAchievement() {
  const totalCollected = Object.keys(state.collection || {}).length;
  if (totalCollected >= 100 && !state.kingAchieved) {
    state.kingAchieved = true;
    saveGame();
    updateTopbar();
    return true;
  }
  return false;
}

export function buySpecialItem(itemId) {
  if (!state.specialItems) {
    state.specialItems = { charm_luck: 0, hourglass_time: 0, magnet_gold: false, potion_zone: 0 };
  }
  const itemPrices = { charm_luck: 3000, hourglass_time: 5000, magnet_gold: 50000, potion_zone: 8000 };
  const price = itemPrices[itemId] || 0;

  if (state.gold < price) {
    return { ok: false, error: 'E02' };
  }

  if (itemId === 'magnet_gold' && state.specialItems.magnet_gold) {
    return { ok: false, error: 'ALREADY_OWNED' };
  }

  state.gold -= price;
  if (itemId === 'magnet_gold') {
    state.specialItems.magnet_gold = true;
  } else {
    state.specialItems[itemId] = (state.specialItems[itemId] || 0) + 5; // 5회 충전
  }

  saveGame();
  updateTopbar();
  return { ok: true };
}

// ==========================================
// 5단계 상점 상태 함수들 (docs/05 2장, 3장)
// ==========================================

export function buyRod(rodId) {
  const rod = RODS[rodId];
  if (!rod) return { ok: false, error: 'E00' };

  if (state.gold < rod.price) {
    return { ok: false, error: 'E02' };
  }

  state.gold -= rod.price;
  if (!state.ownedRods.includes(rodId)) {
    state.ownedRods.push(rodId);
  }
  state.equippedRod = rodId;

  saveGame();
  updateTopbar();
  return { ok: true };
}

export function equipRod(rodId) {
  if (state.ownedRods.includes(rodId)) {
    state.equippedRod = rodId;
    saveGame();
    updateTopbar();
  }
}

export function buyBait(baitId, qty) {
  const bait = BAITS[baitId];
  if (!bait || bait.infinite) return { ok: false, error: 'E00' };

  const currentCount = state.baits[baitId] || 0;
  if (currentCount + qty > BAIT_MAX) {
    return { ok: false, error: 'BAIT_MAX_LIMIT' };
  }

  const totalPrice = bait.price * qty;
  if (state.gold < totalPrice) {
    return { ok: false, error: 'E02' };
  }

  state.gold -= totalPrice;
  state.baits[baitId] = currentCount + qty;

  saveGame();
  updateTopbar();
  return { ok: true };
}

export function buyBagUpgrade() {
  const currentCap = state.bagCapacity;
  const upgrade = BAG_UPGRADES.find((u) => u.from === currentCap);
  if (!upgrade) return { ok: false, error: 'E00' };

  if (state.gold < upgrade.price) {
    return { ok: false, error: 'E02' };
  }

  state.gold -= upgrade.price;
  state.bagCapacity = upgrade.to;

  saveGame();
  updateTopbar();
  return { ok: true, newCapacity: upgrade.to };
}

// ==========================================
// 6단계 지역 상태 함수들 (docs/07)
// ==========================================

export function canUnlockRegion(regionId) {
  if (state.currentRegion === regionId) {
    return 'current';
  }

  if (state.unlockedRegions.includes(regionId)) {
    return 'unlocked';
  }

  const regionIndex = REGIONS.findIndex((r) => r.id === regionId);
  const region = REGIONS[regionIndex];
  if (!region) return 'needPrevious';

  const totalCollected = Object.keys(state.collection || {}).length;
  if (region.requiredCollection > totalCollected) {
    return 'needCollection';
  }

  if (regionIndex > 0) {
    const prevRegion = REGIONS[regionIndex - 1];
    if (!state.unlockedRegions.includes(prevRegion.id)) {
      return 'needPrevious';
    }
  }

  return 'available';
}

export function unlockRegion(regionId) {
  const status = canUnlockRegion(regionId);
  if (status !== 'available') {
    return { ok: false, error: status };
  }

  const region = REGIONS.find((r) => r.id === regionId);
  if (!region) return { ok: false, error: 'E00' };

  if (state.gold < region.unlockPrice) {
    return { ok: false, error: 'E02' };
  }

  state.gold -= region.unlockPrice;
  state.unlockedRegions.push(regionId);

  saveGame();
  updateTopbar();
  return { ok: true };
}

export function moveRegion(regionId) {
  if (state.unlockedRegions.includes(regionId)) {
    state.currentRegion = regionId;
    saveGame();
    updateTopbar();
  }
}
