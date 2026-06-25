chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'play_sound') {
    const audio = new Audio(message.file);
    audio.play()
      .then(() => {
        audio.onended = () => {
          chrome.runtime.sendMessage({ action: 'close_offscreen' }).catch(() => {});
        };
      })
      .catch(err => console.error("Error playing audio in offscreen document:", err));
  }
});
