import {original} from "./source.js";

export function filename(entry) {
    const name = String(entry.title || "level") + " by " + String(entry.creator || "unknown");
    return name.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").slice(0, 180).replace(/[. ]+$/, "") + ".xml";
}

export function downloadlevel(button, entry, status) {
    button.href = entry.file;
    if (!entry.file) button.setAttribute("aria-disabled", "true");
    button.download = filename(entry);
    button.addEventListener("click", async event => {
        event.preventDefault();
        if (!entry.file) return;
        if (button.getAttribute("aria-busy") === "true") return;
        button.setAttribute("aria-busy", "true");
        try {
            const xml = await original(entry.file);
            if (!button.isConnected) return;
            const url = URL.createObjectURL(new Blob([xml], {type: "application/xml;charset=utf-8"}));
            const link = document.createElement("a");
            link.href = url;
            link.download = filename(entry);
            document.body.append(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 30000);
        } catch {status.textContent = "could not download level"}
        finally {button.removeAttribute("aria-busy")}
    });
}
