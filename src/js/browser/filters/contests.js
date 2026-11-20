export function contestfilters(changed) {
    const options = document.createElement("div");
    options.className = "filteroptions contestoptions";
    options.setAttribute("aria-label", "Level contests");
    const selected = new Set();
    fetch("/assets/static/data/levels/contests.json").then(response => response.json()).then(entries => {
        for (const entry of entries) {
            const button = document.createElement("button");
            button.className = "leveltag clickable";
            button.type = "button";
            button.dataset.contest = entry.id;
            const emoji = document.createElement("span");
            emoji.className = "tagemoji";
            emoji.textContent = entry.emoji;
            const name = document.createElement("span");
            name.textContent = entry.name;
            button.append(emoji, name);
            button.addEventListener("click", () => {
                if (selected.has(entry.id)) selected.delete(entry.id);
                else selected.add(entry.id);
                changed();
            });
            options.append(button);
        }
        window.siteemoji?.(options);
        update();
    }).catch(() => {});
    function update() {
        for (const button of options.children) button.setAttribute("aria-pressed", String(selected.has(button.dataset.contest)));
    }
    return {
        element: options, update,
        get count() {return selected.size},
        reset() {selected.clear()},
        read(query) {
            selected.clear();
            for (const id of (query.get("contests") || "").split(",")) if (/^\d{17,22}$/.test(id)) selected.add(id);
        },
        write(url) {
            url.searchParams.delete("contests");
            if (selected.size) url.searchParams.set("contests", [...selected].sort().join(","));
        },
        matches(entry) {return !selected.size || (entry.contests || []).some(id => selected.has(id))}
    };
}
