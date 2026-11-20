(() => {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "/assets/static/css/emoji.css";
    document.head.append(stylesheet);
    const excluded = "script,style,textarea,input,select,option,code,pre,svg,math,[contenteditable],.siteemoji,[data-noemoji]";
    const failed = new Set();
    const pending = new Set();
    const spritecodes = new Set(["1f4a7", "1f389", "1f383", "26a0", "1fa77", "1f3ae", "1f9ea", "1f4e6", "2b06", "1f385-1f3fb", "1f384", "1f90e", "1f1e7-1f1f4"]);
    let scheduled = false;
    let parser;
    let names;
    let sprite;

    function spriteicons() {
        sprite ||= fetch("/assets/images/twemoji.svg").then(async response => {
            if (!response.ok) throw new Error("Emoji sprite unavailable");
            const source = new DOMParser().parseFromString(await response.text(), "image/svg+xml");
            if (source.querySelector("parsererror")) throw new Error("Emoji sprite invalid");
            const symbols = [...source.querySelectorAll("symbol[id^='twemoji-']")];
            const hidden = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            hidden.setAttribute("class", "twemojisprite");
            hidden.setAttribute("aria-hidden", "true");
            for (const symbol of symbols) hidden.append(document.importNode(symbol, true));
            document.body.append(hidden);
            return new Set(symbols.map(symbol => symbol.id.slice(8)));
        }).catch(() => new Set());
        return sprite;
    }

    function remoteimage(wrapper, code, emoji) {
        if (failed.has(code)) return;
        const image = document.createElement("img");
        image.className = "siteemojiimage";
        image.alt = emoji;
        image.draggable = false;
        image.decoding = "async";
        image.onload = () => {image.title = wrapper.title; wrapper.replaceChildren(image)};
        image.onerror = () => {failed.add(code)};
        image.src = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@17.0.3/assets/svg/" + code + ".svg";
        wrapper.append(image);
    }

    function spriteimage(wrapper, code, emoji) {
        spriteicons().then(icons => {
            if (!icons.has(code)) {
                if (wrapper.isConnected) remoteimage(wrapper, code, emoji);
                return;
            }
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.classList.add("siteemojiimage");
            svg.setAttribute("viewBox", "0 0 36 36");
            svg.setAttribute("role", "img");
            svg.setAttribute("aria-label", emoji);
            svg.title = wrapper.title;
            const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
            use.setAttribute("href", "#twemoji-" + code);
            use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#twemoji-" + code);
            svg.append(use);
            wrapper.replaceChildren(svg);
        });
    }

    function title(wrapper, emoji) {
        wrapper.title = emoji;
        if (!names) names = fetch("/assets/static/data/emojinames.json").then(response => response.ok ? response.json() : {}).catch(() => ({}));
        names.then(data => {
            const name = data[emoji.replace(/\ufe0f/g, "")];
            if (!name) return;
            wrapper.title = ":" + name + ":";
            const image = wrapper.querySelector("img");
            if (image) image.title = wrapper.title;
        });
    }

    function custom(root) {
        const selector = "img[src*='/emojis/']";
        const images = root.matches(selector) ? [root] : [...root.querySelectorAll(selector)];
        for (const image of images) {
            if (image.title) continue;
            const url = new URL(image.src, location.href);
            if (!["cdn.discordapp.com", "media.discordapp.net"].includes(url.hostname)) continue;
            const name = image.alt.replace(/^:|:$/g, "");
            if (/^[a-z\d_]+$/i.test(name)) image.title = ":" + name + ":";
        }
    }

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
            title(wrapper, emoji);
            if (spritecodes.has(code)) spriteimage(wrapper, code, emoji);
            else remoteimage(wrapper, code, emoji);
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
        custom(root);
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
    library.src = "/assets/static/dependencies/twemoji.js";
    library.onload = () => {
        if (document.body) start();
        else document.addEventListener("DOMContentLoaded", start, {once: true});
    };
    document.head.append(library);
})();
