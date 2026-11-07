import {setoverlay} from "./overlays.js";

/*//////////////////////////////////////////////////////////////////////*/

const info = document.querySelector(".archiveinfo");
const popup = info.querySelector(".infopopup");

function updateinfo() {
    if (document.body.classList.contains("gameopen")) info.open = false;
    setoverlay(popup, info.open);
}

const observer = new MutationObserver(updateinfo);
observer.observe(info, {attributes: true, attributeFilter: ["open"]});
observer.observe(document.body, {attributes: true, attributeFilter: ["class"]});
updateinfo();

/*//////////////////////////////////////////////////////////////////////*/

document.addEventListener("pointerdown", event => {
    if (info.open && !info.contains(event.target)) info.open = false;
});

document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || !info.open) return;
    info.open = false;
    info.querySelector(".infobutton").focus({preventScroll: true});
    event.preventDefault();
});
