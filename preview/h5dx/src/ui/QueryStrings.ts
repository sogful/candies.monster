// putting all query strings in a central location so that we can easily add/remove for ship

// parse the query strings into a dictionary
const getQueryStrings = () => {
    const assoc: Record<string, string> = {};
    const queryString = location.search.substring(1) || "";
    const keyValues = queryString.split("&");
    const decode = (s: string) => decodeURIComponent(s.replace(/\+/g, " "));

    for (let i = 0, len = keyValues.length; i < len; i++) {
        const kv = keyValues[i]?.split("=");
        if (!kv || !kv[0]) {
            continue;
        }

        const key = decode(kv[0]);
        const value = kv.length > 1 ? decode(kv.slice(1).join("=")) : "";
        assoc[key] = value;
    }
    return assoc;
};

const qs = getQueryStrings();

class QueryStrings {
    /**
     * Parsed query string parameters.
     */
    static #params: Record<string, string> = qs;

    /**
     * Perform a case-insensitive substring check against the current URL.
     * @param {string} val
     */
    static #urlContains(val: string) {
        return window.location.href.toLowerCase().includes(val.toLowerCase());
    }

    static #getInt(key: string): number | null {
        const raw = QueryStrings.#params[key];
        return raw == null || raw === "" ? null : parseInt(raw, 10);
    }


    static #getFlag(flagName: string): boolean {
        const raw = QueryStrings.#params[flagName];

        if (raw != null) {
            const value = raw.toLowerCase();
            return value === "true" || value === "1" || value === "";
        }

        const href = window.location.href.toLowerCase();
        const key = flagName.toLowerCase();

        if (href.includes(`${key}=true`)) {
            return true;
        }
        const candidates = [`?${key}`, `&${key}`];

        return candidates.some((pattern) => {
            const idx = href.indexOf(pattern);
            if (idx === -1) {
                return false;
            }

            const nextChar = href[idx + pattern.length] ?? "";
            return nextChar === "" || nextChar === "&" || nextChar === "#";
        });
    }

    static lang: string | undefined = QueryStrings.#params["lang"];

    static showBoxBackgrounds: boolean = QueryStrings.#getFlag("boxBackgrounds");

    static disableMusic: boolean = QueryStrings.#getFlag("nomusic");

    static showFrameRate = Boolean(
        import.meta.env.DEV || QueryStrings.#getFlag("showFrameRate")
    );

    static forceHtml5Audio: boolean = QueryStrings.#getFlag("html5audio");

    /**
     * Unlock all boxes (dev-only; returns undefined unless explicitly requested).
     */
    static unlockAllBoxes: true | undefined =
        import.meta.env.DEV || (QueryStrings.#getFlag("unlockAllBoxes") ? true : undefined);

    /**
     * Force the pinned box UI to display.
     */
    static forcePinnedBox = Boolean(
        QueryStrings.unlockAllBoxes || QueryStrings.#getFlag("enablePinnedBox")
    );

    static createScoresForBox: number | undefined =
        QueryStrings.#getInt("createScoresForBox") ?? undefined;

    static minFps: number | null = QueryStrings.#getInt("minFps");

    static box: number | null = QueryStrings.#getInt("box");

    static level: number | null = QueryStrings.#getInt("level");

    static candy: number | null = QueryStrings.#getInt("candy");

    static background: number | null = QueryStrings.#getInt("background");
}

export default QueryStrings;
