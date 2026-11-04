function placeicon(placed, size, width, stretch, gap) {
    const rows = new Set([-size / 2]);
    for (const other of placed) {
        rows.add(other.top - size - gap);
        rows.add(other.top + other.size + gap);
        rows.add(other.top + (other.size - size) / 2);
    }
    let best = null;
    function consider(left, right, top) {
        if (right < left - 0.001) return;
        const x = Math.max(left, Math.min(-size / 2, right));
        const radius = Math.hypot(Math.max(Math.abs(x), Math.abs(x + size)), Math.max(Math.abs(top), Math.abs(top + size)) / stretch);
        const score = radius + Math.hypot(x + size / 2, (top + size / 2) / stretch) * 0.01;
        if (!best || score < best.score) best = {left: x, top, size, score};
    }
    for (const top of rows) {
        const obstacles = placed.filter(other => top < other.top + other.size + gap - 0.001 && top + size + gap > other.top + 0.001);
        obstacles.sort((first, second) => first.left - second.left);
        let left = -width / 2;
        for (const other of obstacles) {
            consider(left, other.left - size - gap, top);
            left = Math.max(left, other.left + other.size + gap);
        }
        consider(left, width / 2 - size, top);
    }
    return best;
}

/*//////////////////////////////////////////////////////////////////////*/

export function packcircle(games, width) {
    if (!games.length) return {positions: [], height: 0};
    width = Math.max(1, width);
    const gap = 6;
    const sizes = games.map(game => Math.max(24, 50 + (game.importance - 3) * 5.7));
    const scale = Math.min(1, width / Math.max(...sizes));
    const area = sizes.reduce((total, size) => total + (size * scale + gap) ** 2, 0);
    const diameter = Math.sqrt(area * 4 / (Math.PI * 0.85));
    const stretch = Math.max(1, (diameter / width) ** 2);
    const positions = [];
    for (const size of sizes) positions.push(placeicon(positions, size * scale, width, stretch, gap));
    const left = Math.min(...positions.map(position => position.left));
    const right = Math.max(...positions.map(position => position.left + position.size));
    const top = Math.min(...positions.map(position => position.top));
    const bottom = Math.max(...positions.map(position => position.top + position.size));
    const offset = (width - right - left) / 2;
    return {
        positions: positions.map(position => ({left: position.left + offset, top: position.top - top, size: position.size})),
        height: Math.ceil(bottom - top)
    };
}
