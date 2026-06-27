const audio = new Audio('sound.ogg');
audio.preload = 'auto';

async function resetTimer() {
  await chrome.alarms.clearAll();
  const data = await chrome.storage.local.get(["timerDuration"]);
  const duration = data.timerDuration || 29;
  const endTime = Date.now() + duration * 60 * 1000;
  await chrome.storage.local.set({ endTime });
  chrome.alarms.create("alarmaAula", { delayInMinutes: duration });
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