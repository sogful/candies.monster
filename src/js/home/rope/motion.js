export function spring(channel, target, rate) {
    const distance = channel.value - target;
    const impulse = (channel.velocity + distance * rate) / 60;
    const decay = Math.exp(-rate / 60);
    channel.value = target + (distance + impulse) * decay;
    channel.velocity = (channel.velocity - rate * impulse) * decay;
}

/*//////////////////////////////////////////////////////////////////////*/

export function attachment(width, height, left, top, angle) {
    const radians = angle * Math.PI / 180;
    const x = width * (1486 / 1700 - 0.5);
    const y = height * (900 / 940 - 0.5);
    return {
        x: left + width / 2 + x * Math.cos(radians) - y * Math.sin(radians),
        y: top + height / 2 + x * Math.sin(radians) + y * Math.cos(radians)
    };
}
