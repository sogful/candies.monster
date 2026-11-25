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
    if (game.importance <= 0) return 20;
    return Math.max(24, 50 + (game.importance - 3) * 5.7);
}

export function packcircle(games, width, height = Infinity, factor = 1) {
    if (!games.length) return {positions: [], height: 0};
    width = Math.max(1, width);
    height = Math.max(1, height);
    const gap = Math.min(4 * factor, Math.sqrt(width * height / (games.length * 4)));
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

export const orbits = [
    ["zeptoapp", "zeptoapp"], ["androidtv", "android tv"], ["primary", ""],
    ["other", "other"], ["amazon", "amazon"], ["tiertwo", "tiertwo"], ["teraleak", "testflight"]
];
const labelheight = 20;
const labelwidth = 72;

function packlayout(games, groups, width, height) {
    const primary = groups.get("primary");
    if (primary.length === games.length) return packcircle(games, width, height, 1.12);

    const horizontal = width >= height * 1.17;
    const span = horizontal ? width : height;
    const gap = Math.min(14, span * 0.025);
    const clusters = orbits.map(([key, label]) => ({key, items: groups.get(key), factor: label ? 0.72 : 1}))
        .filter(cluster => cluster.items.length);
    const weight = cluster => Math.hypot(...cluster.items.map(({game}) => iconsize(game) * cluster.factor));
    const total = clusters.reduce((sum, cluster) => sum + weight(cluster), 0);
    const reserved = horizontal ? 0 : labelheight * (clusters.length - Number(primary.length > 0));
    const available = Math.max(1, span - (clusters.length - 1) * gap - reserved);
    const positions = new Array(games.length);
    const labels = [];
    let start = 0;

    for (const cluster of clusters) {
        const {key, items, factor} = cluster;
        const satellite = key !== "primary";
        const labelspace = satellite ? labelheight : 0;
        const extent = available * weight(cluster) / total;
        const boxwidth = horizontal ? extent : width;
        const boxheight = horizontal ? height - labelspace : extent;
        const packed = packcircle(items.map(({game}) => game), boxwidth, boxheight, factor);
        const bounds = orbitbounds(packed.positions);
        const iconwidth = bounds.right - bounds.left;
        const clusterwidth = Math.max(iconwidth, satellite ? labelwidth : 0);
        const clusterheight = bounds.bottom - bounds.top + labelspace;
        const left = horizontal ? start : (width - clusterwidth) / 2;
        const top = horizontal ? (height - clusterheight) / 2 : start;
        const shiftleft = left + (clusterwidth - iconwidth) / 2 - bounds.left;
        const shifttop = top + labelspace - bounds.top;
        items.forEach(({index}, position) => {
            const icon = packed.positions[position];
            positions[index] = {left: icon.left + shiftleft, top: icon.top + shifttop, size: icon.size};
        });
        if (satellite) labels.push({key, left: left + (clusterwidth - labelwidth) / 2, top, width: labelwidth, height: labelheight});
        start += (horizontal ? clusterwidth : clusterheight) + gap;
    }

    const layout = orbitbounds([...positions, ...labels]);
    const layoutwidth = layout.right - layout.left;
    const layoutheight = layout.bottom - layout.top;
    const scale = Math.min(1.3, width / layoutwidth, height / layoutheight);
    const left = (width - layoutwidth * scale) / 2 - layout.left * scale;
    const top = (height - layoutheight * scale) / 2 - layout.top * scale;
    return {
        positions: positions.map(icon => ({left: icon.left * scale + left, top: icon.top * scale + top, size: icon.size * scale})),
        labels: labels.map(label => ({key: label.key, left: label.left * scale + left, top: label.top * scale + top, width: label.width * scale, scale})),
        height
    };
}

export function packorbits(games, width, height) {
    const minimum = 18;
    width = Math.max(minimum, width);
    const groups = new Map(orbits.map(([key]) => [key, []]));
    games.forEach((game, index) => (groups.get(game.circle) || groups.get("primary")).push({game, index}));
    const packed = packlayout(games, groups, width, height);
    if (packed.positions.every(position => position.size >= minimum)) return packed;

    const positions = new Array(games.length);
    const labels = [];
    let top = 0;
    for (const [key, label] of orbits) {
        const items = groups.get(key);
        if (!items.length) continue;
        if (top) top += 14;
        if (label) {
            labels.push({key, left: Math.max(0, (width - labelwidth) / 2), top, width: Math.min(width, labelwidth), scale: 1});
            top += labelheight;
        }
        const sizes = items.map(({index}) => Math.min(width, Math.max(minimum, packed.positions[index].size)));
        const gap = 4;
        const area = sizes.reduce((total, size) => total + (size + gap) ** 2, 0);
        const targetheight = Math.max(...sizes, area / (width * 0.75));
        const cluster = packicons(sizes, width, targetheight, gap);
        const bounds = orbitbounds(cluster.positions);
        items.forEach(({index}, offset) => {
            const position = cluster.positions[offset];
            positions[index] = {...position, top: position.top + top - bounds.top};
        });
        top += bounds.bottom - bounds.top;
    }
    const center = Math.max(0, (height - top) / 2);
    for (const item of [...positions, ...labels]) item.top += center;
    return {positions, labels, height: Math.max(height, top)};
}

function orbitbounds(items) {
    return {
        left: Math.min(...items.map(item => item.left)),
        top: Math.min(...items.map(item => item.top)),
        right: Math.max(...items.map(item => item.left + (item.width ?? item.size))),
        bottom: Math.max(...items.map(item => item.top + (item.height ?? item.size)))
    };
}
