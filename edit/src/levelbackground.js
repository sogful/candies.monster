import {background} from "/src/js/browser/renderer/data.js";
import {levelgame, staticboxcover} from "./levelpicker.js";

const tilewidth = 320;
const tileheight = 480;

function basename(path) {
    return path.split("/").at(-1).toLowerCase();
}

function firstframe(image, path, game) {
    const {width, height} = image;
    const resolution = /_(\d+)_(\d+)\.(?:jpe?g|raw)(?:\.zst)?$/.exec(basename(path));
    if (resolution && (game !== "timetravel" || resolution[1] === "320")) {
        const [w, h] = resolution.slice(1).map(Number);
        if (w <= width && h <= height) return {x: 0, y: 0, w, h};
    }
    if (game === "original" && /\/640x960\/game\//i.test(path) && width >= 770 && height >= 1026) {
        return {x: 1, y: 1, w: 768, h: 1024};
    }
    if (width / height >= 0.58 && width / height <= 0.83) return {x: 0, y: 0, w: width, h: height};
    return null;
}

/*//////////////////////////////////////////////////////////////////////*/

function tiles(image, base, frames, map) {
    const xscale = tilewidth / base.w;
    const yscale = tileheight / base.h;
    const left = Math.min(0, (map.width - tilewidth) / 2);
    const columns = Math.ceil((map.width - left) / tilewidth);
    const rows = Math.ceil(map.height / tileheight);
    const continuations = frames.slice(1).map(frame => {
        const x = (frame.xoffset ?? 0) - (base.xoffset ?? 0);
        const y = (frame.yoffset ?? 0) - (base.yoffset ?? 0);
        return {frame, x, y, across: x > 0 && x + frame.w > base.w, down: y > 0 && y + frame.h > base.h};
    }).filter(({across, down}) => across || down);

    function paint(context, view) {
        const firstcolumn = Math.floor((view.x - left) / tilewidth);
        const firstrow = Math.floor(view.y / tileheight);
        for (let y = firstrow * tileheight; y < view.y + view.height; y += tileheight) {
            for (let x = left + firstcolumn * tilewidth; x < view.x + view.width; x += tilewidth) {
                context.drawImage(image, base.x, base.y, base.w, base.h, x, y, tilewidth, tileheight);
            }
        }
        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                for (const {frame, x, y, across, down} of continuations) {
                    if (across && column === columns - 1 || down && row === rows - 1) continue;
                    context.drawImage(image, frame.x, frame.y, frame.w, frame.h,
                        left + column * tilewidth + x * xscale, row * tileheight + y * yscale, frame.w * xscale, frame.h * yscale);
                }
            }
        }
    }
    return {paint, close: () => image.close()};
}

export async function levelbackground(map, box, packageid, boxart) {
    const game = levelgame(packageid);
    try {
        const media = await boxart?.(box, false, map.settings?.background);
        if (media) {
            const {blob, frames, path} = media;
            const image = await createImageBitmap(blob);
            try {
                const base = frames[0] ?? firstframe(image, path, game);
                if (base) return tiles(image, base, frames, map);
            } catch (error) {
                image.close();
                throw error;
            }
            image.close();
        }
    } catch {}
    if (game === "original") {
        return background(`/assets/images/level/box${box}.webp`, map)
            .catch(() => background("/assets/images/level/box1.webp", map).catch(() => null));
    }
    const fallback = staticboxcover(packageid, box);
    return fallback ? background(fallback, map).catch(() => null) : null;
}
