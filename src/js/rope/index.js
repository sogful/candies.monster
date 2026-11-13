import {strand, paint} from "./physics.js";
import {dangle, resist, transition, advance} from "./motion.js";

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
    const hang = 16;
    const lift = {value: 0, velocity: 0};
    const sway = {value: 0, velocity: 0};
    const shade = document.createElement("div");
    shade.className = "addim";
    shade.setAttribute("aria-hidden", "true");
    root.before(shade);
    let bodylift = 0;
    let timeline = null;
    let width = 400;
    let height = width * 940 / 1700;
    let origin = 0;
    let maximum = 300;
    let opened = false;
    let drag = null;
    let frame = 0;
    let last = 0;
    let accumulator = 0;
    let quiet = 0;
    let suppress = false;

    function measure() {
        width = Math.min(400, root.clientWidth - 12);
        height = width * 940 / 1700;
        origin = root.clientWidth - width * (1 - 1486 / 1700);
        maximum = height;
        root.style.setProperty("--panelheight", height + "px");
        const scale = Math.min(1.5, devicePixelRatio || 1);
        canvas.width = Math.round(root.clientWidth * scale);
        const available = root.parentElement.clientHeight;
        canvas.height = Math.round(available * scale);
        canvas.style.height = available + "px";
        context.setTransform(scale, 0, 0, scale, 0, 0);
        const mount = buckle();
        rope.reset(origin + sway.value, lift.value + hang, mount.x, mount.y);
        position();
        wake();
    }

    function buckle() {
        return {x: origin, y: bodylift - height * (1 - 900 / 940)};
    }

    function position() {
        panel.style.transform = "translate3d(0," + bodylift + "px,0)";
        handle.style.transform = "translate3d(" + sway.value + "px," + (lift.value + hang - 4) + "px,0)";
        const mount = buckle();
        const angle = Math.atan2(-sway.value, lift.value + hang - mount.y) * 180 / Math.PI;
        handle.style.setProperty("--ringangle", angle + "deg");
        const openness = Math.max(0, Math.min(1, bodylift / maximum));
        shade.style.opacity = String(openness * 0.5);
        shade.style.pointerEvents = openness > 0.01 ? "auto" : "none";
        panel.hidden = !opened && !drag && bodylift < 0.2;
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
            const previous = bodylift;
            if (!drag) {
                if (!timeline && Math.abs(target - bodylift) > 0.01) timeline = transition(bodylift, target, opened);
                if (timeline) {
                    bodylift = advance(timeline);
                    if (timeline.finished) timeline = null;
                }
                const mount = buckle();
                dangle(sway, lift, mount, hang - 5 + height * (1 - 900 / 940), (bodylift - previous) * 60, hang);
            }
            const mount = buckle();
            rope.step(origin + sway.value, lift.value + hang, mount.x, mount.y);
            motion = (timeline ? 1 : 0) + Math.abs(target - bodylift) + Math.abs(lift.velocity) + Math.abs(sway.velocity);
            accumulator -= 1 / 60;
        }
        position();
        quiet = !drag && motion < 0.05 ? quiet + 1 : 0;
        if (quiet < 12) frame = requestAnimationFrame(tick);
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
        timeline = transition(bodylift, value ? maximum : 0, value);
        root.dataset.open = String(value);
        handle.setAttribute("aria-expanded", String(value));
        handle.setAttribute("aria-label", value ? "hide links" : "show links");
        if (value) panel.hidden = false;
        panel.inert = !value;
        wake();
    }

    /*//////////////////////////////////////////////////////////////////////*/

    handle.addEventListener("pointerdown", event => {
        if (event.button !== 0) return;
        drag = {id: event.pointerId, x: event.clientX, y: event.clientY, start: lift.value, sideways: sway.value, body: bodylift, opened, moved: false, time: event.timeStamp};
        timeline = null;
        lift.velocity = sway.velocity = 0;
        handle.setPointerCapture(event.pointerId);
        wake();
    });
    handle.addEventListener("pointermove", event => {
        if (!drag || drag.id !== event.pointerId) return;
        const distance = event.clientY - drag.y;
        if (Math.abs(distance) + Math.abs(event.clientX - drag.x) > 5) drag.moved = true;
        bodylift = Math.max(0, Math.min(maximum, drag.body + distance));
        const offset = resist(drag.sideways + event.clientX - drag.x, drag.start + distance - bodylift);
        const elapsed = Math.max(1 / 120, (event.timeStamp - drag.time) / 1000);
        sway.velocity = Math.max(-1200, Math.min(1200, (offset.x - sway.value) / elapsed));
        lift.velocity = Math.max(-1200, Math.min(1200, (bodylift + offset.y - lift.value) / elapsed));
        drag.time = event.timeStamp;
        lift.value = bodylift + offset.y;
        sway.value = offset.x;
        wake();
    });
    function release(event) {
        if (!drag || drag.id !== event.pointerId) return;
        const moved = drag.moved;
        const wasopened = drag.opened;
        if (event.timeStamp - drag.time > 100) lift.velocity = sway.velocity = 0;
        drag = null;
        suppress = moved;
        if (moved) open(!wasopened);
        else wake();
    }
    handle.addEventListener("pointerup", release);
    handle.addEventListener("pointercancel", event => {
        if (!drag || drag.id !== event.pointerId) return;
        drag = null;
        suppress = false;
        open(opened);
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
    shade.addEventListener("click", event => {
        const sound = document.querySelector(".click");
        if (sound) {
            event.soundplayed = true;
            sound.currentTime = 0;
            void sound.play().catch(() => {});
        }
        open(false);
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && opened) open(false);
    });
    document.addEventListener("click", event => {
        if (opened && !root.contains(event.target)) open(false);
    });
    document.addEventListener("homeviewchange", () => open(false));
    window.addEventListener("hashchange", () => open(false));
    window.addEventListener("popstate", () => open(false));
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
