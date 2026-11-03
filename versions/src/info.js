const info = document.querySelector(".archiveinfo");

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
