import {strand, paint} from "./physics.js";

export function morestuff() {
    const root = document.querySelector(".morestuff");
    const handle = root.querySelector(".ropehandle");
    const panel = root.querySelector(".frame");
    const canvas = document.createElement("canvas");
    canvas.className = "ropecanvas";
    canvas.setAttribute("aria-hidden", "true");
    root.prepend(canvas);
    const context = canvas.getContext("2d");
    const rope = strand();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let drop = 0;
    let sideways = 0;
    let velocity = 0;
    let horizontal = 0;
    let maximum = 300;
    let opened = false;
    let drag = null;
    let frame = 0;
    let last = 0;
    let accumulator = 0;
    let quiet = 0;
    let suppress = false;

    function measure() {
        const bounds = panel.getBoundingClientRect();
        const width = bounds.width || Math.min(400, root.clientWidth - 12);
        const height = bounds.height || width * 940 / 1700;
        maximum = height + 24;
        root.style.setProperty("--panelheight", height + "px");
        const right = width * 0.125 - 50;
        canvas.style.right = handle.style.right = right + "px";
        const scale = Math.min(1.5, devicePixelRatio || 1);
        canvas.width = Math.round(100 * scale);
        canvas.height = Math.round((maximum + 110) * scale);
        canvas.style.height = maximum + 110 + "px";
        context.setTransform(scale, 0, 0, scale, 0, 0);
        wake();
    }

    function position() {
        root.style.setProperty("--drop", drop + "px");
        handle.style.transform = "translate(" + sideways + "px," + (drop + 56) + "px)";
        panel.hidden = !opened && !drag && drop < 0.5;
        paint(context, rope.points);
    }

    function tick(time) {
        frame = 0;
        if (document.hidden) return;
        accumulator += Math.min(0.05, (time - (last || time - 16.667)) / 1000);
        last = time;
        let motion = 0;
        while (accumulator >= 1 / 60) {
            const target = opened ? maximum : 0;
            if (!drag) {
                velocity = (velocity + (target - drop) * 220 / 60) * Math.exp(-18 / 60);
                drop += velocity / 60;
                horizontal = (horizontal - sideways * 150 / 60) * Math.exp(-15 / 60);
                sideways += horizontal / 60;
            }
            if (reduced.matches && !drag) {
                drop = target;
                sideways = velocity = horizontal = 0;
                rope.reset(50, drop + 56);
            }
            rope.step(50 + sideways, drop + 56);
            motion = Math.abs(target - drop) + Math.abs(velocity) + Math.abs(sideways) + Math.abs(horizontal);
            accumulator -= 1 / 60;
        }
        position();
        quiet = !drag && motion < 0.05 ? quiet + 1 : 0;
        if (quiet < 24) frame = requestAnimationFrame(tick);
        else root.dataset.resting = "true";
    }

    function wake() {
        quiet = 0;
        delete root.dataset.resting;
        if (!frame && !document.hidden) {
            last = 0;
            frame = requestAnimationFrame(tick);
        }
    }

    function open(value) {
        opened = value;
        root.dataset.open = String(value);
        handle.setAttribute("aria-expanded", String(value));
        if (value) panel.hidden = false;
        panel.inert = !value;
        wake();
    }

    /*//////////////////////////////////////////////////////////////////////*/

    handle.addEventListener("pointerdown", event => {
        if (event.button !== 0) return;
        drag = {id: event.pointerId, x: event.clientX, y: event.clientY, start: drop, moved: false};
        handle.setPointerCapture(event.pointerId);
        wake();
    });
    handle.addEventListener("pointermove", event => {
        if (!drag || drag.id !== event.pointerId) return;
        const distance = event.clientY - drag.y;
        if (Math.abs(distance) + Math.abs(event.clientX - drag.x) > 5) drag.moved = true;
        drop = Math.max(0, Math.min(maximum + 28, drag.start + distance));
        sideways = Math.max(-28, Math.min(28, event.clientX - drag.x));
        wake();
    });
    function release(event) {
        if (!drag || drag.id !== event.pointerId) return;
        const moved = drag.moved;
        drag = null;
        suppress = moved;
        if (moved) open(drop > maximum * 0.35);
        else wake();
    }
    handle.addEventListener("pointerup", release);
    handle.addEventListener("pointercancel", event => {
        if (!drag || drag.id !== event.pointerId) return;
        drag = null;
        suppress = false;
        wake();
    });
    handle.addEventListener("lostpointercapture", release);
    handle.addEventListener("click", () => {
        if (suppress) {suppress = false; return}
        open(!opened);
    });
    root.querySelector(".adclose").addEventListener("click", () => {
        open(false);
        handle.focus({preventScroll: true});
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && opened) open(false);
    });
    document.addEventListener("click", event => {
        if (opened && !root.contains(event.target)) open(false);
    });
    document.addEventListener("homeviewchange", () => open(false));
    window.addEventListener("resize", measure, {passive: true});
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            cancelAnimationFrame(frame);
            frame = 0;
            drag = null;
        } else wake();
    });
    if (window.ResizeObserver) new ResizeObserver(measure).observe(root.parentElement);

    /*//////////////////////////////////////////////////////////////////////*/

    const ads = [...root.querySelectorAll(".carousel a")];
    let current = 0;
    function show(change) {
        current = (current + change + ads.length) % ads.length;
        ads.forEach((link, index) => {link.hidden = index !== current});
    }
    root.querySelector(".adleft").addEventListener("click", () => show(-1));
    root.querySelector(".adright").addEventListener("click", () => show(1));
    panel.inert = true;
    measure();
}
