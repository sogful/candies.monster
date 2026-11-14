let started = false;
let loading = false;
let pendingframe = 0;
let pendingidle = 0;
let pendingtimeout = 0;
let timer = 0;
let index = 0;
let generation = 0;
let frames = [];
let metadata = null;
let loaded = false;
let link = null;
let canvas = null;
let context = null;
let resolveimage;
const ready = new Promise(resolve => {resolveimage = resolve});
const image = new Image();
const encoded = new Map();
const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

/*//////////////////////////////////////////////////////////////////////*/

function stop() {
    if (timer) clearTimeout(timer);
    timer = 0;
}

function render() {
    if (document.hidden || !loaded || !frames.length) return;
    const frame = frames[index].frame;
    try {
        if (!encoded.has(index)) {
            if (!canvas) {
                canvas = document.createElement("canvas");
                context = canvas.getContext("2d");
            }
            canvas.width = frame.w;
            canvas.height = frame.h;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, frame.x, frame.y, frame.w, frame.h, 0, 0, frame.w, frame.h);
            encoded.set(index, canvas.toDataURL("image/png"));
        }
        if (!link) {
            link = document.querySelector('link[rel="icon"]');
            if (!link) {
                link = document.createElement("link");
                link.rel = "icon";
                link.type = "image/png";
                document.head.appendChild(link);
            }
        }
        const href = encoded.get(index);
        if (link.href !== href) link.href = href;
    } catch (error) {
        loaded = false;
        stop();
        resolveimage(null);
    }
}

function animate() {
    stop();
    if (document.hidden || motion.matches || !loaded || !frames.length) return;
    timer = setTimeout(() => {
        timer = 0;
        index = (index + 1) % frames.length;
        render();
        animate();
    }, 300);
}

function getframes() {
    if (!metadata) {
        metadata = fetch("/assets/images/candies/icon.json")
            .then(response => {
                if (!response.ok) throw new Error("favicon frames unavailable");
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data.frames) || !data.frames.length) throw new Error("favicon frames unavailable");
                frames = data.frames;
            });
    }
    return metadata;
}

async function imagechanged() {
    const current = ++generation;
    const source = image.src;
    loaded = false;
    stop();
    encoded.clear();
    index = 0;
    try {
        await getframes();
        if (current !== generation || image.src !== source || !image.complete || !image.naturalWidth) return;
        loaded = true;
        render();
        animate();
        resolveimage(image);
    } catch (error) {
        resolveimage(null);
    }
}

image.addEventListener("load", imagechanged);
image.addEventListener("error", () => {
    generation++;
    loaded = false;
    stop();
    resolveimage(null);
});

/*//////////////////////////////////////////////////////////////////////*/

function load() {
    pendingidle = 0;
    pendingtimeout = 0;
    if (document.hidden || loading) return;
    loading = true;
    getframes().catch(() => {resolveimage(null)});
    if (!image.getAttribute("src")) image.src = "/assets/images/candies/icon.webp";
    else if (image.complete && image.naturalWidth) imagechanged();
}

function queue() {
    if (document.hidden || loading || pendingframe || pendingidle || pendingtimeout) return;
    pendingframe = requestAnimationFrame(() => {
        pendingframe = requestAnimationFrame(() => {
            pendingframe = 0;
            if (document.hidden || loading) return;
            if ("requestIdleCallback" in window) pendingidle = window.requestIdleCallback(load, {timeout: 1500});
            else pendingtimeout = setTimeout(load, 200);
        });
    });
}

function pause() {
    stop();
    if (pendingframe) cancelAnimationFrame(pendingframe);
    if (pendingidle) window.cancelIdleCallback(pendingidle);
    if (pendingtimeout) clearTimeout(pendingtimeout);
    pendingframe = 0;
    pendingidle = 0;
    pendingtimeout = 0;
}

function resume() {
    if (document.hidden) return;
    if (!loading) queue();
    else if (loaded) {
        render();
        animate();
    }
}

function startfavicon({onimage} = {}) {
    if (typeof onimage === "function") onimage(image);
    if (!started) {
        started = true;
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", queue, {once: true});
        else queue();
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) pause();
            else resume();
        });
        window.addEventListener("pagehide", pause);
        window.addEventListener("pageshow", resume);
        const motionchange = () => {
            stop();
            if (!motion.matches) resume();
        };
        if (motion.addEventListener) motion.addEventListener("change", motionchange);
        else motion.addListener(motionchange);
    }
    return ready;
}

startfavicon();

/*//////////////////////////////////////////////////////////////////////*/

export {startfavicon};
