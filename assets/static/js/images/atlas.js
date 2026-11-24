export function quadparse(xmltext) {
    const match = xmltext.match(/<\s*quads\s*>\s*([^<]+?)\s*<\/\s*quads\s*>/i);
    if (!match) return [];
    const values = match[1].trim().split(/[\s,]+/).filter(Boolean);
    if (!values.length || values.length % 4 || values.some(value => !/^-?\d+(?:\.\d+)?$/.test(value))) return [];
    const rects = [];
    for (let index = 0; index < values.length; index += 4) {
        const [x, y, w, h] = values.slice(index, index + 4).map(Number);
        rects.push({x, y, w, h, idx: rects.length});
    }
    return rects;
}

export function drawframe(context, image, rect) {
    context.imageSmoothingEnabled = false;
    context.drawImage(image, rect.x, rect.y, rect.w, rect.h, 0, 0, rect.w, rect.h);
}
