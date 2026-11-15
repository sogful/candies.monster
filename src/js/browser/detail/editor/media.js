export function attachments(root, status, changed, initial = []) {
    const files = new Map();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png,image/jpeg,image/gif,image/webp";
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
                if (present.length >= 3 || file.size + present.reduce((total, item) => total + item.bytes, 0) > 5 * 1024 * 1024) throw new Error("Use up to 3 images, 5mb total");
                if (!["image/png", "image/jpeg", "image/gif", "image/webp"].includes(file.type)) throw new Error("Choose a PNG, JPEG, GIF or WebP image");
                const data = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
                insert({key: crypto.randomUUID().replace(/-/g, ""), name: file.name, type: file.type, bytes: file.size, data: String(data).split(",")[1]});
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
        const image = document.createElement("img");
        image.src = "data:" + file.type + ";base64," + file.data;
        image.alt = file.name;
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "editorremove clickable";
        remove.setAttribute("aria-label", "Remove image");
        const icon = document.createElement("img");
        icon.src = "/assets/images/icons/x.png";
        icon.alt = "";
        remove.append(icon);
        remove.addEventListener("click", () => {figure.remove(); files.delete(key); changed()});
        figure.append(image, remove);
        root.append(figure);
    }
    for (const file of initial) insert(file);
    return {
        open() {input.click()},
        values() {return [...files.values()].filter(item => root.querySelector('[data-attachment="' + item.key + '"]')).map(({name, type, data}) => ({name, type, data}))},
        saved() {return [...files.values()].filter(item => root.querySelector('[data-attachment="' + item.key + '"]'))}
    };
}
