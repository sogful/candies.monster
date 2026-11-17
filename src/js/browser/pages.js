export function pagegestures(list, previous, next) {
    let drag = null;
    let suppress = false;
    let last = 0;
    let wheel = 0;
    function turn(offset) {
        const button = offset < 0 ? previous : next;
        if (button.disabled || performance.now() - last < 250) return;
        last = performance.now();
        button.click();
        list.animate([{opacity: 0.4, transform: `translateX(${offset * 15}px)`}, {opacity: 1, transform: "translateX(0)"}], {duration: 150, easing: "ease-out"});
    }
    list.addEventListener("pointerdown", event => {
        if (!event.isPrimary) {drag = null; suppress = false; return}
        if (event.button !== 0 || event.target.closest(".cardtags,a,button")) return;
        drag = {id: event.pointerId, x: event.clientX, y: event.clientY};
        suppress = false;
    });
    list.addEventListener("pointermove", event => {
        if (!drag || event.pointerId !== drag.id) return;
        const x = event.clientX - drag.x;
        const y = event.clientY - drag.y;
        if (Math.abs(y) > 25 && Math.abs(y) > Math.abs(x)) {drag = null; return}
        if (Math.abs(x) > 15 && Math.abs(x) > Math.abs(y) * 1.5) {
            suppress = true;
            if (!list.hasPointerCapture(event.pointerId)) list.setPointerCapture(event.pointerId);
            event.preventDefault();
        }
    });
    list.addEventListener("pointerup", event => {
        if (!drag || event.pointerId !== drag.id) return;
        const distance = event.clientX - drag.x;
        drag = null;
        if (list.hasPointerCapture(event.pointerId)) list.releasePointerCapture(event.pointerId);
        if (suppress && Math.abs(distance) > 45) turn(distance < 0 ? 1 : -1);
    });
    list.addEventListener("pointercancel", () => {drag = null; suppress = false});
    list.addEventListener("click", event => {
        if (!suppress) return;
        suppress = false;
        event.preventDefault();
        event.stopImmediatePropagation();
    }, true);
    list.addEventListener("wheel", event => {
        if (event.ctrlKey) return;
        if (event.target.closest(".cardtags") || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
        event.preventDefault();
        wheel += event.deltaX;
        if (Math.abs(wheel) > 55) {turn(wheel > 0 ? 1 : -1); wheel = 0}
    }, {passive: false});
}
