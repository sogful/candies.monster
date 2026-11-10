import {strand, paint} from "./physics.js";
import {spring, attachment} from "./motion.js";

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
    const lift = {value: 0, velocity: 0};
    const sway = {value: 0, velocity: 0};
    const bodylift = {value: 0, velocity: 0};
    const bodysway = {value: 0, velocity: 0};
    const tilt = {value: 0, velocity: 0};
    const channels = [lift, sway, bodylift, bodysway, tilt];
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
        maximum = height + 24;
        root.style.setProperty("--panelheight", height + "px");
        const scale = Math.min(1.5, devicePixelRatio || 1);
        canvas.width = Math.round(root.clientWidth * scale);
        canvas.height = Math.round((maximum + 110) * scale);
        canvas.style.height = maximum + 110 + "px";
        context.setTransform(scale, 0, 0, scale, 0, 0);
        const mount = buckle();
        rope.reset(origin + sway.value, lift.value + 60, mount.x, mount.y);
        position();
        wake();
    }

    function buckle() {
        return attachment(width, height, root.clientWidth - width + bodysway.value, bodylift.value - height - 12, tilt.value);
    }

    function position() {
        panel.style.transform = "translate3d(" + bodysway.value + "px," + bodylift.value + "px,0) rotate(" + tilt.value + "deg)";
        handle.style.transform = "translate3d(" + sway.value + "px," + (lift.value + 56) + "px,0)";
        panel.hidden = !opened && !drag && bodylift.value < 0.2 && lift.value < 0.2;
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
                spring(lift, target, 16);
                spring(sway, 0, 14);
            }
            spring(bodylift, lift.value, 26);
            spring(bodysway, sway.value * 0.35, 18);
            const angle = Math.max(-4, Math.min(4, sway.value * 0.1 - bodylift.velocity * 0.002));
            spring(tilt, angle, 14);
            if (reduced.matches && !drag) {
                for (const channel of channels) channel.value = channel.velocity = 0;
                lift.value = bodylift.value = target;
                const mount = buckle();
                rope.reset(origin, target + 60, mount.x, mount.y);
            }
            const mount = buckle();
            rope.step(origin + sway.value, lift.value + 60, mount.x, mount.y);
            motion = Math.abs(target - lift.value) + Math.abs(target - bodylift.value) + Math.abs(bodysway.value) + Math.abs(sway.value) + Math.abs(tilt.value);
            for (const channel of channels) motion += Math.abs(channel.velocity);
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
        drag = {id: event.pointerId, x: event.clientX, y: event.clientY, start: lift.value, moved: false};
        lift.velocity = sway.velocity = 0;
        handle.setPointerCapture(event.pointerId);
        wake();
    });
    handle.addEventListener("pointermove", event => {
        if (!drag || drag.id !== event.pointerId) return;
        const distance = event.clientY - drag.y;
        if (Math.abs(distance) + Math.abs(event.clientX - drag.x) > 5) drag.moved = true;
        lift.value = Math.max(0, Math.min(maximum + 28, drag.start + distance));
        sway.value = Math.max(-28, Math.min(28, event.clientX - drag.x));
        wake();
    });
    function release(event) {
        if (!drag || drag.id !== event.pointerId) return;
        const moved = drag.moved;
        drag = null;
        suppress = moved;
        if (moved) open(lift.value > maximum * 0.35);
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
