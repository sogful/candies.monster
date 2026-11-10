export function spring(channel, target, rate) {
    const distance = channel.value - target;
    const impulse = (channel.velocity + distance * rate) / 60;
    const decay = Math.exp(-rate / 60);
    channel.value = target + (distance + impulse) * decay;
    channel.velocity = (channel.velocity - rate * impulse) * decay;
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
