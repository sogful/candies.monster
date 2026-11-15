const guild = "1112531659078762617";

export function appopen(route) {
    const link = document.createElement("a");
    link.href = "/assets/static/discord/?route=" + encodeURIComponent(route);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.append(link);
    link.click();
    link.remove();
}

/*//////////////////////////////////////////////////////////////////////*/

function membership(button, joined) {
    const dialog = document.createElement("dialog");
    dialog.className = "discordmembership";
    const question = document.createElement("p");
    question.className = "membershipquestion";
    question.textContent = "Are you in Cut the Rope Home?";
    const actions = document.createElement("div");
    actions.className = "membershipactions";
    function close() {dialog.close(); dialog.remove(); if (button.isConnected) button.focus({preventScroll: true})}
    for (const [label, action] of [["Yes", joined], ["Join", () => appopen("invite/Rc6tZUqVkV")]]) {
        const control = document.createElement("button");
        control.type = "button";
        control.className = "membershipbutton descbutton clickable";
        control.textContent = label;
        control.addEventListener("click", () => {close(); action()});
        actions.append(control);
    }
    const dismiss = document.createElement("button");
    dismiss.type = "button";
    dismiss.className = "membershipclose clickable";
    dismiss.setAttribute("aria-label", "Close");
    const cross = document.createElement("img");
    cross.src = "/assets/images/icons/x.svg";
    cross.alt = "";
    dismiss.append(cross);
    dismiss.addEventListener("click", close);
    dialog.append(question, actions, dismiss);
    dialog.addEventListener("cancel", event => {event.preventDefault(); close()});
    dialog.addEventListener("click", event => {
        if (event.target !== dialog) return;
        const box = dialog.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close();
    });
    document.body.append(dialog);
    dialog.showModal();
}

/*//////////////////////////////////////////////////////////////////////*/

export function discordbutton(entry) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "leveldiscord clickable";
    button.setAttribute("aria-label", "Open level in Discord");
    const icon = document.createElement("img");
    icon.src = "/assets/images/icons/discord.svg";
    icon.alt = "";
    button.append(icon);
    button.addEventListener("click", () => {
        const joined = () => appopen("channels/" + guild + "/" + entry.id);
        if (document.cookie.split(";").some(value => value.trim() === "discordhome=1")) {joined(); return}
        document.cookie = "discordhome=1; Path=/; Max-Age=31536000; SameSite=Lax" + (location.protocol === "https:" ? "; Secure" : "");
        membership(button, joined);
    });
    return button;
}
