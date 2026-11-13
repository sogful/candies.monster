export function requiredgame(entry) {
    const text = (entry.title || "") + " " + (entry.description || "");
    if (/\barchivecore\b/i.test(text)) return "Archivecore";
    if (/github\.com\/swordjhon\/cuttherope-dx/i.test(text)) return "SwordJhon's DX fork";
    if ((entry.tags || []).some(tag => /^cut the rope 2$/i.test(tag.name || ""))) return "Cut the Rope 2";
    if ((entry.tags || []).some(tag => /^magic$/i.test(tag.name || ""))) return "Cut the Rope: Magic";
    return "";
}

/*//////////////////////////////////////////////////////////////////////*/

export function unsupported(button, engine) {
    const popup = document.createElement("div");
    popup.className = "unsupportednotice";
    popup.hidden = true;
    popup.setAttribute("role", "tooltip");
    const title = document.createElement("p");
    title.className = "unsupportedtitle";
    title.textContent = engine ? "Unsupported level" : "Level file unavailable";
    popup.append(title);
    if (engine) {
        const required = document.createElement("p");
        required.className = "unsupportedengine";
        required.textContent = "Requires " + engine;
        popup.append(required);
    }
    document.body.append(popup);
    const controller = new AbortController();
    const options = {signal: controller.signal};
    let pinned = false;
    function position() {
        if (popup.hidden) return;
        const anchor = button.getBoundingClientRect();
        const box = popup.getBoundingClientRect();
        popup.style.left = Math.max(8, Math.min(innerWidth - box.width - 8, anchor.left + (anchor.width - box.width) / 2)) + "px";
        popup.style.top = (anchor.bottom + box.height + 8 < innerHeight ? anchor.bottom + 8 : Math.max(8, anchor.top - box.height - 8)) + "px";
    }
    function show() {popup.hidden = false; position()}
    function hide() {if (!pinned) popup.hidden = true}
    button.addEventListener("pointerenter", event => {if (event.pointerType !== "touch") show()}, options);
    button.addEventListener("pointerleave", hide, options);
    button.addEventListener("focus", show, options);
    button.addEventListener("blur", hide, options);
    button.addEventListener("click", event => {
        event.preventDefault();
        pinned = !pinned;
        popup.hidden = !pinned;
        position();
        const sound = document.querySelector(".click");
        if (sound) {sound.currentTime = 0; void sound.play().catch(() => {})}
    }, options);
    document.addEventListener("pointerdown", event => {
        if (button.contains(event.target)) return;
        pinned = false;
        hide();
    }, options);
    window.addEventListener("resize", position, options);
    document.addEventListener("scroll", position, {...options, capture: true, passive: true});
    const removal = new MutationObserver(() => {
        if (button.isConnected) return;
        controller.abort();
        popup.remove();
        removal.disconnect();
    });
    removal.observe(document.querySelector(".leveldetail"), {childList: true});
}
