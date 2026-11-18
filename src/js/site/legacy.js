let old = false;
try {old = localStorage.getItem("homeversion") === "old"} catch {}
const footer = document.querySelector(".sidelinks");
const switcher = document.createElement("a");
switcher.href = location.pathname;
switcher.textContent = old ? "new" : "old";
switcher.addEventListener("click", event => {
    event.preventDefault();
    try {localStorage.setItem("homeversion", old ? "new" : "old")} catch {}
    const destination = new URL(location.href);
    destination.searchParams.delete("old");
    destination.hash = "";
    location.replace(destination.href);
});
footer.append(switcher);

/*//////////////////////////////////////////////////////////////////////*/

if (old) {
    document.documentElement.classList.add("oldmode");
    function reload(anchor, view) {
        anchor.addEventListener("click", event => {
            if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            const destination = new URL(location.href);
            destination.hash = view;
            history.pushState(null, "", destination);
            location.reload();
        });
    }
    const levels = document.createElement("a");
    levels.className = "navlink legacylevels";
    levels.href = "#levels";
    reload(levels, "levels");
    const image = document.createElement("img");
    image.className = "button clickable";
    image.src = "/assets/images/buttons/pages/levels.webp";
    image.alt = "";
    const label = document.createElement("span");
    label.className = "buttonlabel";
    label.textContent = "levels";
    levels.append(image, label);
    const buttons = document.querySelector(".bignav");
    buttons.append(levels);
    const music = document.querySelector('.smallnav a[href="/music/"]');
    const smallbuttons = document.querySelector(".smallnav");
    const musicnext = music?.nextSibling;
    const back = document.createElement("a");
    back.className = "legacyback clickable";
    back.href = "#";
    back.setAttribute("aria-label", "back to home");
    const arrow = document.createElement("img");
    arrow.src = "/assets/images/buttons/back.png";
    arrow.alt = "";
    back.append(arrow);
    reload(back, "");
    const exit = back.cloneNode(true);
    exit.className = "legacyexit clickable";
    reload(exit, "");
    document.querySelector(".site").append(exit);
    const logo = document.querySelector(".homelink img");
    function render() {
        const home = !location.hash || location.hash === "#";
        document.documentElement.classList.toggle("oldhome", home);
        if (music) {
            if (home) buttons.querySelector("a[href^='/versions']")?.after(music);
            else smallbuttons.insertBefore(music, musicnext);
        }
        back.hidden = !location.hash.startsWith("#levels");
        document.querySelector(".buttondrawer").hidden = !home;
        logo.src = "/assets/images/branding/logo.svg";
        window.dispatchEvent(new Event("resize"));
    }
    window.addEventListener("hashchange", render);
    window.addEventListener("popstate", render);
    render();
    const top = document.querySelector(".filtertop") || await new Promise(resolve => {
        const observer = new MutationObserver(() => {
            const top = document.querySelector(".filtertop");
            if (top) {observer.disconnect(); resolve(top)}
        });
        observer.observe(document.querySelector(".levelbrowser"), {childList: true, subtree: true});
    });
    top.prepend(back);
}
