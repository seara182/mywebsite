// The CheapSeats web app moved from /app/ to /cheapseats/app/. This replaces
// the service worker that used to live here: it removes what the old one
// cached, unregisters itself and reloads open tabs, so they reach index.html
// and get forwarded instead of being served the old copy.
//
// Caches are shared per origin and the app at /cheapseats/app/ uses the same
// cache names, so only entries under this worker's own scope are deleted.

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const scope = self.registration.scope;
      for (const name of await caches.keys()) {
        const cache = await caches.open(name);
        const stale = (await cache.keys()).filter((req) => req.url.startsWith(scope));
        await Promise.all(stale.map((req) => cache.delete(req)));
      }
      await self.registration.unregister();
      const tabs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      const mine = tabs.filter((tab) => tab.url.startsWith(scope));
      await Promise.all(mine.map((tab) => tab.navigate(tab.url).catch(() => {})));
    })(),
  );
});
