const filters = ["search", "sort", "tags", "creator", "features", "author", "candy", "candylist", "contests", "page"];
let saved = null;

export function levelroute(open) {
    const url = new URL(location.href);
    if (open) {
        if (saved === null) {
            saved = history.state?.browserquery ?? location.search;
            const query = new URLSearchParams(saved);
            query.delete("revision");
            saved = query.toString();
        }
        for (const key of filters) url.searchParams.delete(key);
        history.replaceState({...history.state, browserquery: saved}, "", url);
    } else if (saved !== null) {
        const query = new URLSearchParams(saved);
        if (!filters.some(key => url.searchParams.has(key))) {
            for (const [key, value] of query) url.searchParams.set(key, value);
        }
        url.searchParams.delete("revision");
        history.replaceState(null, "", url);
        saved = null;
        queueMicrotask(() => document.dispatchEvent(new Event("levelbrowserrestore")));
    }
}
