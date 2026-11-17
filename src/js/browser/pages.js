export function pagegestures(list, previous, next, options) {
    let drag = null;
    let neighbor = null;
    let offset = 0;
    let distance = 0;
    let width = 0;
    let blocked = false;
    let busy = false;
    let timer;
    let generation = 0;
    let animations = [];
    const parent = list.parentElement;

    function reset() {
        generation++;
        clearTimeout(timer);
        for (const animation of animations) animation.cancel();
        animations = [];
        if (drag?.id !== undefined && list.hasPointerCapture(drag.id)) list.releasePointerCapture(drag.id);
        drag = null;
        busy = false;
        distance = 0;
        list.style.transform = "";
        list.classList.remove("pageactive");
        parent.classList.remove("pageswiping");
        if (neighbor) options.discard(neighbor);
        neighbor = null;
        offset = 0;
    }

    function position(value) {
        width = list.clientWidth;
        const direction = value < 0 ? 1 : -1;
        if (offset !== direction) {
            if (neighbor) options.discard(neighbor);
            offset = direction;
            const button = offset < 0 ? previous : next;
            neighbor = button.disabled ? null : options.prepare(offset);
        }
        distance = neighbor ? Math.max(-width, Math.min(width, value)) : value * 0.18;
        parent.classList.add("pageswiping");
        list.classList.add("pageactive");
        list.style.transform = `translate3d(${distance}px,0,0)`;
        if (neighbor) neighbor.style.transform = `translate3d(${distance + offset * width}px,0,0)`;
    }

    async function finish(commit, silent = false) {
        if (busy) return;
        drag = null;
        busy = true;
        const current = ++generation;
        const target = commit && neighbor ? -offset * width : 0;
        const duration = Math.max(90, Math.min(220, Math.abs(target - distance) / Math.max(width, 1) * 220));
        const settings = {duration, easing: "cubic-bezier(0.2,0.7,0.2,1)", fill: "forwards"};
        animations = [list.animate([{transform: `translate3d(${distance}px,0,0)`}, {transform: `translate3d(${target}px,0,0)`}], settings)];
        if (neighbor) animations.push(neighbor.animate([{transform: `translate3d(${distance + offset * width}px,0,0)`}, {transform: `translate3d(${target + offset * width}px,0,0)`}], settings));
        await Promise.allSettled(animations.map(animation => animation.finished));
        if (generation !== current) return;
        const incoming = neighbor;
        const direction = offset;
        neighbor = null;
        reset();
        if (commit && incoming) options.commit(direction, incoming, silent);
        else if (incoming) options.discard(incoming);
    }

    function turn(direction, silent = false) {
        if (busy) return;
        reset();
        const button = direction < 0 ? previous : next;
        if (button.disabled) return;
        position(direction * -0.01);
        void finish(true, silent);
    }

    list.addEventListener("pointerdown", event => {
        if (!event.isPrimary) {reset(); return}
        blocked = false;
        if (busy || event.button !== 0 || event.target.closest(".cardtags,a,button")) return;
        reset();
        blocked = false;
        drag = {id: event.pointerId, x: event.clientX, y: event.clientY, last: event.clientX, time: event.timeStamp, speed: 0};
    });
    window.addEventListener("pointermove", event => {
        if (!drag || drag.id !== event.pointerId) return;
        const x = event.clientX - drag.x;
        const y = event.clientY - drag.y;
        if (!blocked && Math.abs(y) > 10 && Math.abs(y) > Math.abs(x)) {reset(); return}
        if (!blocked && (Math.abs(x) < 8 || Math.abs(x) < Math.abs(y) * 1.3)) return;
        blocked = true;
        drag.speed = (event.clientX - drag.last) / Math.max(1, event.timeStamp - drag.time);
        drag.last = event.clientX;
        drag.time = event.timeStamp;
        if (!list.hasPointerCapture(event.pointerId)) list.setPointerCapture(event.pointerId);
        position(x);
        event.preventDefault();
    });
    window.addEventListener("pointerup", event => {
        if (!drag || drag.id !== event.pointerId) return;
        const speed = event.timeStamp - drag.time < 100 ? drag.speed : 0;
        drag = null;
        if (list.hasPointerCapture(event.pointerId)) list.releasePointerCapture(event.pointerId);
        if (!blocked) {reset(); return}
        void finish(Math.abs(distance) > width * 0.2 || Math.abs(distance) > 30 && Math.abs(speed) > 0.45);
    });
    window.addEventListener("pointercancel", () => {if (drag) void finish(false)});
    list.addEventListener("click", event => {
        if (!busy && (!blocked || event.detail === 0)) return;
        blocked = false;
        event.preventDefault();
        event.stopImmediatePropagation();
    }, true);
    list.addEventListener("wheel", event => {
        if (event.ctrlKey || event.target.closest(".cardtags") || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
        event.preventDefault();
        if (busy || drag?.id !== undefined) return;
        if (!drag) {reset(); drag = {wheel: true}}
        const scale = event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? width : 1;
        position(distance - event.deltaX * scale);
        clearTimeout(timer);
        timer = setTimeout(() => {void finish(Math.abs(distance) > width * 0.18)}, 120);
    }, {passive: false});
    window.addEventListener("blur", reset);
    window.addEventListener("resize", reset, {passive: true});
    document.addEventListener("homeviewchange", reset);
    return {reset, turn};
}
