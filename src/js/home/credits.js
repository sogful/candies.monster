export function credits(scroll, article) {
    const sequence = article.querySelector(".creditssequence");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let ready = false;
    let active = false;
    let automatic = true;
    let period = 0;
    let position = 0;
    let frame = 0;
    let previous = 0;
    let pause = 0;
    let pointer = null;

    function measure() {
        const offset = period ? position % period : 0;
        period = sequence.offsetHeight;
        if (active && period) {
            position = period + offset % period;
            scroll.scrollTop = position;
        }
    }

    function normalize(value) {
        return period ? period + (value % period + period) % period : value;
    }

    function tick(time) {
        frame = 0;
        if (!active || !automatic || document.hidden || motion.matches) return;
        if (previous && time - previous < 32) {
            frame = requestAnimationFrame(tick);
            return;
        }
        if (previous && !pointer && time >= pause && period) {
            position = normalize(position + Math.min(time - previous, 100) * 0.024);
            scroll.scrollTop = position;
        }
        previous = time;
        frame = requestAnimationFrame(tick);
    }

    function resume() {
        cancelAnimationFrame(frame);
        frame = 0;
        previous = 0;
        if (active && automatic && !document.hidden && !motion.matches) frame = requestAnimationFrame(tick);
    }

    function interact() {
        if (!active) return;
        automatic = false;
        resume();
    }

    function stopdrag(event) {
        if (!pointer || event.pointerId !== pointer.id) return;
        pointer = null;
        pause = performance.now() + 1200;
    }

    /*//////////////////////////////////////////////////////////////////////*/

    scroll.addEventListener("scroll", () => {
        if (!active || !period || Math.abs(scroll.scrollTop - position) < 2) return;
        position = normalize(scroll.scrollTop);
        scroll.scrollTop = position;
    }, {passive: true});
    scroll.addEventListener("wheel", interact, {passive: true});
    scroll.addEventListener("keydown", interact);
    scroll.addEventListener("pointerdown", event => {
        if (!active) return;
        interact();
        if (event.pointerType === "touch" || event.button || event.target.closest("a, button")) return;
        pointer = {id: event.pointerId, y: event.clientY, start: position};
        scroll.setPointerCapture(event.pointerId);
    });
    scroll.addEventListener("pointermove", event => {
        if (!pointer || event.pointerId !== pointer.id) return;
        position = normalize(pointer.start + pointer.y - event.clientY);
        scroll.scrollTop = position;
    });
    scroll.addEventListener("pointerup", stopdrag);
    scroll.addEventListener("pointercancel", stopdrag);
    scroll.addEventListener("lostpointercapture", stopdrag);
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("resize", measure, {passive: true});
    if (motion.addEventListener) motion.addEventListener("change", resume);
    else motion.addListener(resume);
    if (window.ResizeObserver) new ResizeObserver(measure).observe(sequence);
    document.fonts?.ready.then(measure);

    return {
        open() {
            if (!ready) {
                for (let count = 0; count < 2; count++) {
                    const clone = sequence.cloneNode(true);
                    clone.setAttribute("aria-hidden", "true");
                    clone.inert = true;
                    if (count) article.append(clone);
                    else article.prepend(clone);
                }
                ready = true;
            }
            active = true;
            automatic = true;
            position = 0;
            measure();
            pause = performance.now() + 1400;
            resume();
        },
        close() {
            active = false;
            pointer = null;
            resume();
        }
    };
}
