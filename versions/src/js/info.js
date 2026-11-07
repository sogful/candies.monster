import {setoverlay} from "./overlays.js";

/*//////////////////////////////////////////////////////////////////////*/

const info = document.querySelector(".archiveinfo");
info.addEventListener("toggle", () => setoverlay(info.querySelector(".infopopup"), info.open));
setoverlay(info.querySelector(".infopopup"), info.open);

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
