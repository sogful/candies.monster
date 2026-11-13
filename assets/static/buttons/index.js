const stylesheet = document.createElement("link");
stylesheet.rel = "stylesheet";
stylesheet.href = "/assets/static/buttons/style.css";
document.head.append(stylesheet);
const tracked = new Set();

function resize(node) {
    const width = node.clientWidth;
    const height = node.clientHeight;
    if (!width || !height) return;
    const scale = Math.min(height / 138, width / 328);
    node.style.setProperty("--buttonvertical", Math.min(48 * scale, height / 2) + "px");
    node.style.setProperty("--buttonhorizontal", Math.min(105 * scale, width / 2) + "px");
}

const sizes = window.ResizeObserver ? new ResizeObserver(entries => {
    for (const entry of entries) resize(entry.target);
}) : null;

function track(node) {
    if (tracked.has(node)) return;
    tracked.add(node);
    sizes?.observe(node);
    resize(node);
}

function scan(root) {
    if (root.matches?.(".buttonart, .descbutton")) track(root);
    for (const node of root.querySelectorAll(".buttonart, .descbutton")) track(node);
}

new MutationObserver(changes => {
    for (const node of tracked) if (!node.isConnected) {sizes?.unobserve(node); tracked.delete(node)}
    for (const change of changes) for (const node of change.addedNodes) if (node.nodeType === 1) scan(node);
}).observe(document.documentElement, {childList: true, subtree: true});
window.addEventListener("resize", () => {for (const node of tracked) resize(node)}, {passive: true});
scan(document);
