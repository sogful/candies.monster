const pending = new Set();
let frame = 0;

/*//////////////////////////////////////////////////////////////////////*/

function updatequality(image) {
    if (!image.isConnected) return;
    const source = image.getAttribute("src") || "";
    const game = source.match(/^(\/assets\/images\/gameicons\/.+)\/(?:64|128|256)\.webp$/);
    const button = source.match(/^\/assets\/images\/downloadbuttons\/(?:48\/|96\/)?([^/]+\.webp)$/);
    if (!game && !button) return;
    const width = image.getBoundingClientRect().width || image.width;
    if (!width) return;
    const scale = (window.visualViewport?.scale || 1) * (window.devicePixelRatio || 1);
    const pixels = width * scale;
    const size = game ? (pixels > 128.5 ? 256 : pixels > 64.5 ? 128 : 64) : (pixels > 48.5 ? 96 : pixels > 24.5 ? 48 : 24);
    const target = game ? `${game[1]}/${size}.webp` : `/assets/images/downloadbuttons/${size > 24 ? `${size}/` : ""}${button[1]}`;
    if (image.hasAttribute("srcset") && image.getAttribute("srcset") !== `${target} 1x`) image.srcset = `${target} 1x`;
    if (source !== target) image.src = target;
}

function schedule(image) {
    if (image instanceof HTMLImageElement) pending.add(image);
    if (frame || !pending.size) return;
    frame = requestAnimationFrame(() => {
        frame = 0;
        const images = [...pending];
        pending.clear();
        images.forEach(updatequality);
    });
}

function collect(node) {
    if (!(node instanceof Element)) return;
    if (node instanceof HTMLImageElement) schedule(node);
    node.querySelectorAll("img").forEach(schedule);
}

/*//////////////////////////////////////////////////////////////////////*/

new MutationObserver(records => {
    records.forEach(record => {
        if (record.type === "attributes") schedule(record.target);
        else record.addedNodes.forEach(collect);
    });
}).observe(document.body, {childList: true, subtree: true, attributes: true, attributeFilter: ["src"]});

window.visualViewport?.addEventListener("resize", () => collect(document.body), {passive: true});
window.addEventListener("resize", () => collect(document.body), {passive: true});
collect(document.body);
