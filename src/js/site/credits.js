import {spinner} from "/assets/static/js/images/spinner.js";

let loading;

function link(text, address) {
    let url;
    try {url = new URL(address, location.href)} catch {return document.createTextNode(text)}
    if (!["http:", "https:"].includes(url.protocol)) return document.createTextNode(text);
    const anchor = document.createElement("a");
    anchor.className = "clickable";
    anchor.textContent = text;
    anchor.href = url.href;
    if (url.origin !== location.origin) {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
    }
    return anchor;
}

function richtext(text) {
    const content = document.createDocumentFragment();
    const source = String(text || "");
    const pattern = /\[([^\]\n]+)\]\(([^\s)]+)\)/g;
    let offset = 0;
    for (const match of source.matchAll(pattern)) {
        content.append(source.slice(offset, match.index), link(match[1], match[2]));
        offset = match.index + match[0].length;
    }
    content.append(source.slice(offset));
    return content;
}

/*//////////////////////////////////////////////////////////////////////*/

export function rendercredits(data) {
    const content = document.createDocumentFragment();
    for (const section of data.sections || []) {
        if (section.title) {
            const heading = document.createElement(section.heading === "major" ? "h1" : "h2");
            heading.className = "documentheading" + (section.heading === "major" ? " documentmajor" : "");
            heading.append(richtext(section.title));
            content.append(heading);
        }
        const list = document.createElement("ul");
        list.className = "documentcontributors";
        for (const entry of section.entries || []) {
            const item = document.createElement("li");
            item.className = "documententry";
            const heading = entry.size === "large" ? "h2" : entry.size === "small" ? "h3" : "div";
            const name = document.createElement(heading);
            if (heading !== "div") name.className = "documentheading" + (heading === "h3" ? " documentminor" : "");
            name.append(entry.url ? link(entry.name, entry.url) : richtext(entry.name));
            if (entry.subtitle) {
                const subtitle = document.createElement("i");
                subtitle.className = "documenttiny";
                subtitle.append("(", richtext(entry.subtitle), ")");
                name.append(document.createElement("br"), subtitle);
            }
            item.append(name);
            list.append(item);
        }
        content.append(list);
    }
    return content;
}

export async function loadcredits(container) {
    if (container.dataset.ready) return;
    const status = document.createElement("div");
    status.className = "creditsloading";
    status.setAttribute("role", "status");
    spinner(status, "Loading credits");
    container.replaceChildren(status);
    loading ||= fetch("/assets/static/data/credits.json").then(response => {
        if (!response.ok) throw new Error("Credits unavailable");
        return response.json();
    }).catch(error => {loading = null; throw error});
    try {
        container.replaceChildren(rendercredits(await loading));
        container.dataset.ready = "true";
    } catch (error) {
        status.textContent = "could not load credits";
        throw error;
    }
}
