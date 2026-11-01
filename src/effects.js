import {startfavicon} from "/assets/static/favicon.js";

startfavicon({onimage(image) {
    window.sheetimg = image;
    if (document.documentElement.style.filter === "invert(1)") {
        image.src = "/assets/images/wonderful.png";
    }
}}).catch(() => {});

/*//////////////////////////////////////////////////////////////////////*/

const container = document.querySelector(".rain");
const drops = new Set();
let frames = [];
let sheetwidth = 0;
let sheetheight = 0;
let loading = false;
let suspended = false;
let timer = 0;
let burst = 0;
let initial = 18;
let pendingframe = 0;
let pendingidle = 0;
let pendingtimeout = 0;

function pause() {
    clearInterval(timer);
    clearTimeout(burst);
    timer = 0;
    burst = 0;
    for (const drop of drops) {
        if (drop.motion.playState === "running") drop.motion.pause();
        if (drop.fade.playState === "running") drop.fade.pause();
    }
}

function remove(drop) {
    drops.delete(drop);
    drop.element.remove();
    drop.fade.cancel();
}

function stop() {
    pause();
    for (const drop of drops) {
        drop.motion.cancel();
        remove(drop);
    }
}

function spawn() {
    if (!container.isConnected) {
        stop();
        return;
    }
    if (document.hidden || suspended || drops.size >= 80 || !frames.length) return;
    const frame = frames[Math.floor(Math.random() * frames.length)].frame;
    const size = 24 + Math.random() * 32;
    const speed = 40 + Math.random() * 80;
    const rotation = Math.random() * 360;
    const spin = (Math.random() * 90 + 30) * (Math.random() < 0.5 ? -1 : 1);
    const x = Math.random() * window.innerWidth;
    const start = -size - Math.random() * window.innerHeight * 0.5;
    const end = window.innerHeight + size;
    const seconds = (end - start) / speed;
    const scale = size / Math.max(frame.w, frame.h);
    const element = document.createElement("div");
    element.className = "candy";
    element.style.width = `${frame.w * scale}px`;
    element.style.height = `${frame.h * scale}px`;
    element.style.backgroundPosition = `-${frame.x * scale}px -${frame.y * scale}px`;
    element.style.backgroundSize = `${sheetwidth * scale}px ${sheetheight * scale}px`;
    container.appendChild(element);
    const motion = element.animate([
        {transform: `translate(${x}px, ${start}px) rotate(${rotation}deg)`},
        {transform: `translate(${x}px, ${end}px) rotate(${rotation + spin * seconds}deg)`}
    ], {duration: seconds * 1000, easing: "linear", fill: "forwards"});
    const fade = element.animate([{opacity: 0}, {opacity: 1}], {
        duration: 1000,
        delay: -start / speed * 1000,
        easing: "linear",
        fill: "forwards"
    });
    const drop = {element, motion, fade};
    drops.add(drop);
    motion.finished.then(() => remove(drop), () => remove(drop));
}

function fill() {
    burst = 0;
    if (document.hidden || suspended || !container.isConnected) return;
    spawn();
    initial--;
    if (initial > 0) burst = setTimeout(fill, 15);
}

function resume() {
    if (!container.isConnected) {
        stop();
        return;
    }
    if (document.hidden || suspended || !frames.length) return;
    for (const drop of drops) {
        if (drop.motion.playState === "paused") drop.motion.play();
        if (drop.fade.playState === "paused") drop.fade.play();
    }
    if (!timer) timer = setInterval(spawn, 360);
    if (initial > 0 && !burst) fill();
}

async function load() {
    if (loading || frames.length || document.hidden || suspended || !container.isConnected) return;
    loading = true;
    try {
        const image = new Image();
        image.decoding = "async";
        image.fetchPriority = "low";
        const ready = new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = reject;
        });
        image.src = "/assets/images/candies/candies.webp";
        const [metadata] = await Promise.all([
            fetch("/assets/images/candies/candies.json").then(response => {
                if (!response.ok) throw new Error("Candy metadata unavailable");
                return response.json();
            }),
            ready
        ]);
        frames = metadata.frames;
        sheetwidth = Math.max(...frames.map(sprite => sprite.frame.x + sprite.frame.w));
        sheetheight = Math.max(...frames.map(sprite => sprite.frame.y + sprite.frame.h));
        resume();
    } catch (error) {
        stop();
    } finally {
        loading = false;
    }
}

function schedule() {
    if (!container || !container.isConnected || document.hidden || suspended) return;
    if (frames.length) {
        resume();
        return;
    }
    if (loading || pendingframe || pendingidle || pendingtimeout) return;
    pendingframe = requestAnimationFrame(() => {
        pendingframe = 0;
        if ("requestIdleCallback" in window) {
            pendingidle = requestIdleCallback(() => {
                pendingidle = 0;
                load();
            }, {timeout: 1000});
        } else {
            pendingtimeout = setTimeout(() => {
                pendingtimeout = 0;
                load();
            }, 0);
        }
    });
}

function cancel() {
    cancelAnimationFrame(pendingframe);
    if (pendingidle) cancelIdleCallback(pendingidle);
    clearTimeout(pendingtimeout);
    pendingframe = 0;
    pendingidle = 0;
    pendingtimeout = 0;
    pause();
}

document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancel();
    else schedule();
});
window.addEventListener("pagehide", () => {
    suspended = true;
    cancel();
});
window.addEventListener("pageshow", () => {
    suspended = false;
    schedule();
});
schedule();
