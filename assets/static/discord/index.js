import {spinner} from "../spinner.js";

const route = new URLSearchParams(location.search).get("route") || "";
const valid = /^(?:channels\/\d{17,22}\/\d{17,22}|invite\/[a-zA-Z0-9_-]{2,40})$/.test(route);
if (!valid) document.querySelector(".discordlabel").textContent = "Invalid Discord link";
else {
    const loading = document.createElement("div");
    spinner(loading, "Opening Discord");
    document.querySelector(".discordstatus").prepend(loading);
    const website = route.startsWith("invite/") ? "https://discord.gg/" + route.slice(7) : "https://discord.com/" + route;
    let timer;
    let hidden = false;
    function fallback() {clearTimeout(timer); timer = setTimeout(() => location.replace(website), 1800)}
    window.addEventListener("blur", () => clearTimeout(timer));
    window.addEventListener("focus", () => {if (!hidden) fallback()});
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) return;
        hidden = true;
        clearTimeout(timer);
        setTimeout(() => window.close(), 250);
    });
    window.addEventListener("pagehide", () => clearTimeout(timer), {once: true});
    fallback();
    try {location.href = "discord://-/" + route} catch {location.replace(website)}
}
