async function resetTimer() {
  await chrome.alarms.clearAll();
  const endTime = Date.now() + 1740000; // 29 minutos en ms
  await chrome.storage.local.set({ endTime });
  chrome.alarms.create("alarmaAula", { delayInMinutes: 29 });
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
    chrome.notifications.create("alarmaAula", {
      type: "basic",
      iconUrl: "icon-48.png",
      title: "CLICK EN AULA DIGITAL",
      message: "Queda 1 minuto de actividad restante."
    });
    playSound();
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "resetTimer") {
    resetTimer();
  } else if (request.action === "close_offscreen") {
    chrome.offscreen.closeDocument().catch(() => {});
  }
});