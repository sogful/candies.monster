import {startaudio} from "./roomaudio.js";

export function startroom() {
    const entry = document.querySelector(".roomentry");
    const dialog = document.querySelector(".secretroom");
    const exit = dialog.querySelector(".roomexit");
    const ambience = startaudio();
    let loading;
    let player;

    entry.addEventListener("click", ambience.prepare);
    dialog.addEventListener("cancel", event => {
        event.preventDefault();
        exit.click();
    });

    function show(open) {
        if (dialog.hasAttribute("open") === open) return;
        ambience.show(open);
        if (!open) {
            player?.show(false);
            if (dialog.close) dialog.close();
            else dialog.removeAttribute("open");
            return;
        }
        if (dialog.showModal) dialog.showModal();
        else dialog.setAttribute("open", "");
        if (player) player.show(true);
        else if (!loading) {
            const canvas = dialog.querySelector(".roomtreasure");
            loading = import("./roommodel.js").then(module => module.roommodel(canvas)).then(model => {
                player = model;
                player.show(dialog.hasAttribute("open"));
            }).catch(() => {
                dialog.classList.add("roomfallback");
            });
        }
    }

    return {show, available: visible => {entry.hidden = !visible}};
}
