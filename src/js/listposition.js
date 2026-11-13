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
