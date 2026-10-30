self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
    event.waitUntil((async () => {
        const registration = self.registration;
        const scope = registration.scope;
        await registration.unregister();
        const clients = await self.clients.matchAll({type: "window"});
        for (const client of clients) {
            if (client.url.startsWith(scope)) await client.navigate(client.url);
        }
    })());
});
