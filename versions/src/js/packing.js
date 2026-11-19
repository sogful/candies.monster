function placeicon(placed, ordered, size, width, stretch, gap) {
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
        let left = -width / 2;
        for (const other of ordered) {
            if (top >= other.top + other.size + gap - 0.001 || top + size + gap <= other.top + 0.001) continue;
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
    const ordered = [];
    for (const size of sizes) {
        const position = placeicon(positions, ordered, size, width, stretch, gap);
        positions.push(position);
        let index = ordered.findIndex(other => other.left > position.left);
        if (index < 0) index = ordered.length;
        ordered.splice(index, 0, position);
    }
    const top = Math.min(...positions.map(position => position.top));
    const bottom = Math.max(...positions.map(position => position.top + position.size));
    const extent = Math.max(-top, bottom);
    return {
        positions: positions.map(position => ({left: position.left + width / 2, top: position.top + extent, size: position.size})),
        height: extent * 2
    };
}

/*//////////////////////////////////////////////////////////////////////*/

function iconsize(game) {
    return Math.max(24, 50 + (game.importance - 3) * 5.7);
}

export function packcircle(games, width, height = Infinity, factor = 1) {
    if (!games.length) return {positions: [], height: 0};
    width = Math.max(1, width);
    height = Math.max(1, height);
    const gap = Math.min(6 * factor, Math.sqrt(width * height / (games.length * 4)));
    const sizes = games.map(game => iconsize(game) * factor);
    const area = sizes.reduce((total, size) => total + (size + gap) ** 2, 0);
    const scale = Math.min(1, width / Math.max(...sizes), Math.sqrt(width * height * Math.PI * 0.85 / (4 * area)));
    const packed = packicons(sizes.map(size => size * scale), width, height, gap);
    if (packed.height <= height) return packed;
    const fit = height / packed.height;
    return {
        positions: packed.positions.map(position => ({left: (position.left - width / 2) * fit + width / 2, top: position.top * fit, size: position.size * fit})),
        height
    };
}

/*//////////////////////////////////////////////////////////////////////*/

export function packorbits(games, width, height) {
    const groups = {primary: [], zeptoapp: [], teraleak: []};
    games.forEach((game, index) => groups[game.circle || "primary"].push({game, index}));
    const {primary, zeptoapp, teraleak} = groups;
    if (!zeptoapp.length && !teraleak.length) return packcircle(games, width, height);
    if (!primary.length && (!zeptoapp.length || !teraleak.length)) return packcircle(games, width, height, 0.72);

    const horizontal = width >= height * 1.17;
    const span = horizontal ? width : height;
    const gap = Math.min(26, span * 0.045);
    const weight = items => Math.hypot(...items.map(({game}) => iconsize(game)));
    const main = weight(primary);
    const largest = Math.max(weight(zeptoapp), weight(teraleak)) * 0.72;
    const share = Math.max(0.28, Math.min(0.72, main / (main + 2 * largest)));
    const middle = (span - 2 * gap) * share;
    const side = (span - middle - 2 * gap) / 2;
    const positions = new Array(games.length);

    function place(items, start, extent, alignment, factor) {
        if (!items.length) return;
        const boxwidth = horizontal ? extent : width * (alignment ? 0.86 : 1);
        const boxheight = horizontal ? height * (alignment ? 0.86 : 1) : extent;
        const packed = packcircle(items.map(({game}) => game), boxwidth, boxheight, factor);
        const left = horizontal ? start : (width - boxwidth) * (1 + alignment) / 2;
        const top = horizontal
            ? (height - packed.height) / 2 + alignment * (height - boxheight) / 2
            : start + (boxheight - packed.height) / 2;
        items.forEach(({index}, position) => {
            const icon = packed.positions[position];
            positions[index] = {left: icon.left + left, top: icon.top + top, size: icon.size};
        });
    }

    place(primary, side + gap, middle, 0, 1);
    place(zeptoapp, 0, side, -1, 0.72);
    place(teraleak, span - side, side, 1, 0.72);
    return {positions, height};
}
