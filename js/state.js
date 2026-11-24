import { START, FISH, REGIONS, RODS, BAITS, BAG_UPGRADES, BAIT_MAX, MESSAGES, TRASH_ITEMS, ECO_SHOP, LOTTERY_TIERS } from './data.js';
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
    rodEnhancements: {}, // { bamboo: 0, carbon: 3, ... }
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
    speedMode: false, // 스피드 파밍 모드 (결과창 자동 닫기)
    ecoPoints: 0, // 해양 쓰레기 정화 마일리지 포인트
    hasEcoRod: false, // 에코 낚싯대 보유 여부
    // 일일 의뢰 (데일리 퀘스트)
    dailyQuests: [
      { id: 'q1', title: '물고기 5마리 낚기', current: 0, target: 5, reward: 5000, completed: false },
      { id: 'q2', title: '점프 스매시 2회 성공', current: 0, target: 2, reward: 8000, completed: false },
      { id: 'q3', title: '희귀 이상 물고기 1마리 낚기', current: 0, target: 1, reward: 12000, completed: false },
    ],
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
// 저장 코드 내보내기 및 다른 기기에서 가져오기 (Cloudless Sync)
// ==========================================

export function exportSaveCode() {
  saveGame();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return '';
  // Base64 인코딩으로 안전하게 변환
  try {
    return btoa(encodeURIComponent(raw));
  } catch (e) {
    return '';
  }
}

export function importSaveCode(code) {
  if (!code || typeof code !== 'string') {
    return { ok: false, error: '유효하지 않은 저장 코드입니다.' };
  }
  try {
    const raw = decodeURIComponent(atob(code.trim()));
    const parsed = JSON.parse(raw);
    if (!validateSavedData(parsed)) {
      return { ok: false, error: '저장 코드 데이터가 손상되었거나 올바르지 않습니다.' };
    }
    sanitizeSavedData(parsed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    Object.assign(state, createNewState(), parsed, {
      activeTab: 'fishing',
      isFishingActive: false,
    });
    updateTopbar();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: '저장 코드를 해석할 수 없습니다. 복사한 코드를 다시 확인해 주세요.' };
  }
}
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
    rodEnhancements: state.rodEnhancements || {},
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
    speedMode: state.speedMode || false,
    ecoPoints: state.ecoPoints || 0,
    hasEcoRod: state.hasEcoRod || false,
    dailyQuests: state.dailyQuests || [],
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
  state.stats.totalEarned = (state.stats.totalEarned || 0) + amount;
  saveGame();
  updateTopbar();
}

export function updateDailyQuestProgress(type, amount = 1) {
  if (!state.dailyQuests) return;
  state.dailyQuests.forEach((q) => {
    if (q.completed) return;
    if (type === 'catch' && q.id === 'q1') {
      q.current = Math.min(q.target, q.current + amount);
    } else if (type === 'smash' && q.id === 'q2') {
      q.current = Math.min(q.target, q.current + amount);
    } else if (type === 'rare_catch' && q.id === 'q3') {
      q.current = Math.min(q.target, q.current + amount);
    }
    if (q.current >= q.target && !q.completed) {
      q.completed = true;
      state.gold += q.reward;
      showToast(`📜 의뢰 완료: [${q.title}] 달성! (+${q.reward}G)`);
      updateTopbar();
    }
  });
  saveGame();
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

  const fishMeta = FISH.find((f) => f.id === item.fishId) || FISH[0];

  state.aquarium.push({
    id: `aq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    fishId: item.fishId,
    name: fishMeta.name,
    emoji: fishMeta.emoji,
    size: item.size,
    rarity: fishMeta.rarity,
    price: item.price,
    addedAt: Date.now(),
  });

  saveGame();
  updateTopbar();
  return { ok: true, fish: { ...item, name: fishMeta.name } };
}

// 가방에서 최고 등급 물고기들 수족관에 한 번에 일괄 입주
export function autoAddBestFishToAquarium() {
  if (!state.aquarium) state.aquarium = [];
  const availableSlots = 20 - state.aquarium.length;
  if (availableSlots <= 0) {
    return { ok: false, error: '수족관이 이미 가득 찼습니다! (최대 20마리)' };
  }
  if (!state.bag || state.bag.length === 0) {
    return { ok: false, error: '가방에 물고기가 없습니다.' };
  }

  const rarityRank = { mythic: 5, legendary: 4, epic: 3, rare: 2, common: 1 };

  // 가방 물고기들을 희귀도 및 가격 순으로 정렬
  const sortedBag = [...state.bag].sort((a, b) => {
    const metaA = FISH.find((f) => f.id === a.fishId) || { rarity: 'common', basePrice: 0 };
    const metaB = FISH.find((f) => f.id === b.fishId) || { rarity: 'common', basePrice: 0 };
    const rankDiff = (rarityRank[metaB.rarity] || 1) - (rarityRank[metaA.rarity] || 1);
    if (rankDiff !== 0) return rankDiff;
    return (b.price || 0) - (a.price || 0);
  });

  const toAdd = sortedBag.slice(0, availableSlots);
  let addedCount = 0;

  toAdd.forEach((item) => {
    const bagIdx = state.bag.findIndex((b) => b.uid === item.uid);
    if (bagIdx !== -1) {
      addFishToAquarium(bagIdx);
      addedCount++;
    }
  });

  return { ok: true, count: addedCount };
}

export function releaseFishFromAquarium(aquariumId) {
  if (!state.aquarium) return false;
  const idx = state.aquarium.findIndex((f) => f.id === aquariumId);
  if (idx === -1) return false;

  const releasedFish = state.aquarium.splice(idx, 1)[0];
  saveGame();
  return releasedFish;
}

// 수족관 물고기 즉시 판매
export function sellFishFromAquarium(aquariumId) {
  if (!state.aquarium) return { ok: false, error: '수족관이 비어있습니다.' };
  const idx = state.aquarium.findIndex((f) => f.id === aquariumId);
  if (idx === -1) return { ok: false, error: '물고기를 찾을 수 없습니다.' };

  const fish = state.aquarium.splice(idx, 1)[0];
  const sellPrice = fish.price || 10;

  state.gold += sellPrice;
  state.stats.totalEarned = (state.stats.totalEarned || 0) + sellPrice;

  saveGame();
  updateTopbar();
  return { ok: true, fish, price: sellPrice };
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
    return null;
  }

  // 10마리 모두 잡았는지 체크
  const regionFish = FISH.filter((f) => f.region === regionId);
  const allCaught = regionFish.every((f) => state.collection && state.collection[f.id]);
  if (!allCaught) {
    return null;
  }

  // 복권 당첨 추첨 (1등 1%, 2등 9%, 3등 30%, 4등 60%)
  const rand = Math.random() * 100;
  let lotteryReward = LOTTERY_TIERS[3]; // 기본 4등
  if (rand < 1) {
    lotteryReward = LOTTERY_TIERS[0]; // 1등
  } else if (rand < 10) {
    lotteryReward = LOTTERY_TIERS[1]; // 2등
  } else if (rand < 40) {
    lotteryReward = LOTTERY_TIERS[2]; // 3등
  }

  state.claimedRegionRewards.push(regionId);
  const totalGoldReward = region.completeReward + lotteryReward.gold;
  state.gold += totalGoldReward;
  state.stats.totalEarned = (state.stats.totalEarned || 0) + totalGoldReward;

  // 복권 보너스 미끼 지급
  if (lotteryReward.baitType) {
    state.baits[lotteryReward.baitType] = (state.baits[lotteryReward.baitType] || 0) + lotteryReward.baitCount;
  }

  saveGame();
  updateTopbar();

  return {
    regionName: region.name,
    baseGold: region.completeReward,
    lottery: lotteryReward,
    totalGold: totalGoldReward,
  };
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

// ==========================================
// 낚싯대 강화 시스템 (+1 ~ +10강)
// ==========================================

export function getRodEnhanceLevel(rodId) {
  if (!state.rodEnhancements) state.rodEnhancements = {};
  return state.rodEnhancements[rodId] || 0;
}

export function getRodEnhanceCost(rodId) {
  const rod = RODS[rodId] || RODS.bamboo;
  const currentLevel = getRodEnhanceLevel(rodId);
  if (currentLevel >= 10) return 0; // 최대 강화
  const baseCost = Math.max(100, Math.round(rod.price * 0.25));
  return Math.round(baseCost * Math.pow(1.5, currentLevel));
}

export function enhanceRod(rodId) {
  if (!state.ownedRods.includes(rodId)) {
    return { ok: false, error: '보유하지 않은 낚싯대입니다.' };
  }
  const currentLevel = getRodEnhanceLevel(rodId);
  if (currentLevel >= 10) {
    return { ok: false, error: '이미 최고 강화 단계(+10강)입니다!' };
  }
  const cost = getRodEnhanceCost(rodId);
  if (state.gold < cost) {
    return { ok: false, error: '골드가 부족합니다!' };
  }

  state.gold -= cost;
  if (!state.rodEnhancements) state.rodEnhancements = {};
  state.rodEnhancements[rodId] = currentLevel + 1;

  saveGame();
  updateTopbar();
  return { ok: true, newLevel: currentLevel + 1, cost };
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

// 스피드 모드 토글 (결과창 자동 닫기)
export function toggleSpeedMode() {
  state.speedMode = !state.speedMode;
  saveGame();
  return state.speedMode;
}

// 에코 포인트 추가
export function addEcoPoints(pts) {
  state.ecoPoints = (state.ecoPoints || 0) + pts;
  saveGame();
  return state.ecoPoints;
}

// 에코 상점 교환
export function exchangeEcoReward(rewardId) {
  const item = ECO_SHOP[rewardId];
  if (!item) return { ok: false, error: '존재하지 않는 상품입니다.' };
  if ((state.ecoPoints || 0) < item.reqPoint) {
    return { ok: false, error: `에코 포인트가 부족합니다. (보유: ${state.ecoPoints || 0}P / 필요: ${item.reqPoint}P)` };
  }

  state.ecoPoints -= item.reqPoint;
  if (rewardId === 'eco_rod') {
    // 낚싯대 조준각 보너스 영구 추가
    state.hasEcoRod = true;
  } else if (rewardId === 'eco_bait') {
    // 고급 미끼 +20개 지급
    state.baits.worm = (state.baits.worm || 0) + 20;
  }

  saveGame();
  return { ok: true, name: item.name };
}

