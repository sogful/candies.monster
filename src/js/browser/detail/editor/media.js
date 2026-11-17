export function attachments(root, status, changed, initial = []) {
    const files = new Map();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "";
    input.multiple = true;
    input.hidden = true;
    input.className = "editorfiles";
    root.after(input);
    input.addEventListener("change", async () => {
        const selected = [...input.files];
        input.value = "";
        try {
            for (const file of selected) {
                const present = [...files.values()].filter(item => root.querySelector('[data-attachment="' + item.key + '"]'));
                if (present.length >= 3 || file.size + present.reduce((total, item) => total + item.bytes, 0) > 5 * 1024 * 1024) throw new Error("Use up to 3 files, 5mb total");
                const data = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
                insert({key: crypto.randomUUID().replace(/-/g, ""), name: file.name, type: file.type || "application/octet-stream", bytes: file.size, data: String(data).split(",")[1]});
            }
            changed();
        } catch (error) {status.textContent = error.message}
    });
    function insert(file) {
        const key = file.key;
        files.set(key, file);
        const figure = document.createElement("figure");
        figure.className = "editorattachment";
        figure.dataset.attachment = key;
        figure.contentEditable = "false";
        const picture = /^image\/(png|jpeg|gif|webp)$/.test(file.type);
        const video = /^video\//.test(file.type);
        const preview = document.createElement(picture ? "img" : video ? "video" : "span");
        if (picture || video) preview.src = "data:" + file.type + ";base64," + file.data;
        if (picture) preview.alt = file.name;
        else if (video) {
            preview.className = "editorvideo";
            preview.controls = true;
            preview.playsInline = true;
            preview.preload = "metadata";
            preview.setAttribute("aria-label", file.name);
        } else {
            preview.className = "editorfile";
            preview.textContent = file.name;
        }
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "editorremove clickable";
        remove.setAttribute("aria-label", "Remove attachment");
        const icon = document.createElement("img");
        icon.src = "/assets/images/icons/x.png";
        icon.alt = "";
        remove.append(icon);
        remove.addEventListener("click", () => {figure.remove(); files.delete(key); changed()});
        figure.append(preview, remove);
        root.append(figure);
    }
    for (const file of initial) insert(file);
    return {
        open() {input.click()},
        values() {return [...files.values()].filter(item => root.querySelector('[data-attachment="' + item.key + '"]')).map(({name, type, data}) => ({name, type, data}))},
        saved() {return [...files.values()].filter(item => root.querySelector('[data-attachment="' + item.key + '"]'))}
    };
}
