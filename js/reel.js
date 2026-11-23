import { FISHING_CONFIG, RODS } from './data.js';
import { clamp } from './utils.js';
import { playSound } from './sound.js';
import { state } from './state.js';

let isReeling = false;
let isHolding = false;
let currentFish = null;
let onFinishCallback = null;

let fishY = 50;
let targetY = 50;
let targetTimer = 0;

let zoneH = 25;
let zoneY = 37.5;
let zoneVel = 0;

let progress = 30;
let timeLeft = 25;
let lastFrameTime = 0;
let animFrameId = null;

// 특수 커맨드 (QTE) 상태 변수
let qteActive = false;
let qteSequence = [];
let qteIndex = 0;
let qteTimer = 0;
let qteMaxTime = 2.5;
let qteTriggeredCount = 0;
let qteStunTimer = 0; // 성공 시 물고기 스턴 시간

const QTE_POSSIBLE_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];
const QTE_KEY_LABELS = {
  ArrowUp: '⬆️',
  ArrowDown: '⬇️',
  ArrowLeft: '⬅️',
  ArrowRight: '➡️',
  Space: 'SPACE',
};

export function isQTEActive() {
  return qteActive;
}

export function handleQTEInput(key) {
  if (!qteActive) return false;

  const expectedKey = qteSequence[qteIndex];
  if (key === expectedKey) {
    playSound('qte_hit');
    qteIndex++;
    updateQTEDOM();

    // 모든 시퀀스 통과
    if (qteIndex >= qteSequence.length) {
      resolveQTE(true);
    }
    return true;
  } else {
    // 오입력 시 시간 페널티 0.4초
    qteTimer = Math.max(0, qteTimer - 0.4);
    playSound('qte_fail');
    return true;
  }
}

function triggerQTE() {
  qteActive = true;
  qteTriggeredCount++;

  // 등급별 커맨드 수 및 제한 시간 차등화
  // 영웅(Epic): 3키, 2.8초 (여유로움)
  // 전설(Legendary): 5키, 2.2초 (빠르고 긴장감)
  // 신화(Mythic): 6~7키, 1.8초 (초고난도 긴박한 리듬 연타!)
  let count = 3;
  let timeLimit = 2.8;

  if (currentFish.rarity === 'mythic') {
    count = 6;
    timeLimit = 1.8;
  } else if (currentFish.rarity === 'legendary') {
    count = 5;
    timeLimit = 2.2;
  }

  qteSequence = [];
  for (let i = 0; i < count; i++) {
    const randomKey = QTE_POSSIBLE_KEYS[Math.floor(Math.random() * QTE_POSSIBLE_KEYS.length)];
    qteSequence.push(randomKey);
  }

  qteIndex = 0;
  qteMaxTime = timeLimit;
  qteTimer = qteMaxTime;

  playSound('qte_prompt');

  const container = document.getElementById('reel-qte-container');
  if (container) {
    container.hidden = false;
  }
  updateQTEDOM();
}

function updateQTEDOM() {
  const promptEl = document.getElementById('reel-qte-prompt');
  const timerFill = document.getElementById('reel-qte-timer-fill');

  if (promptEl) {
    promptEl.innerHTML = qteSequence
      .map((k, idx) => {
        let cls = 'qte-key-badge';
        if (idx < qteIndex) cls += ' cleared';
        else if (idx === qteIndex) cls += ' current';
        return `<span class="${cls}">${QTE_KEY_LABELS[k] || k}</span>`;
      })
      .join('');
  }

  if (timerFill) {
    const pct = Math.max(0, Math.min(100, (qteTimer / qteMaxTime) * 100));
    timerFill.style.width = `${pct}%`;
  }
}

function resolveQTE(success) {
  qteActive = false;
  const container = document.getElementById('reel-qte-container');
  if (container) {
    container.hidden = true;
  }

  const scene = document.getElementById('fishing-scene');

  if (success) {
    playSound('qte_success');
    // 성공 보상: 게이지 대폭 상승 (+20%) & 2.5초간 물고기 마비(스턴)
    progress = clamp(progress + 20, 0, 100);
    qteStunTimer = 2.5;

    if (scene) {
      scene.classList.add('screen-shake');
      setTimeout(() => scene.classList.remove('screen-shake'), 300);
    }
  } else {
    playSound('qte_fail');
    // 실패 패널티: 게이지 감소 (-15%)
    progress = clamp(progress - 15, 0, 100);

    if (scene) {
      scene.classList.add('screen-shake');
      setTimeout(() => scene.classList.remove('screen-shake'), 300);
    }
  }
}

export function startReelGame(fish, equippedRodId, onFinish) {
  currentFish = fish;
  onFinishCallback = onFinish;
  isReeling = true;
  isHolding = false;

  qteActive = false;
  qteSequence = [];
  qteIndex = 0;
  qteTimer = 0;
  qteTriggeredCount = 0;
  qteStunTimer = 0;

  const qteContainer = document.getElementById('reel-qte-container');
  if (qteContainer) {
    qteContainer.hidden = true;
  }

  const rod = RODS[equippedRodId] || RODS.bamboo;
  let bonusH = rod.zoneBonus || 0;

  // 거인의 비약 활성화 시 잡기 영역 1.5배 증가
  if (state.specialItems && state.specialItems.potion_zone > 0) {
    bonusH += 15;
  }

  zoneH = FISHING_CONFIG.ZONE_BASE_HEIGHT + bonusH;
  zoneY = 50 - zoneH / 2;
  zoneVel = 0;

  fishY = 50;
  targetY = 50;
  targetTimer = 0;

  progress = FISHING_CONFIG.PROGRESS_START;
  let timeLimit = FISHING_CONFIG.REEL_TIME_LIMIT_SEC;

  // 시간 정지 모래시계 부적 활성화 시 제한시간 +15초 연장
  if (state.specialItems && state.specialItems.hourglass_time > 0) {
    timeLimit += 15;
  }
  timeLeft = timeLimit;

  // DOM 초기화
  const panel = document.getElementById('reel-panel');
  if (panel) {
    panel.hidden = false;
  }

  updateReelDOM();
  lastFrameTime = performance.now();
  animFrameId = requestAnimationFrame(gameLoop);
}

export function setReelHolding(holding) {
  isHolding = holding;
}

export function isReelingActive() {
  return isReeling;
}

function gameLoop(currentTime) {
  if (!isReeling) return;

  if (document.hidden) {
    lastFrameTime = currentTime;
    animFrameId = requestAnimationFrame(gameLoop);
    return;
  }

  let dt = (currentTime - lastFrameTime) / 1000;
  lastFrameTime = currentTime;

  if (dt > FISHING_CONFIG.MAX_DT) {
    dt = FISHING_CONFIG.MAX_DT;
  }

  updatePhysics(dt);
  updateReelDOM();

  // 종료 조건 검사
  if (progress >= 100) {
    finishGame('success');
    return;
  }
  if (progress <= 0) {
    finishGame('fail_escaped'); // E07
    return;
  }
  if (timeLeft <= 0) {
    finishGame('fail_timeout'); // E08
    return;
  }

  animFrameId = requestAnimationFrame(gameLoop);
}

function updatePhysics(dt) {
  const diffSettings = FISHING_CONFIG.DIFFICULTY[currentFish.difficulty] || FISHING_CONFIG.DIFFICULTY[1];

  // 1. 제한 시간 감소 (QTE 활성화 중에는 전체 시간도 일시 슬로우/유지)
  if (!qteActive) {
    timeLeft -= dt;
    if (timeLeft < 0) timeLeft = 0;
  }

  // 2. QTE 처리
  if (qteActive) {
    qteTimer -= dt;
    updateQTEDOM();
    if (qteTimer <= 0) {
      resolveQTE(false); // 시간 초과 실패
    }
    return; // QTE 중에는 일반 물리 이동 일시 정지 (긴박한 QTE에 집중)
  }

  // QTE 트리거 체크: 영웅/전설/신화 등급
  // 영웅: 1회 발생 (45~65% 구간)
  // 전설: 최대 2회 발생 (1차: 35~55%, 2차: 65~85%)
  // 신화: 최대 2회 발생 (1차: 30~50%, 2차: 60~85%)
  const isHighRarity = ['epic', 'legendary', 'mythic'].includes(currentFish.rarity);
  const maxQteCount = currentFish.rarity === 'epic' ? 1 : 2;

  if (isHighRarity && qteTriggeredCount < maxQteCount) {
    let shouldTrigger = false;
    if (qteTriggeredCount === 0 && progress >= 35 && progress <= 65) {
      shouldTrigger = true;
    } else if (qteTriggeredCount === 1 && progress >= 68 && progress <= 88) {
      shouldTrigger = true;
    }

    if (shouldTrigger) {
      triggerQTE();
      return;
    }
  }

  // 3. 물고기 스턴 타이머
  if (qteStunTimer > 0) {
    qteStunTimer -= dt;
  }

  // 4. 잡기 영역 가속도 & 위치
  if (isHolding) {
    zoneVel += FISHING_CONFIG.ZONE_UP_ACCEL * dt;
    if (Math.random() < 0.2) {
      playSound('reel_tick');
    }
  } else {
    zoneVel -= FISHING_CONFIG.ZONE_GRAVITY * dt;
  }
  zoneVel = clamp(zoneVel, -FISHING_CONFIG.ZONE_MAX_SPEED, FISHING_CONFIG.ZONE_MAX_SPEED);
  zoneY += zoneVel * dt;

  if (zoneY < 0) {
    zoneY = 0;
    zoneVel = 0;
  } else if (zoneY > 100 - zoneH) {
    zoneY = 100 - zoneH;
    zoneVel = 0;
  }

  // 5. 물고기 이동 (스턴 중이면 가만히 정지해 있음!)
  if (qteStunTimer <= 0) {
    targetTimer -= dt;
    if (targetTimer <= 0) {
      targetY = Math.random() * 100;
      targetTimer = diffSettings.targetIntervalSec;
    }

    const dist = targetY - fishY;
    const step = diffSettings.fishSpeed * dt;
    if (Math.abs(dist) <= step) {
      fishY = targetY;
    } else {
      fishY += Math.sign(dist) * step;
    }
    fishY = clamp(fishY, 0, 100);
  }

  // 6. 진행도 증감
  const inZone = fishY >= zoneY && fishY <= zoneY + zoneH;
  if (inZone) {
    // 잡기 영역 안
    const rod = RODS[window.__currentRodId || 'bamboo'] || RODS.bamboo;
    const mult = rod.reelMultiplier || 1.0;
    progress += FISHING_CONFIG.PROGRESS_GAIN * mult * dt;
  } else {
    // 밖 (스턴 중일 때는 패널티 절반)
    const penalty = qteStunTimer > 0 ? diffSettings.progressLoss * 0.5 : diffSettings.progressLoss;
    progress -= penalty * dt;
  }
  progress = clamp(progress, 0, 100);
}

function updateReelDOM() {
  const fishEl = document.getElementById('reel-fish');
  const zoneEl = document.getElementById('reel-zone');
  const progressFill = document.getElementById('reel-progress-fill');
  const progressText = document.getElementById('reel-progress-text');
  const timeText = document.getElementById('reel-time-text');

  if (fishEl) {
    // 바닥이 0이므로 bottom: fishY%
    fishEl.style.bottom = `${fishY}%`;
    if (qteStunTimer > 0) {
      fishEl.textContent = '💫'; // 기절 상태 표시
    } else {
      fishEl.textContent = currentFish ? currentFish.emoji : '🐟';
    }
  }

  if (zoneEl) {
    zoneEl.style.bottom = `${zoneY}%`;
    zoneEl.style.height = `${zoneH}%`;

    const inZone = fishY >= zoneY && fishY <= zoneY + zoneH;
    if (inZone) {
      zoneEl.classList.add('is-hooked');
    } else {
      zoneEl.classList.remove('is-hooked');
    }
  }

  if (progressFill) {
    progressFill.style.width = `${progress}%`;
  }
  if (progressText) {
    progressText.textContent = `${Math.round(progress)}%`;
  }
  if (timeText) {
    timeText.textContent = `${Math.ceil(timeLeft)}초`;
  }
}

function finishGame(result) {
  isReeling = false;
  isHolding = false;
  qteActive = false;

  const qteContainer = document.getElementById('reel-qte-container');
  if (qteContainer) {
    qteContainer.hidden = true;
  }

  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }

  const panel = document.getElementById('reel-panel');
  if (panel) {
    panel.hidden = true;
  }

  if (onFinishCallback) {
    onFinishCallback(result, currentFish);
  }
}
