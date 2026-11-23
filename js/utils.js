export function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

export function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function weightedPick(weights) {
  // weights 예시: { common: 60, rare: 28, epic: 10, legendary: 2 }
  const totalWeight = Object.values(weights).reduce((acc, w) => acc + w, 0);
  let randomVal = Math.random() * totalWeight;

  for (const [key, weight] of Object.entries(weights)) {
    if (randomVal < weight) {
      return key;
    }
    randomVal -= weight;
  }
  return Object.keys(weights)[0];
}

export function formatGold(num) {
  return Number(num || 0).toLocaleString('ko-KR');
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function formatMessage(template, params = {}) {
  let message = template;
  for (const [key, value] of Object.entries(params)) {
    message = message.replaceAll(`{${key}}`, value);
  }
  return message;
}
