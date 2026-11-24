export function spritebrowser(root, choose, clearsearch) {
    const list = root.querySelector(".spritefiles");
    const oldpath = root.querySelector(".spritepath");
    if (oldpath) oldpath.hidden = true;
    let items = [];
    let selected = -1;
    let query = "";

    function folder() {
        return {folders: new Map(), files: []};
    }

    function render() {
        const tree = folder();
        for (const [index, item] of items.entries()) {
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
        if (!tree.files.length && !tree.folders.size) {
            list.textContent = "No media found.";
            return;
        }

        for (const {directory, parent} of nodes) {
            const branch = document.createElement("ul");
            branch.className = "mediatree";
            for (const [name, child] of [...directory.folders].sort(([a], [b]) => a.localeCompare(b))) {
                const entry = document.createElement("li");
                const label = document.createElement("span");
                label.className = "spritefolder";
                label.textContent = name + "/";
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
    }

    return {
        load(files, index) {
            items = files;
            selected = files[index] ? Number(index) : -1;
            query = "";
            clearsearch();
            render();
        },
        search(value) {query = value.trim().toLowerCase(); render()},
        view(mode) {list.classList.toggle("mediawide", mode === "grid")},
        selection() {return selected},
        clear() {
            items = [];
            selected = -1;
            query = "";
            render();
        }
    };
}
