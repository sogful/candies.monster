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

function packicons(sizes, width, height, gap) {
    const area = sizes.reduce((total, size) => total + (size + gap) ** 2, 0);
    const diameter = Math.sqrt(area * 4 / (Math.PI * 0.85));
    const ellipsewidth = Math.min(width, diameter);
    const ellipseheight = Math.min(height, diameter ** 2 / ellipsewidth);
    const stretch = ellipseheight / ellipsewidth;
    const positions = [];
    for (const size of sizes) positions.push(placeicon(positions, size, width, stretch, gap));
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

/*//////////////////////////////////////////////////////////////////////*/

export function packcircle(games, width, height = Infinity) {
    if (!games.length) return {positions: [], height: 0};
    width = Math.max(1, width);
    height = Math.max(1, height);
    const gap = Math.min(6, Math.sqrt(width * height / (games.length * 4)));
    const sizes = games.map(game => Math.max(24, 50 + (game.importance - 3) * 5.7));
    const area = sizes.reduce((total, size) => total + (size + gap) ** 2, 0);
    let scale = Math.min(1, width / Math.max(...sizes), Math.sqrt(width * height * Math.PI * 0.85 / (4 * area)));
    let packed;
    for (let attempt = 0; attempt < 12; attempt++) {
        packed = packicons(sizes.map(size => size * scale), width, height, gap);
        if (packed.height <= height) break;
        scale *= Math.min(0.94, Math.sqrt(height / packed.height) * 0.97);
    }
    return packed;
}
