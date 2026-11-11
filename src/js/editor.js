const root = document.documentElement;
const host = document.createElement("section");
host.className = "editorview";
host.setAttribute("aria-label", "level preview");
host.hidden = true;
const back = document.createElement("button");
back.className = "editorback clickable";
back.type = "button";
back.setAttribute("aria-label", "back to levels");
const arrow = document.createElement("img");
arrow.src = "/assets/images/buttons/back.png";
arrow.alt = "";
back.append(arrow);
host.append(back);
document.querySelector(".levelcontent").append(host);
let frame = null;

function render() {
    const opened = location.hash === "#preview";
    const previous = root.classList.contains("previewopen");
    root.classList.toggle("previewopen", opened);
    const parameters = new URLSearchParams(location.search);
    const minimal = ["noui", "nu", "u"].find(name => parameters.has(name));
    root.classList.toggle("previewminimal", opened && minimal !== undefined && ["", "true", "1"].includes(parameters.get(minimal).trim().toLowerCase()));
    if (previous !== opened) document.dispatchEvent(new Event("previewviewchange"));
    host.hidden = !opened;
    host.inert = !opened;
    document.querySelector(".levelcontent > .main").inert = opened || root.classList.contains("levelopen") || root.classList.contains("documentopen");
    if (opened) {
        if (!frame) {
            frame = document.createElement("iframe");
            frame.className = "editorframe";
            frame.title = "level preview";
            frame.allow = "autoplay; fullscreen; clipboard-write";
            const url = new URL("/preview/editor.html" + location.search, location.origin);
            url.searchParams.set("shell", "1");
            frame.src = url.href;
            host.append(frame);
        }
        document.title = "Level preview - candies.monster";
    } else if (frame) {
        if (!location.hash) document.title = "candies.monster";
        frame.src = "about:blank";
        frame.remove();
        frame = null;
    }
}

back.addEventListener("click", () => {
    history.pushState(null, "", location.pathname);
    render();
    document.dispatchEvent(new Event("homeviewchange"));
});
window.addEventListener("message", event => {
    if (!frame || event.source !== frame.contentWindow || event.origin !== location.origin || event.data !== "exitpreview") return;
    if (window.parent !== window) window.parent.postMessage("exitpreview", "*");
    else back.click();
});
window.addEventListener("hashchange", render);
window.addEventListener("popstate", render);
document.addEventListener("homeviewchange", render);
render();
