const audio = new Audio('sound.ogg');
audio.preload = 'auto';

async function resetTimer() {
  await chrome.alarms.clearAll();
  const endTime = Date.now() + 1740000; // 29 minutos en ms
  await chrome.storage.local.set({ endTime });
  chrome.alarms.create("alarmaAula", { delayInMinutes: 29 });
}

function playSound() {
  audio.currentTime = 0;
  audio.play().catch(error => {
    console.error('Error al reproducir sonido:', error);
  });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "alarmaAula") {
    playSound();
    chrome.notifications.create("alarmaAula", {
      type: "basic",
      iconUrl: "icon-48.png",
      title: "CLICK EN AULA DIGITAL",
      message: "Queda 1 minuto de actividad restante."
    });
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "resetTimer") {
    resetTimer();
  }
});