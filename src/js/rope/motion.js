export function dangle(horizontal, vertical, mount, length, speed) {
    const step = 1 / 240;
    for (let index = 0; index < 4; index++) {
        const dx = horizontal.value;
        const dy = vertical.value + 60 - mount.y;
        const distance = Math.max(0.001, Math.hypot(dx, dy));
        const extension = Math.max(0, distance - length);
        const radial = (horizontal.velocity * dx + (vertical.velocity - speed) * dy) / distance;
        const tension = extension ? Math.max(0, extension * 180 + radial * 14) : 0;
        horizontal.velocity += -dx / distance * tension * step;
        vertical.velocity += (900 - dy / distance * tension) * step;
        const decay = Math.exp(-1.6 * step);
        horizontal.velocity *= decay;
        vertical.velocity *= decay;
        horizontal.value += horizontal.velocity * step;
        vertical.value += vertical.velocity * step;
    }
}

/*//////////////////////////////////////////////////////////////////////*/

export function resist(x, y) {
    const distance = Math.hypot(x, y);
    if (distance <= 40) return {x, y};
    const length = 40 + 100 * (1 - Math.exp(-(distance - 40) / 100));
    const scale = length / distance;
    return {x: x * scale, y: y * scale};
}

/*//////////////////////////////////////////////////////////////////////*/

export function transition(from, to, opening) {
    return {from, to, opening, elapsed: 0, finished: false};
}

/*//////////////////////////////////////////////////////////////////////*/

export function advance(timeline) {
    timeline.elapsed += 1 / 60;
    const progress = Math.max(0, Math.min(1, (timeline.elapsed - (timeline.opening ? 0.1 : 0)) / 0.3));
    const eased = timeline.opening ? 1 - (1 - progress) ** 2 : progress ** 2;
    timeline.finished = progress >= 1;
    return timeline.from + (timeline.to - timeline.from) * eased;
}
