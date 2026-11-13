import {discordmd} from "./discordmd.js";

function attachment(file) {
    let url;
    try {url = new URL(file.url)} catch {return null}
    if (url.protocol !== "https:" || !/^(?:cdn|media)\.discordapp\.(?:com|net)$/.test(url.hostname)) return null;
    const link = document.createElement("a");
    link.className = "commentattachment";
    link.href = url.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    const name = file.name || "Attachment";
    const picture = /^image\/(?:png|jpeg|webp|gif|avif)$/i.test(file.type || "") || /\.(?:png|jpe?g|webp|gif|avif)$/i.test(name);
    if (picture) {
        const image = document.createElement("img");
        image.className = "commentimage";
        image.src = url.href;
        image.alt = name;
        image.loading = "lazy";
        image.decoding = "async";
        if (file.width > 0 && file.height > 0) image.style.aspectRatio = file.width + " / " + file.height;
        image.addEventListener("error", () => image.remove(), {once: true});
        link.append(image);
    }
    const label = document.createElement("span");
    label.className = "commentfilename";
    label.textContent = name;
    link.append(label);
    return link;
}

/*//////////////////////////////////////////////////////////////////////*/

export function comments(entry) {
    const section = document.createElement("section");
    section.className = "levelcomments";
    section.setAttribute("aria-label", "Comments");
    section.tabIndex = 0;
    if (!entry.detailurl) {section.hidden = true; return section}
    const earlier = document.createElement("button");
    earlier.type = "button";
    earlier.className = "earliercomments clickable";
    earlier.textContent = "Load earlier";
    earlier.hidden = true;
    const list = document.createElement("div");
    list.className = "commentlist";
    const status = document.createElement("p");
    status.className = "commentstatus";
    status.textContent = "Loading comments...";
    section.append(earlier, list, status);
    let before = null;
    let loading = false;
    async function load() {
        if (loading) return;
        loading = true;
        earlier.disabled = true;
        try {
            const url = new URL(entry.detailurl.replace(/\/$/, "") + "/comments");
            if (before) url.searchParams.set("before", before);
            const response = await fetch(url);
            if (!response.ok) throw new Error("Comments unavailable");
            const data = await response.json();
            const fragment = document.createDocumentFragment();
            for (const message of data.messages) {
                const item = document.createElement("article");
                item.className = "levelcomment";
                const author = document.createElement("p");
                author.className = "commentauthor";
                author.textContent = message.author;
                const body = document.createElement("div");
                body.className = "commentbody";
                body.append(discordmd(message.content, 0, message.mentions));
                for (const file of message.attachments || []) {
                    const link = attachment(file);
                    if (link) body.append(link);
                }
                item.append(author, body);
                fragment.append(item);
            }
            const height = section.scrollHeight;
            const position = section.scrollTop;
            const initial = !list.children.length;
            list.prepend(fragment);
            before = data.before;
            earlier.hidden = !before;
            status.textContent = list.children.length ? "" : "No comments yet";
            if (!initial) section.scrollTop = position + section.scrollHeight - height;
        } catch {
            status.textContent = "Comments could not be loaded";
            earlier.textContent = "Retry";
            earlier.hidden = false;
        } finally {
            loading = false;
            earlier.disabled = false;
        }
    }
    earlier.addEventListener("click", load);
    void load();
    return section;
}
