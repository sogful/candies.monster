import {credits} from "./credits.js";

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
    document.querySelector(".levelcontent > .main").inert = Boolean(view);
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
    document.title = view ? view[0].toUpperCase() + view.slice(1) + " - candies.monster" : "candies.monster";
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
