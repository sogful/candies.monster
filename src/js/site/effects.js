import {startfavicon} from "/assets/static/js/images/favicon.js";

startfavicon({onimage(image) {
    window.sheetimg = image;
    if (document.documentElement.style.filter === "invert(1)") image.src = "/assets/images/misc/wonderful.png";
}}).catch(() => {});

/*//////////////////////////////////////////////////////////////////////*/

const canvas = document.querySelector(".effects");
const context = canvas?.getContext("2d");
const shadow = document.querySelector(".shadow");
const drops = [];
let sprites = [];
let sheet = null;
let width = innerWidth;
let height = innerHeight;
let ratio = 1;
let limit = 0;
let frame = 0;
let previous = 0;
let suspended = false;
let interval = 1000 / 30;
let expensive = 0;
let loading = null;

function resize() {
    width = innerWidth;
    height = innerHeight;
    const limited = width <= 700 || navigator.hardwareConcurrency <= 4 || navigator.deviceMemory <= 4;
    const budget = limited ? 650000 : 1500000;
    ratio = Math.min(limited ? 0.85 : 1, Math.sqrt(budget / (width * height)));
    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(height * ratio));
    document.documentElement.style.setProperty("--shadowsize", `${Math.hypot(width, height) * 1.5}px`);
    limit = Math.min(limited ? 14 : 36, Math.max(8, Math.round(width * height / 26000)));
    if (navigator.connection?.saveData) limit = Math.min(limit, 6);
    drops.length = Math.min(drops.length, limit);
    while (sprites.length && drops.length < limit) drops.push(particle(true));
    paint(0);
}

function particle(warm = false) {
    const sprite = sprites[Math.floor(Math.random() * sprites.length)].frame;
    const size = 24 + Math.random() * 32;
    return {
        sprite, size, x: Math.random() * width,
        y: warm ? Math.random() * (height + size) - size : -size,
        speed: 40 + Math.random() * 80,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random())
    };
}

/*//////////////////////////////////////////////////////////////////////*/

function paint(seconds) {
    if (!context) return;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    if (sheet) {
        for (let index = 0; index < drops.length; index++) {
            let drop = drops[index];
            drop.y += drop.speed * seconds;
            drop.angle += drop.spin * seconds;
            if (drop.y > height + drop.size) drop = drops[index] = particle();
            const sprite = drop.sprite;
            const scale = drop.size / Math.max(sprite.w, sprite.h);
            context.save();
            context.globalAlpha = Math.min(0.5, Math.max(0, drop.y / 80));
            context.translate(drop.x, drop.y);
            context.rotate(drop.angle);
            context.drawImage(sheet, sprite.x, sprite.y, sprite.w, sprite.h, -sprite.w * scale / 2, -sprite.h * scale / 2, sprite.w * scale, sprite.h * scale);
            context.restore();
        }
    }
}

function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
}

function tick(now) {
    frame = 0;
    if (document.hidden || suspended || !canvas.isConnected) return;
    if (!previous || now - previous >= interval - 1) {
        const elapsed = previous ? Math.min((now - previous) / 1000, 0.1) : 0;
        previous = now;
        const started = performance.now();
        paint(elapsed);
        expensive += performance.now() - started > 10 ? 1 : -0.25;
        expensive = Math.max(0, expensive);
        if (expensive > 12) {
            interval = 1000 / 20;
            limit = Math.max(6, Math.floor(limit * 0.75));
            drops.length = Math.min(drops.length, limit);
            expensive = 0;
        }
    }
    frame = requestAnimationFrame(tick);
}

function resume() {
    stop();
    const covered = document.documentElement.matches(".documentopen.documentdocumentation, .gameloading, .gameopen, .previewopen, .levelopen");
    shadow?.classList.toggle("paused", document.hidden || suspended || covered);
    if (document.hidden || suspended || covered || !canvas?.isConnected) return;
    loadrain();
    frame = requestAnimationFrame(tick);
}

/*//////////////////////////////////////////////////////////////////////*/

function image(url) {
    return new Promise((resolve, reject) => {
        const bitmap = new Image();
        bitmap.decoding = "async";
        bitmap.fetchPriority = "low";
        bitmap.onload = () => resolve(bitmap);
        bitmap.onerror = reject;
        bitmap.src = url;
    });
}

function loadrain() {
    if (sheet || loading) return;
    loading = Promise.all([
        image("/assets/images/candies/candieslow.webp"),
        fetch("/assets/images/candies/candies.json").then(response => {
            if (!response.ok) throw new Error("Candy metadata unavailable");
            return response.json();
        })
    ]).then(([bitmap, metadata]) => {
        sheet = bitmap;
        sprites = metadata.frames.map(sprite => ({...sprite, frame: Object.fromEntries(Object.entries(sprite.frame).map(([key, value]) => [key, value / 2]))})).filter(sprite => {
            const frame = sprite.frame;
            return frame && frame.w > 0 && frame.h > 0 && frame.x >= 0 && frame.y >= 0;
        });
        resize();
        resume();
    }).catch(() => {loading = null});
}

if (context) {
    resize();
    resume();
    document.addEventListener("visibilitychange", resume);
    document.addEventListener("homeviewchange", resume);
    document.addEventListener("levelviewchange", resume);
    document.addEventListener("previewviewchange", resume);
    document.addEventListener("gameviewchange", resume);
    window.addEventListener("resize", resize, {passive: true});
    window.addEventListener("hashchange", resume);
    window.addEventListener("popstate", resume);
    window.addEventListener("pagehide", () => {suspended = true; resume()});
    window.addEventListener("pageshow", () => {suspended = false; resume()});
}
