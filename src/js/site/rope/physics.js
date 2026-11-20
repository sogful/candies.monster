export function strand(count = 28) {
    const points = Array.from({length: count}, () => ({x: 50, y: 0, previousx: 50, previousy: 0}));

    function reset(x, y, startx = 50, starty = -8) {
        for (let index = 0; index < count; index++) {
            const point = points[index];
            point.x = point.previousx = startx + (x - startx) * index / (count - 1);
            point.y = point.previousy = starty + (y - starty) * index / (count - 1);
        }
    }

    function step(x, y, startx = 50, starty = -8) {
        const length = Math.hypot(x - startx, y - starty) * 1.035 / (count - 1);
        for (let index = 1; index < count - 1; index++) {
            const point = points[index];
            const nextx = point.x + (point.x - point.previousx) * 0.96;
            const nexty = point.y + (point.y - point.previousy) * 0.96 + 784 * 0.016 * 0.016;
            point.previousx = point.x;
            point.previousy = point.y;
            point.x = nextx;
            point.y = nexty;
        }
        points[0].x = startx;
        points[0].y = starty;
        points[count - 1].x = x;
        points[count - 1].y = y;
        for (let pass = 0; pass < 30; pass++) {
            for (let index = 1; index < count; index++) {
                const first = points[index - 1];
                const second = points[index];
                const dx = second.x - first.x;
                const dy = second.y - first.y;
                const distance = Math.max(0.001, Math.hypot(dx, dy));
                const firstweight = index === 1 ? 0 : 1;
                const secondweight = index === count - 1 ? 0 : 1;
                const correction = (distance - length) / (distance * (firstweight + secondweight));
                first.x += dx * correction * firstweight;
                first.y += dy * correction * firstweight;
                second.x -= dx * correction * secondweight;
                second.y -= dy * correction * secondweight;
            }
        }
    }

    reset(50, 64);
    return {points, reset, step};
}

/*//////////////////////////////////////////////////////////////////////*/

export function paint(context, points) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let index = 1; index < points.length; index++) context.lineTo(points[index].x, points[index].y);
    context.strokeStyle = "#302015";
    context.lineWidth = 5;
    context.stroke();
    context.lineWidth = 3.4;
    for (let index = 1; index < points.length; index++) {
        const start = points[index - 1];
        const end = points[index];
        const brightness = 0.45 + 0.55 * index / (points.length - 1);
        const colors = index % 2 ? [121, 78, 47] : [172, 112, 70];
        context.strokeStyle = "#" + colors.map(value => Math.round(value * brightness).toString(16).padStart(2, "0")).join("");
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.stroke();
    }
}
