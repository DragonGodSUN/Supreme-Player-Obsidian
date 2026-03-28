const { Notice } = require('obsidian');

const DATA_FILE = 'supreme-player-data.json';
const SHOP_CONFIG_FILE = '.obsidian/plugins/supreme-player/shop-config.json';
const CONFIG_FILE = '.obsidian/plugins/supreme-player/config.json';

function translate(t, key, variables) {
  return typeof t === 'function' ? t(key, variables) : key;
}

function showNotice(message) {
  new Notice(message);
}

function createElement(tag, styles, innerHTML) {
  const element = document.createElement(tag);
  if (styles) element.style.cssText = styles;
  if (innerHTML) element.innerHTML = innerHTML;
  return element;
}

function createButton(text, className, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  if (className) button.className = className;
  if (onClick) button.onclick = onClick;
  return button;
}

function createFlexContainer(gap = '10px') {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.gap = gap;
  return container;
}

function renderEffectParams(type, effectParams, t) {
  effectParams.innerHTML = '';

  switch (type) {
    case 'add_wish_stars':
    case 'add_level':
    case 'add_points': {
      effectParams.innerHTML = `
        <div style="margin-bottom: 5px;">${translate(t, 'effect.value')}</div>
        <input type="number" id="effect-value" value="${type === 'add_points' ? 100 : 1}" min="1" style="width: 100%;">
      `;
      break;
    }
    case 'buff':
      effectParams.innerHTML = `
        <div style="margin-bottom: 5px;">${translate(t, 'effect.buffName')}</div>
        <input type="text" id="buff-name" placeholder="${translate(t, 'common.placeholder')}：${translate(t, 'utils.buffNameExample')}" style="width: 100%; margin-bottom: 10px;">
        <div style="margin-bottom: 5px;">${translate(t, 'effect.buffIcon')}</div>
        <input type="text" id="buff-icon" placeholder="${translate(t, 'common.placeholder')}：✨" style="width: 100%; margin-bottom: 10px;">
        <div style="margin-bottom: 5px;">${translate(t, 'effect.buffDescription')}</div>
        <input type="text" id="buff-desc" placeholder="${translate(t, 'common.placeholder')}：${translate(t, 'utils.buffDescExample')}" style="width: 100%; margin-bottom: 10px;">
        <div style="margin-bottom: 5px;">${translate(t, 'effect.buffDuration')}</div>
        <input type="number" id="buff-duration" value="24" min="1" style="width: 100%;">
      `;
      break;
    case 'random_wish_stars':
      effectParams.innerHTML = `
        <div style="display: flex; gap: 10px;">
          <div style="flex: 1;">
            <div style="margin-bottom: 5px;">${translate(t, 'effect.min')}</div>
            <input type="number" id="effect-min" value="1" min="1" style="width: 100%;">
          </div>
          <div style="flex: 1;">
            <div style="margin-bottom: 5px;">${translate(t, 'effect.max')}</div>
            <input type="number" id="effect-max" value="5" min="1" style="width: 100%;">
          </div>
        </div>
      `;
      break;
  }
}

function buildEffectFromForm(category, effectType, t) {
  if (category !== 'system') {
    return null;
  }

  switch (effectType) {
    case 'add_wish_stars':
    case 'add_level':
    case 'add_points':
      return {
        type: effectType,
        value: parseInt(document.getElementById('effect-value')?.value, 10) || 1
      };
    case 'buff': {
      const buffName = document.getElementById('buff-name')?.value.trim();
      if (!buffName) {
        showNotice(translate(t, 'effect.enterBuffName'));
        return null;
      }
      return {
        type: 'buff',
        buffName,
        buffIcon: document.getElementById('buff-icon')?.value.trim() || '✨',
        buffDesc: document.getElementById('buff-desc')?.value.trim() || '',
        duration: parseInt(document.getElementById('buff-duration')?.value, 10) || 24
      };
    }
    case 'random_wish_stars':
      return {
        type: effectType,
        min: parseInt(document.getElementById('effect-min')?.value, 10) || 1,
        max: parseInt(document.getElementById('effect-max')?.value, 10) || 5
      };
    default:
      return null;
  }
}

module.exports = {
  DATA_FILE,
  SHOP_CONFIG_FILE,
  CONFIG_FILE,
  showNotice,
  createElement,
  createButton,
  createFlexContainer,
  renderEffectParams,
  buildEffectFromForm
};
