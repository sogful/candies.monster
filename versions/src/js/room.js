export function startroom() {
    const entry = document.querySelector(".roomentry");
    const dialog = document.querySelector(".secretroom");
    const exit = dialog.querySelector(".roomexit");
    let loading;
    let player;

    dialog.addEventListener("cancel", event => {
        event.preventDefault();
        exit.click();
    });

    function show(open) {
        if (dialog.hasAttribute("open") === open) return;
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
