export function spritebrowser(root, choose, clearsearch) {
    const pathbar = root.querySelector(".spritepath");
    const list = root.querySelector(".spritefiles");
    let items = [];
    let directory = "";
    let selected = -1;
    let query = "";

    function action(label, classname, activate) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = classname;
        button.textContent = label;
        button.title = label;
        button.addEventListener("click", activate);
        return button;
    }

    function open(path) {
        directory = path;
        query = "";
        clearsearch();
        render();
    }

    function render() {
        const trail = directory.split("/").filter(Boolean);
        pathbar.replaceChildren(action("Textures", "spritecrumb", () => open("")));
        for (const [index, part] of trail.entries()) {
            const button = action(part, "spritecrumb", () => open(trail.slice(0, index + 1).join("/") + "/"));
            pathbar.append(button);
        }
        const files = [];
        const folders = new Set();
        for (const [index, item] of items.entries()) {
            const path = item.label.replace(" / ", "/");
            if (query) {
                if (path.toLowerCase().includes(query)) files.push({label: path, index});
                continue;
            }
            if (!path.startsWith(directory)) continue;
            const relative = path.slice(directory.length);
            if (relative.includes("/")) folders.add(relative.split("/")[0]);
            else files.push({label: relative, index});
        }
        const controls = [...folders].sort().map(folder =>
            action(folder + "/", "spritefolder", () => open(directory + folder + "/")));
        for (const {label, index} of files.sort((a, b) => a.label.localeCompare(b.label))) {
            const button = action(label, "spritefile", () => {
                selected = index;
                list.querySelector('[aria-pressed="true"]')?.setAttribute("aria-pressed", "false");
                button.setAttribute("aria-pressed", "true");
                choose(index);
            });
            button.setAttribute("aria-pressed", String(index === selected));
            controls.push(button);
        }
        list.replaceChildren(...controls);
        if (!controls.length) list.textContent = "No textures found.";
    }

    return {
        load(files, index) {
            items = files;
            selected = files[index] ? Number(index) : -1;
            const path = selected >= 0 ? files[selected].label.replace(" / ", "/") : "";
            open(path ? path.slice(0, path.lastIndexOf("/") + 1) : "");
        },
        search(value) {query = value.trim().toLowerCase(); render()},
        view(mode) {list.classList.toggle("spritegridview", mode === "grid")},
        selection() {return selected},
        clear() {items = []; selected = -1; open("")}
    };
}
