import {creatorlink} from "../catalogue/creator.js";
import {spinner} from "/assets/static/js/images/spinner.js";
import {imageviewer} from "./inspection.js";
import {discordmd} from "./markdown.js";

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
        link.addEventListener("click", event => {
            if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            imageviewer(url.href, name, link);
        });
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
    section.className = "levelcomments commentempty";
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
    spinner(status, "Loading comments");
    section.append(earlier, list, status);
    const content = new WeakMap();
    const visibility = window.IntersectionObserver ? new IntersectionObserver(records => {
        for (const record of records) {
            const item = record.target;
            const selection = getSelection();
            if (selection?.type === "Range" && item.contains(selection.anchorNode)) continue;
            if (record.isIntersecting) {
                if (item.childNodes.length) continue;
                content.get(item)?.();
                item.style.minHeight = "";
            } else if (item.childNodes.length) {
                item.style.minHeight = Math.ceil(item.getBoundingClientRect().height) + "px";
                item.replaceChildren();
            }
        }
    }, {root: section, rootMargin: "400px"}) : null;
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
            if (!section.isConnected) return;
            const fragment = document.createDocumentFragment();
            for (const message of data.messages) {
                const item = document.createElement("article");
                item.className = "levelcomment";
                function render() {
                    const author = creatorlink({creator: message.author, creatorid: message.authorid, detailurl: entry.detailurl}, "commentauthor", "");
                    const body = document.createElement("div");
                    body.className = "commentbody";
                    body.append(discordmd(message.content, 0, message.mentions));
                    for (const file of message.attachments || []) {
                        const link = attachment(file);
                        if (link) body.append(link);
                    }
                    item.append(author, body);
                }
                content.set(item, render);
                if (visibility) {item.style.minHeight = "76px"; visibility.observe(item)}
                else render();
                fragment.append(item);
            }
            const height = section.scrollHeight;
            const position = section.scrollTop;
            const initial = !list.children.length;
            list.prepend(fragment);
            section.classList.toggle("commentempty", !list.children.length);
            before = data.before;
            earlier.hidden = true;
            status.textContent = list.children.length ? "" : "No comments yet";
            if (!initial) section.scrollTop = position + section.scrollHeight - height;
            else section.scrollTop = section.scrollHeight;
        } catch {
            status.textContent = "Comments could not be loaded";
            earlier.textContent = "Retry";
            earlier.hidden = false;
        } finally {
            loading = false;
            earlier.disabled = false;
            if (earlier.hidden) requestAnimationFrame(scroll);
        }
    }
    function scroll() {
        if (before && section.scrollTop < 140 && !loading && earlier.hidden) void load();
    }
    section.addEventListener("scroll", scroll, {passive: true});
    const sizes = window.ResizeObserver ? new ResizeObserver(scroll) : null;
    sizes?.observe(section);
    earlier.addEventListener("click", load);
    const removal = new MutationObserver(() => {
        if (section.isConnected) return;
        visibility?.disconnect();
        sizes?.disconnect();
        removal.disconnect();
    });
    const panel = document.querySelector(".leveldetail");
    if (panel) removal.observe(panel, {childList: true});
    void load();
    return section;
}
