const api = globalThis.browser || globalThis.chrome;

api.storage.local.get({ enabled: true }, ({ enabled }) => {
  document.getElementById('statusText').textContent = enabled ? 'Filtering is on' : 'Filtering is paused';
  document.querySelector('.dot').style.color = enabled ? '#86efac' : '#fbbf24';
});

document.getElementById('openSettings').addEventListener('click', () => {
  api.runtime.openOptionsPage();
});
