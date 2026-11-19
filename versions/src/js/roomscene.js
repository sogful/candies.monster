function random(seed) {
    return () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed / 4294967296;
    };
}

function quad(buffer, corners, shade) {
    const uv = [[0,1],[1,1],[1,0],[0,0]];
    for (const index of [0,1,2,0,2,3]) buffer.push(...corners[index], ...uv[index], shade);
}

function surface(origin, across, up, inward, shade, count) {
    const width = Math.hypot(...across);
    const height = Math.hypot(...up);
    const point = (x, y, inset = 0) => origin.map((value, index) => value + across[index] * x + up[index] * y + inward[index] * inset);
    return {width, height, shade, count, point};
}

/*//////////////////////////////////////////////////////////////////////*/

export function roomgeometry(horizontal, vertical, ratio, seed) {
    const rear = -4.7;
    const front = -1.45;
    const depth = 2.7 - rear;
    const halfwidth = depth * 0.63 / horizontal;
    const halfheight = depth * 0.63 / vertical;
    const across = [2 * halfwidth, 0, 0];
    const up = [0, 2 * halfheight, 0];
    const along = [0, 0, front - rear];
    const back = [0, 0, rear - front];
    const walls = [];
    const posters = [];
    const roll = random(seed);
    const faces = [
        surface([-halfwidth,-halfheight,rear], across, up, [0,0,1], 1, 14),
        surface([-halfwidth,-halfheight,front], back, up, [1,0,0], 0.94, 7),
        surface([halfwidth,-halfheight,rear], along, up, [-1,0,0], 0.96, 7),
        surface([-halfwidth,-halfheight,front], across, back, [0,1,0], 0.92, 6),
        surface([-halfwidth,halfheight,rear], across, along, [0,-1,0], 0.97, 6)
    ];
    for (const {width, height, shade, count, point} of faces) {
        quad(walls, [point(0,0),point(1,0),point(1,1),point(0,1)], shade);
        const placed = [];
        for (let index = 0; index < count; index++) {
            const breadth = Math.min(width, height * 1.35) * (0.16 + roll() * 0.22);
            const tall = breadth / ratio;
            const angle = (roll() - 0.5) * 2.9;
            const cosine = Math.cos(angle);
            const sine = Math.sin(angle);
            const marginx = (breadth * Math.abs(cosine) + tall * Math.abs(sine)) / (2 * width) + 0.018;
            const marginy = (breadth * Math.abs(sine) + tall * Math.abs(cosine)) / (2 * height) + 0.018;
            let x, y;
            for (let tryindex = 0; tryindex < 18; tryindex++) {
                x = marginx + roll() * (1 - 2 * marginx);
                y = marginy + roll() * (1 - 2 * marginy);
                if (placed.every(([px, py]) => Math.hypot(x - px, y - py) > 0.16)) break;
            }
            placed.push([x, y]);
            const corners = [[-1,-1],[1,-1],[1,1],[-1,1]].map(([u, v]) => {
                const right = (u * breadth * cosine - v * tall * sine) / (2 * width);
                const top = (u * breadth * sine + v * tall * cosine) / (2 * height);
                return point(x + right, y + top, 0.008 + index * 0.0003);
            });
            quad(posters, corners, shade);
        }
    }
    return {walls: new Float32Array(walls), posters: new Float32Array(posters)};
}

export function shinegeometry() {
    const vertices = [];
    quad(vertices, [[-1,-1,0],[1,-1,0],[1,1,0],[-1,1,0]], 1);
    return new Float32Array(vertices);
}
