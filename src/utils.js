const { Notice } = require("obsidian");

const DATA_FILE = 'supreme-player-data.json';
const SHOP_CONFIG_FILE = '.obsidian/plugins/supreme-player/shop-config.json';
const CONFIG_FILE = '.obsidian/plugins/supreme-player/config.json';

function showNotice(message) {
  new Notice(message);
}

function createElement(tag, styles, innerHTML) {
  const el = document.createElement(tag);
  if (styles) el.style.cssText = styles;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

function createButton(text, className, onClick) {
  const btn = document.createElement('button');
  btn.textContent = text;
  if (className) btn.className = className;
  if (onClick) btn.onclick = onClick;
  return btn;
}

function createFlexContainer(gap = '10px') {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.gap = gap;
  return container;
}

function renderEffectParams(type, effectParams) {
  effectParams.innerHTML = '';

  switch (type) {
    case 'add_wish_stars':
      effectParams.innerHTML = `<div style="margin-bottom: 5px;">获得愿星数量：</div><input type="number" id="effect-value" value="1" min="1" style="width: 100%;">`;
      break;
    case 'add_level':
      effectParams.innerHTML = `<div style="margin-bottom: 5px;">获得等级数量：</div><input type="number" id="effect-value" value="1" min="1" style="width: 100%;">`;
      break;
    case 'buff':
      effectParams.innerHTML = `
        <div style="margin-bottom: 5px;">Buff名称：</div>
        <input type="text" id="buff-name" placeholder="例如：好运气" style="width: 100%; margin-bottom: 10px;">
        <div style="margin-bottom: 5px;">Buff图标：</div>
        <input type="text" id="buff-icon" placeholder="例如：🍀" style="width: 100%; margin-bottom: 10px;">
        <div style="margin-bottom: 5px;">效果说明：</div>
        <input type="text" id="buff-desc" placeholder="例如：世界线已为你偏移" style="width: 100%; margin-bottom: 10px;">
        <div style="margin-bottom: 5px;">持续时间（小时）：</div>
        <input type="number" id="buff-duration" value="24" min="1" style="width: 100%;">
      `;
      break;
    case 'random_wish_stars':
      effectParams.innerHTML = `
        <div style="display: flex; gap: 10px;">
          <div style="flex: 1;"><div style="margin-bottom: 5px;">最小数量：</div><input type="number" id="effect-min" value="1" min="1" style="width: 100%;"></div>
          <div style="flex: 1;"><div style="margin-bottom: 5px;">最大数量：</div><input type="number" id="effect-max" value="5" min="1" style="width: 100%;"></div>
        </div>
      `;
      break;
    case 'add_points':
      effectParams.innerHTML = `<div style="margin-bottom: 5px;">获得积分数量：</div><input type="number" id="effect-value" value="100" min="1" style="width: 100%;">`;
      break;
  }
}

function buildEffectFromForm(category, effectType) {
  if (category !== 'system') return null;

  switch (effectType) {
    case 'add_wish_stars':
    case 'add_level':
    case 'add_points':
      return { type: effectType, value: parseInt(document.getElementById('effect-value')?.value) || 1 };
    case 'buff': {
      const buffName = document.getElementById('buff-name')?.value.trim();
      if (!buffName) {
        showNotice('❌ 请输入Buff名称');
        return null;
      }
      return {
        type: 'buff',
        buffName: buffName,
        buffIcon: document.getElementById('buff-icon')?.value.trim() || '🔮',
        buffDesc: document.getElementById('buff-desc')?.value.trim() || '',
        duration: parseInt(document.getElementById('buff-duration')?.value) || 24
      };
    }
    case 'random_wish_stars':
      return {
        type: effectType,
        min: parseInt(document.getElementById('effect-min')?.value) || 1,
        max: parseInt(document.getElementById('effect-max')?.value) || 5
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
