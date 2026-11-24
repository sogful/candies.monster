export function spritebrowser(root, choose, clearsearch, modified = () => false) {
    const kinds = [["image", "Textures"], ["audio", "Audio"], ["video", "Video"]];
    const tabs = document.createElement("nav");
    tabs.className = "mediatabs";
    const controls = kinds.map(([kind, label]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "buttonart mediatab";
        button.textContent = label;
        button.addEventListener("click", () => setcategory(kind));
        return button;
    });
    tabs.append(...controls);
    const list = root.querySelector(".spritefiles");
    list.before(tabs);
    let items = [];
    let selected = -1;
    let query = "";
    let category = "image";
    const buttons = new Map();

    function folder() {
        return {folders: new Map(), files: []};
    }

    function refresh() {
        for (const [index, button] of buttons) button.classList.toggle("mediamodified", modified(items[index]));
    }

    function setcategory(kind) {
        if (kind === category || !kinds.some(row => row[0] === kind)) return;
        category = kind;
        if (items[selected]?.kind !== category && selected !== -1) {
            selected = -1;
            choose(selected);
        }
        render();
    }

    function render() {
        for (const [index, [kind]] of kinds.entries()) {
            controls[index].classList.toggle("gold", kind === category);
            controls[index].setAttribute("aria-pressed", String(kind === category));
        }
        buttons.clear();
        const tree = folder();
        for (const [index, item] of items.entries()) {
            if (item.kind !== category) continue;
            const path = item.label.replace(" / ", "/");
            if (query && !path.toLowerCase().includes(query)) continue;
            const segments = path.split("/");
            const filename = segments.pop();
            let directory = tree;
            for (const name of segments) {
                if (!directory.folders.has(name)) directory.folders.set(name, folder());
                directory = directory.folders.get(name);
            }
            directory.files.push({item, filename, index, path});
        }

        const nodes = [{directory: tree, parent: list}];
        list.replaceChildren();
        list.scrollTop = 0;
        if (!tree.files.length && !tree.folders.size) return;

        for (const {directory, parent} of nodes) {
            const branch = document.createElement("ul");
            branch.className = "mediatree";
            for (const [name, child] of [...directory.folders].sort(([a], [b]) => a.localeCompare(b))) {
                const entry = document.createElement("li");
                const label = document.createElement("span");
                label.className = "spritefolder";
                label.textContent = name;
                label.title = name;
                entry.append(label);
                branch.append(entry);
                nodes.push({directory: child, parent: entry});
            }
            for (const {item, filename, index, path} of directory.files.sort((a,b) => a.filename.localeCompare(b.filename))) {
                const entry = document.createElement("li");
                entry.className = "mediaentry";
                const button = document.createElement("button");
                button.type = "button";
                button.className = "spritefile";
                button.textContent = filename;
                button.title = path;
                button.dataset.kind = item.kind;
                buttons.set(index, button);
                button.setAttribute("aria-pressed", String(index === selected));
                button.addEventListener("click", () => {
                    selected = index;
                    list.querySelector('[aria-pressed="true"]')?.setAttribute("aria-pressed", "false");
                    button.setAttribute("aria-pressed", "true");
                    choose(index);
                });
                entry.append(button);
                branch.append(entry);
            }
            parent.append(branch);
        }
        refresh();
    }

    return {
        load(files, index, kind) {
            items = files;
            category = kinds.some(row => row[0] === kind) ? kind
                : files[index]?.kind ?? kinds.find(([entry]) => files.some(file => file.kind === entry))?.[0] ?? "image";
            selected = files[index]?.kind === category ? Number(index) : -1;
            query = "";
            clearsearch();
            render();
        },
        search(value) {query = value.trim().toLowerCase(); render()},
        category() {return category},
        setcategory,
        refresh,
        selection() {return selected},
        clear() {
            items = [];
            selected = -1;
            query = "";
            render();
        }
    };
}
