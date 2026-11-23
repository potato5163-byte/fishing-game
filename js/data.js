export const START = {
  gold: 100,
  region: 'lake',
  rod: 'bamboo',
  bait: 'basic',
  bagCapacity: 20,
};

export const RARITIES = {
  common:    { id: 'common',    name: '일반', cssVar: '--rarity-common' },
  rare:      { id: 'rare',      name: '희귀', cssVar: '--rarity-rare' },
  epic:      { id: 'epic',      name: '영웅', cssVar: '--rarity-epic' },
  legendary: { id: 'legendary', name: '전설', cssVar: '--rarity-legendary' },
};

// 7개 지역
export const REGIONS = [
  {
    id: 'lake',
    name: '잔잔한 호수',
    desc: '바람 한 점 없는 조용한 호수',
    unlockPrice: 0,
    requiredCollection: 0,
    completeReward: 300,
  },
  {
    id: 'river',
    name: '맑은 강',
    desc: '물살이 빠른 시원한 강',
    unlockPrice: 500,
    requiredCollection: 0,
    completeReward: 800,
  },
  {
    id: 'sea',
    name: '푸른 바다',
    desc: '큰 물고기가 사는 넓은 바다',
    unlockPrice: 2000,
    requiredCollection: 0,
    completeReward: 2000,
  },
  {
    id: 'abyss',
    name: '심해 협곡',
    desc: '빛이 닿지 않는 깊은 바닷속',
    unlockPrice: 8000,
    requiredCollection: 10,
    completeReward: 5000,
  },
  {
    id: 'glacier',
    name: '극지 빙하',
    desc: '얼음 아래 차가운 생명이 숨쉬는 극지방',
    unlockPrice: 25000,
    requiredCollection: 15,
    completeReward: 10000,
  },
  {
    id: 'palace',
    name: '신비한 용궁',
    desc: '바다 깊은 곳 영롱하게 빛나는 전설의 궁전',
    unlockPrice: 80000,
    requiredCollection: 22,
    completeReward: 25000,
  },
  {
    id: 'nebula',
    name: '우주 성운 해구',
    desc: '별빛과 에너지가 흐르는 우주 속 은하 낚시터',
    unlockPrice: 250000,
    requiredCollection: 28,
    completeReward: 80000,
  },
];

// 미끼 6종
export const BAITS = {
  basic: {
    id: 'basic',
    name: '기본 미끼',
    emoji: '🍞',
    price: 0,
    infinite: true,
    weights: { common: 60, rare: 28, epic: 10, legendary: 2 },
    desc: '언제나 쓸 수 있는 빵 미끼',
  },
  worm: {
    id: 'worm',
    name: '지렁이 미끼',
    emoji: '🪱',
    price: 10,
    infinite: false,
    weights: { common: 55, rare: 33, epic: 10, legendary: 2 },
    desc: '희귀 물고기가 조금 더 잘 물어요',
  },
  shiny: {
    id: 'shiny',
    name: '반짝이 미끼',
    emoji: '✨',
    price: 50,
    infinite: false,
    weights: { common: 46, rare: 36, epic: 15, legendary: 3 },
    desc: '희귀·영웅 물고기가 잘 물어요',
  },
  golden: {
    id: 'golden',
    name: '황금 미끼',
    emoji: '🌟',
    price: 200,
    infinite: false,
    weights: { common: 40, rare: 30, epic: 22, legendary: 8 },
    desc: '전설 물고기를 노려보세요',
  },
  rainbow: {
    id: 'rainbow',
    name: '무지개 미끼',
    emoji: '🌈',
    price: 500,
    infinite: false,
    weights: { common: 30, rare: 35, epic: 25, legendary: 10 },
    desc: '오색빛깔로 영웅·전설을 유혹해요',
  },
  cosmic_bait: {
    id: 'cosmic_bait',
    name: '코스믹 미끼',
    emoji: '🪐',
    price: 1200,
    infinite: false,
    weights: { common: 20, rare: 35, epic: 30, legendary: 15 },
    desc: '은하수의 기운을 품은 최강의 미끼',
  },
};

export const BAIT_MAX = 999;
export const BAIT_ORDER = ['basic', 'worm', 'shiny', 'golden', 'rainbow', 'cosmic_bait'];

// 낚싯대 7종
export const RODS = {
  bamboo: {
    id: 'bamboo',
    name: '대나무 낚싯대',
    emoji: '🎋',
    price: 0,
    zoneBonus: 0,
    reelMultiplier: 1.0,
    desc: '처음 받는 낚싯대',
  },
  carbon: {
    id: 'carbon',
    name: '카본 낚싯대',
    emoji: '🎣',
    price: 300,
    zoneBonus: 5,
    reelMultiplier: 1.10,
    desc: '가볍고 튼튼해요',
  },
  pro: {
    id: 'pro',
    name: '프로 낚싯대',
    emoji: '🪝',
    price: 1500,
    zoneBonus: 10,
    reelMultiplier: 1.20,
    desc: '프로 낚시꾼의 선택',
  },
  legend: {
    id: 'legend',
    name: '전설의 낚싯대',
    emoji: '🔱',
    price: 6000,
    zoneBonus: 15,
    reelMultiplier: 1.35,
    desc: '바다의 신이 쓰던 낚싯대',
  },
  titanium: {
    id: 'titanium',
    name: '티타늄 낚싯대',
    emoji: '⚡',
    price: 15000,
    zoneBonus: 20,
    reelMultiplier: 1.50,
    desc: '극지방의 한파도 견디는 신소재 낚싯대',
  },
  dragon: {
    id: 'dragon',
    name: '용비늘 낚싯대',
    emoji: '🐉',
    price: 60000,
    zoneBonus: 25,
    reelMultiplier: 1.75,
    desc: '용궁의 신비한 힘이 깃든 낚싯대',
  },
  cosmic: {
    id: 'cosmic',
    name: '은하의 성채 낚싯대',
    emoji: '🌌',
    price: 200000,
    zoneBonus: 30,
    reelMultiplier: 2.00,
    desc: '별을 낚아 올릴 수 있는 궁극의 낚싯대',
  },
};

export const ROD_ORDER = ['bamboo', 'carbon', 'pro', 'legend', 'titanium', 'dragon', 'cosmic'];

// 가방 업그레이드 확장 (20 -> 100)
export const BAG_UPGRADES = [
  { from: 20, to: 30, price: 400 },
  { from: 30, to: 40, price: 1000 },
  { from: 40, to: 50, price: 2500 },
  { from: 50, to: 60, price: 5000 },
  { from: 60, to: 75, price: 12000 },
  { from: 75, to: 100, price: 30000 },
];

// 총 35종 물고기 (7개 지역 * 5마리)
export const FISH = [
  // 1. 잔잔한 호수 (lake)
  { id: 'minnow', region: 'lake', name: '피라미', emoji: '🐟', rarity: 'common', minSize: 5, maxSize: 15, basePrice: 15, difficulty: 1, desc: '떼 지어 다니는 작은 물고기' },
  { id: 'crucian', region: 'lake', name: '붕어', emoji: '🐟', rarity: 'common', minSize: 10, maxSize: 30, basePrice: 20, difficulty: 1, desc: '호수에서 가장 흔한 물고기' },
  { id: 'carp', region: 'lake', name: '잉어', emoji: '🐠', rarity: 'rare', minSize: 30, maxSize: 80, basePrice: 80, difficulty: 2, desc: '힘이 세고 오래 사는 물고기' },
  { id: 'catfish', region: 'lake', name: '메기', emoji: '🐟', rarity: 'epic', minSize: 40, maxSize: 120, basePrice: 250, difficulty: 3, desc: '수염으로 먹이를 찾는 밤의 사냥꾼' },
  { id: 'golden_carp', region: 'lake', name: '황금 잉어', emoji: '🐠', rarity: 'legendary', minSize: 50, maxSize: 100, basePrice: 1000, difficulty: 4, desc: '보면 행운이 온다는 전설의 잉어' },

  // 2. 맑은 강 (river)
  { id: 'dace', region: 'river', name: '갈겨니', emoji: '🐟', rarity: 'common', minSize: 10, maxSize: 20, basePrice: 30, difficulty: 1, desc: '맑은 물을 좋아하는 은빛 물고기' },
  { id: 'kkeokji', region: 'river', name: '꺽지', emoji: '🐟', rarity: 'common', minSize: 10, maxSize: 25, basePrice: 40, difficulty: 2, desc: '바위 틈에 숨어 사는 토종 물고기' },
  { id: 'mandarin_fish', region: 'river', name: '쏘가리', emoji: '🐠', rarity: 'rare', minSize: 20, maxSize: 50, basePrice: 150, difficulty: 2, desc: '표범 무늬를 가진 강의 왕' },
  { id: 'salmon', region: 'river', name: '연어', emoji: '🐟', rarity: 'epic', minSize: 50, maxSize: 100, basePrice: 400, difficulty: 3, desc: '태어난 강으로 돌아오는 물고기' },
  { id: 'sturgeon', region: 'river', name: '철갑상어', emoji: '🦈', rarity: 'legendary', minSize: 100, maxSize: 250, basePrice: 2000, difficulty: 5, desc: '공룡 시대부터 살아온 물고기' },

  // 3. 푸른 바다 (sea)
  { id: 'mackerel', region: 'sea', name: '고등어', emoji: '🐟', rarity: 'common', minSize: 20, maxSize: 40, basePrice: 50, difficulty: 2, desc: '등이 푸른 국민 생선' },
  { id: 'horse_mackerel', region: 'sea', name: '전갱이', emoji: '🐟', rarity: 'common', minSize: 15, maxSize: 35, basePrice: 45, difficulty: 2, desc: '무리 지어 빠르게 헤엄쳐요' },
  { id: 'sea_bream', region: 'sea', name: '참돔', emoji: '🐠', rarity: 'rare', minSize: 25, maxSize: 60, basePrice: 250, difficulty: 3, desc: '분홍빛이 아름다운 바다의 여왕' },
  { id: 'tuna', region: 'sea', name: '참치', emoji: '🐟', rarity: 'epic', minSize: 100, maxSize: 250, basePrice: 900, difficulty: 4, desc: '쉬지 않고 헤엄치는 바다의 탄환' },
  { id: 'marlin', region: 'sea', name: '돛새치', emoji: '🐟', rarity: 'legendary', minSize: 150, maxSize: 350, basePrice: 4000, difficulty: 5, desc: '바다에서 가장 빠른 물고기' },

  // 4. 심해 협곡 (abyss)
  { id: 'monkfish', region: 'abyss', name: '아귀', emoji: '🐡', rarity: 'common', minSize: 30, maxSize: 80, basePrice: 150, difficulty: 3, desc: '입이 엄청 큰 바닥의 물고기' },
  { id: 'squid', region: 'abyss', name: '오징어', emoji: '🦑', rarity: 'common', minSize: 20, maxSize: 60, basePrice: 120, difficulty: 3, desc: '먹물을 뿜고 도망쳐요' },
  { id: 'giant_octopus', region: 'abyss', name: '대왕문어', emoji: '🐙', rarity: 'rare', minSize: 100, maxSize: 300, basePrice: 600, difficulty: 4, desc: '여덟 다리로 바위를 붙잡아요' },
  { id: 'anglerfish', region: 'abyss', name: '초롱아귀', emoji: '🏮', rarity: 'epic', minSize: 20, maxSize: 50, basePrice: 1500, difficulty: 4, desc: '머리 위 등불로 먹이를 유혹해요' },
  { id: 'whale_shark', region: 'abyss', name: '고래상어', emoji: '🐋', rarity: 'legendary', minSize: 400, maxSize: 1200, basePrice: 10000, difficulty: 5, desc: '심해 협곡의 주인, 거대한 물고기' },

  // 5. 극지 빙하 (glacier)
  { id: 'icefish', region: 'glacier', name: '빙어', emoji: '🐟', rarity: 'common', minSize: 8, maxSize: 18, basePrice: 200, difficulty: 3, desc: '투명하고 차가운 얼음물에 사는 물고기' },
  { id: 'polar_cod', region: 'glacier', name: '북극대구', emoji: '🐟', rarity: 'common', minSize: 25, maxSize: 50, basePrice: 260, difficulty: 3, desc: '영하의 수온에서도 헤엄치는 대구' },
  { id: 'king_icefish', region: 'glacier', name: '빙어왕', emoji: '🐠', rarity: 'rare', minSize: 30, maxSize: 70, basePrice: 1000, difficulty: 4, desc: '빙하 동굴 깊은 곳의 푸른빛 제왕' },
  { id: 'leopard_seal', region: 'glacier', name: '얼음표범물범', emoji: '🦭', rarity: 'epic', minSize: 120, maxSize: 280, basePrice: 3200, difficulty: 5, desc: '얼음 위를 미끄러지는 사냥꾼' },
  { id: 'white_whale', region: 'glacier', name: '북극 흰고래', emoji: '🐳', rarity: 'legendary', minSize: 350, maxSize: 900, basePrice: 22000, difficulty: 5, desc: '빙하 세계의 노래하는 하얀 거인' },

  // 6. 신비한 용궁 (palace)
  { id: 'seahorse', region: 'palace', name: '용궁 해마', emoji: '🐡', rarity: 'common', minSize: 10, maxSize: 25, basePrice: 500, difficulty: 3, desc: '용궁의 문지기 역할을 하는 해마' },
  { id: 'pearl_clam', region: 'palace', name: '여의주 조개', emoji: '🦪', rarity: 'common', minSize: 20, maxSize: 45, basePrice: 650, difficulty: 4, desc: '영롱한 여의주 빛 진주를 품은 조개' },
  { id: 'palace_carp', region: 'palace', name: '비단잉어', emoji: '🐠', rarity: 'rare', minSize: 40, maxSize: 95, basePrice: 2500, difficulty: 4, desc: '오색 비단옷을 입은 듯 화려한 잉어' },
  { id: 'palace_turtle', region: 'palace', name: '용궁 거북이', emoji: '🐢', rarity: 'epic', minSize: 80, maxSize: 200, basePrice: 7500, difficulty: 5, desc: '천 년의 지혜를 품고 용궁을 수호해요' },
  { id: 'blue_dragon', region: 'palace', name: '동해 청룡', emoji: '🐉', rarity: 'legendary', minSize: 500, maxSize: 1500, basePrice: 55000, difficulty: 5, desc: '여의주를 물고 승천하는 전설의 수룡' },

  // 7. 우주 성운 해구 (nebula)
  { id: 'star_fish', region: 'nebula', name: '별조각 물고기', emoji: '⭐', rarity: 'common', minSize: 15, maxSize: 35, basePrice: 1200, difficulty: 4, desc: '부서진 소행성의 별빛을 먹고 자라요' },
  { id: 'plasma_jelly', region: 'nebula', name: '플라즈마 해파리', emoji: '🪼', rarity: 'common', minSize: 30, maxSize: 80, basePrice: 1500, difficulty: 4, desc: '전기 에너지를 뿜으며 성운을 유영해요' },
  { id: 'meteor_ray', region: 'nebula', name: '유성 가오리', emoji: '🛸', rarity: 'rare', minSize: 80, maxSize: 220, basePrice: 6000, difficulty: 5, desc: '혜성의 꼬리를 따라 비행하는 가오리' },
  { id: 'galaxy_whale', region: 'nebula', name: '은하 고래', emoji: '🌌', rarity: 'epic', minSize: 600, maxSize: 1800, basePrice: 20000, difficulty: 5, desc: '은하수를 품고 우주의 심연을 헤엄쳐요' },
  { id: 'cosmic_leviathan', region: 'nebula', name: '코스믹 리바이어던', emoji: '👾', rarity: 'legendary', minSize: 1000, maxSize: 3000, basePrice: 150000, difficulty: 5, desc: '시공간의 균열을 다스리는 우주 최강의 존재' },
];

export const FISHING_CONFIG = {
  POWER_CYCLE_SEC: 1.6,
  WAIT_TIME: {
    weak:    { maxPower: 39,  min: 4.0, max: 8.0 },
    normal:  { maxPower: 89,  min: 3.0, max: 6.0 },
    perfect: { maxPower: 100, min: 1.5, max: 3.0 },
  },
  BITE_WINDOW_SEC: 1.0,
  ZONE_BASE_HEIGHT: 25,
  ZONE_UP_ACCEL: 200,
  ZONE_GRAVITY: 160,
  ZONE_MAX_SPEED: 90,
  PROGRESS_START: 30,
  PROGRESS_GAIN: 22,
  REEL_TIME_LIMIT_SEC: 25,
  MAX_DT: 0.1,
  DIFFICULTY: {
    1: { targetIntervalSec: 1.6, fishSpeed: 25, progressLoss: 12 },
    2: { targetIntervalSec: 1.3, fishSpeed: 35, progressLoss: 14 },
    3: { targetIntervalSec: 1.0, fishSpeed: 45, progressLoss: 16 },
    4: { targetIntervalSec: 0.8, fishSpeed: 60, progressLoss: 18 },
    5: { targetIntervalSec: 0.6, fishSpeed: 75, progressLoss: 20 },
  },
};

export const MESSAGES = {
  E01: '가방이 가득 찼어요. 가방에서 물고기를 팔아 자리를 만들어 주세요.',
  E02: '골드가 부족해요. (필요 {price}G / 보유 {gold}G)',
  E03: '{baitName}가 다 떨어져서 기본 미끼로 바꿨어요.',
  E04: '도감을 {required}종 이상 채워야 {regionName}에 갈 수 있어요. (현재 {count}종)',
  E05: '너무 일찍 당겼어요! 물고기가 놀라서 도망갔어요.',
  E06: '아쉬워요, 입질을 놓쳤어요.',
  E07: '물고기가 도망갔어요…',
  E08: '줄이 끊어졌어요! 너무 오래 버텼어요.',
  E09: '이 브라우저에서는 저장이 안 돼요. 창을 닫으면 기록이 사라져요.',
  E10: '저장된 기록을 읽을 수 없어서 새로 시작해요.',
  E11: '저장하지 못했어요. 잠시 후 다시 시도할게요.',
  PERFECT_CAST: '✨ 퍼펙트 캐스팅!',
  SELL_ONE: '🪙 {fishName}을(를) {price}G에 팔았어요',
  SELL_ALL: '🪙 {count}마리를 {total}G에 팔았어요',
  BUY_ITEM: '✅ {itemName} 구매 완료!',
  BUY_ROD: '✅ {rodName} 구매 완료! 바로 장착했어요.',
  EQUIP_ROD: '🎣 {rodName}을(를) 장착했어요.',
  BAG_EXPAND: '✅ 가방이 {capacity}마리로 커졌어요!',
  BAIT_MAX_LIMIT: '미끼는 최대 999개까지 가질 수 있어요.',
  REGION_UNLOCK: '🔓 {regionName}이(가) 열렸어요!',
  REGION_MOVE: '🗺️ {regionName}(으)로 이동했어요',
  COLLECTION_COMPLETE: '🎉 {regionName} 도감 완성! 보상 {reward}G를 받았어요',
  FISH_UNKNOWN: '아직 발견하지 못한 물고기예요.',
  RESET_GAME: '🔄 처음부터 다시 시작해요',
};

// 미끼 확률 합 검증 및 물고기 개수 검사
function validateData() {
  if (FISH.length !== 35) {
    console.error(`[데이터 오류] FISH 개수는 35개여야 하지만 현재 ${FISH.length}개입니다.`);
  }

  for (const [id, bait] of Object.entries(BAITS)) {
    const sum = Object.values(bait.weights).reduce((acc, cur) => acc + cur, 0);
    if (sum !== 100) {
      console.error(`[데이터 오류] 미끼(${id})의 확률 합이 100이 아닙니다: ${sum}`);
    }
  }
}

validateData();
