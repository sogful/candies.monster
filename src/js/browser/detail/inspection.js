import {spinner} from "/assets/static/js/images/spinner.js";
import {renderlevel} from "../renderer/export.js";
export function inspection(entry) {
    const button = document.createElement("button");
    button.className = "levelinspect clickable";
    button.type = "button";
    button.setAttribute("aria-label", "view full-quality level preview");
    const icon = document.createElement("img");
    icon.src = "/assets/images/icons/search.svg";
    icon.alt = "";
    button.append(icon);
    button.addEventListener("click", () => imageviewer(null, entry.title, button, entry));
    return button;
}

/*//////////////////////////////////////////////////////////////////////*/

export function imageviewer(url, label, trigger, entry = null, type = "image") {
    const dialog = document.createElement("dialog");
    dialog.className = "levelinspection";
    dialog.classList.toggle("levelexport", Boolean(entry));
    dialog.setAttribute("aria-label", label);
    const viewport = document.createElement("div");
    viewport.className = "inspectionview";
    const video = !entry && type === "video";
    const image = document.createElement(entry ? "canvas" : video ? "video" : "img");
    if (video) {image.controls = true; image.playsInline = true; image.preload = "metadata"}
    image.className = "inspectionimage";
    image.alt = label;
    image.draggable = false;
    const status = document.createElement("p");
    status.className = "inspectionstatus";
    spinner(status, "Loading preview");
    status.setAttribute("role", "status");
    const closebutton = document.createElement("button");
    closebutton.type = "button";
    closebutton.className = "inspectionclose clickable";
    closebutton.setAttribute("aria-label", "close preview");
    const closeicon = document.createElement("img");
    closeicon.src = "/assets/images/icons/x.svg";
    closeicon.alt = "";
    closebutton.append(closeicon);
    viewport.append(image, status);
    dialog.append(viewport, closebutton);
    document.body.append(dialog);
    const controller = new AbortController();
    const options = {signal: controller.signal};
    const pointers = new Map();
    let scale = 1;
    let x = 0;
    let y = 0;
    let closing = false;
    let naturalwidth = 0;
    let naturalheight = 0;
    let displaywidth = 0;
    let displayheight = 0;
    let dragged = false;
    let empty = true;
    let startx = 0;
    let starty = 0;

    function paint() {
        const limitx = Math.max(0, (displaywidth * scale - viewport.clientWidth) / 2) + viewport.clientWidth / 3;
        const limity = Math.max(0, (displayheight * scale - viewport.clientHeight) / 2) + viewport.clientHeight / 3;
        x = Math.max(-limitx, Math.min(limitx, x));
        y = Math.max(-limity, Math.min(limity, y));
        image.style.transform = `translate(-50%,-50%) translate(${x}px,${y}px) scale(${scale})`;
    }

    function fit() {
        if (!naturalwidth) return;
        const ratio = Math.min((viewport.clientWidth - 24) / naturalwidth, (viewport.clientHeight - 24) / naturalheight);
        displaywidth = Math.max(1, Math.round(naturalwidth * ratio));
        displayheight = Math.max(1, Math.round(naturalheight * ratio));
        image.style.width = displaywidth + "px";
        image.style.height = displayheight + "px";
        scale = 1;
        x = y = 0;
        paint();
    }

    function zoom(value, pointx, pointy) {
        if (!Number.isFinite(value) || value <= 0) return;
        const next = value;
        const bounds = viewport.getBoundingClientRect();
        const localx = pointx - bounds.left - bounds.width / 2;
        const localy = pointy - bounds.top - bounds.height / 2;
        x = localx + (x - localx) * next / scale;
        y = localy + (y - localy) * next / scale;
        scale = next;
        paint();
    }

    function close() {
        if (closing) return;
        closing = true;
        controller.abort();
        if (video) {image.pause(); image.removeAttribute("src"); image.load()}
        dialog.classList.remove("visible");
        setTimeout(() => {
            dialog.close();
            dialog.remove();
            if (trigger.isConnected && !trigger.closest("[hidden]")) trigger.focus({preventScroll: true});
        }, 150);
    }

    const loaded = () => {
        if (closing) return;
        naturalwidth = video ? image.videoWidth : image.naturalWidth;
        naturalheight = video ? image.videoHeight : image.naturalHeight;
        status.hidden = true;
        dialog.classList.add("ready");
        fit();
    };
    image.addEventListener(video ? "loadedmetadata" : "load", loaded, options);
    image.onerror = () => {status.textContent = "could not load preview"};
    closebutton.addEventListener("click", close, options);
    dialog.addEventListener("cancel", event => {event.preventDefault(); close()}, options);
    dialog.addEventListener("keydown", event => {
        if (event.key === "Escape") event.stopPropagation();
        if (event.key === "0") fit();
        else if (["+", "=", "-"].includes(event.key)) {
            event.preventDefault();
            zoom(scale * (event.key === "-" ? 0.8 : 1.25), innerWidth / 2, innerHeight / 2);
        }
    }, options);
    viewport.addEventListener("wheel", event => {
        event.preventDefault();
        zoom(scale * Math.exp(-event.deltaY * 0.002), event.clientX, event.clientY);
    }, {...options, passive: false});
    viewport.addEventListener("dblclick", fit, options);
    viewport.addEventListener("click", event => {if (event.target === viewport && !dragged && empty) close()}, options);
    viewport.addEventListener("pointerdown", event => {
        if (event.button !== 0) return;
        if (video && event.target === image && event.offsetY >= image.clientHeight - 48) return;
        if (!pointers.size) {dragged = false; empty = event.target === viewport; startx = event.clientX; starty = event.clientY}
        pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
        viewport.setPointerCapture(event.pointerId);
    }, options);
    viewport.addEventListener("pointermove", event => {
        const previous = pointers.get(event.pointerId);
        if (!previous) return;
        if (Math.hypot(event.clientX - startx, event.clientY - starty) > 4) dragged = true;
        const other = [...pointers.entries()].find(([id]) => id !== event.pointerId)?.[1];
        if (other) {
            dragged = true;
            const before = Math.hypot(previous.x - other.x, previous.y - other.y);
            const after = Math.hypot(event.clientX - other.x, event.clientY - other.y);
            x += (event.clientX - previous.x) / 2;
            y += (event.clientY - previous.y) / 2;
            if (before > 1) zoom(scale * after / before, (event.clientX + other.x) / 2, (event.clientY + other.y) / 2);
        } else {
            x += event.clientX - previous.x;
            y += event.clientY - previous.y;
            paint();
        }
        pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
    }, options);
    for (const name of ["pointerup", "pointercancel", "lostpointercapture"]) viewport.addEventListener(name, event => pointers.delete(event.pointerId), options);
    for (const name of ["hashchange", "popstate"]) window.addEventListener(name, close, options);
    document.addEventListener("homeviewchange", close, options);
    window.addEventListener("resize", fit, options);
    dialog.showModal();
    requestAnimationFrame(() => dialog.classList.add("visible"));
    if (entry) {
        const exports = document.createElement("div");
        exports.className = "inspectionexports";
        for (const size of [1280, 2560, 4096]) {
            const button = document.createElement("button");
            button.className = "inspectionexport clickable buttonart";
            button.type = "button";
            button.textContent = size + "p";
            button.addEventListener("click", async () => {
                button.disabled = true;
                try {
                    const output = document.createElement("canvas");
                    await renderlevel(entry, output, size);
                    const blob = await new Promise(resolve => output.toBlob(resolve, "image/png"));
                    if (!blob || closing) return;
                    const link = document.createElement("a");
                    const url = URL.createObjectURL(blob);
                    link.href = url;
                    link.download = (entry.title + " by " + entry.creator).replace(/[<>:"/\\|?*]/g, "") + ".png";
                    link.click();
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                    output.width = output.height = 1;
                } catch {status.hidden = false; status.textContent = "could not export preview"}
                finally {button.disabled = false}
            }, options);
            exports.append(button);
        }
        dialog.append(exports);
        void renderlevel(entry, image, 2560).then(() => {
            if (closing) return;
            naturalwidth = image.width;
            naturalheight = image.height;
            status.hidden = true;
            dialog.classList.add("ready");
            fit();
        }).catch(() => {status.textContent = "could not load preview"});
    } else image.src = url;
}
