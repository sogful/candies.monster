import {replacementkey} from "./package.js";
import {previewtexture} from "./sprites.js";

const common = "ar tr pt es nl fr it zh zh-hant de ko ja en ru he".split(" ");
const upper = "ar pt nl it zh de ja en he".split(" ");
const lower = "tr es fr zh-hant ko ru".split(" ");
const cache = new WeakMap();

function strip(languages, x, y, width, height, dx, dy, rotated = false) {
    return languages.map((language, index) => [language, [x + dx * index, y + dy * index, width, height, rotated]]);
}

const layouts = {
    "1638x150": strip(common, 5, 1, 98, 140, 104, 0, true),
    "952x248": [...strip(upper, 1, 1, 97, 139, 102, 0, true), ...strip(lower, 1, 146, 139, 97, 145, 0)],
    "248x944": [...strip(upper, 1, 1, 139, 97, 0, 102), ...strip(lower, 146, 1, 97, 139, 0, 145, true)],
    "288x3128": strip(common, 1, 1, 277, 193, 0, 199),
    "378x206": [
        ...strip(["ru","en"], 1, 97, 76, 53, 0, 55),
        ...strip(["ja","ko","de"], 87, 39, 76, 53, 0, 55),
        ...strip(["zh","it","fr"], 165, 39, 76, 53, 0, 55),
        ...strip(["nl","es","pt"], 243, 39, 76, 53, 0, 55)
    ],
    "1430x246": [
        ...strip(["ru","en","ja"], 176, 62, 151, 108, 172, 0),
        ...strip(["ko","zh","fr","es"], 749, 1, 151, 108, 172, 0),
        ...strip(["de","it","nl","pt"], 749, 124, 151, 108, 172, 0)
    ]
};

function languagecode(locale) {
    const tag = String(locale ?? "").toLowerCase().replaceAll("_", "-");
    if (/^zh-(?:hant|tw|hk|mo)\b/.test(tag)) return "zh-hant";
    const base = tag.split("-")[0];
    return {br: "pt", jp: "ja", kr: "ko", cn: "zh", tw: "zh-hant", iw: "he"}[base] ?? base;
}

function basename(item) {
    return item.path.toLowerCase().split("/").at(-1).replace(/\.(?:raw(?:\.zst)?|png|jpe?g|webp)$/i, "");
}

async function cropflags(item, replacements) {
    const bitmap = await createImageBitmap(await previewtexture(item, replacements));
    try {
        const layout = layouts[bitmap.width + "x" + bitmap.height] ?? [];
        const result = new Map();
        for (const [language, [x, y, width, height, rotated]] of layout) {
            const canvas = new OffscreenCanvas(rotated ? height : width, rotated ? width : height);
            const context = canvas.getContext("2d");
            if (rotated) {
                context.translate(0, width);
                context.rotate(-Math.PI / 2);
            }
            context.drawImage(bitmap, x, y, width, height, 0, 0, width, height);
            result.set(language, await canvas.convertToBlob());
        }
        return result;
    } finally {
        bitmap.close();
    }
}

async function atlasflags(item, replacements) {
    const parts = item.parts.map(part => replacements?.get(replacementkey(part)));
    let record = cache.get(item);
    if (!record || parts.some((part, index) => part !== record.parts[index])) {
        record = {parts, flags: cropflags(item, replacements).catch(() => new Map())};
        cache.set(item, record);
    }
    return record.flags;
}

export async function languageflag(locale, sprites, replacements) {
    const code = languagecode(locale);
    if (!code) return null;
    const direct = sprites.find(item => {
        const match = /^(?:flag|lang|language)[_-]([a-z]{2})(?:[_-]([a-z]{2,4}))?$/.exec(basename(item));
        return match && languagecode(match.slice(1).filter(Boolean).join("-")) === code;
    });
    if (direct) {
        const blob = await previewtexture(direct, replacements).catch(() => null);
        if (blob) return blob;
    }
    const atlases = sprites.filter(item => /^(?:language|menu_settings)(?:[_-]\d+)*$/.test(basename(item)))
        .sort((a, b) => a.size - b.size);
    for (const atlas of atlases) {
        const flag = (await atlasflags(atlas, replacements)).get(code);
        if (flag) return flag;
    }
    return null;
}
