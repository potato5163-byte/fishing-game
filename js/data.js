export const START = {
  gold: 100,
  region: 'lake',
  rod: 'bamboo',
  bait: 'basic',
  bagCapacity: 20,
};

// 5개 등급: 일반, 희귀, 영웅, 전설, 그리고 전설 윗등급 [신화 (Mythic)]
export const RARITIES = {
  common:    { id: 'common',    name: '일반', cssVar: '--rarity-common' },
  rare:      { id: 'rare',      name: '희귀', cssVar: '--rarity-rare' },
  epic:      { id: 'epic',      name: '영웅', cssVar: '--rarity-epic' },
  legendary: { id: 'legendary', name: '전설', cssVar: '--rarity-legendary' },
  mythic:    { id: 'mythic',    name: '신화', cssVar: '--rarity-mythic' },
};

// 15개 지역 (초대형 엔드콘텐츠 확장)
export const REGIONS = [
  { id: 'lake', name: '잔잔한 호수', desc: '바람 한 점 없는 조용한 호수', unlockPrice: 0, requiredCollection: 0, completeReward: 500 },
  { id: 'river', name: '맑은 강', desc: '물살이 빠른 시원한 강', unlockPrice: 500, requiredCollection: 0, completeReward: 1500 },
  { id: 'sea', name: '푸른 바다', desc: '큰 물고기가 사는 넓은 바다', unlockPrice: 2000, requiredCollection: 0, completeReward: 4000 },
  { id: 'abyss', name: '심해 협곡', desc: '빛이 닿지 않는 깊은 바닷속', unlockPrice: 8000, requiredCollection: 10, completeReward: 10000 },
  { id: 'glacier', name: '극지 빙하', desc: '얼음 아래 차가운 생명이 숨쉬는 극지방', unlockPrice: 25000, requiredCollection: 20, completeReward: 20000 },
  { id: 'palace', name: '신비한 용궁', desc: '바다 깊은 곳 영롱하게 빛나는 전설의 궁전', unlockPrice: 80000, requiredCollection: 35, completeReward: 50000 },
  { id: 'nebula', name: '우주 성운 해구', desc: '별빛과 에너지가 흐르는 우주 속 은하 낚시터', unlockPrice: 250000, requiredCollection: 50, completeReward: 150000 },
  { id: 'volcano', name: '용암 분화호', desc: '끓어오르는 마그마 속에서 헤엄치는 불꽃의 생명체들', unlockPrice: 800000, requiredCollection: 65, completeReward: 400000 },
  { id: 'timewarp', name: '시간의 틈새 해저', desc: '과거와 미래의 시공간이 뒤엉킨 신비의 차원 바다', unlockPrice: 2500000, requiredCollection: 80, completeReward: 1000000 },
  { id: 'sky_ocean', name: '천상 유원지', desc: '무지개 구름 위 신들이 노니는 궁극의 천상 바다', unlockPrice: 8000000, requiredCollection: 90, completeReward: 5000000 },
  { id: 'rift', name: '차원 왜곡 균열', desc: '시공간이 쪼개져 네온 픽셀 글리치가 흐르는 외계 바다', unlockPrice: 25000000, requiredCollection: 95, completeReward: 12000000 },
  { id: 'horizon', name: '사건의 지평선', desc: '블랙홀의 강착원반 광선과 빛조차 빨아들이는 중력의 바다', unlockPrice: 80000000, requiredCollection: 105, completeReward: 35000000 },
  { id: 'atlantis', name: '아틀란티스 신전', desc: '수억 년 전 가라앉은 초고대 기계 문명의 황금 성역', unlockPrice: 200000000, requiredCollection: 115, completeReward: 80000000 },
  { id: 'chronos', name: '시간의 태엽 나선', desc: '선사 시대 고대어와 3000년 미래 기계어가 공존하는 시간 바다', unlockPrice: 500000000, requiredCollection: 125, completeReward: 200000000 },
  { id: 'genesis', name: '창세의 에테르 성소', desc: '우주 만물 생명의 기원이 태동한 궁극의 성역 바다', unlockPrice: 1000000000, requiredCollection: 135, completeReward: 500000000 },
];

// 미끼 8종 (신화 확률 포함)
export const BAITS = {
  basic: {
    id: 'basic', name: '기본 미끼', emoji: '🍞', price: 0, infinite: true,
    weights: { common: 60, rare: 28, epic: 10, legendary: 2, mythic: 0 },
    desc: '언제나 쓸 수 있는 빵 미끼',
  },
  worm: {
    id: 'worm', name: '지렁이 미끼', emoji: '🪱', price: 10, infinite: false,
    weights: { common: 52, rare: 33, epic: 12, legendary: 3, mythic: 0 },
    desc: '희귀 물고기가 조금 더 잘 물어요',
  },
  shiny: {
    id: 'shiny', name: '반짝이 미끼', emoji: '✨', price: 50, infinite: false,
    weights: { common: 43, rare: 36, epic: 16, legendary: 5, mythic: 0 },
    desc: '희귀·영웅 물고기가 잘 물어요',
  },
  golden: {
    id: 'golden', name: '황금 미끼', emoji: '🌟', price: 200, infinite: false,
    weights: { common: 35, rare: 30, epic: 24, legendary: 10, mythic: 1 },
    desc: '전설과 신화 물고기를 노려보세요',
  },
  rainbow: {
    id: 'rainbow', name: '무지개 미끼', emoji: '🌈', price: 500, infinite: false,
    weights: { common: 25, rare: 32, epic: 27, legendary: 13, mythic: 3 },
    desc: '오색빛깔로 영웅·전설·신화를 유혹해요',
  },
  cosmic_bait: {
    id: 'cosmic_bait', name: '코스믹 미끼', emoji: '🪐', price: 1500, infinite: false,
    weights: { common: 15, rare: 30, epic: 32, legendary: 17, mythic: 6 },
    desc: '은하수의 기운을 품은 강력한 미끼',
  },
  phoenix: {
    id: 'phoenix', name: '불사조 깃털 미끼', emoji: '🔥', price: 5000, infinite: false,
    weights: { common: 10, rare: 25, epic: 35, legendary: 20, mythic: 10 },
    desc: '영원히 타오르는 불꽃으로 대물을 불러모아요',
  },
  celestial_star: {
    id: 'celestial_star', name: '천상의 별조각 미끼', emoji: '💫', price: 15000, infinite: false,
    weights: { common: 5, rare: 20, epic: 35, legendary: 25, mythic: 15 },
    desc: '신화 등급 물고기가 반응하는 궁극의 미끼',
  },
};

export const BAIT_MAX = 999;
export const BAIT_ORDER = ['basic', 'worm', 'shiny', 'golden', 'rainbow', 'cosmic_bait', 'phoenix', 'celestial_star'];

// 낚싯대 10종 (신규 능력치: 조준 너비, 제압력/스턴초, 릴링 파워)
export const RODS = {
  bamboo: {
    id: 'bamboo', name: '대나무 낚싯대', emoji: '🎋', price: 0,
    trackingWidth: 26, stunDuration: 1.2, reelMultiplier: 1.0,
    desc: '기본적인 대나무 낚싯대. 조준과 스매시 기초용',
  },
  carbon: {
    id: 'carbon', name: '카본 낚싯대', emoji: '🎣', price: 300,
    trackingWidth: 30, stunDuration: 1.5, reelMultiplier: 1.15,
    desc: '가볍고 탄성이 좋아 좌우 반응 속도가 빨라요',
  },
  pro: {
    id: 'pro', name: '프로 낚싯대', emoji: '🪝', price: 1500,
    trackingWidth: 35, stunDuration: 1.8, reelMultiplier: 1.30,
    desc: '넓은 조준 반경과 강한 스매시 제압력을 자랑합니다',
  },
  legend: {
    id: 'legend', name: '전설의 낚싯대', emoji: '🔱', price: 6000,
    trackingWidth: 40, stunDuration: 2.2, reelMultiplier: 1.50,
    desc: '바다의 신이 남긴 삼지창의 힘. 점프한 물고기를 강력히 제압',
  },
  titanium: {
    id: 'titanium', name: '티타늄 낚싯대', emoji: '⚡', price: 20000,
    trackingWidth: 45, stunDuration: 2.6, reelMultiplier: 1.70,
    desc: '전기 충격파를 발생시켜 점프 스매시 시 물고기 2.6초 기절',
  },
  dragon: {
    id: 'dragon', name: '용비늘 낚싯대', emoji: '🐉', price: 80000,
    trackingWidth: 50, stunDuration: 3.0, reelMultiplier: 1.95,
    desc: '용궁의 여의주 기운으로 화면 절반을 커버하는 넓은 조준각',
  },
  cosmic: {
    id: 'cosmic', name: '은하의 성채 낚싯대', emoji: '🌌', price: 300000,
    trackingWidth: 55, stunDuration: 3.5, reelMultiplier: 2.25,
    desc: '중력장을 펼쳐 물고기의 좌우 이동을 봉쇄합니다',
  },
  magma: {
    id: 'magma', name: '용암의 창 낚싯대', emoji: '🌋', price: 1000000,
    trackingWidth: 60, stunDuration: 4.0, reelMultiplier: 2.60,
    desc: '불꽃 스매시로 단 한 번의 강타에 물고기를 완벽 무력화',
  },
  timewarp_rod: {
    id: 'timewarp_rod', name: '시간 역행 낚싯대', emoji: '⏳', price: 3500000,
    trackingWidth: 65, stunDuration: 4.5, reelMultiplier: 3.00,
    desc: '시공간을 왜곡하여 물고기의 점프 타이밍을 매우 느리게 만듦',
  },
  celestial_god: {
    id: 'celestial_god', name: '천상신의 황금 낚싯대', emoji: '👑', price: 10000000,
    trackingWidth: 75, stunDuration: 5.5, reelMultiplier: 3.60,
    desc: '우주 전체를 가두는 신의 결계. 스매시 성공 시 즉시 35% 끌어당김!',
  },
  rift_quantum: {
    id: 'rift_quantum', name: '차원 수렴 퀀텀 낚싯대', emoji: '🌌', price: 30000000,
    trackingWidth: 80, stunDuration: 6.0, reelMultiplier: 4.20, skill: 'teleport_pull',
    desc: '⚡특수기: QTE 성공 시 물고기 즉시 30m 강제 순간이동 견인!',
  },
  dark_matter_rod: {
    id: 'dark_matter_rod', name: '암흑물질 블랙홀 낚싯대', emoji: '🕳️', price: 100000000,
    trackingWidth: 85, stunDuration: 6.5, reelMultiplier: 4.80, skill: 'blackhole_slow',
    desc: '⚡특수기: 초중력장 발생으로 물고기 도주 속도 -50% 영구 감속!',
  },
  atlantis_ancient_rod: {
    id: 'atlantis_ancient_rod', name: '아틀란티스 하이테크 낚싯대', emoji: '🏛️', price: 250000000,
    trackingWidth: 90, stunDuration: 7.0, reelMultiplier: 5.50, skill: 'qte_double',
    desc: '⚡특수기: 신전 나노 와이어로 QTE 판정 2배 확장 및 릴링 파워 극대화!',
  },
  chronos_rewind_rod: {
    id: 'chronos_rewind_rod', name: '크로노스 타임루프 낚싯대', emoji: '⏳', price: 600000000,
    trackingWidth: 95, stunDuration: 7.5, reelMultiplier: 6.20, skill: 'time_rewind',
    desc: '⚡특수기: 릴 제한시간 소진 시 1회 시간 10초 되감기 부활!',
  },
  genesis_infinity_rod: {
    id: 'genesis_infinity_rod', name: '궁극 창세의 에테르 낚싯대', emoji: '🔱', price: 1500000000,
    trackingWidth: 100, stunDuration: 8.5, reelMultiplier: 7.50, skill: 'double_catch',
    desc: '⚡궁극기: 35% 확률로 2마리 동시 낚기(Double Catch) & 판매 골드 1.5배!',
  },
};

export const ROD_ORDER = [
  'bamboo', 'carbon', 'pro', 'legend', 'titanium', 'dragon',
  'cosmic', 'magma', 'timewarp_rod', 'celestial_god',
  'rift_quantum', 'dark_matter_rod', 'atlantis_ancient_rod', 'chronos_rewind_rod', 'genesis_infinity_rod'
];

// 특수 부적/아이템 (신규 상점 품목)
export const SPECIAL_ITEMS = {
  charm_luck: { id: 'charm_luck', name: '행운의 부적', emoji: '🍀', price: 3000, desc: '다음 낚시 5회 동안 전설·신화 출현 확률 2배 증가!', maxCount: 99 },
  hourglass_time: { id: 'hourglass_time', name: '시간 정지 모래시계', emoji: '⏱️', price: 5000, desc: '릴 미니게임 제한 시간이 15초 늘어나 여유롭게 낚아요 (5회 적용)', maxCount: 99 },
  magnet_gold: { id: 'magnet_gold', name: '황금 자석', emoji: '🧲', price: 50000, desc: '보유 중 영구 효과: 모든 물고기 판매 금액 +30% 보너스!', isPermanent: true },
  potion_zone: { id: 'potion_zone', name: '거인의 비약', emoji: '🧪', price: 8000, desc: '다음 낚시 5회 동안 잡기 영역 크기가 1.5배로 커집니다', maxCount: 99 },
};

// 가방 업그레이드 (20 -> 500마리)
export const BAG_UPGRADES = [
  { from: 20, to: 30, price: 400 },
  { from: 30, to: 40, price: 1000 },
  { from: 40, to: 50, price: 2500 },
  { from: 50, to: 70, price: 6000 },
  { from: 70, to: 100, price: 15000 },
  { from: 100, to: 150, price: 50000 },
  { from: 150, to: 200, price: 150000 },
  { from: 200, to: 300, price: 500000 },
  { from: 300, to: 400, price: 2000000 },
  { from: 400, to: 500, price: 10000000 },
];

// 총 100종 물고기 (10개 지역 × 10마리씩)
// 각 지역: 일반 4마리, 희귀 3마리, 영웅 2마리, 전설/신화 1마리
export const FISH = [
  // 1. 잔잔한 호수 (lake) - 10마리
  { id: 'minnow', region: 'lake', name: '피라미', emoji: '🐟', rarity: 'common', minSize: 5, maxSize: 15, basePrice: 15, difficulty: 1, desc: '떼 지어 다니는 작은 물고기' },
  { id: 'crucian', region: 'lake', name: '붕어', emoji: '🐟', rarity: 'common', minSize: 10, maxSize: 30, basePrice: 20, difficulty: 1, desc: '호수에서 가장 흔한 물고기' },
  { id: 'mudfish', region: 'lake', name: '미꾸라지', emoji: '🪱', rarity: 'common', minSize: 8, maxSize: 22, basePrice: 25, difficulty: 1, desc: '진흙 속에 숨어 사는 미끄러운 친구' },
  { id: 'bluegill', region: 'lake', name: '블루길', emoji: '🐠', rarity: 'common', minSize: 12, maxSize: 28, basePrice: 30, difficulty: 1, desc: '호수 풀숲 주변을 맴돌아요' },
  { id: 'carp', region: 'lake', name: '잉어', emoji: '🐠', rarity: 'rare', minSize: 30, maxSize: 80, basePrice: 80, difficulty: 2, desc: '힘이 세고 오래 사는 물고기' },
  { id: 'bass', region: 'lake', name: '배스', emoji: '🐟', rarity: 'rare', minSize: 25, maxSize: 60, basePrice: 110, difficulty: 2, desc: '먹이를 낚아채는 민물의 강자' },
  { id: 'eel', region: 'lake', name: '민물장어', emoji: '🐍', rarity: 'rare', minSize: 40, maxSize: 90, basePrice: 160, difficulty: 2, desc: '원기 회복에 으뜸인 미끌미끌한 장어' },
  { id: 'catfish', region: 'lake', name: '메기', emoji: '🐟', rarity: 'epic', minSize: 40, maxSize: 120, basePrice: 250, difficulty: 3, desc: '수염으로 먹이를 찾는 밤의 사냥꾼' },
  { id: 'snakehead', region: 'lake', name: '가물치', emoji: '🐊', rarity: 'epic', minSize: 50, maxSize: 130, basePrice: 380, difficulty: 3, desc: '호수의 최상위 포식자 물고기' },
  { id: 'golden_carp', region: 'lake', name: '황금 잉어', emoji: '✨', rarity: 'legendary', minSize: 50, maxSize: 100, basePrice: 1200, difficulty: 4, desc: '보면 행운이 온다는 전설의 잉어' },

  // 2. 맑은 강 (river) - 10마리
  { id: 'dace', region: 'river', name: '갈겨니', emoji: '🐟', rarity: 'common', minSize: 10, maxSize: 20, basePrice: 35, difficulty: 1, desc: '맑은 물을 좋아하는 은빛 물고기' },
  { id: 'kkeokji', region: 'river', name: '꺽지', emoji: '🐟', rarity: 'common', minSize: 10, maxSize: 25, basePrice: 45, difficulty: 2, desc: '바위 틈에 숨어 사는 토종 물고기' },
  { id: 'pale_chub', region: 'river', name: '피라미 강돌이', emoji: '🐟', rarity: 'common', minSize: 8, maxSize: 18, basePrice: 40, difficulty: 1, desc: '여울을 거슬러 오르는 날쌘돌이' },
  { id: 'shiner', region: 'river', name: '쉬리', emoji: '🐠', rarity: 'common', minSize: 7, maxSize: 16, basePrice: 50, difficulty: 2, desc: '1급수 맑은 계곡에만 서식하는 귀한 물고기' },
  { id: 'mandarin_fish', region: 'river', name: '쏘가리', emoji: '🐠', rarity: 'rare', minSize: 20, maxSize: 50, basePrice: 180, difficulty: 2, desc: '표범 무늬를 가진 강의 왕' },
  { id: 'trout', region: 'river', name: '무지개송어', emoji: '🐟', rarity: 'rare', minSize: 25, maxSize: 65, basePrice: 240, difficulty: 3, desc: '영롱한 무지갯빛 줄무늬를 가졌어요' },
  { id: 'char', region: 'river', name: '열목어', emoji: '🐟', rarity: 'rare', minSize: 20, maxSize: 55, basePrice: 300, difficulty: 3, desc: '눈에 열이 많아 찬물만 찾는 신비한 어종' },
  { id: 'salmon', region: 'river', name: '연어', emoji: '🐟', rarity: 'epic', minSize: 50, maxSize: 100, basePrice: 500, difficulty: 3, desc: '태어난 강으로 거슬러 돌아오는 의지의 물고기' },
  { id: 'sweetfish', region: 'river', name: '황금 은어', emoji: '✨', rarity: 'epic', minSize: 18, maxSize: 35, basePrice: 650, difficulty: 4, desc: '수박 향이 솔솔 나는 맑은 물의 귀족' },
  { id: 'sturgeon', region: 'river', name: '철갑상어', emoji: '🦈', rarity: 'legendary', minSize: 100, maxSize: 250, basePrice: 2500, difficulty: 5, desc: '공룡 시대부터 살아온 살아있는 화석' },

  // 3. 푸른 바다 (sea) - 10마리
  { id: 'mackerel', region: 'sea', name: '고등어', emoji: '🐟', rarity: 'common', minSize: 20, maxSize: 40, basePrice: 60, difficulty: 2, desc: '등이 푸른 바다의 국민 생선' },
  { id: 'horse_mackerel', region: 'sea', name: '전갱이', emoji: '🐟', rarity: 'common', minSize: 15, maxSize: 35, basePrice: 55, difficulty: 2, desc: '무리 지어 빠르게 헤엄쳐요' },
  { id: 'sardine', region: 'sea', name: '정어리', emoji: '🐟', rarity: 'common', minSize: 12, maxSize: 28, basePrice: 50, difficulty: 1, desc: '바다 생태계의 풍요로운 영양원' },
  { id: 'anchovy_king', region: 'sea', name: '대왕멸치', emoji: '🐟', rarity: 'common', minSize: 10, maxSize: 22, basePrice: 70, difficulty: 2, desc: '놀라울 정도로 큼직한 멸치 우두머리' },
  { id: 'sea_bream', region: 'sea', name: '참돔', emoji: '🐠', rarity: 'rare', minSize: 25, maxSize: 60, basePrice: 300, difficulty: 3, desc: '분홍빛이 아름다운 바다의 여왕' },
  { id: 'flounder', region: 'sea', name: '넙치', emoji: '🐡', rarity: 'rare', minSize: 30, maxSize: 70, basePrice: 350, difficulty: 3, desc: '모래 바닥에 완벽히 위장하고 누워있어요' },
  { id: 'rockfish', region: 'sea', name: '우럭', emoji: '🐟', rarity: 'rare', minSize: 20, maxSize: 50, basePrice: 400, difficulty: 3, desc: '암초 지대를 지키는 묵직한 바다 친구' },
  { id: 'tuna', region: 'sea', name: '참치', emoji: '🐟', rarity: 'epic', minSize: 100, maxSize: 250, basePrice: 1100, difficulty: 4, desc: '쉬지 않고 헤엄치는 바다의 탄환' },
  { id: 'yellowtail', region: 'sea', name: '대방어', emoji: '🐟', rarity: 'epic', minSize: 60, maxSize: 140, basePrice: 1300, difficulty: 4, desc: '겨울철 기름이 좔좔 흐르는 힘센 방어' },
  { id: 'marlin', region: 'sea', name: '돛새치', emoji: '🗡️', rarity: 'legendary', minSize: 150, maxSize: 350, basePrice: 4800, difficulty: 5, desc: '바다에서 가장 빠른 뾰족부리의 사냥꾼' },

  // 4. 심해 협곡 (abyss) - 10마리
  { id: 'monkfish', region: 'abyss', name: '아귀', emoji: '🐡', rarity: 'common', minSize: 30, maxSize: 80, basePrice: 180, difficulty: 3, desc: '입이 엄청 큰 바닥의 대식가 물고기' },
  { id: 'squid', region: 'abyss', name: '오징어', emoji: '🦑', rarity: 'common', minSize: 20, maxSize: 60, basePrice: 150, difficulty: 3, desc: '먹물을 뿜고 빠르게 도망쳐요' },
  { id: 'cutlass', region: 'abyss', name: '심해 갈치', emoji: '🗡️', rarity: 'common', minSize: 50, maxSize: 130, basePrice: 200, difficulty: 3, desc: '은빛 칼날처럼 서서 헤엄치는 물고기' },
  { id: 'blobfish', region: 'abyss', name: '블롭피쉬', emoji: '🫠', rarity: 'common', minSize: 15, maxSize: 35, basePrice: 220, difficulty: 2, desc: '깊은 수압을 견디는 젤리 같은 친구' },
  { id: 'giant_octopus', region: 'abyss', name: '대왕문어', emoji: '🐙', rarity: 'rare', minSize: 100, maxSize: 300, basePrice: 750, difficulty: 4, desc: '여덟 다리로 바위를 꽉 붙잡아요' },
  { id: 'vampire_squid', region: 'abyss', name: '흡혈오징어', emoji: '🦑', rarity: 'rare', minSize: 15, maxSize: 40, basePrice: 900, difficulty: 4, desc: '망토 같은 다리를 펼치며 발광해요' },
  { id: 'gulper_eel', region: 'abyss', name: '풍선장어', emoji: '🐍', rarity: 'rare', minSize: 60, maxSize: 180, basePrice: 1100, difficulty: 4, desc: '자기 몸보다 큰 먹이도 삼키는 거대한 입' },
  { id: 'anglerfish', region: 'abyss', name: '초롱아귀', emoji: '🏮', rarity: 'epic', minSize: 20, maxSize: 50, basePrice: 1800, difficulty: 4, desc: '머리 위 등불로 캄캄한 심해를 밝혀요' },
  { id: 'coelacanth', region: 'abyss', name: '실러캔스', emoji: '🐟', rarity: 'epic', minSize: 80, maxSize: 200, basePrice: 2600, difficulty: 5, desc: '수억 년 전 모습을 그대로 간직한 전설의 고대어' },
  { id: 'whale_shark', region: 'abyss', name: '심해 고래상어', emoji: '🐋', rarity: 'legendary', minSize: 400, maxSize: 1200, basePrice: 12000, difficulty: 5, desc: '심해 협곡의 심연을 지배하는 거대한 군주' },

  // 5. 극지 빙하 (glacier) - 10마리
  { id: 'icefish', region: 'glacier', name: '빙어', emoji: '🐟', rarity: 'common', minSize: 8, maxSize: 18, basePrice: 250, difficulty: 3, desc: '투명하고 차가운 얼음물에 사는 물고기' },
  { id: 'polar_cod', region: 'glacier', name: '북극대구', emoji: '🐟', rarity: 'common', minSize: 25, maxSize: 50, basePrice: 320, difficulty: 3, desc: '영하의 수온에서도 헤엄치는 대구' },
  { id: 'arctic_smelt', region: 'glacier', name: '설원 은어', emoji: '🐟', rarity: 'common', minSize: 10, maxSize: 22, basePrice: 290, difficulty: 3, desc: '눈 덮인 빙판 밑에서 반짝여요' },
  { id: 'glacier_crab', region: 'glacier', name: '스노우 킹크랩', emoji: '🦀', rarity: 'common', minSize: 30, maxSize: 70, basePrice: 380, difficulty: 3, desc: '단단한 얼음 껍질을 지닌 극한의 게' },
  { id: 'king_icefish', region: 'glacier', name: '빙어왕', emoji: '🐠', rarity: 'rare', minSize: 30, maxSize: 70, basePrice: 1200, difficulty: 4, desc: '빙하 동굴 깊은 곳의 푸른빛 제왕' },
  { id: 'greenland_shark', region: 'glacier', name: '그린란드 상어', emoji: '🦈', rarity: 'rare', minSize: 200, maxSize: 500, basePrice: 1600, difficulty: 4, desc: '수백 년을 천천히 유영하는 장수의 상징' },
  { id: 'narwhal', region: 'glacier', name: '일각고래', emoji: '🦄', rarity: 'rare', minSize: 250, maxSize: 500, basePrice: 2200, difficulty: 4, desc: '이마에 긴 나선형 뿔을 가진 바다의 유니콘' },
  { id: 'leopard_seal', region: 'glacier', name: '얼음표범물범', emoji: '🦭', rarity: 'epic', minSize: 120, maxSize: 280, basePrice: 3800, difficulty: 5, desc: '얼음 위를 미끄러지는 날렵한 사냥꾼' },
  { id: 'aurora_whale', region: 'glacier', name: '오로라 돌고래', emoji: '🐬', rarity: 'epic', minSize: 150, maxSize: 320, basePrice: 5000, difficulty: 5, desc: '극지의 오로라 빛을 몸에 머금고 헤엄쳐요' },
  { id: 'white_whale', region: 'glacier', name: '북극 백사자고래', emoji: '🐳', rarity: 'legendary', minSize: 350, maxSize: 900, basePrice: 25000, difficulty: 5, desc: '빙하 세계의 노래하는 하얀 거인' },

  // 6. 신비한 용궁 (palace) - 10마리
  { id: 'seahorse', region: 'palace', name: '용궁 해마', emoji: '🐡', rarity: 'common', minSize: 10, maxSize: 25, basePrice: 600, difficulty: 3, desc: '용궁의 문지기 역할을 하는 해마' },
  { id: 'pearl_clam', region: 'palace', name: '여의주 조개', emoji: '🦪', rarity: 'common', minSize: 20, maxSize: 45, basePrice: 750, difficulty: 4, desc: '영롱한 여의주 빛 진주를 품은 조개' },
  { id: 'coral_fish', region: 'palace', name: '산호 나비고기', emoji: '🐠', rarity: 'common', minSize: 12, maxSize: 28, basePrice: 700, difficulty: 3, desc: '용궁 정원의 아름다운 산호초를 가꿔요' },
  { id: 'lantern_crab', region: 'palace', name: '궁궐 보물게', emoji: '🦀', rarity: 'common', minSize: 20, maxSize: 40, basePrice: 850, difficulty: 3, desc: '반짝이는 금은보화를 등에 짊어진 게' },
  { id: 'palace_carp', region: 'palace', name: '비단잉어', emoji: '🐠', rarity: 'rare', minSize: 40, maxSize: 95, basePrice: 2800, difficulty: 4, desc: '오색 비단옷을 입은 듯 화려한 궁중 잉어' },
  { id: 'mantis_shrimp', region: 'palace', name: '용궁 수호새우', emoji: '🦐', rarity: 'rare', minSize: 15, maxSize: 35, basePrice: 3400, difficulty: 4, desc: '번개 같은 펀치로 바위도 부수는 호위무사' },
  { id: 'goldfish_princess', region: 'palace', name: '금붕어 공주', emoji: '👑', rarity: 'rare', minSize: 20, maxSize: 50, basePrice: 4200, difficulty: 4, desc: '우아한 비늘 지느러미를 흩날려요' },
  { id: 'palace_turtle', region: 'palace', name: '용궁 거북이', emoji: '🐢', rarity: 'epic', minSize: 80, maxSize: 200, basePrice: 8500, difficulty: 5, desc: '천 년의 지혜를 품고 용궁을 수호해요' },
  { id: 'king_crab_general', region: 'palace', name: '해룡 장군', emoji: '🐉', rarity: 'epic', minSize: 150, maxSize: 350, basePrice: 12000, difficulty: 5, desc: '용궁 군대를 지휘하는 위엄 넘치는 장군' },
  { id: 'blue_dragon', region: 'palace', name: '동해 청룡', emoji: '🐲', rarity: 'legendary', minSize: 500, maxSize: 1500, basePrice: 65000, difficulty: 5, desc: '여의주를 물고 승천하는 전설의 수룡' },

  // 7. 우주 성운 해구 (nebula) - 10마리
  { id: 'star_fish', region: 'nebula', name: '별조각 물고기', emoji: '⭐', rarity: 'common', minSize: 15, maxSize: 35, basePrice: 1400, difficulty: 4, desc: '부서진 소행성의 별빛을 먹고 자라요' },
  { id: 'plasma_jelly', region: 'nebula', name: '플라즈마 해파리', emoji: '🪼', rarity: 'common', minSize: 30, maxSize: 80, basePrice: 1700, difficulty: 4, desc: '전기 에너지를 뿜으며 성운을 유영해요' },
  { id: 'cosmic_shrimp', region: 'nebula', name: '성운 크릴', emoji: '🦐', rarity: 'common', minSize: 10, maxSize: 25, basePrice: 1500, difficulty: 3, desc: '은하수 구름 사이를 떼 지어 비행해요' },
  { id: 'starlight_squid', region: 'nebula', name: '성광 오징어', emoji: '🦑', rarity: 'common', minSize: 25, maxSize: 60, basePrice: 1900, difficulty: 4, desc: '빛의 광선으로 먹이를 감싸 포획해요' },
  { id: 'meteor_ray', region: 'nebula', name: '유성 가오리', emoji: '🛸', rarity: 'rare', minSize: 80, maxSize: 220, basePrice: 6500, difficulty: 5, desc: '혜성의 꼬리를 따라 비행하는 가오리' },
  { id: 'supernova_fish', region: 'nebula', name: '초신성 엔젤피쉬', emoji: '✨', rarity: 'rare', minSize: 35, maxSize: 85, basePrice: 8000, difficulty: 5, desc: '별이 폭발할 때 태어난 영롱한 빛의 물고기' },
  { id: 'blackhole_eel', region: 'nebula', name: '암흑 성운 곰치', emoji: '🌌', rarity: 'rare', minSize: 100, maxSize: 260, basePrice: 10000, difficulty: 5, desc: '빛조차 빨아들이는 중력을 뿜어내요' },
  { id: 'galaxy_whale', region: 'nebula', name: '은하 고래', emoji: '🐋', rarity: 'epic', minSize: 600, maxSize: 1800, basePrice: 24000, difficulty: 5, desc: '은하수를 품고 우주의 심연을 헤엄쳐요' },
  { id: 'pulsar_beast', region: 'nebula', name: '펄서 드래곤', emoji: '🐲', rarity: 'epic', minSize: 400, maxSize: 1100, basePrice: 35000, difficulty: 5, desc: '주기적으로 거대한 전자기파를 내뿜어요' },
  { id: 'cosmic_leviathan', region: 'nebula', name: '코스믹 리바이어던', emoji: '👾', rarity: 'legendary', minSize: 1000, maxSize: 3000, basePrice: 180000, difficulty: 5, desc: '시공간의 균열을 다스리는 우주 최강의 존재' },

  // 8. 용암 분화호 (volcano) - 10마리 (신화 등급 등장!)
  { id: 'magma_guppy', region: 'volcano', name: '마그마 송사리', emoji: '🔥', rarity: 'common', minSize: 10, maxSize: 25, basePrice: 3000, difficulty: 4, desc: '1000도 이상의 쇳물에서도 헤엄쳐요' },
  { id: 'ember_crab', region: 'volcano', name: '화염 바위게', emoji: '🦀', rarity: 'common', minSize: 20, maxSize: 50, basePrice: 3800, difficulty: 4, desc: '등껍질에 숯불을 피우고 다니는 단단한 게' },
  { id: 'lava_eel', region: 'volcano', name: '용암 장어', emoji: '🐍', rarity: 'common', minSize: 50, maxSize: 140, basePrice: 4500, difficulty: 4, desc: '펄펄 끓는 용암류를 거슬러 올라가요' },
  { id: 'ash_puffer', region: 'volcano', name: '화산재 복어', emoji: '🐡', rarity: 'common', minSize: 25, maxSize: 60, basePrice: 4200, difficulty: 4, desc: '놀라면 뜨거운 유황 가스를 뿜어 부풀어요' },
  { id: 'obsidian_carp', region: 'volcano', name: '흑요석 잉어', emoji: '🖤', rarity: 'rare', minSize: 40, maxSize: 100, basePrice: 15000, difficulty: 5, desc: '검게 굳은 흑요석처럼 매끄럽고 단단한 비늘' },
  { id: 'flame_tuna', region: 'volcano', name: '불꽃 다랑어', emoji: '🐟', rarity: 'rare', minSize: 80, maxSize: 200, basePrice: 19000, difficulty: 5, desc: '수면에 불길을 일으키며 쾌속 질주해요' },
  { id: 'inferno_octopus', region: 'volcano', name: '지옥불 문어', emoji: '🐙', rarity: 'rare', minSize: 100, maxSize: 300, basePrice: 24000, difficulty: 5, desc: '다리마다 화염 채찍을 휘두르는 문어' },
  { id: 'magma_shark', region: 'volcano', name: '마그마 메갈로돈', emoji: '🦈', rarity: 'epic', minSize: 300, maxSize: 800, basePrice: 60000, difficulty: 5, desc: '화산 분화구를 삼킬 듯한 거대한 불의 상어' },
  { id: 'salamander_king', region: 'volcano', name: '불도롱뇽 대공', emoji: '🦎', rarity: 'epic', minSize: 150, maxSize: 400, basePrice: 85000, difficulty: 5, desc: '불길 속에서만 부활하는 정령 군주' },
  { id: 'phoenix_leviathan', region: 'volcano', name: '불사조 레비아탄', emoji: '🔥', rarity: 'mythic', minSize: 800, maxSize: 2500, basePrice: 500000, difficulty: 5, desc: '🔥[신화] 타오르는 화염 속에서 영원히 불멸하는 대지의 화신' },

  // 9. 시간의 틈새 해저 (timewarp) - 10마리
  { id: 'clockwork_fish', region: 'timewarp', name: '태엽 물고기', emoji: '⚙️', rarity: 'common', minSize: 15, maxSize: 40, basePrice: 8000, difficulty: 4, desc: '째깍째깍 소리를 내며 시간을 되감아요' },
  { id: 'past_dunkle', region: 'timewarp', name: '고대 둔클레오', emoji: '🐟', rarity: 'common', minSize: 50, maxSize: 120, basePrice: 10000, difficulty: 5, desc: '선사 시대 갑주 어류가 시간의 틈새로 넘어왔어요' },
  { id: 'future_drone_fish', region: 'timewarp', name: '사이버 드론어', emoji: '🤖', rarity: 'common', minSize: 20, maxSize: 50, basePrice: 9500, difficulty: 4, desc: '먼 미래에서 시간 여행을 온 기계 생명체' },
  { id: 'chrono_squid', region: 'timewarp', name: '타임 오징어', emoji: '🦑', rarity: 'common', minSize: 30, maxSize: 70, basePrice: 11000, difficulty: 4, desc: '먹물 대신 과거의 잔상을 뿜어내요' },
  { id: 'hourglass_ray', region: 'timewarp', name: '모래시계 가오리', emoji: '⏳', rarity: 'rare', minSize: 70, maxSize: 180, basePrice: 38000, difficulty: 5, desc: '날갯짓 한 번에 1초씩 시간이 정지해요' },
  { id: 'paradox_jelly', region: 'timewarp', name: '패러독스 해파리', emoji: '🪼', rarity: 'rare', minSize: 40, maxSize: 100, basePrice: 48000, difficulty: 5, desc: '원인과 결과가 뒤섞인 다차원 해파리' },
  { id: 'dimension_eel', region: 'timewarp', name: '차원 도약 장어', emoji: '🐍', rarity: 'rare', minSize: 80, maxSize: 220, basePrice: 60000, difficulty: 5, desc: '공간을 순간이동하며 낚시 바늘을 따돌려요' },
  { id: 'ancient_mosasaur', region: 'timewarp', name: '시공의 모사사우루스', emoji: '🐊', rarity: 'epic', minSize: 500, maxSize: 1500, basePrice: 160000, difficulty: 5, desc: '백악기 바다를 호령하던 절대 포식자의 귀환' },
  { id: 'future_mecha_whale', region: 'timewarp', name: '메카 타이탄 고래', emoji: '🚀', rarity: 'epic', minSize: 800, maxSize: 2400, basePrice: 240000, difficulty: 5, desc: '미래 문명의 양자 엔진을 탑재한 강철 고래' },
  { id: 'chronos_dragon', region: 'timewarp', name: '시간의 지배자 크로노스', emoji: '⌛', rarity: 'mythic', minSize: 1200, maxSize: 3500, basePrice: 1500000, difficulty: 5, desc: '⌛[신화] 모든 흐르는 시간을 멈추고 되돌릴 수 있는 차원의 신' },

  // 10. 천상 유원지 (sky_ocean) - 10마리 (최종 종결 지역)
  { id: 'cloud_guppy', region: 'sky_ocean', name: '뭉게구름 송사리', emoji: '☁️', rarity: 'common', minSize: 15, maxSize: 35, basePrice: 20000, difficulty: 4, desc: '폭신폭신한 솜사탕 구름 속을 날아다녀요' },
  { id: 'rainbow_tetra', region: 'sky_ocean', name: '무지개빛 테트라', emoji: '🌈', rarity: 'common', minSize: 20, maxSize: 45, basePrice: 26000, difficulty: 4, desc: '하늘에 뜬 무지개를 조각조각 먹고 자라요' },
  { id: 'feather_fish', region: 'sky_ocean', name: '천사의 날개치', emoji: '🪽', rarity: 'common', minSize: 30, maxSize: 70, basePrice: 32000, difficulty: 5, desc: '새하얀 날개 지느러미로 바람을 타요' },
  { id: 'sunlight_ray', region: 'sky_ocean', name: '햇살 가오리', emoji: '☀️', rarity: 'common', minSize: 60, maxSize: 150, basePrice: 38000, difficulty: 5, desc: '따스한 태양빛을 모아 하늘 바다를 비춰요' },
  { id: 'valkyrie_salmon', region: 'sky_ocean', name: '발키리 연어', emoji: '⚔️', rarity: 'rare', minSize: 70, maxSize: 180, basePrice: 110000, difficulty: 5, desc: '빛의 폭포수를 거슬러 천상으로 올라온 연어' },
  { id: 'pegasus_seahorse', region: 'sky_ocean', name: '페가수스 해마', emoji: '🦄', rarity: 'rare', minSize: 40, maxSize: 110, basePrice: 140000, difficulty: 5, desc: '천상의 날개를 달고 은하수를 질주해요' },
  { id: 'seraphim_jelly', region: 'sky_ocean', name: '세라핌 치천사 해파리', emoji: '🪼', rarity: 'rare', minSize: 60, maxSize: 160, basePrice: 180000, difficulty: 5, desc: '여섯 개의 빛의 날개를 펼쳐 축복을 내려요' },
  { id: 'eden_serpent', region: 'sky_ocean', name: '낙원의 비단구렁이', emoji: '🐍', rarity: 'epic', minSize: 400, maxSize: 1200, basePrice: 450000, difficulty: 5, desc: '천상 정원의 생명나무 아래를 지키는 영물' },
  { id: 'heavenly_phoenix', region: 'sky_ocean', name: '천상 봉황어', emoji: '🦚', rarity: 'epic', minSize: 300, maxSize: 900, basePrice: 650000, difficulty: 5, desc: '오색 깃털을 휘날리며 은빛 비를 내려줘요' },
  { id: 'celestial_yggdrasil', region: 'sky_ocean', name: '신화의 창조주 오메가', emoji: '🌌', rarity: 'mythic', minSize: 2000, maxSize: 5000, basePrice: 5000000, difficulty: 5, desc: '🌌[초월 신화] 우주와 천상 모든 낚시터의 시작과 끝을 관장하는 신' },

  // 11. 차원 왜곡 균열 (rift) - 10마리
  { id: 'glitch_minnow', region: 'rift', name: '글리치 송사리', emoji: '👾', rarity: 'common', minSize: 15, maxSize: 35, basePrice: 45000, difficulty: 4, desc: '데이터 오류처럼 깜빡이며 좌표를 이동해요' },
  { id: 'pixel_plankton', region: 'rift', name: '네온 픽셀어', emoji: '🟩', rarity: 'common', minSize: 20, maxSize: 45, basePrice: 55000, difficulty: 4, desc: '8비트 레트로 비주얼로 빛나는 차원 생명체' },
  { id: 'parallel_carp', region: 'rift', name: '평행세계 붕어', emoji: '🐟', rarity: 'common', minSize: 25, maxSize: 60, basePrice: 65000, difficulty: 5, desc: '다른 차원의 나를 마주보고 헤엄쳐요' },
  { id: 'quantum_tetra', region: 'rift', name: '양자 중첩 피라미', emoji: '⚛️', rarity: 'common', minSize: 20, maxSize: 50, basePrice: 75000, difficulty: 5, desc: '관측하기 전까지는 위치를 알 수 없어요' },
  { id: 'rift_manta', region: 'rift', name: '차원 도약 가오리', emoji: '🛸', rarity: 'rare', minSize: 80, maxSize: 200, basePrice: 220000, difficulty: 5, desc: '공간의 균열을 접어서 순식간에 워프해요' },
  { id: 'gravity_invert_fish', region: 'rift', name: '반중력 갈치', emoji: '🗡️', rarity: 'rare', minSize: 70, maxSize: 180, basePrice: 280000, difficulty: 5, desc: '물속에서 거꾸로 서서 하늘로 솟구쳐요' },
  { id: 'void_puffer', region: 'rift', name: '공허 복어', emoji: '🕳️', rarity: 'rare', minSize: 40, maxSize: 90, basePrice: 350000, difficulty: 5, desc: '부풀어 오르면 주변 빛을 집어삼켜요' },
  { id: 'mobius_eel', region: 'rift', name: '뫼비우스 뱀장어', emoji: '♾️', rarity: 'epic', minSize: 120, maxSize: 300, basePrice: 900000, difficulty: 5, desc: '시작과 끝이 연결된 무한 루프의 장어' },
  { id: 'hyperspace_whale', region: 'rift', name: '초공간 아성체 고래', emoji: '🐋', rarity: 'epic', minSize: 600, maxSize: 1800, basePrice: 1400000, difficulty: 5, desc: '4차원 공간을 뚫고 노래를 부르는 고래' },
  { id: 'rift_nebula_dragon', region: 'rift', name: '차원 붕괴의 네뷸라 드래곤', emoji: '🐲', rarity: 'mythic', minSize: 1500, maxSize: 4500, basePrice: 9000000, difficulty: 5, desc: '🌌[신화] 차원의 벽을 산산조각 내며 강림하는 균열의 수호룡' },

  // 12. 사건의 지평선 (horizon) - 10마리
  { id: 'dark_matter_smelt', region: 'horizon', name: '암흑물질 빙어', emoji: '🖤', rarity: 'common', minSize: 15, maxSize: 40, basePrice: 90000, difficulty: 5, desc: '우주의 95%를 채우는 미지의 질량으로 된 빙어' },
  { id: 'gamma_anchovy', region: 'horizon', name: '감마선 멸치', emoji: '⚡', rarity: 'common', minSize: 15, maxSize: 35, basePrice: 110000, difficulty: 5, desc: '초신성 폭발의 고에너지 감마선을 내뿜어요' },
  { id: 'tachyon_sardine', region: 'horizon', name: '타키온 정어리', emoji: '💫', rarity: 'common', minSize: 20, maxSize: 45, basePrice: 130000, difficulty: 5, desc: '빛보다 빠르게 헤엄쳐 과거로 가버려요' },
  { id: 'graviton_octopus', region: 'horizon', name: '중력자 문어', emoji: '🐙', rarity: 'common', minSize: 80, maxSize: 220, basePrice: 160000, difficulty: 5, desc: '여덟 개의 촉수로 중력장을 비틀어요' },
  { id: 'accretion_angler', region: 'horizon', name: '강착원반 아귀', emoji: '🐡', rarity: 'rare', minSize: 70, maxSize: 180, basePrice: 480000, difficulty: 5, desc: '이마의 미끼가 블랙홀로 빨려 들어가는 빛이에요' },
  { id: 'antimatter_jelly', region: 'horizon', name: '반물질 해파리', emoji: '🪼', rarity: 'rare', minSize: 50, maxSize: 130, basePrice: 600000, difficulty: 5, desc: '물질과 접촉하면 쌍소멸 에너지를 터뜨려요' },
  { id: 'quasar_ray', region: 'horizon', name: '퀘이사 가오리', emoji: '✨', rarity: 'rare', minSize: 100, maxSize: 280, basePrice: 750000, difficulty: 5, desc: '수천억 개의 별보다 밝은 빛줄기를 뿜어요' },
  { id: 'whitehole_shark', region: 'horizon', name: '화이트홀 분출 상어', emoji: '🦈', rarity: 'epic', minSize: 400, maxSize: 1100, basePrice: 2200000, difficulty: 5, desc: '모든 물질을 끝없이 뱉어내는 화이트홀의 정점' },
  { id: 'singularity_serpent', region: 'horizon', name: '특이점 우주구렁이', emoji: '🐍', rarity: 'epic', minSize: 600, maxSize: 1600, basePrice: 3200000, difficulty: 5, desc: '밀도가 무한대인 중심핵에 똬리를 틀고 있어요' },
  { id: 'blackhole_leviathan', region: 'horizon', name: '종말의 블랙홀 리바이어던', emoji: '🕳️', rarity: 'mythic', minSize: 2500, maxSize: 7000, basePrice: 20000000, difficulty: 5, desc: '🕳️[신화] 빛조차 탈출할 수 없는 사건의 지평선 최심부의 절대신' },

  // 13. 아틀란티스 신전 (atlantis) - 10마리
  { id: 'ancient_gear_fish', region: 'atlantis', name: '황금 태엽 나비어', emoji: '⚙️', rarity: 'common', minSize: 20, maxSize: 50, basePrice: 180000, difficulty: 5, desc: '초고대 황금 합금으로 제작된 자율 헤엄 기계' },
  { id: 'orichalcum_tetra', region: 'atlantis', name: '오리하르콘 테트라', emoji: '🪙', rarity: 'common', minSize: 25, maxSize: 55, basePrice: 220000, difficulty: 5, desc: '영원히 녹슬지 않는 전설의 금속 비늘' },
  { id: 'temple_stone_carp', region: 'atlantis', name: '신전 수호 석조잉어', emoji: '🗿', rarity: 'common', minSize: 40, maxSize: 90, basePrice: 260000, difficulty: 5, desc: '신전 기둥 조각상이 생명을 얻어 헤엄쳐요' },
  { id: 'hydro_crystal_puffer', region: 'atlantis', name: '수경 크리스탈 복어', emoji: '💎', rarity: 'common', minSize: 30, maxSize: 70, basePrice: 300000, difficulty: 5, desc: '수백만 년 동안 수압을 견디며 다이아몬드가 된 복어' },
  { id: 'poseidon_trout', region: 'atlantis', name: '포세이돈의 은빛 송어', emoji: '🐟', rarity: 'rare', minSize: 60, maxSize: 150, basePrice: 1100000, difficulty: 5, desc: '바다의 신의 축복을 받은 성스러운 송어' },
  { id: 'sentinel_crab', region: 'atlantis', name: '센티널 아틀라스 바위게', emoji: '🦀', rarity: 'rare', minSize: 80, maxSize: 200, basePrice: 1400000, difficulty: 5, desc: '고대 신전의 보물창고 문을 지키는 기계 게' },
  { id: 'trident_swordfish', region: 'atlantis', name: '삼지창 황금 황새치', emoji: '🔱', rarity: 'rare', minSize: 120, maxSize: 320, basePrice: 1800000, difficulty: 5, desc: '부리가 삼지창 형태로 진화한 신전의 경비병' },
  { id: 'colossus_sea_turtle', region: 'atlantis', name: '아틀란티스 거신 현무', emoji: '🐢', rarity: 'epic', minSize: 400, maxSize: 1200, basePrice: 5500000, difficulty: 5, desc: '등 위에 침몰한 신전의 누각을 짊어진 고대 거북' },
  { id: 'mecha_kraken_core', region: 'atlantis', name: '고대병기 프로토 크라켄', emoji: '🤖', rarity: 'epic', minSize: 800, maxSize: 2500, basePrice: 8000000, difficulty: 5, desc: '아틀란티스 문명이 남긴 궁극의 해저 결전 병기' },
  { id: 'atlantis_god_emperor', name: '해신 아틀란티스 황제룡', region: 'atlantis', emoji: '🏛️', rarity: 'mythic', minSize: 3000, maxSize: 8888, basePrice: 50000000, difficulty: 5, desc: '🏛️[신화] 잃어버린 문명의 영원한 영광을 수호하는 해저의 신' },

  // 14. 시간의 태엽 나선 (chronos) - 10마리
  { id: 'triassic_coelacanth', region: 'chronos', name: '트라이아스 실러캔스', emoji: '🐟', rarity: 'common', minSize: 30, maxSize: 80, basePrice: 380000, difficulty: 5, desc: '공룡보다 먼저 지구에 나타났던 고대 어류' },
  { id: 'amber_dunkle', region: 'chronos', name: '호박 화석 둔클레오', emoji: '🪨', rarity: 'common', minSize: 50, maxSize: 130, basePrice: 45000, difficulty: 5, desc: '단단한 호박 보석 속에 갇혔다가 풀려났어요' },
  { id: 'gear_jellyfish', region: 'chronos', name: '태엽 시간 해파리', emoji: '⚙️', rarity: 'common', minSize: 35, maxSize: 80, basePrice: 550000, difficulty: 5, desc: '째깍째깍 초침을 돌리며 유영하는 해파리' },
  { id: 'paradox_salmon', region: 'chronos', name: '시간 역행 황금연어', emoji: '🐟', rarity: 'common', minSize: 40, maxSize: 100, basePrice: 650000, difficulty: 5, desc: '미래에서 태어나 과거로 거슬러 올라가요' },
  { id: 'pleiosaur_ray', region: 'chronos', name: '수장룡 지느러미 가오리', emoji: '🦕', rarity: 'rare', minSize: 120, maxSize: 300, basePrice: 2500000, difficulty: 5, desc: '쥐라기 바다 파충류의 유전자를 간직한 대형 가오리' },
  { id: 'time_capsule_eel', region: 'chronos', name: '타임캡슐 메탈 장어', emoji: '🐍', rarity: 'rare', minSize: 100, maxSize: 250, basePrice: 3200000, difficulty: 5, desc: '서기 4000년의 역사 기록을 몸에 담고 있어요' },
  { id: 'infinite_spiral_nautilus', region: 'chronos', name: '황금 나선 앵무조개', emoji: '🐚', rarity: 'rare', minSize: 50, maxSize: 140, basePrice: 4000000, difficulty: 5, desc: '피보나치 황금 나선으로 시공간을 왜곡해요' },
  { id: 'mecha_megalodon_x', region: 'chronos', name: '사이버 메갈로돈 제로', emoji: '🦈', rarity: 'epic', minSize: 700, maxSize: 2000, basePrice: 12000000, difficulty: 5, desc: '선사시대 상어 화석에 나노머신이 융합된 궁극 괴수' },
  { id: 'chrono_titan_whale', region: 'chronos', name: '세월의 나한 백경', emoji: '🐋', rarity: 'epic', minSize: 1500, maxSize: 400, basePrice: 18000000, difficulty: 5, desc: '등에 영원의 모래시계를 짊어지고 시간을 유영해요' },
  { id: 'primordial_chronos_god', region: 'chronos', name: '시간의 절대주신 크로노스', emoji: '⌛', rarity: 'mythic', minSize: 4000, maxSize: 9999, basePrice: 120000000, difficulty: 5, desc: '⌛[신화] 과거, 현재, 미래 모든 차원의 흐름을 지배하는 태초신' },

  // 15. 창세의 에테르 성소 (genesis) - 10마리 (궁극 종결)
  { id: 'primordial_amoeba', region: 'genesis', name: '창세의 프리즘 송사리', emoji: '✨', rarity: 'common', minSize: 20, maxSize: 50, basePrice: 800000, difficulty: 5, desc: '우주 최초의 물 한 방울에서 피어난 생명체' },
  { id: 'life_spark_tetra', region: 'genesis', name: '생명 불꽃 테트라', emoji: '🌟', rarity: 'common', minSize: 25, maxSize: 60, basePrice: 1000000, difficulty: 5, desc: '비늘 하나하나가 작은 은하처럼 반짝여요' },
  { id: 'holy_light_guppy', region: 'genesis', name: '신성 광휘 구피', emoji: '🕊️', rarity: 'common', minSize: 30, maxSize: 70, basePrice: 1200000, difficulty: 5, desc: '순백의 신성한 빛으로 주변을 정화해요' },
  { id: 'aether_butterfly_fish', region: 'genesis', name: '에테르 황금나비치', emoji: '🦋', rarity: 'common', minSize: 35, maxSize: 80, basePrice: 1500000, difficulty: 5, desc: '날갯짓마다 별가루를 흩뿌리는 천상 나비 물고기' },
  { id: 'celestial_phoenix_carp', region: 'genesis', name: '오로라 불멸 잉어', emoji: '🎏', rarity: 'rare', minSize: 100, maxSize: 250, basePrice: 6000000, difficulty: 5, desc: '에테르 분수 속에서 끝없이 부활하는 성스러운 잉어' },
  { id: 'sanctuary_archon_ray', region: 'genesis', name: '집정관 아르콘 가오리', emoji: '🪽', rarity: 'rare', minSize: 150, maxSize: 400, basePrice: 8000000, difficulty: 5, desc: '성소의 옥좌 주변을 순찰하는 천사 가오리' },
  { id: 'eden_golden_salmon', region: 'genesis', name: '에덴의 순금 연어', emoji: '👑', rarity: 'rare', minSize: 90, maxSize: 240, basePrice: 10000000, difficulty: 5, desc: '생명의 강 최초의 상류에서만 산란하는 순금 연어' },
  { id: 'world_tree_leviathan', region: 'genesis', name: '세계수 뿌리 레비아탄', emoji: '🌳', rarity: 'epic', minSize: 2000, maxSize: 5000, basePrice: 35000000, difficulty: 5, desc: '우주를 떠받치는 이그드라실의 뿌리를 지키는 영물' },
  { id: 'seraphim_omega_whale', region: 'genesis', name: '치천사 오메가 세라프', emoji: '🪽', rarity: 'epic', minSize: 3000, maxSize: 8000, basePrice: 60000000, difficulty: 5, desc: '열두 장의 날개를 펼치고 창세의 성가를 부르는 고래' },
  { id: 'genesis_supreme_ouroboros', region: 'genesis', name: '궁극 창조신 인피니티 우로보로스', emoji: '♾️', rarity: 'mythic', minSize: 5000, maxSize: 99999, basePrice: 300000000, difficulty: 5, desc: '♾️[궁극 초월] 온 우주 만물의 시작이자 영원한 무한을 상징하는 전지전능 창조신' },
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

// 해양 쓰레기 및 정화 센터 보상 정의
export const TRASH_ITEMS = [
  { id: 'old_boot', name: '오래된 장화', emoji: '🥾', point: 10, desc: '누군가 버린 낡은 고무장화' },
  { id: 'rusty_can', name: '찌그러진 깡통', emoji: '🥫', point: 8, desc: '바다에 떠돌던 통조림 캔' },
  { id: 'torn_net', name: '찢어진 폐그물', emoji: '🕸️', point: 15, desc: '산호초를 위협하던 플라스틱 그물' },
  { id: 'plastic_bottle', name: '페트병', emoji: '🍾', point: 12, desc: '바다거북이를 괴롭히던 플라스틱 병' },
];

export const ECO_SHOP = {
  eco_rod: { id: 'eco_rod', name: '자연의 수호자 에코 낚싯대', emoji: '🌿', reqPoint: 50, desc: '해양 쓰레기 50개를 정화하여 얻은 청정 대나무 낚싯대. 조준각 +10° 보너스!' },
  eco_bait: { id: 'eco_bait', name: '생분해 친환경 미끼 (20개)', emoji: '🌱', reqPoint: 20, desc: '바다를 오염시키지 않는 천연 효모 미끼' },
};

// 행운의 황금 복권 티어 및 당첨 테이블
export const LOTTERY_TIERS = [
  { rank: 1, name: '🥇 1등 대박 잭팟', gold: 1000000, baitType: 'rainbow', baitCount: 50, baitName: '무지개 미끼', weight: 1, color: '#f59e0b' },
  { rank: 2, name: '🥈 2등 황금 당첨', gold: 100000, baitType: 'golden', baitCount: 30, baitName: '황금 미끼', weight: 9, color: '#eab308' },
  { rank: 3, name: '🥉 3등 행운 당첨', gold: 30000, baitType: 'shiny', baitCount: 20, baitName: '반짝이 미끼', weight: 30, color: '#38bdf8' },
  { rank: 4, name: '🎖️ 4등 실속 당첨', gold: 10000, baitType: 'worm', baitCount: 10, baitName: '지렁이 미끼', weight: 60, color: '#10b981' },
];

// ⛵ 나만의 낚싯배 (선상 낚시) 커스텀 티어
export const BOATS = {
  wood_raft: { id: 'wood_raft', name: '낡은 목재 뗏목', emoji: '🪵', price: 0, bagBonus: 0, powerBonus: 0, desc: '강가에 띄워둔 기본 나무 뗏목' },
  fishing_boat: { id: 'fishing_boat', name: '바다 통통배', emoji: '🚤', price: 50000, bagBonus: 10, powerBonus: 5, desc: '가방 +10칸 & 캐스팅 파워 +5% 영구 보너스' },
  speed_boat: { id: 'speed_boat', name: '쾌속 낚시보트', emoji: '🛥️', price: 300000, bagBonus: 25, powerBonus: 12, desc: '가방 +25칸 & 캐스팅 파워 +12% 영구 보너스' },
  luxury_yacht: { id: 'luxury_yacht', name: '황금 크루즈 유람선', emoji: '🛳️', price: 2000000, bagBonus: 50, powerBonus: 25, desc: '가방 +50칸 & 캐스팅 파워 +25% 영구 보너스' },
  hover_craft: { id: 'hover_craft', name: '차원 반중력 호버크래프트', emoji: '🛸', price: 50000000, bagBonus: 100, powerBonus: 40, desc: '가방 +100칸 & 캐스팅 파워 +40% 영구 보너스' },
  hyperion_mothership: { id: 'hyperion_mothership', name: '성간 하이페리온 기함', emoji: '🚀', price: 300000000, bagBonus: 200, powerBonus: 60, desc: '가방 +200칸 & 캐스팅 파워 +60% 영구 보너스' },
};
export const BOAT_ORDER = ['wood_raft', 'fishing_boat', 'speed_boat', 'luxury_yacht', 'hover_craft', 'hyperion_mothership'];

// 🤫 개발자만 알고 있는 40종의 비밀 히든 물고기 (유저에겐 서식지/출현조건 철저히 비공개)
export const HIDDEN_FISH = [
  // 날씨 관련 히든 (4종)
  { id: 'hf_thunder_catfish', name: '⚡ 벼락 맞은 황금메기', emoji: '⚡', rarity: 'legendary', minSize: 120, maxSize: 240, basePrice: 35000, difficulty: 4, desc: '거센 비와 번개가 내리칠 때만 수면 위로 올라오는 번개의 화신', condition: 'weather_rainy' },
  { id: 'hf_phantom_ray', name: '🌫️ 안개 속 유령가오리', emoji: '👻', rarity: 'legendary', minSize: 150, maxSize: 300, basePrice: 45000, difficulty: 4, desc: '한 치 앞도 보이지 않는 짙은 안개 속에서 환영처럼 나타나는 유령 가오리', condition: 'weather_foggy' },
  { id: 'hf_lunar_jellyfish', name: '🌙 달빛 심연 야광해파리', emoji: '🪼', rarity: 'mythic', minSize: 80, maxSize: 180, basePrice: 90000, difficulty: 5, desc: '칠흑 같은 어둠 속 고요한 밤하늘 달빛을 쬐러 올라오는 푸른 네온 해파리', condition: 'weather_night' },
  { id: 'hf_sun_dragon', name: '☀️ 태양의 화염룡', emoji: '🌞', rarity: 'mythic', minSize: 300, maxSize: 800, basePrice: 120000, difficulty: 5, desc: '눈부시게 화창한 맑은 날, 태양의 적외선을 충전하러 승천하는 불의 용', condition: 'weather_sunny' },

  // 장비/낚싯배 관련 히든 (6종)
  { id: 'hf_ancient_turtle', name: '🪵 고목 등껍질 거북', emoji: '🐢', rarity: 'rare', minSize: 60, maxSize: 140, basePrice: 18000, difficulty: 3, desc: '오래된 나무 뗏목 밑에 붙어 이끼를 뜯어먹고 살던 장수의 거북', condition: 'boat_wood_raft' },
  { id: 'hf_speed_sailfish', name: '🚤 모터 광속 돛새치', emoji: '🗡️', rarity: 'epic', minSize: 140, maxSize: 280, basePrice: 40000, difficulty: 4, desc: '통통배와 쾌속정의 스크루 물살 속도를 즐기는 질주의 사냥꾼', condition: 'boat_speed' },
  { id: 'hf_cruise_leviathan', name: '🛳️ 크루즈 삼킨 모비딕', emoji: '🐋', rarity: 'mythic', minSize: 1000, maxSize: 3500, basePrice: 250000, difficulty: 5, desc: '황금 크루즈 유람선의 거대한 닻을 장난감처럼 물고 노는 전설의 백경', condition: 'boat_yacht' },
  { id: 'hf_hover_alien_manta', name: '🛸 반중력 외계 만타', emoji: '🛸', rarity: 'mythic', minSize: 500, maxSize: 1500, basePrice: 1200000, difficulty: 5, desc: '호버크래프트의 자기장 추진력을 연료로 섭취하는 우주 가오리', condition: 'boat_hover' },
  { id: 'hf_mothership_star_whale', name: '🚀 하이페리온 항성 고래', emoji: '🌌', rarity: 'mythic', minSize: 3000, maxSize: 9999, basePrice: 3500000, difficulty: 5, desc: '성간 기함의 거대한 차원 엔진 소리에 화답하는 은하의 거수', condition: 'boat_mothership' },
  { id: 'hf_bamboo_spirit', name: '🎋 대나무 요정 송사리', emoji: '🎋', rarity: 'legendary', minSize: 15, maxSize: 30, basePrice: 50000, difficulty: 4, desc: '초보자의 대나무 낚싯대만을 그리워하여 나타나는 신비한 민물 정령', condition: 'rod_bamboo' },

  // 피버 및 시간대/캐스팅 관련 히든 (5종)
  { id: 'hf_fever_phoenix', name: '🔥 광란의 불새어', emoji: '🦚', rarity: 'mythic', minSize: 150, maxSize: 400, basePrice: 180000, difficulty: 5, desc: '피버 타임의 뜨거운 열기에 이끌려 솟구쳐 오르는 열화의 영물', condition: 'fever_active' },
  { id: 'hf_sniper_barracuda', name: '🎯 100% 저격 바라쿠다', emoji: '🏹', rarity: 'epic', minSize: 90, maxSize: 200, basePrice: 38000, difficulty: 4, desc: '오직 게이지 100% 퍼펙트 캐스팅에만 날카롭게 반응하는 사냥꾼', condition: 'perfect_cast' },
  { id: 'hf_golden_koi_king', name: '👑 억만장자 황금비단잉어', emoji: '👑', rarity: 'mythic', minSize: 80, maxSize: 180, basePrice: 300000, difficulty: 5, desc: '황금 미끼와 황금 복권의 기운을 받고 탄생한 물속의 대부호', condition: 'bait_golden' },
  { id: 'hf_rainbow_hydra', name: '🌈 칠색 무지개 히드라', emoji: '🐲', rarity: 'mythic', minSize: 500, maxSize: 1500, basePrice: 400000, difficulty: 5, desc: '무지개 미끼의 오색 빛깔 향기에 반응하여 깨어난 일곱 머리의 수룡', condition: 'bait_rainbow' },
  { id: 'hf_lucky_seven_dolphin', name: '🎰 777 잭팟 행운돌고래', emoji: '🐬', rarity: 'mythic', minSize: 120, maxSize: 300, basePrice: 777777, difficulty: 5, desc: '슬롯머신 잭팟의 행운 기운을 타고 나타나는 황금 무지개 돌고래', condition: 'slot_jackpot' },

  // 1~10 지역 서식 히든 (10종)
  { id: 'hf_cosmic_stardust', name: '✨ 성운의 별가루 엔젤', emoji: '⭐', rarity: 'legendary', minSize: 40, maxSize: 90, basePrice: 75000, difficulty: 4, desc: '은하수가 부서진 가루를 마시며 자라난 우주 속 천사 물고기', condition: 'region_nebula' },
  { id: 'hf_quantum_ghost', name: '⚛️ 양자 얽힘 유령어', emoji: '👾', rarity: 'mythic', minSize: 70, maxSize: 160, basePrice: 220000, difficulty: 5, desc: '시간의 틈새에서 존재와 소멸을 반복하는 4차원 홀로그램 생명체', condition: 'region_timewarp' },
  { id: 'hf_magma_behemoth', name: '🌋 용암핵 베히모스', emoji: '🦖', rarity: 'mythic', minSize: 600, maxSize: 1800, basePrice: 280000, difficulty: 5, desc: '화산 심장부 5000도 마그마 마그넷을 뚫고 기어나온 태고의 거수', condition: 'region_volcano' },
  { id: 'hf_ice_crystal_queen', name: '❄️ 빙정의 얼음여왕어', emoji: '👸', rarity: 'legendary', minSize: 100, maxSize: 220, basePrice: 85000, difficulty: 4, desc: '영하 70도 극지방 가장 투명한 빙벽 속에 얼어붙어 있던 여왕 물고기', condition: 'region_glacier' },
  { id: 'hf_abyss_kraken', name: '🐙 심연의 공포 크라켄', emoji: '🦑', rarity: 'mythic', minSize: 800, maxSize: 2500, basePrice: 350000, difficulty: 5, desc: '심해 협곡 가장 깊은 1만 미터 참호에서 잠들어 있던 공포의 대왕 촉수', condition: 'region_abyss' },
  { id: 'hf_dragon_palace_emperor', name: '🐉 용궁 태상황룡', emoji: '🐲', rarity: 'mythic', minSize: 1200, maxSize: 3000, basePrice: 500000, difficulty: 5, desc: '용궁 깊숙한 옥좌 아래에서 여의주를 수호하는 궁극의 황제 용', condition: 'region_palace' },
  { id: 'hf_seraph_archangel', name: '🪽 치천사 미카엘 어류', emoji: '🪽', rarity: 'mythic', minSize: 400, maxSize: 1000, basePrice: 600000, difficulty: 5, desc: '천상 유원지 가장 높은 무지개 계단 위에서 빛을 내리는 수호 천사', condition: 'region_sky_ocean' },
  { id: 'hf_lake_nessie', name: '🦕 호수의 네시 주니어', emoji: '🦕', rarity: 'epic', minSize: 200, maxSize: 600, basePrice: 150000, difficulty: 4, desc: '조용한 호수 안개 낀 새벽에만 목을 내미는 전설의 수룡 새끼', condition: 'region_lake' },
  { id: 'hf_river_golden_otter', name: '🦦 황금 강달 어류', emoji: '🦦', rarity: 'legendary', minSize: 70, maxSize: 150, basePrice: 180000, difficulty: 4, desc: '맑은 강의 물살을 타고 조개를 깨먹는 영특한 황금 수달 어류', condition: 'region_river' },
  { id: 'hf_sea_megalodon_ghost', name: '🦈 푸른 바다 유령 메갈로돈', emoji: '🦈', rarity: 'legendary', minSize: 800, maxSize: 2000, basePrice: 320000, difficulty: 5, desc: '수백만 년 전 멸종했던 거대 상어의 푸른 영혼', condition: 'region_sea' },

  // 신규 11~15지역 초월 히든 (10종)
  { id: 'hf_rift_glitch_dragon', name: '👾 차원 글리치 시공룡', emoji: '🐉', rarity: 'mythic', minSize: 2000, maxSize: 6000, basePrice: 15000000, difficulty: 5, desc: '차원 왜곡 균열 속에서 코드가 붕괴되며 깨어난 디지털 용', condition: 'region_rift' },
  { id: 'hf_rift_hypercube', name: '🧊 4차원 테서랙트 어류', emoji: '💎', rarity: 'mythic', minSize: 100, maxSize: 300, basePrice: 12000000, difficulty: 5, desc: '보는 각도에 따라 형태가 끝없이 변하는 4차원 정육면체 생명체', condition: 'region_rift' },
  { id: 'hf_horizon_hawking_rad', name: '☢️ 호킹 복사 광휘어', emoji: '☀️', rarity: 'mythic', minSize: 150, maxSize: 400, basePrice: 25000000, difficulty: 5, desc: '블랙홀이 소멸할 때 마지막으로 내뿜는 찬란한 호킹 복사의 정수', condition: 'region_horizon' },
  { id: 'hf_horizon_dark_titan', name: '🕳️ 암흑 특이점 티탄상어', emoji: '🦈', rarity: 'mythic', minSize: 3500, maxSize: 8500, basePrice: 35000000, difficulty: 5, desc: '블랙홀 한가운데에서 중력을 삼키며 유영하는 절대 포식자', condition: 'region_horizon' },
  { id: 'hf_atlantis_orichalcum_dragon', name: '🏛️ 오리하르콘 기계황룡', emoji: '🐲', rarity: 'mythic', minSize: 4000, maxSize: 9000, basePrice: 60000000, difficulty: 5, desc: '침몰한 아틀란티스 중앙 제어 컴퓨터가 가동한 영구동력 수호룡', condition: 'region_atlantis' },
  { id: 'hf_atlantis_chronos_nautilus', name: '🐚 신전의 황금 나선 앵무조개', emoji: '🐚', rarity: 'mythic', minSize: 200, maxSize: 500, basePrice: 45000000, difficulty: 5, desc: '아틀란티스 왕족의 비밀 지도가 새겨진 신성한 앵무조개', condition: 'region_atlantis' },
  { id: 'hf_chronos_time_rewinder', name: '⏳ 시간역행 크로노사우루스', emoji: '🐊', rarity: 'mythic', minSize: 3000, maxSize: 7500, basePrice: 150000000, difficulty: 5, desc: '시간의 태엽을 거꾸로 감아 부상을 스스로 치유하는 고대 해룡', condition: 'region_chronos' },
  { id: 'hf_chronos_paradox_butterfly', name: '🦋 타임 패러독스 나비어', emoji: '🦋', rarity: 'mythic', minSize: 120, maxSize: 350, basePrice: 90000000, difficulty: 5, desc: '날갯짓 한 번에 미래의 태풍을 과거로 보내는 시공간 나비치', condition: 'region_chronos' },
  { id: 'hf_genesis_aether_god', name: '🕊️ 태초의 창세 에테르신어', emoji: '🌟', rarity: 'mythic', minSize: 5000, maxSize: 15000, basePrice: 500000000, difficulty: 5, desc: '창세의 성소 중앙 분수에서 태어난 전 우주 모든 물고기의 어버이', condition: 'region_genesis' },
  { id: 'hf_genesis_ouroboros', name: '♾️ 무한의 창조 우로보로스', emoji: '🌌', rarity: 'mythic', minSize: 10000, maxSize: 99999, basePrice: 1000000000, difficulty: 5, desc: '자신의 꼬리를 물고 세계의 순환과 영원을 상징하는 태초의 우주 뱀', condition: 'endgame_secret' },

  // 특수 융합/인양/보스 연계 히든 (5종)
  { id: 'hf_chimera_beast', name: '🧬 키메라 돌연변이 카오스', emoji: '🦖', rarity: 'mythic', minSize: 800, maxSize: 2500, basePrice: 8000000, difficulty: 5, desc: '생체 연구소의 수많은 실험 끝에 탄생한 궁극의 융합 생명체', condition: 'fusion_secret' },
  { id: 'hf_salvage_treasure_shark', name: '🏴‍☠️ 해적선 금괴 먹은 상어', emoji: '🦈', rarity: 'mythic', minSize: 600, maxSize: 1800, basePrice: 5000000, difficulty: 5, desc: '침몰선 보물창고의 금괴를 온몸에 둘러 번쩍이는 보물 상어', condition: 'salvage_secret' },
  { id: 'hf_boss_baby_leviathan', name: '👶 소용돌이 보스의 새끼용', emoji: '🐲', rarity: 'mythic', minSize: 300, maxSize: 900, basePrice: 6500000, difficulty: 5, desc: '차원 보스를 제압한 후 잔잔해진 수면에 홀로 남겨진 새끼 용', condition: 'vortex_secret' },
  { id: 'hf_siamese_twin_koi', name: '🎏 샴쌍둥이 황금 비단잉어', emoji: '🎏', rarity: 'mythic', minSize: 100, maxSize: 250, basePrice: 10000000, difficulty: 5, desc: '머리가 두 개 달린 기적의 황금 잉어. 더블 캐치 발동 시 출현', condition: 'double_catch_secret' },
  { id: 'hf_god_angler_trophy', name: '🏆 우주 낚시신의 황금 트로피어', emoji: '🏆', rarity: 'mythic', minSize: 500, maxSize: 1200, basePrice: 200000000, difficulty: 5, desc: '전 우주의 낚시터를 평정한 위대한 낚시신에게만 모습을 드러내는 살아있는 트로피', condition: 'god_angler_secret' },
];




// 🌀 1. 차원 소용돌이 포탈 보스 (상위 맵 전용 거대 레이드 보스)
export const VORTEX_BOSSES = [
  { id: 'boss_kraken', name: '🦑 심연의 절대공포 크라켄', emoji: '🐙', region: 'abyss', hp: 300, dist: 90, rewardGold: 80000, desc: '심연 협곡을 뒤흔드는 고대 거대 촉수의 괴수' },
  { id: 'boss_dragon_god', name: '🐉 신화의 흑룡신', emoji: '🐲', region: 'palace', hp: 450, dist: 120, rewardGold: 200000, desc: '용궁 옥좌를 지키는 전설의 흑룡신' },
  { id: 'boss_star_eater', name: '🪐 은하 포식자 레비아탄', emoji: '🌌', region: 'nebula', hp: 600, dist: 150, rewardGold: 500000, desc: '성운의 별빛을 집어삼키는 우주의 지배자' },
  { id: 'boss_chronos', name: '⏳ 시공간의 파괴자 크로노스', emoji: '⌛', region: 'timewarp', hp: 800, dist: 180, rewardGold: 1200000, desc: '과거와 미래의 시간을 붕괴시키는 차원의 지배체' },
  { id: 'boss_genesis_titan', name: '👑 창세의 천상 티탄', emoji: '🔱', region: 'sky_ocean', hp: 1000, dist: 220, rewardGold: 3000000, desc: '천상 유원지 가장 높은 옥좌의 궁극 거신' },
];

// 🔬 3. 생체 연구소 돌연변이 100종 도감 (일반 25, 희귀 25, 영웅 20, 전설 20, 신화 10)
export const HYBRID_FISH = [
  // ⚪ [일반 돌연변이] 25종 (기본 유전자 변이) - 기본 판매가 800 ~ 2,500G
  { id: 'mut_albino_crucian', name: '알비노 백붕어', emoji: '🐟', rarity: 'common', basePrice: 800, desc: '색소가 결핍되어 온몸이 하얗게 변한 붕어' },
  { id: 'mut_two_tailed_minnow', name: '쌍꼬리 피라미', emoji: '🐟', rarity: 'common', basePrice: 900, desc: '꼬리지느러미가 둘로 갈라져 헤엄치는 피라미' },
  { id: 'mut_translucent_mudfish', name: '반투명 미꾸라지', emoji: '🪱', rarity: 'common', basePrice: 1000, desc: '속이 훤히 비치는 투명한 젤리 미꾸라지' },
  { id: 'mut_giant_bluegill', name: '가시 블루길', emoji: '🐠', rarity: 'common', minSize: 20, maxSize: 40, basePrice: 1100, desc: '등지느러미에 날카로운 가시가 돋아난 변종' },
  { id: 'mut_glass_dace', name: '유리 갈겨니', emoji: '🐟', rarity: 'common', basePrice: 1200, desc: '유리알처럼 영롱하게 빛나는 갈겨니' },
  { id: 'mut_spotted_kkeokji', name: '표범무늬 꺽지', emoji: '🐟', rarity: 'common', basePrice: 1300, desc: '줄무늬 대신 강렬한 반점이 생긴 꺽지' },
  { id: 'mut_neon_shiner', name: '네온 형광 쉬리', emoji: '🐠', rarity: 'common', basePrice: 1400, desc: '1급수에서 스스로 연두색 형광빛을 내는 쉬리' },
  { id: 'mut_striped_sardine', name: '얼룩 정어리', emoji: '🐟', rarity: 'common', basePrice: 1500, desc: '지브라 무늬를 띄는 특이한 정어리' },
  { id: 'mut_silver_anchovy', name: '순은 대왕멸치', emoji: '🐟', rarity: 'common', basePrice: 1600, desc: '은박지를 두른 듯 눈부신 멸치' },
  { id: 'mut_mini_monkfish', name: '난쟁이 뿔아귀', emoji: '🐡', rarity: 'common', basePrice: 1700, desc: '몸집은 작지만 뿔이 두 개 달린 아귀' },
  { id: 'mut_glow_squid', name: '야광 새끼오징어', emoji: '🦑', rarity: 'common', basePrice: 1800, desc: '밤바다에서 스스로 빛나는 초록 오징어' },
  { id: 'mut_golden_flounder', name: '황금점 넙치', emoji: '🐡', rarity: 'common', basePrice: 1900, desc: '등판에 황금빛 점이 박힌 넙치' },
  { id: 'mut_rock_blobfish', name: '화강암 블롭피쉬', emoji: '🫠', rarity: 'common', basePrice: 2000, desc: '말랑하지 않고 바위처럼 딱딱한 블롭피쉬' },
  { id: 'mut_ice_feather_guppy', name: '얼음 깃털 구피', emoji: '❄️', rarity: 'common', basePrice: 2100, desc: '지느러미가 눈꽃 결정 형태인 구피' },
  { id: 'mut_magma_spark_fry', name: '불씨 송사리', emoji: '🔥', rarity: 'common', basePrice: 2200, desc: '지느러미 끝에서 작은 불꽃이 튀는 송사리' },
  { id: 'mut_cloud_sponge_fish', name: '솜사탕 해면어', emoji: '☁️', rarity: 'common', basePrice: 2300, desc: '스펀지처럼 푹신한 구름 무늬 물고기' },
  { id: 'mut_clock_tetra', name: '초침 테트라', emoji: '⚙️', rarity: 'common', basePrice: 2400, desc: '초침처럼 딱딱 끊어지며 유영하는 변종' },
  { id: 'mut_amber_guppy', name: '호박 구피', emoji: '🪨', rarity: 'common', basePrice: 2500, desc: '단단한 보석 비늘을 가진 돌연변이' },
  { id: 'mut_cyber_minnow', name: '칩셋 송사리', emoji: '👾', rarity: 'common', basePrice: 2500, desc: '등에 반도체 회로 무늬가 새겨진 물고기' },
  { id: 'mut_bubble_puffer', name: '비눗방울 복어', emoji: '🫧', rarity: 'common', basePrice: 2500, desc: '공기 대신 물방울을 뿜는 복어' },
  { id: 'mut_sand_eel', name: '유황 모래장어', emoji: '🐍', rarity: 'common', basePrice: 2500, desc: '노란 유황가루를 두르고 다니는 장어' },
  { id: 'mut_coral_bass', name: '산호가지 배스', emoji: '🪸', rarity: 'common', basePrice: 2500, desc: '아가미에 붉은 산호가 돋아난 배스' },
  { id: 'mut_prism_dace', name: '프리즘 피라미', emoji: '🌈', rarity: 'common', basePrice: 2500, desc: '빛을 받으면 7가지 색으로 반사돼요' },
  { id: 'mut_moss_carp', name: '이끼 잉어', emoji: '🌿', rarity: 'common', basePrice: 2500, desc: '비늘에 천연 이끼가 자생하는 잉어' },
  { id: 'mut_clay_catfish', name: '점토 메기', emoji: '🐟', rarity: 'common', basePrice: 2500, desc: '진흙과 완전히 동화된 회색 메기' },

  // 🔵 [희귀 돌연변이] 25종 (속성 결합 변이) - 기본 판매가 5,000 ~ 15,000G
  { id: 'mut_volt_catfish', name: '찌릿 메기', emoji: '⚡', rarity: 'rare', basePrice: 5000, desc: '수염에서 약한 정전기를 방출하는 메기' },
  { id: 'mut_crystal_trout', name: '수정 송어', emoji: '💎', rarity: 'rare', basePrice: 5500, desc: '비늘이 각진 크리스탈로 덮여있어요' },
  { id: 'mut_emerald_eel', name: '에메랄드 장어', emoji: '🐍', rarity: 'rare', basePrice: 6000, desc: '깊은 초록빛 보석 광채를 뿜는 장어' },
  { id: 'mut_ruby_sea_bream', name: '루비 참돔', emoji: '🐠', rarity: 'rare', basePrice: 7000, desc: '선홍빛 보석처럼 아름다운 변종 돔' },
  { id: 'mut_sapphire_mackerel', name: '사파이어 고등어', emoji: '🐟', rarity: 'rare', basePrice: 7500, desc: '등에서 짙은 청색 사파이어 빛이 돌아요' },
  { id: 'mut_obsidian_rockfish', name: '흑요석 우럭', emoji: '🖤', rarity: 'rare', basePrice: 8000, desc: '바늘도 튕겨낼 듯 단단한 흑요석 피부' },
  { id: 'mut_plasma_squid', name: '플라즈마 오징어', emoji: '🦑', rarity: 'rare', basePrice: 8500, desc: '다리 끝에서 푸른 플라즈마 불꽃이 일어요' },
  { id: 'mut_frost_salmon', name: '서리꽃 연어', emoji: '❄️', rarity: 'rare', basePrice: 9000, desc: '지느러미에 얼음 서리가 맺힌 채 헤엄쳐요' },
  { id: 'mut_flame_sweetfish', name: '불꽃 은어', emoji: '🔥', rarity: 'rare', basePrice: 9500, desc: '수박 향 대신 은은한 불향이 나는 은어' },
  { id: 'mut_abyss_lantern_crab', name: '발광 등불게', emoji: '🦀', rarity: 'rare', basePrice: 10000, desc: '집게발에 심해 등불을 달고 다니는 게' },
  { id: 'mut_nebula_tetra', name: '성간 가스 테트라', emoji: '🌌', rarity: 'rare', basePrice: 11000, desc: '몸속에 보랏빛 은하 구름을 품었어요' },
  { id: 'mut_solar_flounder', name: '태양열 넙치', emoji: '☀️', rarity: 'rare', basePrice: 11500, desc: '햇볕을 모아 뜨끈뜨끈한 열기를 내뿜어요' },
  { id: 'mut_chrono_seahorse', name: '모래시계 해마', emoji: '⏳', rarity: 'rare', basePrice: 12000, desc: '꼬리로 시간을 감으며 유영하는 해마' },
  { id: 'mut_quantum_ray', name: '홀로그램 가오리', emoji: '👾', rarity: 'rare', basePrice: 12500, desc: '몸통이 3차원 입체 홀로그램으로 깜빡여요' },
  { id: 'mut_coral_octopus', name: '산호 숲 문어', emoji: '🐙', rarity: 'rare', basePrice: 13000, desc: '다리마다 산호초가 자라난 위장 문어' },
  { id: 'mut_aurora_char', name: '오로라 열목어', emoji: '✨', rarity: 'rare', basePrice: 13500, desc: '차가운 극지방 오로라 빛을 띈 열목어' },
  { id: 'mut_steam_puffer', name: '수증기 증기복어', emoji: '💨', rarity: 'rare', basePrice: 14000, desc: '물과 불이 만나 수증기를 뿜는 복어' },
  { id: 'mut_iron_mandarin', name: '강철 쏘가리', emoji: '🐠', rarity: 'rare', basePrice: 14500, desc: '비늘이 강철 합금처럼 단단한 쏘가리' },
  { id: 'mut_toxic_jelly', name: '형광 맹독 해파리', emoji: '🪼', rarity: 'rare', basePrice: 15000, desc: '어두운 곳에서 맹독을 발산하는 변종' },
  { id: 'mut_echo_bass', name: '음파 진동 배스', emoji: '🔊', rarity: 'rare', basePrice: 15000, desc: '아가미로 초음파를 쏘아 먹이를 찾아요' },
  { id: 'mut_silver_tuna', name: '은빛 탄환 다랑어', emoji: '🐟', rarity: 'rare', basePrice: 15000, desc: '물살을 가를 때 은빛 궤적이 생겨요' },
  { id: 'mut_pearl_carp', name: '흑진주 비단잉어', emoji: '🦪', rarity: 'rare', basePrice: 15000, desc: '비늘 하나하나가 흑진주 광택을 띱니다' },
  { id: 'mut_feather_salmon', name: '날개 연어', emoji: '🪽', rarity: 'rare', basePrice: 15000, desc: '수면 위로 3미터씩 날아오르는 연어' },
  { id: 'mut_deep_angler', name: '쌍전구 심해아귀', emoji: '🐡', rarity: 'rare', basePrice: 15000, desc: '이마에 밝은 전구가 두 개 달린 아귀' },
  { id: 'mut_speed_squid', name: '제트 분사 오징어', emoji: '🦑', rarity: 'rare', basePrice: 15000, desc: '로켓처럼 고속으로 물살을 뿜는 오징어' },

  // 🟣 [영웅 돌연변이] 20종 (강력한 변형체) - 기본 판매가 30,000 ~ 80,000G
  { id: 'mut_mecha_cyborg_salmon', name: '사이보그 메카 연어', emoji: '🤖', rarity: 'epic', basePrice: 30000, desc: '기계 회로와 생체 근육이 결합된 연어' },
  { id: 'mut_inferno_snakehead', name: '화염 가물치', emoji: '🐊', rarity: 'epic', basePrice: 35000, desc: '입에서 끓어오르는 화염을 머금은 가물치' },
  { id: 'mut_shadow_tuna', name: '그림자 심연 참치', emoji: '🐟', rarity: 'epic', basePrice: 40000, desc: '빛을 흡수하여 바닷속에서 완전히 은신해요' },
  { id: 'mut_frost_behemoth_carp', name: '동결 베히모스 잉어', emoji: '🧊', rarity: 'epic', basePrice: 45000, desc: '지나간 수면을 얼어붙게 만드는 거대 잉어' },
  { id: 'mut_laser_swordfish', name: '레이저 빔 돛새치', emoji: '🗡️', rarity: 'epic', basePrice: 50000, desc: '부리 끝에서 고출력 에너지 광선을 발산해요' },
  { id: 'mut_titan_catfish', name: '티탄 바위메기', emoji: '🗿', rarity: 'epic', basePrice: 55000, desc: '등에 고대 유적 파편을 이고 다니는 메기' },
  { id: 'mut_thunder_yellowtail', name: '뇌우 대방어', emoji: '🐟', rarity: 'epic', basePrice: 60000, desc: '몸을 회전할 때마다 천둥 번개가 칩니다' },
  { id: 'mut_quantum_shark', name: '양자 점멸 상어', emoji: '🦈', rarity: 'epic', basePrice: 65000, desc: '공간을 순간이동하며 낚시바늘을 교란해요' },
  { id: 'mut_nebula_octopus', name: '성운 촉수 문어', emoji: '🐙', rarity: 'epic', basePrice: 70000, desc: '은하계 성운 구름을 뿜어내는 거대 문어' },
  { id: 'mut_clockwork_dragon_fish', name: '태엽 장치 아로와나', emoji: '⚙️', rarity: 'epic', basePrice: 75000, desc: '정교한 황금 톱니바퀴로 심장이 뛰어요' },
  { id: 'mut_prism_whale', name: '칠색 프리즘 아기고래', emoji: '🐋', rarity: 'epic', basePrice: 80000, desc: '숨을 쉴 때 무지개 물기둥을 뿜어냅니다' },
  { id: 'mut_abyss_vampire_eel', name: '심연 흡혈 뱀장어', emoji: '🐍', rarity: 'epic', basePrice: 80000, desc: '붉은 안광을 번뜩이는 심해의 암살자' },
  { id: 'mut_volcano_ray', name: '마그마 분출 가오리', emoji: '🌋', rarity: 'epic', basePrice: 80000, desc: '꼬리침에서 800도 용암 독을 분사해요' },
  { id: 'mut_ghost_kraken_tentacle', name: '유령 촉수 크라켄', emoji: '👻', rarity: 'epic', basePrice: 80000, desc: '실체가 없는 영체 상태로 수면을 유영해요' },
  { id: 'mut_chrono_barracuda', name: '시간 가속 바라쿠다', emoji: '🏹', rarity: 'epic', basePrice: 80000, desc: '자신의 시간을 2배 가속하여 돌진해요' },
  { id: 'mut_hyper_seahorse', name: '초공간 아틀라스 해마', emoji: '🦄', rarity: 'epic', basePrice: 80000, desc: '차원의 틈새를 질주하는 날개 달린 해마' },
  { id: 'mut_golden_dunkle', name: '순금 장갑 둔클레오', emoji: '🪙', rarity: 'epic', basePrice: 80000, desc: '고대 갑주가 순금으로 치환된 화석 어류' },
  { id: 'mut_starfall_jelly', name: '유성우 낙하 해파리', emoji: '🌠', rarity: 'epic', basePrice: 80000, desc: '밤하늘 별똥별이 수면에 닿아 변이된 해파리' },
  { id: 'mut_crystal_nautilus', name: '다이아 앵무조개', emoji: '🐚', rarity: 'epic', basePrice: 80000, desc: '껍질이 완전한 무결점 다이아몬드 결정' },
  { id: 'mut_eden_angel_tuna', name: '에덴의 천사 날개치', emoji: '🪽', rarity: 'epic', basePrice: 80000, desc: '천상의 빛으로 바다를 정화하는 다랑어' },

  // 🟡 [전설 돌연변이] 20종 (대성공 대박 어종) - 기본 판매가 150,000 ~ 450,000G
  { id: 'hyb_magma_koi', name: '🔥 볼케이노 비단잉어', emoji: '🎏', rarity: 'legendary', basePrice: 150000, desc: '마그마의 열기와 황금 비늘이 융합된 화려한 물고기' },
  { id: 'hyb_frost_tuna', name: '🧊 절대영도 프로스트 참치', emoji: '🐟', rarity: 'legendary', basePrice: 180000, desc: '빙하의 한기로 영구 동결된 고속의 탄환' },
  { id: 'mut_diamond_sturgeon', name: '💎 다이아몬드 철갑상어', emoji: '🦈', rarity: 'legendary', basePrice: 200000, desc: '수억 년 수압을 이겨내고 보석 갑옷을 입은 상어' },
  { id: 'mut_plasma_marlin', name: '⚡ 플라즈마 뇌전 돛새치', emoji: '🗡️', rarity: 'legendary', basePrice: 220000, desc: '부리에서 100만 볼트 벼락을 내리꽂는 돛새치' },
  { id: 'mut_supernova_ray', name: '✨ 초신성 광휘 가오리', emoji: '💫', rarity: 'legendary', basePrice: 250000, desc: '항성이 폭발할 때의 영롱한 에너지를 날개에 머금음' },
  { id: 'mut_chrono_dunkle', name: '⏳ 시공간 붕괴 둔클레오', emoji: '⌛', rarity: 'legendary', basePrice: 280000, desc: '과거와 미래의 시간을 턱 힘으로 부숴버려요' },
  { id: 'mut_inferno_leviathan_koi', name: '🌋 연옥 화룡 잉어', emoji: '🐲', rarity: 'legendary', basePrice: 300000, desc: '용암 폭포를 거슬러 올라 용이 되기 직전의 잉어' },
  { id: 'mut_cosmic_ghost_whale', name: '🌌 성간 유령 고래', emoji: '🐋', rarity: 'legendary', basePrice: 320000, desc: '우주 먼지 속을 소리 없이 항해하는 은빛 고래' },
  { id: 'mut_atlantis_golden_hydra', name: '🏛️ 아틀란티스 황금 삼두룡', emoji: '🐉', rarity: 'legendary', basePrice: 350000, desc: '머리가 셋 달린 전설의 신전 수호룡' },
  { id: 'mut_blackhole_angler', name: '🕳️ 암흑 특이점 대왕아귀', emoji: '🐡', rarity: 'legendary', basePrice: 380000, desc: '이마의 미니 블랙홀로 모든 먹이를 끌어당겨요' },
  { id: 'mut_valkyrie_phoenix_salmon', name: '⚔️ 발키리 불사조 연어', emoji: '🦚', rarity: 'legendary', basePrice: 400000, desc: '불꽃과 날개를 지닌 천상 전사의 화신' },
  { id: 'mut_orichalcum_megalodon', name: '🪙 오리하르콘 메갈로돈', emoji: '🦈', rarity: 'legendary', basePrice: 420000, desc: '전설의 금속 오리하르콘 이빨을 가진 고대 상어' },
  { id: 'mut_cyber_titan_octopus', name: '🤖 사이버네틱 티탄 문어', emoji: '🐙', rarity: 'legendary', basePrice: 450000, desc: '나노 컴퓨터 중앙 코어로 제어되는 거대 기계 문어' },
  { id: 'mut_aether_pegasus_seahorse', name: '🦄 창세 페가수스 해마', emoji: '🦄', rarity: 'legendary', basePrice: 450000, desc: '에테르의 은빛 날개를 펼치고 하늘 바다를 질주' },
  { id: 'mut_time_paradox_eel', name: '♾️ 무한 루프 시공 장어', emoji: '🐍', rarity: 'legendary', basePrice: 450000, desc: '자신의 꼬리를 물고 시간을 무한 반복시키는 장어' },
  { id: 'mut_hypercube_jelly', name: '🧊 4차원 큐브 해파리', emoji: '💎', rarity: 'legendary', basePrice: 450000, desc: '4차원 공간 좌표를 넘나들며 유영하는 초입방체' },
  { id: 'mut_solar_flare_dragon_fish', name: '☀️ 태양 플레어 화염룡어', emoji: '🌞', rarity: 'legendary', basePrice: 450000, desc: '태양 흑점 폭발 에너지를 비늘에 완벽 충전' },
  { id: 'mut_frostfire_chimaera', name: '❄️🔥 빙화 일체 키메라', emoji: '✨', rarity: 'legendary', basePrice: 450000, desc: '절대영도 한기와 5000도 불꽃이 공존하는 기적의 생명체' },
  { id: 'mut_seraph_gold_tuna', name: '🪽 치천사 세라핌 황금참치', emoji: '👑', rarity: 'legendary', basePrice: 450000, desc: '여섯 개의 빛의 날개로 바다를 가르는 성스러운 참치' },
  { id: 'mut_omega_ancient_turtle', name: '🐢 세계수 봉인 고대현무', emoji: '🌳', rarity: 'legendary', basePrice: 450000, desc: '등껍질에 세계수의 새싹을 틔운 백만 년 수명의 거북' },

  // 🔴 [신화 키메라] 10종 (초대박 궁극 키메라) - 기본 판매가 1,000,000 ~ 5,000,000G
  { id: 'hyb_storm_eel', name: '⚡ 뇌전 플라즈마 전기뱀장어', emoji: '🐍', rarity: 'mythic', basePrice: 1000000, desc: '10만 볼트의 번개 에너지를 온몸에 휘감은 위험한 어종' },
  { id: 'hyb_crystal_manta', name: '💎 오로라 크리스탈 가오리', emoji: '✨', rarity: 'mythic', basePrice: 1200000, desc: '수면 위를 날아오르면 영롱한 보석 가루를 흩뿌리는 가오리' },
  { id: 'hyb_cosmic_shark', name: '🌌 성간 초신성 메갈로돈', emoji: '🦈', rarity: 'mythic', basePrice: 1500000, desc: '우주 성운과 심해의 최상위 포식자가 결합한 궁극의 상어' },
  { id: 'hyb_cyber_squid', name: '🤖 네온 사이버네틱 대왕오징어', emoji: '🦑', rarity: 'mythic', basePrice: 1800000, desc: '미래 나노 기술과 심해 촉수가 결합된 인공 생명체' },
  { id: 'hyb_abyss_phoenix', name: '🪶 심연 불사조 비룡어', emoji: '🦚', rarity: 'mythic', basePrice: 2200000, desc: '빛 없는 어둠에서 스스로 영원한 불꽃을 피워내는 환상의 영물' },
  { id: 'hyb_chrono_turtle', name: '⏳ 시간 왜곡 천년현무', emoji: '🐢', rarity: 'mythic', basePrice: 2600000, desc: '등껍질에 시공간 나침반을 얹고 세월을 거스르는 신령' },
  { id: 'hyb_golden_leviathan', name: '👑 황금 미다스 레비아탄', emoji: '🔱', rarity: 'mythic', basePrice: 3200000, desc: '닿는 모든 바닷물을 순금으로 변환시키는 전설의 거수' },
  { id: 'hyb_genesis_godfish', name: '♾️ 창세신화 에테르신어', emoji: '🌟', rarity: 'mythic', basePrice: 4000000, desc: '생명의 기원 그 자체를 품고 유영하는 신성한 물고기' },
  { id: 'mut_apocalypse_chimaera', name: '🦖 종말 카오스 키메라 몬스터', emoji: '🦖', rarity: 'mythic', basePrice: 4500000, desc: '수백 마리의 유전자가 뒤엉켜 탄생한 금기의 재앙 생명체' },
  { id: 'mut_supreme_ouroboros_god', name: '🌌 전지전능 창조신 우로보로스', emoji: '♾️', rarity: 'mythic', basePrice: 5000000, desc: '우주의 시작과 끝, 모든 순환을 지배하는 궁극의 무한신어' },
];

// 🎰 4. 침몰선 인양 크레인 보물 품목
export const SALVAGE_ITEMS = [
  { id: 'sal_rusty_anchor', name: '⚓ 녹슨 해적선 닻', price: 5000, desc: '백 년 전 침몰한 해적선에서 건져 올린 무거운 철제 닻' },
  { id: 'sal_silver_goblet', name: '🏆 고대 은제 성배', price: 15000, desc: '바닷속에서 은은한 광채를 잃지 않은 왕실의 은잔' },
  { id: 'sal_gold_chest', name: '🪙 스페인 함선 황금 궤짝', price: 50000, desc: '금화와 은화가 가득 채워져 있는 무거운 보물상자' },
  { id: 'sal_pearl_crown', name: '👑 심해 인어의 진주 왕관', price: 120000, desc: '영롱한 흑진주와 사파이어가 박힌 전설의 왕관' },
  { id: 'sal_alien_artifact', name: '🛸 추락한 외계 잠수정 코어', price: 300000, desc: '미지의 외계 항성에서 유입된 무한 에너지 구체' },
  { id: 'sal_atlantis_tablet', name: '📜 아틀란티스 석판 조각', price: 800000, desc: '잃어버린 고대 초고대 문명의 비밀이 새겨진 석판' },
];

// 🧬 5. 돌연변이 & 보스 도감 마일스톤 달성 보상
export const MUTATION_REWARDS = [
  { count: 10,  title: '생체 연구 입문자', gold: 50000,    desc: '연구비 5만G 지원' },
  { count: 25,  title: '유전자 교배 마스터', gold: 200000,   desc: '연구비 20만G 지원' },
  { count: 50,  title: '돌연변이 권위자',   gold: 1000000,  desc: '연구비 100만G 지원' },
  { count: 75,  title: '사이언스 닥터',     gold: 5000000,  desc: '연구비 500만G 지원' },
  { count: 100, title: '키메라의 창조신',   gold: 20000000, desc: '연구비 2000만G 지원 + 영구 칭호' },
];

export const BOSS_REWARDS = [
  { count: 1, title: '소용돌이 도전자', gold: 100000,   desc: '격퇴 축하금 10만G' },
  { count: 3, title: '심해 레이드 헌터', gold: 1000000,  desc: '격퇴 축하금 100만G' },
  { count: 5, title: '심해의 절대 지배자', gold: 10000000, desc: '전설 격퇴 축하금 1000만G + 영구 칭호' },
];

// 미끼 확률 합 검증 및 물고기 150종 전수 검사
function validateData() {
  if (FISH.length !== 150) {
    console.error(`[데이터 오류] FISH 개수는 150개여야 하지만 현재 ${FISH.length}개입니다.`);
  }

  for (const [id, bait] of Object.entries(BAITS)) {
    const sum = Object.values(bait.weights).reduce((acc, cur) => acc + cur, 0);
    if (sum !== 100) {
      console.error(`[데이터 오류] 미끼(${id})의 확률 합이 100이 아닙니다: ${sum}`);
    }
  }
}

validateData();
