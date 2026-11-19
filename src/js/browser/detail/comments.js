import {feather} from "/assets/static/js/controls/feather.js";
import {creatorlink} from "../catalogue/creator.js";
import {spinner} from "/assets/static/js/images/spinner.js";
import {imageviewer} from "./inspection.js";
import {discordmd} from "./markdown.js";
import {composer} from "./community.js";

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
        const preview = new URL(url);
        preview.hostname = "media.discordapp.net";
        preview.searchParams.set("width", String(Math.min(320, file.width || 320)));
        preview.searchParams.set("height", String(Math.min(240, file.height || 240)));
        preview.searchParams.set("quality", "lossy");
        preview.searchParams.set("format", "webp");
        image.src = preview.href;
        image.alt = name;
        image.loading = "lazy";
        image.decoding = "async";
        if (file.width > 0 && file.height > 0) image.style.aspectRatio = file.width + " / " + file.height;
        image.addEventListener("error", () => {image.src = url.href}, {once: true});
        link.append(image);
        link.addEventListener("click", event => {
            if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            imageviewer(url.href, name, link);
        });
        return link;
    }
    if (/^video\//.test(file.type || "") || /\.(?:mp4|webm|mov|m4v)$/i.test(name)) {
        const video = document.createElement("video");
        video.className = "commentvideo";
        video.src = url.href;
        video.controls = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.setAttribute("aria-label", name);
        const container = document.createElement("div");
        container.className = "commentattachment commentvideowrap";
        const expand = document.createElement("button");
        expand.type = "button";
        expand.className = "commentvideoopen clickable";
        expand.setAttribute("aria-label", "Enlarge " + name);
        const icon = document.createElement("img");
        icon.src = "/assets/images/icons/search.svg";
        icon.alt = "";
        expand.append(icon);
        expand.addEventListener("click", () => imageviewer(url.href, name, expand, null, "video"));
        container.append(video, expand);
        return container;
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
    const view = document.createElement("div");
    view.className = "commentview";
    section.append(view);
    const thread = document.createElement("div");
    thread.className = "commentthread";
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
    const writing = composer(entry, async () => {
        before = null;
        for (const item of list.children) visibility?.unobserve(item);
        seen.clear();
        list.replaceChildren();
        await load();
    }, section);
    if (!writing.hidden) section.classList.add("commentwriting");
    thread.append(earlier, list, status);
    view.append(thread);
    feather(thread);
    section.append(writing);
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
    }, {root: thread, rootMargin: "400px"}) : null;
    let before = null;
    let loading = false;
    let failed = false;
    let position = 0;
    const seen = new Set();
    const lifetime = new AbortController();

    function earlierbutton() {
        if (loading || failed) return;
        earlier.hidden = !before || thread.scrollHeight > thread.clientHeight + 1;
        earlier.textContent = "Load earlier";
    }

    async function load() {
        if (loading || !section.isConnected || panel?.hidden || lifetime.signal.aborted) return;
        loading = true;
        failed = false;
        earlier.disabled = true;
        const cursor = before;
        try {
            const url = new URL(entry.detailurl.replace(/\/$/, "") + "/comments");
            if (cursor) url.searchParams.set("before", cursor);
            const response = await fetch(url, {signal: lifetime.signal});
            if (!response.ok) throw new Error("Comments unavailable");
            const data = await response.json();
            if (!section.isConnected || panel?.hidden || lifetime.signal.aborted) return;
            const fragment = document.createDocumentFragment();
            for (const message of data.messages) {
                if (seen.has(message.id)) continue;
                seen.add(message.id);
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
            const height = thread.scrollHeight;
            const anchor = thread.scrollTop;
            const initial = !list.children.length;
            list.prepend(fragment);
            section.classList.toggle("commentempty", !list.children.length);
            const next = data.before;
            before = typeof next === "string" && /^\d{17,22}$/.test(next) && (!cursor || BigInt(next) < BigInt(cursor)) ? next : null;
            status.replaceChildren();
            status.classList.toggle("commentsad", !list.children.length);
            if (!list.children.length) {
                const image = document.createElement("img");
                image.src = "/assets/images/omnom/404/404.gif";
                image.alt = "";
                const label = document.createElement("span");
                label.textContent = "No comments yet";
                status.append(image, label);
            }
            if (!initial) thread.scrollTop = anchor + thread.scrollHeight - height;
            else thread.scrollTop = thread.scrollHeight;
            position = thread.scrollTop;
        } catch {
            if (lifetime.signal.aborted || !section.isConnected) return;
            failed = true;
            status.textContent = "Comments could not be loaded";
            earlier.textContent = "Retry";
            earlier.hidden = false;
        } finally {
            loading = false;
            earlier.disabled = false;
            if (section.isConnected) earlierbutton();
        }
    }
    function scroll() {
        const current = thread.scrollTop;
        const upward = current + 1 < position;
        position = current;
        if (section.isConnected && !panel?.hidden && !view.hidden && before && upward && current < 140 && !loading && !failed) void load();
    }
    thread.addEventListener("scroll", scroll, {passive: true});
    const sizes = window.ResizeObserver ? new ResizeObserver(earlierbutton) : null;
    sizes?.observe(thread);
    earlier.addEventListener("click", load);
    const removal = new MutationObserver(() => {
        if (section.isConnected && !panel?.hidden) return;
        lifetime.abort();
        visibility?.disconnect();
        sizes?.disconnect();
        removal.disconnect();
    });
    const panel = document.querySelector(".leveldetail");
    if (panel) removal.observe(panel, {childList: true, attributes: true, attributeFilter: ["hidden"]});
    queueMicrotask(load);
    return section;
}
