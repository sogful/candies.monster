let panel;
let details;
let copied;
let previous;
let audio;

function close() {
    panel.hidden = true;
    audio.pause();
    if (previous?.isConnected) previous.focus({preventScroll: true});
}

/*//////////////////////////////////////////////////////////////////////*/

function create(tag, classname, text) {
    const element = document.createElement(tag);
    element.className = classname;
    if (text) element.textContent = text;
    return element;
}

export function crash(message, level) {
    if (!panel) {
        panel = create("section", "gamefailure");
        panel.setAttribute("role", "alertdialog");
        panel.setAttribute("aria-label", "Game error");
        panel.tabIndex = -1;
        const title = create("h2", "failuretitle", "fatal error");
        details = create("pre", "failuredetails");
        details.tabIndex = 0;
        const actions = create("div", "failureactions");
        copied = create("button", "failurebutton clickable", "Copy error");
        const dismiss = create("button", "failurebutton clickable", "Close");
        copied.type = dismiss.type = "button";
        copied.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(details.textContent);
                copied.textContent = "Copied";
            } catch {
                const range = document.createRange();
                range.selectNodeContents(details);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                copied.textContent = "Select and copy";
            }
        });
        dismiss.addEventListener("click", close);
        const image = create("img", "failureimage");
        image.src = "/preview/assets/svgs/oops.svg";
        image.alt = "";
        image.draggable = false;
        actions.append(copied, dismiss);
        panel.append(title, details, actions, image);
        panel.addEventListener("keydown", event => {
            if (event.key === "Escape") {event.stopPropagation(); close()}
        });
        audio = new Audio("/preview/assets/audio/oops.mp3");
        document.body.append(panel);
    }
    previous = document.activeElement;
    details.textContent = [level, String(message).slice(0, 8000)].filter(Boolean).join("\n\n");
    copied.textContent = "Copy error";
    panel.hidden = false;
    panel.focus({preventScroll: true});
    audio.currentTime = 0;
    void audio.play().catch(() => {});
}
