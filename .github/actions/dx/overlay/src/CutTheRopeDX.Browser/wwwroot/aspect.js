(() => {
    const ratios = {"16:9": [16, 9], "4:3": [4, 3], "9:16": [9, 16], "Dynamic": null};
    let current = "16:9";
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
