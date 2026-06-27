// Chrome MV3: usar chrome.alarms en lugar de setTimeout (el service worker puede suspenderse)
// Las variables se pierden al suspenderse — todo el estado va a chrome.storage.

async function resetTimer() {
  await chrome.alarms.clearAll();
  const data = await chrome.storage.local.get(["timerDuration"]);
  const duration = data.timerDuration || 29;
  const endTime = Date.now() + duration * 60 * 1000;
  await chrome.storage.local.set({ endTime });
  chrome.alarms.create("alarmaAula", { delayInMinutes: duration });
}

async function playSound() {
  try {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Alerta de sonido para la alarma de Aula Digital'
    });
  } catch (error) {
    if (!error.message.includes('Only a single offscreen document may be created')) {
      console.error('Error al crear el documento offscreen:', error);
    }
  }
  chrome.runtime.sendMessage({
    action: 'play_sound',
    file: 'sound.ogg'
  });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "alarmaAula") {
    playSound();
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon-48.png",
      title: "CLICK EN AULA DIGITAL",
      message: "Queda 1 minuto de actividad restante.",
      priority: 2,
      requireInteraction: true
    });
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "resetTimer") {
    resetTimer();
  } else if (request.action === "close_offscreen") {
    chrome.offscreen.closeDocument().catch(() => {});
  }
});