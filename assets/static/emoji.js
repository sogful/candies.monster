(() => {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "/assets/static/emoji.css";
    document.head.append(stylesheet);
    const excluded = "script,style,textarea,input,select,option,code,pre,svg,math,[contenteditable],.siteemoji,[data-noemoji]";
    const failed = new Set();
    const pending = new Set();
    let scheduled = false;
    let parser;

    function replace(text) {
        if (!text.parentElement || text.parentElement.closest(excluded)) return;
        const original = text.data;
        if (!parser.test(original)) return;
        const fragment = document.createDocumentFragment();
        let cursor = 0;
        parser.replace(original, (emoji, ...argumentslist) => {
            const offset = argumentslist[argumentslist.length - 2];
            fragment.append(document.createTextNode(original.slice(cursor, offset)));
            const code = parser.convert.toCodePoint(emoji.includes("\u200d") ? emoji : emoji.replace(/\ufe0f/g, ""));
            const wrapper = document.createElement("span");
            wrapper.className = "siteemoji";
            wrapper.textContent = emoji;
            if (!failed.has(code)) {
                const image = document.createElement("img");
                image.className = "siteemojiimage";
                image.alt = emoji;
                image.draggable = false;
                image.decoding = "async";
                image.onload = () => {wrapper.replaceChildren(image)};
                image.onerror = () => {failed.add(code)};
                image.src = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@17.0.3/assets/svg/" + code + ".svg";
            }
            fragment.append(wrapper);
            cursor = offset + emoji.length;
            return emoji;
        });
        fragment.append(document.createTextNode(original.slice(cursor)));
        text.replaceWith(fragment);
    }

    function render(root = document.body) {
        if (!parser || !root) return;
        if (root.nodeType === Node.TEXT_NODE) {replace(root); return}
        if (root.nodeType !== Node.ELEMENT_NODE || root.closest(excluded)) return;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: text => text.parentElement.closest(excluded) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
        });
        const texts = [];
        while (walker.nextNode()) texts.push(walker.currentNode);
        for (const text of texts) replace(text);
    }

    function flush() {
        scheduled = false;
        const roots = Array.from(pending);
        pending.clear();
        for (const root of roots) {
            if (root.isConnected && !roots.some(parent => parent !== root && parent.contains(root))) render(root);
        }
    }

    function start() {
        parser = window.twemoji;
        if (!parser) return;
        window.siteemoji = render;
        render();
        new MutationObserver(records => {
            for (const record of records) {
                if (record.target.parentElement?.closest(excluded)) continue;
                if (record.type === "characterData") pending.add(record.target);
                else for (const node of record.addedNodes) pending.add(node);
            }
            if (pending.size && !scheduled) {
                scheduled = true;
                queueMicrotask(flush);
            }
        }).observe(document.body, {childList: true, characterData: true, subtree: true});
    }

    const library = document.createElement("script");
    library.src = "/assets/static/vendor/twemoji.js";
    library.onload = () => {
        if (document.body) start();
        else document.addEventListener("DOMContentLoaded", start, {once: true});
    };
    document.head.append(library);
})();
