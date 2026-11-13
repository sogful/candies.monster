import {requiredgame} from "./unsupported.js";

export async function refresh(entry) {
    if (!entry.detailurl) return entry;
    const response = await fetch(entry.detailurl, {credentials: "omit"});
    if (!response.ok) throw new Error("Level information unavailable");
    const data = await response.json();
    if (data.id !== entry.id) throw new Error("Invalid level information");
    entry.revisions = Array.isArray(data.revisions) ? data.revisions : entry.revisions;
    if (!entry.revision && data.primaryfile !== undefined) {
        const file = data.files?.find(file => file.id === data.primaryfile);
        const url = file ? new URL("/levels/" + entry.id + "/files/" + file.id, entry.detailurl).href : "";
        if (url !== entry.file) {entry.file = url; entry.filename = file?.name || ""; entry.objects = null; entry.filechanged = true}
    }
    entry.title = typeof data.title === "string" ? data.title : entry.title;
    entry.tags = Array.isArray(data.tags) ? data.tags : entry.tags;
    entry.created = typeof data.created === "string" ? data.created : entry.created;
    entry.rating = Number.isSafeInteger(data.rating) && data.rating >= 0 ? data.rating : entry.rating;
    entry.reactions = Array.isArray(data.reactions) ? data.reactions : entry.reactions;
    entry.plays = Number.isSafeInteger(data.plays) && data.plays >= 0 ? data.plays : entry.plays;
    entry.description = typeof data.description === "string" ? data.description : entry.description;
    const engine = requiredgame(entry);
    if (engine !== entry.engine) {entry.engine = engine; entry.filechanged = true}
    entry.creator = data.author?.name || entry.creator || data.author?.id;
    entry.creatorid = data.author?.id || entry.creatorid;
    return entry;
}

/*//////////////////////////////////////////////////////////////////////*/

export async function played(entry) {
    if (!entry.playurl) return entry;
    const response = await fetch(entry.playurl, {method: "POST", credentials: "omit", keepalive: true});
    if (!response.ok) throw new Error("Play count unavailable");
    const data = await response.json();
    if (Number.isSafeInteger(data.plays) && data.plays >= 0) entry.plays = data.plays;
    return entry;
}
