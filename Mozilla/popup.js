function parseColor(val) {
  if (!val) return '';
  val = val.trim();
  if (val.startsWith('#') || val.startsWith('rgb') || val.startsWith('hsl') || /^[a-zA-Z]+$/.test(val)) {
    return val;
  }
  const parts = val.split(/[\s,]+/);
  if (parts.length >= 3) {
    const r = parseInt(parts[0]);
    const g = parseInt(parts[1]);
    const b = parseInt(parts[2]);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
  return val;
}

function formatColorForInput(val) {
  if (!val) return '';
  val = val.trim();
  const match = val.match(/^rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\)$/i);
  if (match) {
    return `${match[1]}, ${match[2]}, ${match[3]}`;
  }
  return val;
}

function getRgbComponents(colorStr) {
  const temp = document.createElement('div');
  temp.style.color = colorStr;
  document.body.appendChild(temp);
  const resolved = window.getComputedStyle(temp).color;
  document.body.removeChild(temp);
  
  const match = resolved.match(/^rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3])
    };
  }
  return { r: 30, g: 41, b: 59 };
}

function colorToHex(colorStr) {
  const { r, g, b } = getRgbComponents(colorStr);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Light theme contrast check helper
function isLightColor(colorStr) {
  const { r, g, b } = getRgbComponents(colorStr);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 180;
}

function applyThemeStyles(bgColor, textColor) {
  const parsedBg = parseColor(bgColor) || '#1e293b';
  const parsedText = parseColor(textColor) || '#ffffff';
  
  document.body.style.backgroundColor = parsedBg;
  document.getElementById('time').style.color = parsedText;
  
  const isLight = isLightColor(parsedBg);
  if (isLight) {
    document.body.classList.add('theme-light');
  } else {
    document.body.classList.remove('theme-light');
  }
}

// Convert HSV (h: 0-360, s: 0-1, v: 0-1) to RGB ({r, g, b})
function hsvToRgb(h, s, v) {
  let r, g, b;
  const i = Math.floor(h / 60) % 6;
  const f = h / 60 - Math.floor(h / 60);
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// Convert RGB (r, g, b: 0-255) to HSV ({h: 0-360, s: 0-1, v: 0-1})
function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: s,
    v: v
  };
}

// Picker State
let currentHue = 0;
let currentSaturation = 0;
let currentVal = 1;
let editingProperty = ''; // 'bgColor' or 'textColor'
let isDragging = false;

const colorBlock = document.getElementById('color-block');
const colorCursor = document.getElementById('color-cursor');
const hueSlider = document.getElementById('hue-slider');

function updateColorFromHSV() {
  const { r, g, b } = hsvToRgb(currentHue, currentSaturation, currentVal);
  const rgbString = `rgb(${r}, ${g}, ${b})`;
  const hexString = colorToHex(rgbString);
  
  document.getElementById('picker-preview').style.backgroundColor = rgbString;
  document.getElementById('picker-hex').innerText = hexString;
  
  const bgInput = document.getElementById('input-bg-color');
  const textInput = document.getElementById('input-text-color');
  const btnPickerBg = document.getElementById('btn-picker-bg');
  const btnPickerText = document.getElementById('btn-picker-text');
  
  if (editingProperty === 'bgColor') {
    bgInput.value = formatColorForInput(rgbString);
    btnPickerBg.style.backgroundColor = rgbString;
    applyThemeStyles(rgbString, textInput.value);
    chrome.storage.local.set({ bgColor: rgbString });
  } else if (editingProperty === 'textColor') {
    textInput.value = formatColorForInput(rgbString);
    btnPickerText.style.backgroundColor = rgbString;
    applyThemeStyles(bgInput.value, rgbString);
    chrome.storage.local.set({ textColor: rgbString });
  }
}

function handleColorBlockClick(e) {
  const rect = colorBlock.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  x = Math.max(0, Math.min(rect.width, x));
  y = Math.max(0, Math.min(rect.height, y));
  
  colorCursor.style.left = x + 'px';
  colorCursor.style.top = y + 'px';
  
  currentSaturation = x / rect.width;
  currentVal = 1 - (y / rect.height);
  
  updateColorFromHSV();
}

colorBlock.addEventListener('mousedown', (e) => {
  isDragging = true;
  handleColorBlockClick(e);
});

window.addEventListener('mousemove', (e) => {
  if (isDragging) {
    handleColorBlockClick(e);
  }
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

hueSlider.addEventListener('input', (e) => {
  currentHue = parseInt(e.target.value);
  colorBlock.style.backgroundColor = `hsl(${currentHue}, 100%, 50%)`;
  updateColorFromHSV();
});

function openColorPicker(property, colorStr, titleText) {
  editingProperty = property;
  document.getElementById('picker-title').innerText = titleText;
  
  const { r, g, b } = getRgbComponents(colorStr);
  const { h, s, v } = rgbToHsv(r, g, b);
  
  currentHue = h;
  currentSaturation = s;
  currentVal = v;
  
  hueSlider.value = h;
  colorBlock.style.backgroundColor = `hsl(${h}, 100%, 50%)`;
  
  // Set cursor position (block is 125x95px)
  const blockWidth = 125;
  const blockHeight = 95;
  const x = s * blockWidth;
  const y = (1 - v) * blockHeight;
  
  colorCursor.style.left = x + 'px';
  colorCursor.style.top = y + 'px';
  
  const rgbString = `rgb(${r}, ${g}, ${b})`;
  document.getElementById('picker-preview').style.backgroundColor = rgbString;
  document.getElementById('picker-hex').innerText = colorToHex(rgbString);
  
  document.getElementById('app-container').className = 'app-container view-picker';
}

function initSettings(currentDuration, currentBg, currentText) {
  const slider = document.getElementById('input-duration');
  const valDuration = document.getElementById('val-duration');
  const bgInput = document.getElementById('input-bg-color');
  const textInput = document.getElementById('input-text-color');
  const btnPickerBg = document.getElementById('btn-picker-bg');
  const btnPickerText = document.getElementById('btn-picker-text');
  
  slider.value = currentDuration;
  valDuration.innerText = `(${currentDuration} min)`;
  
  bgInput.value = formatColorForInput(currentBg);
  textInput.value = formatColorForInput(currentText);
  btnPickerBg.style.backgroundColor = parseColor(currentBg);
  btnPickerText.style.backgroundColor = parseColor(currentText);
  
  slider.addEventListener('input', (e) => {
    valDuration.innerText = `(${e.target.value} min)`;
  });
  
  slider.addEventListener('change', async (e) => {
    const duration = parseInt(e.target.value);
    await chrome.storage.local.set({ timerDuration: duration });
    chrome.runtime.sendMessage({ action: "resetTimer" }).catch(() => {});
  });
  
  bgInput.addEventListener('change', async (e) => {
    const parsed = parseColor(e.target.value);
    await chrome.storage.local.set({ bgColor: parsed });
    btnPickerBg.style.backgroundColor = parsed;
    applyThemeStyles(parsed, textInput.value);
  });
  
  textInput.addEventListener('change', async (e) => {
    const parsed = parseColor(e.target.value);
    await chrome.storage.local.set({ textColor: parsed });
    btnPickerText.style.backgroundColor = parsed;
    applyThemeStyles(bgInput.value, parsed);
  });
  
  btnPickerBg.addEventListener('click', () => {
    openColorPicker('bgColor', parseColor(bgInput.value), 'Color de Fondo');
  });
  
  btnPickerText.addEventListener('click', () => {
    openColorPicker('textColor', parseColor(textInput.value), 'Color del Reloj');
  });
}

function updatePopup() {
  chrome.storage.local.get(["endTime"], (data) => {
    if (data.endTime) {
      let timeLeft = Math.max(0, Math.round((data.endTime - Date.now()) / 1000));
      let mins = Math.floor(timeLeft / 60);
      let secs = timeLeft % 60;
      document.getElementById("time").innerText = `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  });
}

// Navigation Events
document.getElementById('btn-settings').addEventListener('click', () => {
  document.getElementById('app-container').className = 'app-container view-settings';
});

document.getElementById('btn-back').addEventListener('click', () => {
  document.getElementById('app-container').className = 'app-container';
});

document.getElementById('btn-picker-back').addEventListener('click', () => {
  document.getElementById('app-container').className = 'app-container view-settings';
});

// Load saved settings on startup
chrome.storage.local.get(["timerDuration", "bgColor", "textColor"], (data) => {
  const duration = Math.min(29, data.timerDuration || 29);
  const bg = data.bgColor || '#1e293b';
  const text = data.textColor || '#ffffff';
  
  initSettings(duration, bg, text);
  applyThemeStyles(bg, text);
});

setInterval(updatePopup, 1000);
updatePopup();