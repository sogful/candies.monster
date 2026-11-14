let positions = {};
try {positions = JSON.parse(sessionStorage.getItem("levelpositions") || "{}")} catch {}
if (!positions || Array.isArray(positions) || typeof positions !== "object") positions = {};

export function readposition() {
    const key = location.pathname + location.search;
    const saved = positions[key];
    const page = Math.max(0, (Number(new URLSearchParams(location.search).get("page")) || 1) - 1);
    return saved && Number.isFinite(saved.page) && Number.isFinite(saved.scroll) ? saved : {page, scroll: 0};
}

/*//////////////////////////////////////////////////////////////////////*/

export function storeposition(key, page, scroll) {
    delete positions[key];
    positions[key] = {page, scroll};
    for (const old of Object.keys(positions).slice(0, -30)) delete positions[old];
}

window.addEventListener("pagehide", () => {
    try {sessionStorage.setItem("levelpositions", JSON.stringify(positions))} catch {}
});

/*//////////////////////////////////////////////////////////////////////*/

export function recentplays() {
    try {
        const data = JSON.parse(localStorage.getItem("playedlevels") || "{}");
        return Object.fromEntries(Object.entries(data).filter(([id, time]) => /^\d{1,22}$/.test(id) && Number.isFinite(time)));
    } catch {return {}}
}

/*//////////////////////////////////////////////////////////////////////*/

export function rememberlevel(entry) {
    const data = recentplays();
    data[entry.id] = Date.now();
    const recent = Object.fromEntries(Object.entries(data).sort((first, second) => second[1] - first[1]).slice(0, 100));
    try {localStorage.setItem("playedlevels", JSON.stringify(recent))} catch {}
    document.dispatchEvent(new Event("levelplayed"));
}
