export const tagdata = fetch("/src/data/tags.json").then(response => {
    if (!response.ok) throw new Error("Tags unavailable");
    return response.json();
}).catch(() => ({tags: [], features: {}}));

let tagicons = {};
tagdata.then(data => {tagicons = data.features || {}});

export function featurecontent(key, name) {
    return tagcontent({name, icon: tagicons[key]});
}

export function candycontent(name) {
    return tagcontent({name: name[0].toUpperCase() + name.slice(1), icon: "/assets/images/candies/candy.png"});
}

/*//////////////////////////////////////////////////////////////////////*/

export function tagcontent(tag) {
    const content = document.createDocumentFragment();
    const emoji = tag.emoji;
    const icon = tag.icon;
    if (icon?.startsWith("/")) {
        const image = document.createElement("img");
        image.className = "tagemoji";
        image.src = icon;
        image.alt = "";
        image.draggable = false;
        content.append(image);
    } else if (icon) {
        const span = document.createElement("span");
        span.className = "tagemoji";
        span.textContent = icon;
        content.append(span);
    } else if (emoji?.id && /^\d{17,22}$/.test(emoji.id)) {
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
