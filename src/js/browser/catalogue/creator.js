import {spinner} from "/assets/static/js/images/spinner.js";
import {offline} from "./offline.js";
const requests = new Map();
const known = new Map();

export function creatorlink(entry, classname, prefix = "by ") {
    const row = document.createElement("p");
    row.className = classname;
    row.append(prefix);
    if (entry.creatorid) known.set(entry.creatorid, entry);
    if (!/^\d{17,22}$/.test(entry.creatorid || "")) {row.append(entry.creator); return row}
    const link = document.createElement("a");
    link.className = "creatorlink clickable";
    link.textContent = entry.creator;
    link.href = "/?author=" + entry.creatorid;
    link.draggable = false;
    link.addEventListener("click", event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !getSelection().isCollapsed) return;
        event.preventDefault();
        document.dispatchEvent(new CustomEvent("levelcreator", {detail: entry.creatorid}));
    });
    row.append(link);
    return row;
}

/*//////////////////////////////////////////////////////////////////////*/

export function profile(container, id, entries) {
    container.replaceChildren();
    const entry = entries.find(entry => entry.creatorid === id) || known.get(id);
    container.hidden = !id;
    if (!id) return;
    const back = document.createElement("button");
    back.type = "button";
    back.className = "creatorback clickable";
    back.setAttribute("aria-label", "Back to levels");
    const arrow = document.createElement("img");
    arrow.src = "/assets/images/buttons/back.png";
    arrow.alt = "";
    back.append(arrow);
    back.addEventListener("click", () => document.dispatchEvent(new Event("levelprofileback")));
    const avatar = document.createElement("div");
    avatar.className = "creatoravatar";
    if (!offline()) spinner(avatar, "Loading profile");
    const image = document.createElement("img");
    image.className = "creatorpicture";
    image.addEventListener("load", () => {image.hidden = false; avatar.querySelector(".candyloading")?.remove()}, {once: true});
    avatar.append(image);
    image.alt = "";
    image.hidden = true;
    const text = document.createElement("div");
    text.className = "creatortext";
    const name = document.createElement("p");
    name.className = "creatorname";
    name.textContent = entry?.creator || "Deleted User";
    const username = document.createElement("p");
    username.className = "creatorusername";
    username.textContent = offline() ? "" : "@...";
    const identifier = document.createElement("span");
    identifier.className = "creatorid";
    identifier.textContent = "(" + id + ")";
    const line = document.createElement("div");
    line.className = "creatorsubline";
    line.append(username, identifier);
    text.append(name, line);
    container.append(back, avatar, text);
    if (!entry?.detailurl || offline()) return;
    if (!requests.has(id)) {
        const url = new URL("/creators/" + id, entry.detailurl);
        const request = fetch(url).then(response => {
            if (!response.ok) throw new Error("Profile unavailable");
            return response.json();
        }).catch(error => {requests.delete(id); throw error});
        requests.set(id, request);
    }
    void requests.get(id).then(data => {
        if (!name.isConnected || data.id !== id) return;
        name.textContent = data.name || name.textContent;
        username.textContent = data.username ? "@" + data.username : "";
        if (/^https:\/\/cdn\.discordapp\.com\//.test(data.avatar || "")) {image.src = data.avatar}
    }).catch(() => {});
}
