// Creates the WebGL2 context Skia renders into. Emscripten's GL registry is used
// rather than canvas.getContext directly, because Skia's GPU backend resolves its GL
// entry points through that registry - a context created outside it is invisible to Skia.

function getGL() {
    const gl = globalThis.ctrdxWasmModule?.GL;
    if (!gl) {
        throw new Error("Emscripten GL registry unavailable");
    }
    return gl;
}

// Fills the viewport exactly, at any aspect ratio - no letterboxing at this layer. Core's own
// ScreenPresentation (see ScreenPresentation.cs) already does "cover"-style scaling once it sees
// a non-16:9 surface (ScreenPresentation.FullScreenCropWidth, on by default): it fills the full
// height or width and crops the other axis rather than showing black bars, and every HUD element
// anchors off the resulting scaled-view edges (Canvas.xOffsetScaled) rather than a fixed 2560px
// reference, so this doesn't need to reproduce any of that letterboxing math here - just hand
// Core the real surface size and let it do what it already knows how to do.
export function fitCanvasToViewport(viewportWidth, viewportHeight) {
    return {
        width: Math.max(1, Math.round(viewportWidth)),
        height: Math.max(1, Math.round(viewportHeight)),
        left: 0,
        top: 0,
    };
}

function resizeViewportSurfaces(canvas) {
    const layout = fitCanvasToViewport(window.innerWidth, window.innerHeight);
    const width = `${layout.width}px`;
    const height = `${layout.height}px`;
    const left = `${layout.left}px`;
    const top = `${layout.top}px`;
    const surfaces = [canvas, document.getElementById("movie")];
    for (const surface of surfaces) {
        if (
            surface !== null &&
            (surface.style.width !== width ||
                surface.style.height !== height ||
                surface.style.left !== left ||
                surface.style.top !== top)
        ) {
            surface.style.width = width;
            surface.style.height = height;
            surface.style.left = left;
            surface.style.top = top;
        }
    }
}

export function createContext(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (canvas === null) {
        return 0;
    }
    resizeViewportSurfaces(canvas);
    const attributes = {
        alpha: 1,
        depth: 1,
        stencil: 8,
        antialias: 0,
        premultipliedAlpha: 1,
        preserveDrawingBuffer: 0,
        majorVersion: 2,
        minorVersion: 0,
        enableExtensionsByDefault: 1,
    };
    const GL = getGL();
    const handle = GL.createContext(canvas, attributes);
    if (!handle) {
        return 0;
    }
    GL.makeContextCurrent(handle);
    // Skia renders to the default framebuffer of the context it is handed.
    return 0;
}

export function canvasSize(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (canvas === null) {
        return [0, 0];
    }
    resizeViewportSurfaces(canvas);
    const ratio = Math.min(globalThis.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
    const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
    }
    return [width, height];
}

export function documentBaseUrl() {
    return document.baseURI;
}
