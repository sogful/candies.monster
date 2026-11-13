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
