let active = null;

export const homeemojis = fetch("/assets/static/data/levels/homeemojis.json").then(response => {
    if (!response.ok) throw new Error("Reactions unavailable");
    return response.json();
}).then(items => new Set(items));

export function emojipicker(anchor, emojis, selected) {
    active?.();
    const popup = document.createElement("section");
    popup.className = "emojipicker";
    popup.setAttribute("role", "dialog");
    popup.setAttribute("aria-label", "Choose a reaction");
    const list = document.createElement("div");
    list.className = "emojiitems";
    const status = document.createElement("p");
    status.className = "emojistatus";
    status.setAttribute("role", "status");
    popup.append(list, status);
    document.body.append(popup);
    function render() {
        list.replaceChildren();
        for (const emoji of emojis.filter(item => item.listed !== false)) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "emojichoice clickable";
            button.title = ":" + emoji.name + ":";
            button.setAttribute("aria-label", button.title);
            const image = document.createElement("img");
            image.src = "https://cdn.discordapp.com/emojis/" + emoji.id + ".webp?size=48";
            image.alt = "";
            image.loading = "lazy";
            image.decoding = "async";
            button.append(image);
            button.addEventListener("click", async () => {
                button.disabled = true;
                try {await selected(emoji); close()}
                catch (error) {status.textContent = error.message; button.disabled = false}
            });
            list.append(button);
        }
        status.replaceChildren();
        if (!list.childElementCount) {
            const image = document.createElement("img");
            image.src = "/assets/images/omnom/404/404.gif";
            image.alt = "";
            const label = document.createElement("span");
            label.textContent = "no results :(";
            status.append(image, label);
        }
    }
    function position() {
        if (!anchor.isConnected) {close(); return}
        const bounds = anchor.getBoundingClientRect();
        const width = popup.offsetWidth;
        const height = popup.offsetHeight;
        let left = bounds.right + 6;
        let top = bounds.top;
        if (left + width > innerWidth - 8) {
            left = bounds.left - width - 6;
            if (left < 8) {
                left = Math.max(8, Math.min(bounds.right - width, innerWidth - width - 8));
                top = bounds.bottom + 6;
                if (top + height > innerHeight - 8) top = bounds.top - height - 6;
            }
        }
        popup.style.left = Math.max(8, Math.min(left, innerWidth - width - 8)) + "px";
        popup.style.top = Math.max(8, Math.min(top, innerHeight - height - 8)) + "px";
    }
    function outside(event) {
        if (!popup.contains(event.target) && !anchor.contains(event.target)) close();
    }
    function key(event) {
        if (event.key === "Escape") {event.preventDefault(); event.stopPropagation(); close(); anchor.focus({preventScroll: true})}
    }
    function close() {
        popup.remove();
        document.removeEventListener("pointerdown", outside);
        document.removeEventListener("keydown", key, true);
        document.removeEventListener("levelviewchange", close);
        window.removeEventListener("resize", position);
        if (active === close) active = null;
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", key, true);
    document.addEventListener("levelviewchange", close);
    window.addEventListener("resize", position, {passive: true});
    active = close;
    render();
    position();
    list.querySelector("button")?.focus({preventScroll: true});
}
