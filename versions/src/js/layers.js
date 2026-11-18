export const layers = [
    {name: "omnom", label: "Om Nom"},
    {name: "zeptolab", label: "Zeptolab"},
    {name: "fangames", label: "Fangames"}
];

export function startlayers() {
    const viewport = document.querySelector(".archiveviewport");
    const template = document.querySelector(".layertemplate");
    const above = document.querySelector(".layerup");
    const below = document.querySelector(".layerdown");
    const search = document.querySelector(".archivesearch");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const groups = layers.map(layer => {
        const element = template.content.firstElementChild.cloneNode(true);
        element.dataset.layer = layer.name;
        const container = element.querySelector(".container");
        const platforms = [...container.querySelectorAll(".gamescreen")].map((screen, index) => {
            const name = index === 0 ? "android" : "ios";
            const directory = layer.name === "omnom" ? "" : layer.name + "/";
            return {name, layer: layer.name, label: index === 0 ? "Android" : "iOS", container, screen,
                circle: screen.querySelector(".gamecircle"), url: `/assets/static/data/versions/${directory}${name}.csv`};
        });
        viewport.append(element);
        return {...layer, element, container, platforms};
    });

    function arrow(button, target) {
        button.hidden = !target;
        button.dataset.layer = target?.name || "";
        button.querySelector("span").textContent = target?.label || "";
    }

    function positionabove() {
        if (above.hidden) return;
        const button = above.getBoundingClientRect();
        if (!button.width) return;
        const bar = search.getBoundingClientRect();
        const overlap = bar.width && button.left < bar.right + 4 && button.right > bar.left - 4;
        const top = overlap ? Math.ceil(bar.bottom + 6) : 8;
        above.style.setProperty("--layeruptop", `${top}px`);
        viewport.style.setProperty("--layerpadding", `${Math.max(56, top + button.height + 4)}px`);
    }

    window.addEventListener("resize", positionabove, {passive: true});
    if ("ResizeObserver" in window) {
        const observer = new ResizeObserver(positionabove);
        observer.observe(above);
        observer.observe(search);
    }

    function show(name, animate = false) {
        const index = Math.max(0, groups.findIndex(group => group.name === name));
        const group = groups[index];
        for (const layer of groups) layer.element.inert = layer !== group;
        group.element.classList.add("visited");
        arrow(above, groups[index - 1]);
        arrow(below, groups[index + 1]);
        positionabove();
        viewport.scrollTo({top: group.element.offsetTop, behavior: animate && !reduced.matches ? "smooth" : "instant"});
    }

    return {groups, show};
}
