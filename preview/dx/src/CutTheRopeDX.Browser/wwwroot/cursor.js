// Custom cursor, as a browser can do it.
//
// The desktop host swaps a native cursor between two bitmaps rather than drawing one into the
// scene, so the CSS equivalent is the faithful port: same two images, same top-left hotspot,
// and the pointer keeps the responsiveness of a real cursor instead of trailing a frame behind.
//
// Applied at native bitmap size regardless of the canvas's CSS size - this build's canvas is
// often shown much smaller than its 2560px-wide internal resolution (embedded in a preview
// tool), and a cursor scaled down to match would shrink to barely visible along with it.

const canvas = document.getElementById("game");
// The cutscene overlay covers the canvas, so a cursor set only there would be invisible
// for the whole of a cutscene - including the paused state, where Core asks for it back.
const surfaces = [canvas, document.getElementById("movie")];
const sources = {
    idle: "./content/images/cursor.webp",
    pressed: "./content/images/cursor_active.webp",
};

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
    const url = sources[pressed ? "pressed" : "idle"];
    for (const surface of surfaces) {
        surface.style.cursor = `url("${url}") 0 0, auto`;
    }
}

apply();

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
