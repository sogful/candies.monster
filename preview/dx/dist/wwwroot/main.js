import { dotnet } from "./_framework/dotnet.js";
import { setLoadingProgress } from "./loading-progress.js";

const reportDownloadProgress = (loaded, total) => {
    setLoadingProgress("runtime", loaded, total);
};

const builder = dotnet
    .withDiagnosticTracing(false)
    .withApplicationArgumentsFromQuery();

// Probed rather than called outright: losing the counter is cosmetic, but throwing
// here would cost the whole app its boot.
if (typeof builder.withModuleConfig === "function") {
    builder.withModuleConfig({
        onDownloadResourceProgress: reportDownloadProgress,
    });
}

const runtime = await builder.create();
const config = runtime.getConfig();
globalThis.ctrdxWasmModule = runtime.Module;
await runtime.runMain(config.mainAssemblyName, []);

const exports = await runtime.getAssemblyExports(config.mainAssemblyName);
const canvas = document.getElementById("game");
const input = exports.CutTheRopeDX.Browser.InputRouter;
const loop = exports.CutTheRopeDX.Browser.GameLoop;

const toBacking = (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return [
        (event.clientX - rect.left) * scaleX,
        (event.clientY - rect.top) * scaleY,
    ];
};

const sendPointer = (event, phase) => {
    event.preventDefault();
    const [x, y] = toBacking(event);
    input.OnPointer(x, y, phase);
};

canvas.addEventListener("pointerdown", (event) => {
    canvas.setPointerCapture(event.pointerId);
    sendPointer(event, 0);
});
canvas.addEventListener("pointermove", (event) => sendPointer(event, 1));
canvas.addEventListener("pointerup", (event) => sendPointer(event, 2));
canvas.addEventListener("pointercancel", (event) => sendPointer(event, 2));

// Core scrolls in the desktop's wheel units: one notch is 120 and positive scrolls up. A
// WheelEvent reports the opposite sign and, depending on deltaMode, counts lines or pages
// rather than pixels — so both are normalized here and Core sees what it does on desktop.
const PIXELS_PER_NOTCH = 100;
const UNITS_PER_NOTCH = 120;
// Firefox reports one notch as three lines where other browsers report ~100px, so a line is
// worth a third of a notch here rather than a text line's height. Sizing it any other way
// makes the same wheel scroll a different distance per browser.
const PIXELS_PER_LINE = PIXELS_PER_NOTCH / 3;

canvas.addEventListener(
    "wheel",
    (event) => {
        event.preventDefault();
        const scale =
            event.deltaMode === 1
                ? PIXELS_PER_LINE
                : event.deltaMode === 2
                  ? canvas.clientHeight
                  : 1;
        const units =
            (-event.deltaY * scale * UNITS_PER_NOTCH) / PIXELS_PER_NOTCH;
        const rounded = Math.round(units);
        if (rounded !== 0) {
            input.OnWheel(rounded);
        }
    },
    // preventDefault needs a non-passive listener, which wheel handlers default to.
    { passive: false },
);

const sendKey = (event, down) => {
    if (["Space", "ArrowLeft", "ArrowRight"].includes(event.code)) {
        event.preventDefault();
    }
    input.OnKey(event.code, down);
};
globalThis.addEventListener("keydown", (event) => sendKey(event, true));
globalThis.addEventListener("keyup", (event) => sendKey(event, false));

// Visibility alone gates the loop - not focus. A standalone window losing focus while still
// visible is a real case (see the removed hasFocus() check's original reasoning below), but
// this build boots inside a level-editor preview embed, which frequently has neither focus nor
// a click yet on its very first load - gating the initial state on hasFocus() left it frozen
// until the player happened to click it, for no benefit here. A hidden tab still stops getting
// animation frames on its own regardless of this flag.
const syncActive = () => loop.SetActive(document.visibilityState === "visible");
document.addEventListener("visibilitychange", syncActive);
syncActive();

// Pausing already flushes the save, but a page can be discarded without ever going
// inactive first.
globalThis.addEventListener("pagehide", () => loop.Flush());

// Relays pointer-near-edge proximity to an embedding page (candies.monster's preview tool),
// which fades its own floating close/link/details chrome in near the edges of the page, out
// otherwise. That page's own `mousemove` listener never fires while the pointer is over this
// iframe - separate browsing contexts don't bubble pointer events across the boundary - so
// without this, once its chrome faded in it had no way to find out the pointer had moved on and
// never faded back out. Harmless (posts to nobody) when this page isn't actually embedded.
if (globalThis.parent !== globalThis) {
    const EDGE_THRESHOLD = 140;
    globalThis.addEventListener(
        "pointermove",
        (event) => {
            const near =
                event.clientX <= EDGE_THRESHOLD ||
                event.clientX >= globalThis.innerWidth - EDGE_THRESHOLD ||
                event.clientY <= EDGE_THRESHOLD ||
                event.clientY >= globalThis.innerHeight - EDGE_THRESHOLD;
            globalThis.parent.postMessage(
                { type: "ctrdx-edge-proximity", near },
                globalThis.location.origin,
            );
        },
        { passive: true },
    );
}

// No Play button gating this: the loading screen hides itself and gameplay starts ticking the
// moment the runtime and assets are ready. Audio unlocks separately on the player's first
// gesture (see audio.js) - browsers won't allow it any earlier regardless.
const frame = (timestamp) => {
    loop.Tick(timestamp);
    requestAnimationFrame(frame);
};
requestAnimationFrame(frame);
globalThis.ctrdxReady?.();
