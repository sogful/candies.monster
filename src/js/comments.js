import {discordmd} from "./discordmd.js";

export function comments(entry) {
    const section = document.createElement("section");
    section.className = "levelcomments";
    section.setAttribute("aria-label", "Comments");
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
                body.append(discordmd(message.content));
                for (const file of message.attachments || []) {
                    if (!/^https:\/\/(?:cdn|media)\.discordapp\.(?:com|net)\//.test(file.url)) continue;
                    const link = document.createElement("a");
                    link.href = file.url;
                    link.textContent = file.name;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    body.append(link);
                }
                item.append(author, body);
                fragment.append(item);
            }
            list.prepend(fragment);
            before = data.before;
            earlier.hidden = !before;
            status.textContent = list.children.length ? "" : "No comments yet";
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
