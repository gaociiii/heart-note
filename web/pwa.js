if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(async () => {
    if (!document.getElementById('app')) return;
    const registration = await navigator.serviceWorker.ready;
    const prepareOffline = () => registration.active?.postMessage('prepare-offline');
    prepareOffline();
    window.addEventListener('online', prepareOffline);
  }).catch(error => console.warn('无法启用离线模式', error));
}
