const CACHE = 'heart-notes-offline-v1';
const SNAPSHOT = '/__heart_notes_offline__';
const APP_PATHS = new Set(['/', '/index.html']);
const APP_ASSETS = new Set([
  '/style.css', '/refinement.css', '/host.css', '/seed.js', '/data.js',
  '/avatars.js', '/host-ui.js', '/app.js', '/icon.svg', '/pwa.js',
  ...Array.from({length: 10}, (_, index) => '/avatar-a' + (index + 1) + '.png')
]);

let pending = Promise.resolve();
function serialize(operation) {
  const result = pending.then(operation);
  pending = result.catch(() => {});
  return result;
}

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

async function prepareOffline() {
  const page = await fetch('/', {cache: 'no-store', redirect: 'manual'});
  const expires = Number(page.headers.get('X-Heart-Session-Expires'));
  if (page.type === 'opaqueredirect' || page.status === 303 || page.status === 401) {
    await caches.delete(CACHE);
    return;
  }
  if (!page.ok || expires <= Date.now() / 1000) return;

  const entries = await Promise.all(
    [['/', page], ...Array.from(APP_ASSETS, path => [path, fetch(path, {cache: 'no-store', redirect: 'error'})])]
      .map(async ([path, pendingResponse]) => {
        const response = await pendingResponse;
        if (!response.ok) throw new Error('Offline resource unavailable: ' + path);
        const binary = response.headers.get('Content-Type')?.startsWith('image/png');
        let body;
        if (binary) {
          const bytes = new Uint8Array(await response.arrayBuffer());
          let encoded = '';
          for (const byte of bytes) encoded += String.fromCharCode(byte);
          body = btoa(encoded);
        } else {
          body = await response.text();
        }
        return [path, {body, binary, headers: [...response.headers]}];
      })
  );
  // Store a complete snapshot at once so a failed refresh leaves the previous copy intact.
  const cache = await caches.open(CACHE);
  await cache.put(SNAPSHOT, new Response(JSON.stringify({expires, assets: Object.fromEntries(entries)})));
}

self.addEventListener('message', event => {
  if (event.data === 'prepare-offline' && event.source?.url &&
      APP_PATHS.has(new URL(event.source.url).pathname)) {
    event.waitUntil(serialize(prepareOffline).catch(() => {}));
  }
});

function offlinePage(message) {
  return new Response(
    '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>心动纸条</title><body><main><h1>心动纸条</h1><p>' + message + '</p><p><a href="/">重新打开</a></p></main></body></html>',
    {status: 503, headers: {'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-store'}}
  );
}

async function offlineAsset(path, navigation) {
  let snapshot;
  try {
    const stored = await caches.match(SNAPSHOT, {cacheName: CACHE});
    snapshot = await stored?.json();
  } catch {
    // Storage may be disabled or full.
  }
  if (snapshot?.expires > Date.now() / 1000) {
    const entry = snapshot.assets[APP_PATHS.has(path) ? '/' : path];
    if (entry) {
      // Snapshot bodies are reconstructed locally; remove stale transport headers.
      const headers = new Headers(entry.headers);
      headers.delete('Content-Length');
      headers.delete('Content-Encoding');
      const body = entry.binary
        ? Uint8Array.from(atob(entry.body), character => character.charCodeAt(0))
        : entry.body;
      return new Response(body, {headers});
    }
  }
  return navigation
    ? offlinePage('无法连接网络。请联网登录并打开主持页后再使用离线模式。')
    : Response.error();
}

async function networkFirst(request, path, navigation) {
  let response;
  try {
    response = await fetch(request);
  } catch {
    return offlineAsset(path, navigation);
  }
  const signedOut = response.status === 401 ||
    (navigation && APP_PATHS.has(path) && response.type === 'opaqueredirect') ||
    (navigation && path === '/login' && response.ok && !response.redirected);
  if (signedOut) await serialize(() => caches.delete(CACHE)).catch(() => {});
  return response;
}

self.addEventListener('fetch', event => {
  const {request} = event;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  const path = url.pathname;
  if (request.method === 'POST' && path === '/auth/logout') {
    event.respondWith(serialize(async () => {
      await caches.delete(CACHE).catch(() => {});
      return fetch(request);
    }));
    return;
  }
  if (request.method !== 'GET') return;
  const navigation = request.mode === 'navigate';
  if (navigation ? APP_PATHS.has(path) || path === '/login' : APP_ASSETS.has(path)) {
    event.respondWith(networkFirst(request, path, navigation));
  }
});
