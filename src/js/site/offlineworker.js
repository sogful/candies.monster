const workers = navigator.serviceWorker;
let checked = 0;
let registration;

function publish(offline, dx) {
    document.documentElement.dataset.offlinedx = dx;
    document.dispatchEvent(new CustomEvent("offlinechange", {detail: {offline, dx}}));
}

async function status() {
    if (!workers?.controller) return;
    try {
        const response = await fetch("/offline/status", {cache: "no-store"});
        if (!response.ok) return;
        const data = await response.json();
        publish(!navigator.onLine || data.offline === true, data.dx || "");
    } catch {}
}

function prepare(force = false) {
    if (!registration?.active || !navigator.onLine || !force && Date.now() - checked < 300000) return;
    checked = Date.now();
    let quality = "medium";
    try {quality = localStorage.getItem("ctrdxquality")?.toLowerCase() || quality} catch {}
    registration.active.postMessage({type: "cache-offline", quality, reply: "cdm-offline"});
}

/*//////////////////////////////////////////////////////////////////////*/

function legacy(registration) {
    const root = "/preview/dx/dist/wwwroot/";
    const worker = registration.active || registration.waiting || registration.installing;
    if (!worker || new URL(registration.scope).pathname !== root) return false;
    return ["coi-sw.js", "service-worker.js", "service-worker.published.js"].some(name => new URL(worker.scriptURL).pathname === root + name);
}

if (workers) {
    workers.addEventListener("message", event => {
        if (["cdm-offline", "candies-offline"].includes(event.data?.type)) void status();
    });
    workers.addEventListener("controllerchange", () => {
        void status();
        prepare(true);
    });
    window.addEventListener("online", () => {
        registration?.active?.postMessage({type: "online"});
        publish(false, document.documentElement.dataset.offlinedx || "");
        prepare(true);
    });
    window.addEventListener("offline", () => {void status()});
    window.addEventListener("storage", event => {
        if (event.key === "ctrdxquality") prepare(true);
    });
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) prepare();
    });
    const start = async () => {
        try {
            await status();
            registration = await workers.getRegistration("/");
            if (!registration?.active) {
                await workers.register("/sw.js", {scope: "/"});
                registration = await workers.ready;
            }
            if (!navigator.onLine) return;
            void registration.update().catch(() => {});
            for (const old of await workers.getRegistrations()) {
                if (legacy(old)) await old.unregister();
            }
            await status();
            function warm() {
                if ("requestIdleCallback" in window) requestIdleCallback(() => prepare(), {timeout: 2000});
                else setTimeout(() => prepare(), 250);
            }
            if (document.readyState === "complete") warm();
            else window.addEventListener("load", warm, {once: true});
        } catch {}
    };
    void start();
}

if (navigator.storage?.persist) {
    async function persist() {
        window.removeEventListener("pointerdown", persist);
        window.removeEventListener("keydown", persist);
        try {
            if (!(await navigator.storage.persisted())) await navigator.storage.persist();
        } catch {}
    }
    window.addEventListener("pointerdown", persist, {passive: true});
    window.addEventListener("keydown", persist);
}
