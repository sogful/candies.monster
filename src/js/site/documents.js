import {loadcredits} from "./credits.js";

export function credits(scroll, article) {
    const sequence = article.querySelector(".creditssequence");
    let ready = false;
    let active = false;
    let period = 0;
    let position = 0;
    let frame = 0;
    let previous = 0;
    let pointer = null;
    let generation = 0;

    function measure() {
        if (!ready) return;
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
        if (!active || document.hidden) return;
        if (previous && time - previous < 32) {
            frame = requestAnimationFrame(tick);
            return;
        }
        if (previous && period) {
            position = normalize(position + Math.min(time - previous, 100) * 0.024);
            scroll.scrollTop = position;
            if (pointer) {pointer.start = position; pointer.y = pointer.current}
        }
        previous = time;
        frame = requestAnimationFrame(tick);
    }

    function resume() {
        cancelAnimationFrame(frame);
        frame = 0;
        previous = 0;
        if (active && !document.hidden) frame = requestAnimationFrame(tick);
    }

    function stopdrag(event) {
        if (!pointer || event.pointerId !== pointer.id) return;
        pointer = null;
    }

    /*//////////////////////////////////////////////////////////////////////*/

    scroll.addEventListener("scroll", () => {
        if (!active || !period || Math.abs(scroll.scrollTop - position) < 2) return;
        position = normalize(scroll.scrollTop);
        scroll.scrollTop = position;
    }, {passive: true});
    scroll.addEventListener("pointerdown", event => {
        if (!active) return;
        if (event.pointerType === "touch" || event.button || event.target.closest("a, button")) return;
        pointer = {id: event.pointerId, y: event.clientY, current: event.clientY, start: position};
        scroll.setPointerCapture(event.pointerId);
    });
    scroll.addEventListener("pointermove", event => {
        if (!pointer || event.pointerId !== pointer.id) return;
        pointer.current = event.clientY;
        position = normalize(pointer.start + pointer.y - event.clientY);
        scroll.scrollTop = position;
    });
    scroll.addEventListener("pointerup", stopdrag);
    scroll.addEventListener("pointercancel", stopdrag);
    scroll.addEventListener("lostpointercapture", stopdrag);
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("resize", measure, {passive: true});
    if (window.ResizeObserver) new ResizeObserver(measure).observe(sequence);
    document.fonts?.ready.then(measure);

    return {
        async open() {
            active = true;
            const request = ++generation;
            if (!ready) {
                try {await loadcredits(sequence.querySelector(".creditscontent"))} catch {return}
                await document.fonts?.ready;
                if (!active || request !== generation) return;
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
            position = 0;
            measure();
            article.classList.add("creditsready");
            resume();
        },
        close() {
            active = false;
            generation++;
            pointer = null;
            resume();
        }
    };
}

/*//////////////////////////////////////////////////////////////////////*/

const root = document.documentElement;
const panel = document.querySelector(".documentviews");
const scroll = document.querySelector(".documentscroll");
const close = document.querySelector(".documentclose");
const back = document.querySelector(".documentback");
const links = [...document.querySelectorAll('.sidelinks [href="#credits"], .sidelinks [href="#documentation"]')];
const views = ["credits", "documentation"];
const roll = credits(scroll, panel.querySelector(".creditsview"));
const motion = matchMedia("(prefers-reduced-motion: reduce)");
let current = "";
let closing = 0;

function render() {
    const hash = location.hash.slice(1).toLowerCase();
    const view = views.includes(hash) ? hash : "";
    const previous = current;
    if (view === current && panel.dataset.ready) return;
    panel.dataset.ready = "true";
    clearTimeout(closing);
    current = view;
    root.classList.toggle("documentopen", Boolean(view));
    if (view) {
        for (const name of views) root.classList.toggle("document" + name, name === view);
    } else {
        closing = setTimeout(() => {
            for (const name of views) root.classList.remove("document" + name);
        }, motion.matches ? 0 : 300);
    }
    if (previous && !view && panel.contains(document.activeElement)) {
        links.find(link => link.hash === "#" + previous)?.focus({preventScroll: true});
    }
    for (const name of views) panel.querySelector("." + name + "view").setAttribute("aria-hidden", String(name !== view));
    panel.setAttribute("aria-hidden", String(!view));
    panel.inert = !view;
    panel.setAttribute("role", view === "credits" ? "dialog" : "region");
    if (view === "credits") panel.setAttribute("aria-modal", "true");
    else panel.removeAttribute("aria-modal");
    document.querySelector(".levelbrowser").setAttribute("aria-label", view || "custom levels");
    document.querySelector(".levelcontent > .main").inert = Boolean(view) || root.classList.contains("levelopen");
    document.querySelector(".morestuff").inert = Boolean(view);
    for (const link of links) {
        if (link.hash === "#" + view) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
    }
    if (view === "credits") {
        for (const image of panel.querySelectorAll(".creditsart img, .creditslogo")) image.loading = "eager";
        roll.open();
    }
    else {
        roll.close();
        if (view) scroll.scrollTop = 0;
    }
    if (previous && view && !motion.matches) panel.animate([{opacity: 0}, {opacity: 1}], {duration: 300, easing: "ease"});
    document.dispatchEvent(new CustomEvent("homeviewchange", {detail: view}));
}

function navigate(view) {
    const path = location.pathname + location.search + (view ? "#" + view : "");
    if (path !== location.pathname + location.search + location.hash) history.pushState(null, "", path);
    render();
}

/*//////////////////////////////////////////////////////////////////////*/

for (const link of links) {
    link.addEventListener("click", event => {
        if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigate(link.hash.slice(1));
        (current === "credits" ? close : back).focus({preventScroll: true});
    });
}

close.addEventListener("click", () => navigate(""));
back.addEventListener("click", () => navigate(""));
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && current && !event.defaultPrevented) {
        event.preventDefault();
        navigate("");
    } else if (event.key === "Tab" && current === "credits") {
        const controls = [close, scroll, ...panel.querySelectorAll('.creditssequence:not([aria-hidden]) a[href]')];
        const position = controls.indexOf(document.activeElement);
        if (position < 0 || event.shiftKey && position === 0 || !event.shiftKey && position === controls.length - 1) {
            event.preventDefault();
            controls[event.shiftKey ? controls.length - 1 : 0].focus({preventScroll: true});
        }
    }
});
window.addEventListener("hashchange", render);
window.addEventListener("popstate", render);
render();
