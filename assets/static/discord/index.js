const route = new URLSearchParams(location.search).get("route") || "";
const valid = /^(?:channels\/\d{17,22}\/\d{17,22}|invite\/[a-zA-Z0-9_-]{2,40})$/.test(route);
if (!valid) document.querySelector(".discordlabel").textContent = "Invalid Discord link";
else {
    document.querySelector(".discordlabel").textContent = "Open Discord";
    const website = route.startsWith("invite/") ? "https://discord.gg/" + route.slice(7) : "https://discord.com/" + route;
    for (const [label, address] of [["Open app", "discord://-/" + route], ["Open in browser", website]]) {
        const link = document.createElement("a");
        link.className = "discordweb";
        link.href = address;
        link.textContent = label;
        link.rel = "noopener noreferrer";
        document.querySelector(".discordstatus").append(link);
    }
}
