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
setInterval(updatePopup, 1000);
updatePopup();