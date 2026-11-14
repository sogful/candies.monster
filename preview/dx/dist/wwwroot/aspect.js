(() => {
    const ratios = {"16:9": [16, 9], "4:3": [4, 3], "9:16": [9, 16], "Dynamic": null};
    let current = "Dynamic";
    try {
        const saved = localStorage.getItem("ctrdxaspect");
        if (Object.keys(ratios).includes(saved)) current = saved;
    } catch {}

    function set(value) {
        if (!Object.keys(ratios).includes(value)) return;
        current = value;
        const ratio = ratios[value];
        const style = document.documentElement.style;
        style.setProperty("--previewwidth", ratio ? `calc(100vh * ${ratio[0]} / ${ratio[1]})` : "none");
        style.setProperty("--previewheight", ratio ? `calc(100vw * ${ratio[1]} / ${ratio[0]})` : "none");
        try {localStorage.setItem("ctrdxaspect", value)} catch {}
    }

    set(current);
    globalThis.ctrdxaspect = Object.freeze({get: () => current, set});
})();


/*//////////////////////////////////////////////////////////////////////*/

(() => {
    const options = ["High", "Medium", "Low"];
    let current = "Medium";
    try {
        const saved = localStorage.getItem("ctrdxquality");
        if (options.includes(saved)) current = saved;
    } catch {}
    globalThis.ctrdxquality = Object.freeze({
        get: () => current,
        set(value) {
            if (!options.includes(value) || value === current) return false;
            current = value;
            try {localStorage.setItem("ctrdxquality", value)} catch {}
            return true;
        },
        url(url) {
            if (current === "High" || !/\/content\/(?:images|sounds)\//.test(url)) return url;
            return url.replace("/content/", "/content/" + current.toLowerCase() + "/");
        }
    });
})();
