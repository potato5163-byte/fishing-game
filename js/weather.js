// 날씨 시스템 (맑음, 비, 안개, 밤)
export const WeatherType = {
  SUNNY: 'sunny',
  RAINY: 'rainy',
  FOGGY: 'foggy',
  NIGHT: 'night',
};

export const WEATHERS = {
  sunny: { id: 'sunny', name: '맑음', emoji: '☀️', bonusRarity: null },
  rainy: { id: 'rainy', name: '비', emoji: '🌧️', bonusRarity: 'rare' },
  foggy: { id: 'foggy', name: '안개', emoji: '🌫️', bonusRarity: 'epic' },
  night: { id: 'night', name: '밤하늘', emoji: '🌙', bonusRarity: 'legendary' },
};

let currentWeather = WeatherType.SUNNY;

export function getCurrentWeather() {
  return currentWeather;
}

export function cycleWeather() {
  const list = [WeatherType.SUNNY, WeatherType.RAINY, WeatherType.FOGGY, WeatherType.NIGHT];
  const nextIdx = (list.indexOf(currentWeather) + 1) % list.length;
  currentWeather = list[nextIdx];
  updateWeatherVisual();
  return WEATHERS[currentWeather];
}

export function updateWeatherVisual() {
  if (typeof document === 'undefined') return;
  const scene = document.getElementById('fishing-scene');
  const weatherBadge = document.getElementById('fishing-weather-badge');

  if (weatherBadge) {
    const w = WEATHERS[currentWeather];
    weatherBadge.textContent = `${w.emoji} ${w.name}`;
  }

  if (scene) {
    scene.classList.remove('weather-sunny', 'weather-rainy', 'weather-foggy', 'weather-night');
    scene.classList.add(`weather-${currentWeather}`);
  }
}
