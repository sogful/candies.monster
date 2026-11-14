export function titlekey(value) {
    return String(value || "").normalize("NFKC").toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

export function basename(value) {
    let name = String(value || "").trim();
    for (let index = 0; index < 3; index++) name = name.replace(/\s*\(pauseless\)\s*$/i, "").replace(/\s+[0-3]\s*stars?\s*$/i, "");
    return name;
}

export function points(rank) {
    return rank > 75 ? 0 : Math.round(Math.max(0, 200 - 24.9975 * Math.pow(rank - 1, 0.4)) * 1000) / 1000;
}

export function attach(entries, data) {
    const lookup = new Map();
    for (const entry of entries) {
        entry.candylist = [];
        const key = titlekey(entry.title);
        if (!lookup.has(key)) lookup.set(key, []);
        lookup.get(key).push(entry);
        const plain = entry.title.replace(/(?:\s*\((?!updated\b|ath\b)[^)]*\))+\s*$/i, "");
        const alias = titlekey(plain);
        if (alias !== key) {
            if (!lookup.has(alias)) lookup.set(alias, []);
            lookup.get(alias).push(entry);
        }
    }
    for (const row of data.levels || []) {
        const key = titlekey(basename(row.title));
        let matches = lookup.get(key) || [];
        if (!matches.length) {
            const truncated = entries.filter(entry => entry.title.length >= 90 && key.startsWith(titlekey(entry.title)));
            if (truncated.length === 1) matches = truncated;
        }
        const tags = [...new Set((row.tags || []).map(tag => tag.toLocaleLowerCase()))];
        for (const entry of matches) entry.candylist.push({...row, tags, points: points(row.rank)});
    }
    return entries;
}

/*//////////////////////////////////////////////////////////////////////*/

export async function candydata(endpoint) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
        const response = await fetch(new URL("/candylist", endpoint), {signal: controller.signal});
        if (!response.ok) throw new Error("Candylist unavailable");
        const data = await response.json();
        if (!Array.isArray(data.levels)) throw new Error("Invalid Candylist data");
        return data;
    } catch {
        const response = await fetch(new URL("../../../../assets/static/data/candylist/levels.json", import.meta.url));
        return response.ok ? response.json() : {levels: []};
    } finally {clearTimeout(timer)}
}
