// Custom cursor, as a browser can do it.
//
// The desktop host swaps a native cursor between two bitmaps rather than drawing one into the
// scene, so the CSS equivalent is the faithful port: same two images, same top-left hotspot,
// and the pointer keeps the responsiveness of a real cursor instead of trailing a frame behind.
//
// Rendered once at a fixed target size rather than either the raw source bitmap (62x71 native -
// disproportionately huge in an embed shown much smaller than the game's 2560px-wide internal
// resolution) or scaled to match the canvas's CSS size (the opposite problem - shrinks toward
// invisible in that same small embed). A typical OS cursor is roughly this tall; this just keeps
// it there regardless of how big or small the game itself is shown.

const TARGET_HEIGHT = 32;

const canvas = document.getElementById("game");
// The cutscene overlay and the loading screen both cover the canvas at one time or another, so
// a cursor set only there would be invisible during a cutscene (including the paused state,
// where Core asks for it back) or before the game has finished loading.
const surfaces = [
    canvas,
    document.getElementById("movie"),
    document.getElementById("betterLoader"),
];
const sources = {
    idle: "./content/images/cursor.webp",
    pressed: "./content/images/cursor_active.webp",
};

const rendered = {};
let enabled = true;
let pressed = false;

/** Applies the cursor the current state calls for. */
function apply() {
    if (!enabled) {
        for (const surface of surfaces) {
            surface.style.cursor = "none";
        }
        return;
    }
    const url = rendered[pressed ? "pressed" : "idle"];
    // Until the bitmap is rendered there is nothing to show, so the pointer stays the system one.
    const value = url ? `url("${url}") 0 0, auto` : "auto";
    for (const surface of surfaces) {
        surface.style.cursor = value;
    }
}

for (const [name, src] of Object.entries(sources)) {
    const image = new Image();
    image.decoding = "async";
    image.addEventListener("load", () => {
        const scale = TARGET_HEIGHT / image.naturalHeight;
        const target = document.createElement("canvas");
        target.width = Math.max(1, Math.round(image.naturalWidth * scale));
        target.height = Math.max(1, Math.round(image.naturalHeight * scale));
        target
            .getContext("2d")
            .drawImage(image, 0, 0, target.width, target.height);
        rendered[name] = target.toDataURL("image/png");
        apply();
    });
    image.src = src;
}

/**
 * Shows or hides the cursor over the canvas. Core hides it while a cutscene plays.
 *
 * @param {boolean} value
 */
export function setEnabled(value) {
    enabled = value;
    apply();
}

/**
 * Switches between the idle and pressed bitmaps.
 *
 * @param {boolean} value
 */
export function setPressed(value) {
    pressed = value;
    apply();
}
