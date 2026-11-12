import {createsharing} from "/preview/src/sharing.js";
import {encodeurl} from "/preview/src/data.js";
import {source} from "./source.js";

export function share(entry, button) {
    const popup = document.createElement("div");
    popup.className = "levelshare";
    popup.hidden = true;
    popup.setAttribute("role", "dialog");
    popup.setAttribute("aria-label", "share level");
    const status = document.createElement("p");
    status.className = "sharestatus";
    status.setAttribute("role", "status");
    for (const [classname, label] of [["forumurl", "Level Link:"], ["shorturl", "Play Link:"]]) {
        const row = document.createElement("div");
        row.className = "sharerow";
        const name = document.createElement("span");
        name.className = "sharelabel";
        name.textContent = label;
        const link = document.createElement("a");
        link.className = classname;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        const copy = document.createElement("button");
        copy.className = "sharecopy clickable";
        copy.type = "button";
        const graphic = document.createElement("img");
        graphic.src = "/assets/images/buttons/wide/sbutton.webp";
        graphic.alt = "";
        graphic.draggable = false;
        const caption = document.createElement("span");
        caption.textContent = "Copy";
        copy.append(graphic, caption);
        copy.addEventListener("click", () => {
            if (!link.getAttribute("href")) return;
            void sharing.copyurl(link).then(copied => {status.textContent = copied ? "copied!" : "could not copy link"});
        });
        row.append(name, link, copy);
        popup.append(row);
    }
    const forum = popup.querySelector(".forumurl");
    forum.href = location.origin + location.pathname + "#" + entry.id;
    forum.textContent = forum.href.replace(/^https?:\/\//, "");
    popup.append(status);
    let data = "";
    const sharing = createsharing({getlevel: () => data, container: popup, onerror: message => {status.textContent = message}});
    button.addEventListener("click", async () => {
        popup.hidden = !popup.hidden;
        button.setAttribute("aria-expanded", String(!popup.hidden));
        if (popup.hidden) return;
        popup.querySelector(".forumurl").focus({preventScroll: true});
        if (data) return;
        status.textContent = "loading links...";
        try {
            data = encodeurl(await source(entry.file));
            sharing.generatelinks();
            status.textContent = "";
        } catch {status.textContent = "could not load links"}
    });
    popup.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;
        event.stopPropagation();
        popup.hidden = true;
        button.setAttribute("aria-expanded", "false");
        button.focus({preventScroll: true});
    });
    const controller = new AbortController();
    document.addEventListener("pointerdown", event => {
        if (!popup.contains(event.target) && !button.contains(event.target)) {
            popup.hidden = true;
            button.setAttribute("aria-expanded", "false");
        }
    }, {signal: controller.signal});
    const observer = new MutationObserver(() => {
        if (popup.isConnected) return;
        controller.abort();
        observer.disconnect();
    });
    observer.observe(document.querySelector(".leveldetail"), {childList: true});
    return popup;
}
