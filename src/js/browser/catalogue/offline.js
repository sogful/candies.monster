const root = document.documentElement;
let catalogueoffline = false;

export function offline() {return root.classList.contains("offline")}

function setoffline(value) {
    if (offline() === value) return;
    root.classList.toggle("offline", value);
    document.dispatchEvent(new CustomEvent("libraryconnection", {detail: value}));
}

export function markoffline() {
    catalogueoffline = true;
    setoffline(true);
}

setoffline(navigator.onLine === false);
window.addEventListener("offline", () => setoffline(true));
window.addEventListener("online", () => {
    catalogueoffline = false;
    setoffline(false);
});
document.addEventListener("offlinechange", event => {
    if (typeof event.detail?.offline === "boolean") setoffline(catalogueoffline || event.detail.offline || navigator.onLine === false);
});
