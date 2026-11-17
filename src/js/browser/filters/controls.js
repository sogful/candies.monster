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
        if (event.ctrlKey) return;
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        const distance = delta * (event.deltaMode === 1 ? 18 : event.deltaMode === 2 ? options.clientWidth : 1);
        const previous = options.scrollLeft;
        options.scrollLeft += distance;
        if (options.scrollLeft !== previous) event.preventDefault();
    }, {passive: false});
}

/*//////////////////////////////////////////////////////////////////////*/

export function normalized(value) {
    return String(value || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/['\u2018\u2019\u02bc\uff07]/g, "").toLocaleLowerCase();
}

/*//////////////////////////////////////////////////////////////////////*/

function near(first, second) {
    const limit = first.length >= 7 ? 2 : first.length >= 4 ? 1 : 0;
    if (Math.abs(first.length - second.length) > limit) return false;
    let row = Array.from({length: second.length + 1}, (_, index) => index);
    let previous = null;
    for (let left = 1; left <= first.length; left++) {
        const next = [left];
        for (let right = 1; right <= second.length; right++) {
            next[right] = Math.min(next[right - 1] + 1, row[right] + 1, row[right - 1] + Number(first[left - 1] !== second[right - 1]));
            if (previous && right > 1 && first[left - 1] === second[right - 2] && first[left - 2] === second[right - 1]) next[right] = Math.min(next[right], previous[right - 2] + 1);
        }
        if (Math.min(...next) > limit) return false;
        previous = row;
        row = next;
    }
    return row[second.length] <= limit;
}

export function matches(query, value) {
    const words = normalized(query).match(/[\p{L}\p{N}]+/gu) || [];
    const targets = normalized(value).match(/[\p{L}\p{N}]+/gu) || [];
    return !words.length || words.some(word => targets.some(target => target.includes(word) || near(word, target)));
}
