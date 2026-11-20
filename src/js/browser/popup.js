export function popup(button, label = "", name = label) {
    const dialog = document.createElement("dialog");
    dialog.className = "discordmembership";
    dialog.setAttribute("aria-label", name);
    const title = document.createElement("p");
    title.className = "membershipquestion";
    title.textContent = label;
    title.hidden = !label;
    const actions = document.createElement("div");
    actions.className = "membershipactions";
    function open() {
        dialog.showModal();
        if (button?.hasAttribute("aria-expanded")) button.setAttribute("aria-expanded", "true");
    }
    function close() {
        dialog.close();
        dialog.remove();
        if (button?.hasAttribute("aria-expanded")) button.setAttribute("aria-expanded", "false");
        if (button?.isConnected) button.focus({preventScroll: true});
    }
    const dismiss = document.createElement("button");
    dismiss.type = "button";
    dismiss.className = "membershipclose popupclose clickable";
    dismiss.setAttribute("aria-label", "Close");
    const cross = document.createElement("img");
    cross.src = "/assets/images/icons/x.svg";
    cross.alt = "";
    dismiss.append(cross);
    dismiss.addEventListener("click", close);
    dialog.append(title, actions, dismiss);
    dialog.addEventListener("cancel", event => {
        event.preventDefault();
        close();
    });
    dialog.addEventListener("click", event => {
        if (event.target !== dialog) return;
        const box = dialog.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dismiss.click();
    });
    document.body.append(dialog);
    return {dialog, actions, open, close};
}
