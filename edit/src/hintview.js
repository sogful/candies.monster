const fadetime = 320;
const linewidth = 5;
const tapdistance = 6;

function fade(age) {
    const progress = Math.min(1, Math.max(0, age / fadetime));
    return 1 - (progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2);
}

function paths(replay) {
    const strokes = [];
    const touches = new Map();
    for (const event of replay.events) {
        for (const {phase, pointer, x, y} of event.touches ?? [event]) {
            let stroke = touches.get(pointer);
            if (phase === "down" || !stroke) {
                stroke = [];
                touches.set(pointer, stroke);
                strokes.push(stroke);
            }
            stroke.push({x, y, time: event.time * 1000});
            if (phase === "up") touches.delete(pointer);
        }
    }
    return strokes;
}

function moments(replay) {
    const pieces = [];
    for (const stroke of paths(replay)) {
        const origin = stroke[0];
        if (stroke.every(point => Math.hypot(point.x - origin.x, point.y - origin.y) <= tapdistance)) {
            pieces.push({from: origin, start: origin.time, end: origin.time});
            continue;
        }
        for (let index = 1; index < stroke.length; index++) {
            const from = stroke[index - 1];
            const to = stroke[index];
            if (from.x === to.x && from.y === to.y) continue;
            const end = Math.max(from.time, to.time);
            pieces.push({from, to, start: Math.max(from.time, end - fadetime), end});
        }
    }
    return pieces.sort((a, b) => a.start - b.start);
}

/*//////////////////////////////////////////////////////////////////////*/

function ring(context, {from, start}, time) {
    const age = time - start;
    const progress = Math.min(1, age / fadetime);
    context.globalAlpha = fade(age);
    context.lineWidth = linewidth * (1 - progress / 2);
    context.beginPath();
    context.arc(from.x, from.y, 4 + 17 * (1 - (1 - progress) ** 2), 0, 2 * Math.PI);
    context.stroke();
}

function slash(context, {from, to, start, end}, time) {
    const duration = end - start;
    const front = duration ? Math.min(1, (time - start) / duration) : 1;
    const back = duration ? Math.max(0, (time - start - fadetime) / duration) : 0;
    if (front <= back) return;
    const step = (front - back) / 4;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    for (let index = 0; index < 4; index++) {
        const first = back + index * step;
        const last = first + step;
        const opacity = fade(time - start - duration * (first + last) / 2);
        context.globalAlpha = opacity;
        context.lineWidth = linewidth * Math.max(0.001, opacity);
        context.beginPath();
        context.moveTo(from.x + dx * first, from.y + dy * first);
        context.lineTo(from.x + dx * last, from.y + dy * last);
        context.stroke();
    }
}

/*//////////////////////////////////////////////////////////////////////*/

export function hintview(root, stage, canvas, map, recordings) {
    const replays = recordings.filter(replay => replay.events.length);
    if (!replays.length) return;
    const overlay = document.createElement("canvas");
    overlay.className = "hintoverlay";
    overlay.width = canvas.width;
    overlay.height = canvas.height;
    overlay.hidden = true;
    overlay.setAttribute("aria-hidden", "true");
    const context = overlay.getContext("2d");
    context.setTransform(overlay.width / map.width, 0, 0, overlay.height / map.height, 0, 0);
    context.strokeStyle = "#fff";
    context.lineCap = "round";
    context.lineJoin = "round";
    stage.append(overlay);

    const bar = document.createElement("div");
    bar.className = "pkglevelhints";
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "buttonart hinttoggle";
    toggle.textContent = "View hint";
    const selector = document.createElement("select");
    selector.className = "hintselect";
    selector.title = "Hint recording";
    selector.hidden = replays.length < 2;
    for (const [index, replay] of replays.entries()) {
        selector.add(new Option(replay.label ?? "Hint " + (index + 1), String(index)));
    }
    bar.append(toggle, selector);
    root.append(bar);

    let frame = 0;

    function stop() {
        cancelAnimationFrame(frame);
        frame = 0;
        overlay.hidden = true;
        toggle.textContent = "View hint";
    }

    function play() {
        const pieces = moments(replays[Number(selector.value)]);
        let cursor = 0;
        let active = [];
        const started = performance.now();
        overlay.hidden = false;
        toggle.textContent = "Stop hint";

        function paint(now) {
            const time = Math.max(0, now - started);
            context.clearRect(0, 0, map.width, map.height);
            active = active.filter(piece => time - piece.end < fadetime);
            while (cursor < pieces.length && pieces[cursor].start <= time) {
                const piece = pieces[cursor++];
                if (time - piece.end < fadetime) active.push(piece);
            }
            for (const piece of active) {
                if (piece.to) slash(context, piece, time);
                else ring(context, piece, time);
            }
            if (active.length || cursor < pieces.length) frame = requestAnimationFrame(paint);
            else stop();
        }
        frame = requestAnimationFrame(paint);
    }

    toggle.addEventListener("click", () => {
        if (frame) stop();
        else play();
    });
    selector.addEventListener("change", () => {
        if (!frame) return;
        stop();
        play();
    });
    return stop;
}
