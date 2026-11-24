export function mediaview(container) {
    const media = [...container.querySelectorAll(".spriteimage, .spritevideo")];
    const pointers = new Map();
    let x = 0;
    let y = 0;
    let scale = 1;
    let angle = 0;

    function active() {
        return media.find(element => !element.hidden);
    }

    function render() {
        container.style.setProperty("--media-x", x + "px");
        container.style.setProperty("--media-y", y + "px");
        container.style.setProperty("--media-scale", String(scale));
        container.style.setProperty("--media-angle", angle + "deg");
    }

    function reset() {
        x = y = 0;
        scale = 1;
        angle = 0;
        for (const pointer of pointers.keys()) {
            if (container.hasPointerCapture(pointer)) container.releasePointerCapture(pointer);
        }
        pointers.clear();
        container.classList.remove("mediagrabbing");
        render();
    }

    function zoom(factor, atx, aty) {
        const bounds = container.getBoundingClientRect();
        const anchorx = atx - bounds.left - bounds.width / 2;
        const anchory = aty - bounds.top - bounds.height / 2;
        const next = scale * factor;
        const nextx = anchorx - (anchorx - x) * factor;
        const nexty = anchory - (anchory - y) * factor;
        if (!next || ![next, nextx, nexty].every(Number.isFinite)) return;
        x = nextx;
        y = nexty;
        scale = next;
    }

    function oncontrols(event, element) {
        if (event.altKey || element.tagName !== "VIDEO" || !element.controls || event.target !== element) return false;
        const bounds = element.getBoundingClientRect();
        const dx = (event.clientX - bounds.left - bounds.width / 2) / scale;
        const dy = (event.clientY - bounds.top - bounds.height / 2) / scale;
        const radians = angle * Math.PI / 180;
        const localx = dx * Math.cos(radians) + dy * Math.sin(radians);
        const localy = dy * Math.cos(radians) - dx * Math.sin(radians);
        return Math.abs(localx) <= element.clientWidth / 2
            && localy >= element.clientHeight / 2 - 48 && localy <= element.clientHeight / 2;
    }

    function release(event) {
        pointers.delete(event.pointerId);
        if (!pointers.size) container.classList.remove("mediagrabbing");
    }

    for (const element of media) element.draggable = false;

    container.addEventListener("wheel", event => {
        if (!active()) return;
        event.preventDefault();
        const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? container.clientHeight : 1;
        const delta = Math.max(-300, Math.min(300, event.deltaY * unit));
        zoom(Math.exp(-delta / 450), event.clientX, event.clientY);
        render();
    }, {passive: false});

    container.addEventListener("pointerdown", event => {
        const element = active();
        if (!element || event.button !== 0 || pointers.size >= 2 || oncontrols(event, element)) return;
        pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
        container.setPointerCapture(event.pointerId);
        container.classList.add("mediagrabbing");
    });

    container.addEventListener("pointermove", event => {
        const previous = pointers.get(event.pointerId);
        if (!previous) return;
        const next = {x: event.clientX, y: event.clientY};
        const other = [...pointers.entries()].find(([id]) => id !== event.pointerId)?.[1];
        const dx = next.x - previous.x;
        const dy = next.y - previous.y;
        if (other) {
            const before = Math.hypot(previous.x - other.x, previous.y - other.y);
            const after = Math.hypot(next.x - other.x, next.y - other.y);
            if (before >= 1 && after >= 1) zoom(after / before, (previous.x + other.x) / 2, (previous.y + other.y) / 2);
            x += dx / 2;
            y += dy / 2;
        } else {
            x += dx;
            y += dy;
        }
        pointers.set(event.pointerId, next);
        render();
    });

    for (const event of ["pointerup", "pointercancel", "lostpointercapture"]) container.addEventListener(event, release);
    container.addEventListener("dblclick", event => {
        const element = active();
        if (element && !oncontrols(event, element)) reset();
    });

    return {
        reset,
        rotate() {
            if (active()?.tagName !== "VIDEO") return;
            angle = (angle + 90) % 360;
            render();
        }
    };
}
