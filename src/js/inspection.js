export function inspection(entry) {
    const button = document.createElement("button");
    button.className = "levelinspect clickable";
    button.type = "button";
    button.setAttribute("aria-label", "view full-quality level preview");
    const icon = document.createElement("img");
    icon.src = "/assets/images/icons/search.png";
    icon.alt = "";
    button.append(icon);
    button.addEventListener("click", () => open(entry, button));
    return button;
}

/*//////////////////////////////////////////////////////////////////////*/

function open(entry, trigger) {
    const dialog = document.createElement("dialog");
    dialog.className = "levelinspection";
    dialog.setAttribute("aria-label", entry.title + " preview");
    const viewport = document.createElement("div");
    viewport.className = "inspectionview";
    const image = document.createElement("img");
    image.className = "inspectionimage";
    image.alt = entry.title;
    image.draggable = false;
    const status = document.createElement("p");
    status.className = "inspectionstatus";
    status.textContent = "loading preview...";
    status.setAttribute("role", "status");
    const closebutton = document.createElement("button");
    closebutton.type = "button";
    closebutton.className = "inspectionclose clickable";
    closebutton.setAttribute("aria-label", "close preview");
    const closeicon = document.createElement("img");
    closeicon.src = "/assets/images/icons/x.png";
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

    function paint() {
        const limitx = Math.max(0, (image.width * scale - viewport.clientWidth) / 2) + viewport.clientWidth / 3;
        const limity = Math.max(0, (image.height * scale - viewport.clientHeight) / 2) + viewport.clientHeight / 3;
        x = Math.max(-limitx, Math.min(limitx, x));
        y = Math.max(-limity, Math.min(limity, y));
        image.style.transform = `translate(-50%,-50%) translate(${x}px,${y}px) scale(${scale})`;
    }

    function fit() {
        if (!image.naturalWidth) return;
        const ratio = Math.min((viewport.clientWidth - 24) / image.naturalWidth, (viewport.clientHeight - 24) / image.naturalHeight);
        image.width = Math.max(1, Math.round(image.naturalWidth * ratio));
        image.height = Math.max(1, Math.round(image.naturalHeight * ratio));
        scale = 1;
        x = y = 0;
        paint();
    }

    function zoom(value, pointx, pointy) {
        const next = Math.max(1, Math.min(8, value));
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
        dialog.classList.remove("visible");
        setTimeout(() => {
            dialog.close();
            dialog.remove();
            if (trigger.isConnected && !trigger.closest("[hidden]")) trigger.focus({preventScroll: true});
        }, 150);
    }

    image.onload = () => {
        if (closing) return;
        status.hidden = true;
        dialog.classList.add("ready");
        fit();
    };
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
    viewport.addEventListener("pointerdown", event => {
        if (event.button !== 0) return;
        pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
        viewport.setPointerCapture(event.pointerId);
    }, options);
    viewport.addEventListener("pointermove", event => {
        const previous = pointers.get(event.pointerId);
        if (!previous) return;
        const other = [...pointers.entries()].find(([id]) => id !== event.pointerId)?.[1];
        if (other) {
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
    image.src = "https://levels.candies.monster/thumb/" + encodeURIComponent(entry.id);
}
