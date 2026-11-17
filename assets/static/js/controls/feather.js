export function feather(element) {
    element.classList.add("textfeather");
    let pending = false;
    let attached = false;
    let resize = null;
    let mutation = null;
    function update() {
        pending = false;
        if (element.isConnected) attached = true;
        else if (attached) {resize?.disconnect(); mutation?.disconnect(); return}
        element.classList.toggle("fadeabove", element.scrollTop > 1);
        element.classList.toggle("fadebelow", element.scrollHeight - element.clientHeight - element.scrollTop > 1);
    }
    function schedule() {
        if (!pending) {pending = true; Promise.resolve().then(update)}
    }
    element.addEventListener("scroll", update, {passive: true});
    element.addEventListener("load", schedule, true);
    if (window.ResizeObserver) {
        resize = new ResizeObserver(schedule);
        resize.observe(element);
    }
    mutation = new MutationObserver(schedule);
    mutation.observe(element, {subtree: true, childList: true, characterData: true});
    update();
}
