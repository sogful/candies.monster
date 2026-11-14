import {loadingsvg} from "./loading.js";

const style = document.createElement("link");
style.rel = "stylesheet";
style.href = "/assets/static/css/spinner.css";
document.head.append(style);

export function spinner(container, label = "Loading") {
    const element = document.createElement("span");
    element.className = "candyloading";
    element.setAttribute("role", "status");
    element.setAttribute("aria-label", label);
    element.innerHTML = loadingsvg;
    element.querySelector("svg").setAttribute("aria-hidden", "true");
    container.replaceChildren(element);
    return element;
}
