import {popup} from "../popup.js";

const guild = "1112531659078762617";

export function appopen(route) {
    if (!/^(?:channels\/\d{17,22}\/\d{17,22}|invite\/[a-zA-Z0-9_-]{2,40})$/.test(route)) return;
    const website = route.startsWith("invite/") ? "https://discord.gg/" + route.slice(7) : "https://discord.com/" + route;
    const {actions, open, close} = popup(document.activeElement, "", "Open Discord");
    for (const [label, address] of [["Open app", "discord://-/" + route], ["Open in browser", website]]) {
        const link = document.createElement("a");
        link.className = "membershipbutton descbutton clickable";
        link.href = address;
        link.textContent = label;
        if (address === website) {link.target = "_blank"; link.rel = "noopener noreferrer"; link.addEventListener("click", close)}
        actions.append(link);
    }
    open();
}

/*//////////////////////////////////////////////////////////////////////*/

function membership(button, joined) {
    const {actions, open, close} = popup(button, "Are you in Cut the Rope Home?");
    for (const [label, action] of [["Yes", joined], ["Join", () => appopen("invite/Rc6tZUqVkV")]]) {
        const control = document.createElement("button");
        control.type = "button";
        control.className = "membershipbutton descbutton clickable";
        control.textContent = label;
        control.addEventListener("click", () => {close(); action()});
        actions.append(control);
    }
    open();
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
