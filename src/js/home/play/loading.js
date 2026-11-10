export function loading() {
    const sidebar = document.querySelector(".sidebar");
    let overlays = [];
    let button = null;
    let highest = 0;

    function create(parent, classname) {
        const node = document.createElement("span");
        node.className = classname;
        const percent = document.createElement("span");
        percent.className = "loadpercent";
        const info = document.createElement("span");
        info.className = "loadinfo";
        node.append(percent, info);
        parent.append(node);
        return {node, percent, info};
    }

    function update(value, information) {
        highest = Math.max(highest, Math.min(100, Math.round(value)));
        for (const overlay of overlays) {
            overlay.percent.textContent = highest + "%";
            overlay.info.textContent = information;
        }
    }

    function stop() {
        button?.removeAttribute("aria-busy");
        button?.classList.remove("playpending");
        sidebar.inert = false;
        overlays.forEach(overlay => overlay.node.remove());
        overlays = [];
        button = null;
        highest = 0;
    }

    function start(control) {
        stop();
        button = control;
        button.setAttribute("aria-busy", "true");
        button.classList.add("playpending");
        sidebar.inert = true;
        overlays = [create(button, "playloading"), create(sidebar, "sidebarloading")];
        overlays[0].node.setAttribute("role", "status");
        overlays[1].node.setAttribute("aria-hidden", "true");
        update(0, "loading level");
    }

    return {start, update, stop};
}
