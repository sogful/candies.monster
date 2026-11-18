const old = new URLSearchParams(location.search).get("old") === "1";
const footer = document.querySelector(".sidelinks");
const switcher = document.createElement("a");
const destination = new URL(location.href);
if (old) destination.searchParams.delete("old");
else destination.searchParams.set("old", "1");
destination.hash = "";
switcher.href = destination.pathname + destination.search;
switcher.textContent = old ? "new" : "old";
footer.append(switcher);

/*//////////////////////////////////////////////////////////////////////*/

if (old) {
    const levels = document.createElement("a");
    levels.className = "navlink legacylevels";
    levels.href = "#levels";
    const image = document.createElement("img");
    image.className = "button clickable";
    image.src = "/assets/images/buttons/pages/levels.webp";
    image.alt = "";
    const label = document.createElement("span");
    label.className = "buttonlabel";
    label.textContent = "levels";
    levels.append(image, label);
    document.querySelector(".bignav").prepend(levels);
    const back = document.createElement("a");
    back.className = "legacyback clickable";
    back.href = "#";
    back.setAttribute("aria-label", "back to home");
    const arrow = document.createElement("img");
    arrow.src = "/assets/images/buttons/back.png";
    arrow.alt = "";
    back.append(arrow);
    const logo = document.querySelector(".homelink img");
    function render() {
        const home = !location.hash || location.hash === "#";
        document.documentElement.classList.toggle("oldhome", home);
        back.hidden = !location.hash.startsWith("#levels");
        logo.src = home ? "/assets/images/branding/logo.webp" : "/assets/images/branding/logotiny.webp";
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
