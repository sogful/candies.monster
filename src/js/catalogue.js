import {requiredgame} from "./unsupported.js";

export async function catalogue() {
    const configuration = await fetch(new URL("../data/levels.json", import.meta.url));
    if (!configuration.ok) throw new Error("Catalogue unavailable");
    const {endpoint} = await configuration.json();
    if (!endpoint) {
        const response = await fetch(new URL("../data/test.json", import.meta.url));
        if (!response.ok) throw new Error("Levels unavailable");
        return response.json();
    }
    const base = new URL(endpoint);
    const response = await fetch(new URL("/levels", base));
    if (!response.ok) throw new Error("Levels unavailable");
    const data = await response.json();
    if (!Array.isArray(data.levels)) throw new Error("Invalid catalogue");
    const names = new Map(data.levels.filter(level => level.author?.name).map(level => [level.author.id, level.author.name]));
    return data.levels.flatMap(level => {
        if (!/^\d{17,22}$/.test(level.id) || !Array.isArray(level.files)) return [];
        const file = level.files.find(file => /^\d{17,22}$/.test(file.id) && (level.primaryfile === undefined ? /\.(xml|json)$/i.test(file.name) : file.id === level.primaryfile));
        if (!file && !level.files.some(file => /\.(xml|json)$/i.test(file.name))) return [];
        return [{
            id: level.id, title: level.title, creator: level.author?.name || names.get(level.author?.id) || level.author?.id || "unknown",
            creatorid: level.author?.id || "", duplicateof: level.duplicateof || null,
            notable: Array.isArray(level.features) ? level.features : [], levelerror: level.levelerror || null,
            description: level.description || "", file: file ? new URL(`/levels/${level.id}/files/${file.id}`, base).href : "",
            engine: requiredgame(level),
            filename: file?.name || "", revisions: Array.isArray(level.revisions) ? level.revisions : [], background: "/assets/images/level/box1.webp", features: [],
            detailurl: new URL(`/levels/${level.id}`, base).href,
            playurl: new URL(`/levels/${level.id}/plays`, base).href,
            rating: Number.isSafeInteger(level.rating) && level.rating >= 0 ? level.rating : null,
            tags: Array.isArray(level.tags) ? level.tags : [],
            created: level.created || new Date(Number((BigInt(level.id) >> 22n) + 1420070400000n)).toISOString(),
            reactions: Array.isArray(level.reactions) ? level.reactions : [],
            plays: Number.isSafeInteger(level.plays) && level.plays >= 0 ? level.plays : null,
            downloads: null, likes: null, objects: Number.isSafeInteger(level.objects) ? level.objects : null
        }];
    });
}
