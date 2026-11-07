(function () {
    const root = document.documentElement;
    const chromium = /(?:Chrome|Chromium|Edg|OPR)\//.test(navigator.userAgent);
    const safari = navigator.userAgent.match(/Version\/(\d+)\.(\d+).*Safari\//);
    const legacy = !window.CSS || !CSS.supports("paint-order", "stroke fill") ||
        chromium && !CSS.supports("field-sizing", "content") ||
        !chromium && safari && (Number(safari[1]) < 17 || Number(safari[1]) === 17 && Number(safari[2]) < 4);
    const sheets = new WeakMap();
    const links = new WeakSet();
    let pending = false;

    /*//////////////////////////////////////////////////////////////////////*/

    function shadows(width, color) {
        const result = [];
        for (const [radius, count] of [[width / 4, 8], [width / 2, 16]]) {
            for (let index = 0; index < count; index++) {
                const angle = index * Math.PI * 2 / count;
                const left = (Math.cos(angle) * radius).toFixed(4);
                const top = (Math.sin(angle) * radius).toFixed(4);
                const horizontal = (Math.cos(angle) * 0.25).toFixed(4);
                const vertical = (Math.sin(angle) * 0.25).toFixed(4);
                result.push(`calc(${left}em - ${horizontal}px) calc(${top}em - ${vertical}px) 0 ${color}`);
            }
        }
        return result;
    }

    function outline(rule) {
        const style = rule.style;
        const stroke = style.getPropertyValue("-webkit-text-stroke-width");
        const width = parseFloat(stroke);
        if (!width || !stroke.endsWith("em")) return "";
        const color = style.getPropertyValue("-webkit-text-stroke-color") || "#000";
        const parts = shadows(width, color);
        const drop = style.textShadow;
        if (drop && drop !== "none") parts.push(drop);
        return `${rule.selectorText} {\n` +
            `    paint-order: normal !important; -webkit-text-stroke: 0 !important;\n` +
            `    text-shadow: ${parts.join(",")} !important;\n}`;
    }

    function rules(list) {
        const result = [];
        for (const rule of list) {
            if (rule.cssRules && rule.cssRules.length) {
                const content = rules(rule.cssRules);
                if (content) result.push(`${rule.cssText.slice(0, rule.cssText.indexOf("{"))}{${content}}`);
            } else if (rule.selectorText && rule.style) {
                const content = outline(rule);
                if (content) result.push(content);
            }
        }
        return result.join("\n");
    }

    function refresh() {
        pending = false;
        for (const sheet of document.styleSheets) {
            if (sheet.ownerNode && sheet.ownerNode.classList.contains("fontcompat")) continue;
            let content;
            try {content = rules(sheet.cssRules)} catch {continue}
            const previous = sheets.get(sheet);
            if (previous && previous.content === content) continue;
            if (!content && !previous) continue;
            const node = previous ? previous.node : document.createElement("style");
            node.className = "fontcompat";
            node.media = sheet.media.mediaText;
            node.disabled = sheet.disabled;
            node.textContent = content;
            sheets.set(sheet, {node, content});
            if (!node.parentNode) document.head.appendChild(node);
        }
    }

    function schedule() {
        if (pending) return;
        pending = true;
        queueMicrotask(refresh);
    }

    /*//////////////////////////////////////////////////////////////////////*/

    if (legacy) {
        root.classList.add("fontlegacy");
        refresh();
        new MutationObserver(records => {
            let changed = false;
            for (const record of records) {
                if (record.target.closest && record.target.closest(".fontcompat")) continue;
                for (const node of record.addedNodes) {
                    if (node.nodeType !== 1 || node.classList.contains("fontcompat")) continue;
                    if (node.matches("style,link[rel=stylesheet]")) changed = true;
                    if (node.matches("link[rel=stylesheet]") && !links.has(node)) {
                        links.add(node);
                        node.addEventListener("load", schedule);
                    }
                }
                if (record.target.nodeName === "STYLE") changed = true;
            }
            if (changed) schedule();
        }).observe(document.head, {childList: true, subtree: true, characterData: true});
    }

    /*//////////////////////////////////////////////////////////////////////*/

    if (document.fonts) {
        const faces = Array.from(document.fonts).filter(face => face.family.replace(/["']/g, "") === "Good Dog");
        if (faces.some(face => face.status !== "loaded")) {
            root.style.setProperty("--sitefont", "Arial,sans-serif");
            Promise.all(faces.map(face => face.load().catch(() => {}))).then(() => {
                root.style.removeProperty("--sitefont");
            });
        }
    }
})();
