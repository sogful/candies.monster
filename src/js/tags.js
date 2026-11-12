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
        const item = document.createElement("span");
        item.className = "leveltag";
        item.append(tagcontent(tag));
        container.append(item);
    }
    container.hidden = !container.childElementCount;
}
