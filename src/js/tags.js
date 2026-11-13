export function tagcontent(tag) {
    const content = document.createDocumentFragment();
    const emoji = tag.emoji;
    if (emoji?.id && /^\d{17,22}$/.test(emoji.id)) {
        const image = document.createElement("img");
        image.className = "tagemoji";
        image.src = "https://cdn.discordapp.com/emojis/" + emoji.id + ".webp?size=32";
        image.alt = emoji.name || "";
        image.draggable = false;
        content.append(image);
    } else if (emoji?.name) {
        const image = document.createElement("span");
        image.className = "tagemoji";
        image.textContent = emoji.name;
        content.append(image);
    }
    const name = document.createElement("span");
    name.textContent = tag.name || "";
    content.append(name);
    return content;
}

export function tags(entry, container) {
    container.replaceChildren();
    for (const tag of entry.tags || []) {
        const item = document.createElement("button");
        item.className = "leveltag clickable";
        item.type = "button";
        item.append(tagcontent(tag));
        item.addEventListener("click", () => {
            history.pushState(null, "", location.pathname + location.search);
            window.dispatchEvent(new HashChangeEvent("hashchange"));
            document.dispatchEvent(new CustomEvent("leveltagfilter", {detail: {id: tag.id, selected: true}}));
        });
        container.append(item);
    }
    container.hidden = !container.childElementCount;
}
