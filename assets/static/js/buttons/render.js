const images = new Map();

export async function render(width, height, color = "red") {
    if (!["red", "gold", "green", "purple"].includes(color)) color = "red";
    if (!images.has(color)) {
        const image = new Image();
        image.src = "/assets/images/buttons/" + color + ".webp";
        images.set(color, image.decode().then(() => image).catch(error => {images.delete(color); throw error}));
    }
    const source = await images.get(color);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.min(4096, Math.round(width)));
    canvas.height = Math.max(1, Math.min(4096, Math.round(height)));
    const scale = Math.min(canvas.height / 138, canvas.width / 328);
    const horizontal = Math.min(105 * scale, canvas.width / 2);
    const vertical = Math.min(48 * scale, canvas.height / 2);
    const sx = [0, 105, 223, 328];
    const sy = [0, 48, 90, 138];
    const dx = [0, horizontal, canvas.width - horizontal, canvas.width];
    const dy = [0, vertical, canvas.height - vertical, canvas.height];
    const context = canvas.getContext("2d");
    for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) {
        if (dx[x + 1] <= dx[x] || dy[y + 1] <= dy[y]) continue;
        context.drawImage(source, sx[x], sy[y], sx[x + 1] - sx[x], sy[y + 1] - sy[y], dx[x], dy[y], dx[x + 1] - dx[x], dy[y + 1] - dy[y]);
    }
    return canvas;
}
