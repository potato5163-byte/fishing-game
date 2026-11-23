import { FISHING_CONFIG, RODS } from './data.js';
import { clamp } from './utils.js';
import { playSound } from './sound.js';

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

export function startReelGame(fish, equippedRodId, onFinish) {
  currentFish = fish;
  onFinishCallback = onFinish;
  isReeling = true;
  isHolding = false;

  const rod = RODS[equippedRodId] || RODS.bamboo;
  zoneH = FISHING_CONFIG.ZONE_BASE_HEIGHT + (rod.zoneBonus || 0);
  zoneY = 50 - zoneH / 2;
  zoneVel = 0;

  fishY = 50;
  targetY = 50;
  targetTimer = 0;

  progress = FISHING_CONFIG.PROGRESS_START;
  timeLeft = FISHING_CONFIG.REEL_TIME_LIMIT_SEC;

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

  // 1. 제한 시간 감소
  timeLeft -= dt;
  if (timeLeft < 0) timeLeft = 0;

  // 2. 잡기 영역 가속도 & 위치
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

  // 3. 물고기 목표 위치 및 이동
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

  // 4. 진행도 증감
  const inZone = fishY >= zoneY && fishY <= zoneY + zoneH;
  if (inZone) {
    // 잡기 영역 안
    const rod = RODS[window.__currentRodId || 'bamboo'] || RODS.bamboo;
    const mult = rod.reelMultiplier || 1.0;
    progress += FISHING_CONFIG.PROGRESS_GAIN * mult * dt;
  } else {
    // 밖
    progress -= diffSettings.progressLoss * dt;
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
