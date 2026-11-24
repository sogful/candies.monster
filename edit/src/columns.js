export function resizablecolumns(table, initial) {
    const group = document.createElement("colgroup");
    const widths = [...initial];
    const columns = widths.map(() => document.createElement("col"));
    group.append(...columns);
    table.prepend(group);
    const headings = [...table.tHead.rows[0].cells];

    function apply() {
        for (const [index, column] of columns.entries()) column.style.width = widths[index] + "%";
    }

    function resize(index, position, pair, first) {
        const minimum = Math.min(pair / 2, 4500 / table.clientWidth);
        widths[index] = Math.max(minimum, Math.min(pair - minimum, first + position));
        widths[index + 1] = pair - widths[index];
        apply();
    }

    for (const [index, heading] of headings.slice(0, -1).entries()) {
        const handle = document.createElement("button");
        handle.type = "button";
        handle.className = "columnhandle";
        handle.title = "Resize " + heading.textContent + " column";
        heading.append(handle);
        let drag;
        handle.addEventListener("pointerdown", event => {
            if (event.button !== 0) return;
            handle.setPointerCapture(event.pointerId);
            drag = {start: event.clientX, first: widths[index], pair: widths[index] + widths[index + 1]};
        });
        handle.addEventListener("pointermove", event => {
            if (!drag) return;
            resize(index, 100 * (event.clientX - drag.start) / table.clientWidth, drag.pair, drag.first);
        });
        handle.addEventListener("lostpointercapture", () => {drag = undefined});
        handle.addEventListener("keydown", event => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            resize(index, event.key === "ArrowLeft" ? -2 : 2, widths[index] + widths[index + 1], widths[index]);
        });
    }
    apply();
}
