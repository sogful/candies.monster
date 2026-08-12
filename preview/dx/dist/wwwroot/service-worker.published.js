// Kill switch, not an offline cache. This build no longer registers a service worker (see the
// inline script in index.html) - this file exists only to reach anyone whose browser is still
// running one from before that change and would otherwise stay stuck on it forever.
//
// The earlier worker's fetch handler served index.html straight out of Cache Storage for every
// navigation, without ever checking the network, and this build removed the update-prompt flow
// that used to be the only thing that could tell it to let go. A worker in that state has no way
// to notice a new deploy exists - it just keeps serving whatever it cached on its very first
// install, forever, with no error to point at, because every request "succeeds" from its own
// cache. Browsers always fetch a service worker's own script fresh off the network (never from
// HTTP cache, regardless of any other caching in play), so this file is the one thing guaranteed
// to actually reach an already-stuck client - once it does, it force-activates immediately,
// reloads every page it controls, and removes itself so nothing intercepts requests again.

self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(keys.map((key) => caches.delete(key)));

            const clientsList = await self.clients.matchAll({ type: "window" });
            for (const client of clientsList) {
                client.navigate(client.url);
            }

            await self.registration.unregister();
        })(),
    );
});
