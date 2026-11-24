let opened = null;

export function dropdown(select, {menuclass, grid = false} = {}) {
    const root = document.createElement("span");
    root.className = "dropdown";
    const button = document.createElement("button");
    button.type = "button";
    button.className = select.className + " dropdownbutton clickable";
    button.setAttribute("aria-haspopup", "listbox");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", select.getAttribute("aria-label") || "Choose an option");
    select.before(root);
    select.classList.add("dropdownnative");
    select.tabIndex = -1;
    select.setAttribute("aria-hidden", "true");
    root.append(select, button);
    let menu = null;
    let controller = null;
    const property = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value");
    Object.defineProperty(select, "value", {get() {return property.get.call(this)}, set(value) {property.set.call(this, value); sync()}});

    function content(control, option) {
        if (!option?.dataset.flag) {
            control.textContent = option?.textContent || "Choose an option";
            return;
        }
        const image = document.createElement("img");
        image.className = "flagart";
        image.alt = "";
        image.src = option.dataset.flag;
        control.replaceChildren(image, document.createTextNode(" " + option.textContent));
    }

    function sync() {
        content(button, select.selectedOptions[0]);
        button.disabled = select.disabled || !select.options.length;
        button.title = select.selectedOptions[0]?.textContent || select.title;
        button.classList.toggle("dropdownmodified", select.selectedOptions[0]?.hasAttribute("data-modified") ?? false);
    }

    function close(focus = false) {
        controller?.abort();
        menu?.remove();
        menu = null;
        button.setAttribute("aria-expanded", "false");
        if (opened === close) opened = null;
        if (focus && button.isConnected) button.focus({preventScroll: true});
    }

    function position() {
        if (!root.isConnected) {close(); return}
        const bounds = button.getBoundingClientRect();
        menu.style.minWidth = Math.min(bounds.width, innerWidth - 16) + "px";
        menu.style.maxWidth = innerWidth - 16 + "px";
        const above = bounds.top - 8;
        const below = innerHeight - bounds.bottom - 8;
        const up = menu.scrollHeight > below && above > below;
        menu.style.maxHeight = Math.max(32, Math.min(300, up ? above : below)) + "px";
        menu.style.left = Math.max(8, Math.min(bounds.left, innerWidth - menu.offsetWidth - 8)) + "px";
        menu.style.top = (up ? Math.max(8, bounds.top - menu.offsetHeight - 3) : bounds.bottom + 3) + "px";
    }

    function open() {
        if (select.disabled) return;
        opened?.();
        opened = close;
        sync();
        controller = new AbortController();
        const options = {signal: controller.signal};
        menu = document.createElement("div");
        menu.className = "dropdownmenu";
        if (menuclass) menu.classList.add(menuclass);
        menu.setAttribute("role", "listbox");
        if (button.hasAttribute("aria-label")) menu.setAttribute("aria-label", button.getAttribute("aria-label"));
        menu.style.fontSize = getComputedStyle(button).fontSize;
        menu.style.fontFamily = getComputedStyle(button).fontFamily;
        for (const option of select.options) {
            const item = document.createElement("button");
            item.type = "button";
            item.className = "dropdownoption clickable";
            item.classList.toggle("dropdownsecondary", option.hasAttribute("data-secondary"));
            item.title = option.textContent;
            item.classList.toggle("dropdownmodified", option.hasAttribute("data-modified"));
            content(item, option);
            item.disabled = option.disabled;
            item.setAttribute("role", "option");
            item.setAttribute("aria-selected", String(option.selected));
            item.addEventListener("click", () => {
                select.value = option.value;
                close(true);
                select.dispatchEvent(new Event("change", {bubbles: true}));
            });
            menu.append(item);
        }
        document.body.append(menu);
        button.setAttribute("aria-expanded", "true");
        position();
        const selected = menu.querySelector('[aria-selected="true"]') || menu.querySelector("button");
        selected?.focus({preventScroll: true});
        if (grid) selected?.scrollIntoView({block: "nearest"});
        menu.addEventListener("keydown", event => {
            const items = [...menu.querySelectorAll("button:not(:disabled)")];
            const current = items.indexOf(document.activeElement);
            const columns = grid ? getComputedStyle(menu).gridTemplateColumns.split(" ").length : 1;
            let index = -1;
            if (event.key === "ArrowDown") index = (current + columns) % items.length;
            if (event.key === "ArrowUp") index = (current + items.length - columns) % items.length;
            if (grid && event.key === "ArrowRight") index = (current + 1) % items.length;
            if (grid && event.key === "ArrowLeft") index = (current + items.length - 1) % items.length;
            if (event.key === "Home") index = 0;
            if (event.key === "End") index = items.length - 1;
            if (event.key === "Escape") {event.preventDefault(); event.stopPropagation(); close(true)}
            if (event.key === "Tab") close(true);
            if (index >= 0) {event.preventDefault(); items[index].focus({preventScroll: true}); items[index].scrollIntoView({block: "nearest"})}
        }, options);
        document.addEventListener("pointerdown", event => {if (!menu?.contains(event.target) && !root.contains(event.target)) close()}, options);
        window.addEventListener("resize", position, options);
        window.addEventListener("scroll", event => {if (!menu?.contains(event.target)) position()}, {...options, capture: true});
        for (const event of ["hashchange", "popstate", "homeviewchange"]) window.addEventListener(event, () => close(), options);
    }

    button.addEventListener("click", () => menu ? close() : open());
    button.addEventListener("keydown", event => {
        if (["ArrowDown", "ArrowUp"].includes(event.key)) {event.preventDefault(); open()}
    });
    select.addEventListener("change", sync);
    new MutationObserver(sync).observe(select, {attributes: true, childList: true, subtree: true, characterData: true});
    sync();
    return root;
}
