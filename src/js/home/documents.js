const root = document.documentElement;
const panel = document.querySelector(".documentviews");
const close = document.querySelector(".documentclose");
const links = [...document.querySelectorAll('.sitefooter [href="#credits"], .sitefooter [href="#documentation"]')];
const views = ["credits", "documentation"];
let current = "";

function render() {
    const hash = location.hash.slice(1).toLowerCase();
    const view = views.includes(hash) ? hash : "";
    const previous = current;
    current = view;
    root.classList.toggle("documentopen", Boolean(view));
    for (const name of views) {
        root.classList.toggle("document" + name, name === view);
        panel.querySelector("." + name + "view").setAttribute("aria-hidden", String(name !== view));
    }
    panel.setAttribute("aria-hidden", String(!view));
    document.querySelector(".levelbrowser").setAttribute("aria-label", view || "custom levels");
    document.querySelector(".levelcontent > .main").setAttribute("aria-hidden", String(Boolean(view)));
    for (const link of links) {
        if (link.hash === "#" + view) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
    }
    if (view !== previous) panel.scrollTop = 0;
    if (previous && !view && panel.contains(document.activeElement)) {
        links.find(link => link.hash === "#" + previous)?.focus({preventScroll: true});
    }
    document.title = view ? view[0].toUpperCase() + view.slice(1) + " - candies.monster" : "candies.monster";
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
        close.focus({preventScroll: true});
    });
}

close.addEventListener("click", () => navigate(""));
document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !current || event.defaultPrevented) return;
    event.preventDefault();
    navigate("");
});
window.addEventListener("hashchange", render);
window.addEventListener("popstate", render);
render();
