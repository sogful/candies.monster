export async function catalogue() {
    const configuration = await fetch(new URL("../../data/levels.json", import.meta.url));
    if (!configuration.ok) throw new Error("Catalogue unavailable");
    const {endpoint} = await configuration.json();
    if (!endpoint) {
        const response = await fetch(new URL("../../data/test.json", import.meta.url));
        if (!response.ok) throw new Error("Levels unavailable");
        return response.json();
    }
    const base = new URL(endpoint);
    const response = await fetch(new URL("/levels", base));
    if (!response.ok) throw new Error("Levels unavailable");
    const data = await response.json();
    if (!Array.isArray(data.levels)) throw new Error("Invalid catalogue");
    return data.levels.flatMap(level => {
        if (!/^\d{17,22}$/.test(level.id) || !Array.isArray(level.files)) return [];
        const file = level.files.find(file => /^\d{17,22}$/.test(file.id) && /\.(xml|json)$/i.test(file.name));
        if (!file) return [];
        return [{
            id: level.id, title: level.title, creator: level.author?.name || level.author?.id || "unknown",
            description: level.description || "", file: new URL(`/levels/${level.id}/files/${file.id}`, base).href,
            filename: file.name, background: "/assets/images/level/box1.webp", features: [],
            rating: null, downloads: null, likes: null, objects: null
        }];
    });
}
