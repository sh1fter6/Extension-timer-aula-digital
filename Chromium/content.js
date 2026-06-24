// Resetea el timer en cada navegación real dentro de auladigital.sence.cl.
// El content script se re-inyecta en cada carga de página (Moodle es server-side),
// así que este código corre automáticamente en cada click en un enlace real.

chrome.runtime.sendMessage({ action: "resetTimer" }).catch(() => {});

// Cubre también navegación SPA sin recarga (history.pushState)
const originalPushState = history.pushState.bind(history);
history.pushState = function(...args) {
  originalPushState(...args);
  chrome.runtime.sendMessage({ action: "resetTimer" }).catch(() => {});
};

window.addEventListener("popstate", () => {
  chrome.runtime.sendMessage({ action: "resetTimer" }).catch(() => {});
});