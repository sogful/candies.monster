import {setoverlay} from "../overlays.js";

/*//////////////////////////////////////////////////////////////////////*/

let popup = null;
let trigger = null;
let closing = 0;
let frame = 0;
let lasttap = null;
let restoring = false;

/*//////////////////////////////////////////////////////////////////////*/

function downloadbutton(target) {
    return target instanceof Element ? target.closest(".versionbuttons .downloadbutton") : null;
}

function touchinput(event) {
    return event?.pointerType === "touch" || matchMedia("(hover: none), (pointer: coarse)").matches;
}

function keepopen() {
    clearTimeout(closing);
    closing = 0;
}

function closepopup(focus = false) {
    keepopen();
    if (!popup || popup.hidden) return;
    popup.hidden = true;
    setoverlay(popup, false);
    const previous = trigger;
    trigger = null;
    previous?.setAttribute("aria-expanded", "false");
    if (focus && previous?.isConnected) {
        restoring = true;
        previous.focus({preventScroll: true});
        restoring = false;
    }
}

function delayedclose() {
    keepopen();
    closing = setTimeout(() => closepopup(), ["left", "right"].includes(popup?.dataset.placement) ? 320 : 160);
}

/*//////////////////////////////////////////////////////////////////////*/

function positionpopup() {
    frame = 0;
    if (!trigger || !popup || popup.hidden) return;
    if (!trigger.isConnected) return closepopup();
    const viewport = window.visualViewport;
    const left = viewport?.offsetLeft || 0;
    const top = viewport?.offsetTop || 0;
    const width = viewport?.width || innerWidth;
    const height = viewport?.height || innerHeight;
    const anchor = trigger.getBoundingClientRect();
    if (anchor.bottom <= top || anchor.top >= top + height || anchor.right <= left || anchor.left >= left + width) return closepopup();
    const panel = !touchinput() ? trigger.closest(".versionscreen,.searchresults")?.getBoundingClientRect() : null;
    const before = panel ? panel.left - left - 16 : 0;
    const after = panel ? left + width - panel.right - 16 : 0;
    const beside = Math.max(before, after) >= 240;
    const preceding = before >= after;
    popup.style.maxWidth = `${Math.max(0, beside ? Math.min(width - 16, preceding ? before : after) : width - 16)}px`;
    popup.style.maxHeight = `${Math.max(0, height - 16)}px`;
    const measured = popup.getBoundingClientRect();
    if (beside) {
        popup.dataset.placement = preceding ? "left" : "right";
        popup.style.left = `${preceding ? panel.left - measured.width - 8 : panel.right + 8}px`;
        popup.style.top = `${Math.max(top + 8, Math.min(anchor.top, top + height - measured.height - 8))}px`;
        setoverlay(popup, true);
        return;
    }
    const below = top + height - anchor.bottom - 16;
    const above = anchor.top - top - 16;
    const underneath = measured.height <= below || (measured.height > above && below >= above);
    popup.dataset.placement = underneath ? "below" : "above";
    popup.style.maxHeight = `${Math.max(0, underneath ? below : above)}px`;
    const actual = popup.getBoundingClientRect();
    popup.style.left = `${Math.max(left + 8, Math.min(anchor.left, left + width - actual.width - 8))}px`;
    popup.style.top = `${underneath ? anchor.bottom + 8 : anchor.top - actual.height - 8}px`;
    setoverlay(popup, true);
}

function scheduleposition() {
    if (!frame && trigger) frame = requestAnimationFrame(positionpopup);
}

function textnode(tag, classname, text) {
    const node = document.createElement(tag);
    node.className = classname;
    node.textContent = text;
    return node;
}

function showpopup(button) {
    keepopen();
    if (!popup) {
        popup = document.createElement("section");
        popup.className = "downloadpopup";
        popup.setAttribute("role", "dialog");
        popup.setAttribute("aria-label", "Download information");
        document.body.appendChild(popup);
    }
    trigger?.setAttribute("aria-expanded", "false");
    trigger = button;
    button.setAttribute("aria-expanded", "true");
    const data = button.dataset;
    popup.replaceChildren(textnode("div", "downloadheading", data.downloadversion));
    const details = document.createElement("dl");
    details.className = "downloaddata";
    for (const [label, value] of [["Size", data.downloadsize], ["Architecture", data.downloadarch], ["Symbols", data.downloadsymbols]]) {
        if (!value) continue;
        details.append(textnode("dt", "downloadlabel", label), textnode("dd", "downloadvalue", value));
    }
    if (details.childElementCount) popup.appendChild(details);
    if (data.downloadnote) popup.appendChild(textnode("div", "downloadnotes", data.downloadnote));
    if (data.downloadwarning) {
        const warning = document.createElement("div");
        warning.className = "downloadwarning";
        const icon = document.createElement("img");
        icon.src = "/assets/images/warning.png";
        icon.alt = "";
        icon.width = 16;
        icon.height = 16;
        icon.draggable = false;
        warning.append(icon, textnode("span", "downloadwarningtext", data.downloadwarning));
        popup.appendChild(warning);
    }
    const url = textnode("a", "downloadurl clickable", button.href);
    url.href = button.href;
    url.target = "_blank";
    url.rel = "noopener";
    popup.appendChild(url);
    popup.hidden = false;
    positionpopup();
}

/*//////////////////////////////////////////////////////////////////////*/

document.addEventListener("pointerover", event => {
    if (touchinput(event)) return;
    if (popup?.contains(event.target)) return keepopen();
    const button = downloadbutton(event.target);
    if (button && button !== downloadbutton(event.relatedTarget)) showpopup(button);
});

document.addEventListener("pointerout", event => {
    if (touchinput(event) || !trigger) return;
    if (popup?.contains(event.relatedTarget) || trigger.contains(event.relatedTarget)) return;
    if (popup?.contains(event.target) || trigger.contains(event.target)) delayedclose();
});

document.addEventListener("focusin", event => {
    const button = downloadbutton(event.target);
    if (button && !restoring && !touchinput()) showpopup(button);
    else if (popup && !popup.hidden && !popup.contains(event.target)) closepopup();
});

document.addEventListener("focusout", event => {
    if (!trigger || touchinput()) return;
    if (popup?.contains(event.relatedTarget) || trigger.contains(event.relatedTarget)) return;
    delayedclose();
});

document.addEventListener("pointerdown", event => {
    if (popup?.hidden === false && !popup.contains(event.target) && !trigger?.contains(event.target)) {
        lasttap = null;
        closepopup();
    }
});

document.addEventListener("click", event => {
    const button = downloadbutton(event.target);
    if (!button) {
        if (popup?.contains(event.target) && event.target.closest("a")) closepopup();
        return;
    }
    if (!touchinput(event) || event.detail === 0 || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
        closepopup();
        return;
    }
    const now = event.timeStamp;
    if (lasttap?.button === button && (event.detail > 1 || now - lasttap.time < 450)) {
        lasttap = null;
        closepopup();
        return;
    }
    event.preventDefault();
    lasttap = {button, time: now};
    showpopup(button);
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && popup?.hidden === false) {
        event.preventDefault();
        closepopup(true);
    } else if (event.key === "ArrowDown") {
        const button = downloadbutton(event.target);
        if (!button) return;
        event.preventDefault();
        showpopup(button);
        popup.querySelector(".downloadurl").focus({preventScroll: true});
    }
});

document.addEventListener("scroll", event => {
    if (!popup?.contains(event.target)) closepopup();
}, {capture: true, passive: true});
window.addEventListener("resize", scheduleposition, {passive: true});
window.visualViewport?.addEventListener("resize", scheduleposition, {passive: true});
window.visualViewport?.addEventListener("scroll", scheduleposition, {passive: true});
window.addEventListener("hashchange", () => closepopup());
