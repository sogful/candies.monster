import {spinner} from "/assets/static/spinner.js";

export function loading() {
    const sidebar = document.querySelector(".sidebar");
    let overlays = [];
    let button = null;
    let highest = 0;
    let presses = 0;
    let notice = "";
    let controls = [];

    function create(parent, classname) {
        const node = document.createElement("span");
        node.className = classname;
        const candy = document.createElement("span");
        candy.className = "loadcandy";
        spinner(candy);
        const percent = document.createElement("span");
        percent.className = "loadpercent";
        const info = document.createElement("span");
        info.className = "loadinfo";
        node.append(candy, percent, info);
        parent.append(node);
        return {node, percent, info};
    }

    function update(value, information) {
        highest = Math.max(highest, Math.min(100, Math.round(value)));
        for (const overlay of overlays) {
            overlay.percent.textContent = highest + "%";
            overlay.info.textContent = notice || information;
        }
    }

    function stop() {
        button?.removeAttribute("aria-busy");
        button?.classList.remove("playpending");
        sidebar.inert = false;
        for (const [control, inert] of controls) control.inert = inert;
        controls = [];
        presses = 0;
        notice = "";
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
        controls = [...document.querySelectorAll(".site button,.site a,.site [role=button],.sidebartoggle")].filter(control => control !== button && !control.closest(".sidebar")).map(control => [control, control.inert]);
        for (const [control] of controls) control.inert = true;
        overlays = [create(button, "playloading")];
        overlays[0].node.setAttribute("role", "status");
        update(0, "level");
    }

    function press() {
        presses++;
        notice = presses >= 30 ? "[SECRET MODE ENABLED, LOADING 100X FASTER]"
            : presses >= 20 ? "please?"
            : presses >= 10 ? "please!"
            : presses >= 5 ? "loading, please be patient!" : "";
        if (notice) for (const overlay of overlays) overlay.info.textContent = notice;
    }

    for (const name of ["click", "auxclick"]) document.addEventListener(name, event => {
        if (!button || button.contains(event.target)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
    }, true);

    return {start, update, stop, press};
}
