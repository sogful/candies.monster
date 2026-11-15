const guild = "1112531659078762617";

export function appopen(route) {
    if (!/^(?:channels\/\d{17,22}\/\d{17,22}|invite\/[a-zA-Z0-9_-]{2,40})$/.test(route)) return;
    const website = route.startsWith("invite/") ? "https://discord.gg/" + route.slice(7) : "https://discord.com/" + route;
    const {dialog, actions, close} = popup(document.activeElement, "Open Discord");
    for (const [label, address] of [["Open app", "discord://-/" + route], ["Open in browser", website]]) {
        const link = document.createElement("a");
        link.className = "membershipbutton descbutton clickable";
        link.href = address;
        link.textContent = label;
        if (address === website) {link.target = "_blank"; link.rel = "noopener noreferrer"; link.addEventListener("click", close)}
        actions.append(link);
    }
    dialog.showModal();
}

/*//////////////////////////////////////////////////////////////////////*/

function popup(button, label) {
    const dialog = document.createElement("dialog");
    dialog.className = "discordmembership";
    const question = document.createElement("p");
    question.className = "membershipquestion";
    question.textContent = label;
    const actions = document.createElement("div");
    actions.className = "membershipactions";
    function close() {dialog.close(); dialog.remove(); if (button?.isConnected) button.focus({preventScroll: true})}
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
    return {dialog, actions, close};
}

/*//////////////////////////////////////////////////////////////////////*/

function membership(button, joined) {
    const {dialog, actions, close} = popup(button, "Are you in Cut the Rope Home?");
    for (const [label, action] of [["Yes", joined], ["Join", () => appopen("invite/Rc6tZUqVkV")]]) {
        const control = document.createElement("button");
        control.type = "button";
        control.className = "membershipbutton descbutton clickable";
        control.textContent = label;
        control.addEventListener("click", () => {close(); action()});
        actions.append(control);
    }
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
