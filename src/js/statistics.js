export async function refresh(entry) {
    if (!entry.detailurl) return entry;
    const response = await fetch(entry.detailurl, {credentials: "omit"});
    if (!response.ok) throw new Error("Level information unavailable");
    const data = await response.json();
    if (data.id !== entry.id) throw new Error("Invalid level information");
    entry.rating = Number.isSafeInteger(data.rating) && data.rating >= 0 ? data.rating : entry.rating;
    entry.reactions = Array.isArray(data.reactions) ? data.reactions : entry.reactions;
    entry.plays = Number.isSafeInteger(data.plays) && data.plays >= 0 ? data.plays : entry.plays;
    entry.description = typeof data.description === "string" ? data.description : entry.description;
    entry.creator = data.author?.name || data.author?.id || entry.creator;
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
