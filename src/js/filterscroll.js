export function filterscroll(options) {
    let held = null;
    options.addEventListener("pointerdown", () => {held = options.scrollLeft});
    options.addEventListener("click", () => {
        if (held === null) return;
        const saved = held;
        held = null;
        options.scrollLeft = saved;
        requestAnimationFrame(() => {options.scrollLeft = saved});
    });
    let drag = null;
    let ignoreclick = false;
    options.addEventListener("pointerdown", event => {
        if (event.button !== 0 || event.pointerType === "touch") return;
        drag = {id: event.pointerId, start: event.clientX, scroll: options.scrollLeft, moved: false};
        ignoreclick = false;
    });
    options.addEventListener("pointermove", event => {
        if (!drag || event.pointerId !== drag.id) return;
        const distance = event.clientX - drag.start;
        if (!drag.moved && Math.abs(distance) < 5) return;
        if (!drag.moved) {
            drag.moved = true;
            options.setPointerCapture(event.pointerId);
            options.classList.add("tagdragging");
        }
        options.scrollLeft = drag.scroll - distance;
        event.preventDefault();
    });
    function released(event) {
        if (!drag || event.pointerId !== drag.id) return;
        ignoreclick = drag.moved;
        drag = null;
        options.classList.remove("tagdragging");
        if (options.hasPointerCapture(event.pointerId)) options.releasePointerCapture(event.pointerId);
    }
    options.addEventListener("pointerup", released);
    options.addEventListener("pointercancel", released);
    options.addEventListener("lostpointercapture", released);
    options.addEventListener("click", event => {
        if (!ignoreclick) return;
        ignoreclick = false;
        event.preventDefault();
        event.stopPropagation();
    }, true);
    options.addEventListener("wheel", event => {
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        const distance = delta * (event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? options.clientWidth : 1);
        const previous = options.scrollLeft;
        options.scrollLeft += distance;
        if (options.scrollLeft !== previous) event.preventDefault();
    }, {passive: false});
}
