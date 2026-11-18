import {loadingsvg} from "./loading.js";

const style = document.createElement("link");
style.rel = "stylesheet";
style.href = "/assets/static/css/spinner.css";
document.head.append(style);
const source = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(loadingsvg);

export function spinner(container, label = "Loading") {
    const element = document.createElement("span");
    element.className = "candyloading";
    element.setAttribute("role", "status");
    element.setAttribute("aria-label", label);
    const image = document.createElement("img");
    image.src = source;
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    element.append(image);
    container.replaceChildren(element);
    return element;
}
