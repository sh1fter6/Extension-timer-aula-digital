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

function initSettings(currentDuration, currentBg, currentText) {
  const slider = document.getElementById('input-duration');
  const valDuration = document.getElementById('val-duration');
  const bgInput = document.getElementById('input-bg-color');
  const textInput = document.getElementById('input-text-color');
  const pickerBg = document.getElementById('picker-bg-color');
  const pickerText = document.getElementById('picker-text-color');
  
  slider.value = currentDuration;
  valDuration.innerText = `(${currentDuration} min)`;
  
  bgInput.value = formatColorForInput(currentBg);
  textInput.value = formatColorForInput(currentText);
  pickerBg.value = colorToHex(currentBg);
  pickerText.value = colorToHex(currentText);
  
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
    pickerBg.value = colorToHex(parsed);
    applyThemeStyles(parsed, textInput.value);
  });
  
  pickerBg.addEventListener('input', async (e) => {
    const hexVal = e.target.value;
    bgInput.value = formatColorForInput(hexVal);
    await chrome.storage.local.set({ bgColor: hexVal });
    applyThemeStyles(hexVal, textInput.value);
  });
  
  textInput.addEventListener('change', async (e) => {
    const parsed = parseColor(e.target.value);
    await chrome.storage.local.set({ textColor: parsed });
    pickerText.value = colorToHex(parsed);
    applyThemeStyles(bgInput.value, parsed);
  });
  
  pickerText.addEventListener('input', async (e) => {
    const hexVal = e.target.value;
    textInput.value = formatColorForInput(hexVal);
    await chrome.storage.local.set({ textColor: hexVal });
    applyThemeStyles(bgInput.value, hexVal);
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
  document.getElementById('app-container').classList.add('show-settings');
});

document.getElementById('btn-back').addEventListener('click', () => {
  document.getElementById('app-container').classList.remove('show-settings');
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