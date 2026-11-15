export const configuration = (async () => {
    const response = await fetch("/assets/static/data/levels/levels.json");
    if (!response.ok) throw new Error("Catalogue unavailable");
    const settings = await response.json();
    if (["localhost", "127.0.0.1", "[::1]"].includes(location.hostname)) {
        try {
            const local = await fetch("/.claude/runtime/levels.json", {cache: "no-store"});
            if (local.ok) Object.assign(settings, await local.json());
        } catch {}
    }
    return settings;
})();
