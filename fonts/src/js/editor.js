function synceditor() {
    const input = document.querySelector(".textinput");
    const preview = document.querySelector(".textpreview");
    if (!input || !preview) return;
    const style = getComputedStyle(preview);
    input.style.width = preview.offsetWidth + 2 + "px";
    input.style.height = preview.offsetHeight + "px";
    input.style.fontFamily = style.fontFamily;
    input.style.fontSize = style.fontSize;
    input.style.fontWeight = style.fontWeight;
    input.style.fontStyle = style.fontStyle;
    input.style.letterSpacing = style.letterSpacing;
    input.style.lineHeight = style.lineHeight;
    input.style.transform = preview.style.transform;
    input.scrollTop = 0;
    input.scrollLeft = 0;
}
