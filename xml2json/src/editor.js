function savecursorpos(element) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    const precaretrange = range.cloneRange();
    precaretrange.selectNodeContents(element);
    precaretrange.setEnd(range.endContainer, range.endOffset);
    return precaretrange.toString().length;
}

function restorecursorpos(element, offset) {
    if (offset === null || offset === undefined) return;
    try {
        const selection = window.getSelection();
        const range = document.createRange();
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        let cur = 0;
        let node;
        while (node = walker.nextNode()) {
            const len = node.textContent.length;
            if (cur + len >= offset) {
                range.setStart(node, Math.max(0, offset - cur));
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
                break;
            }
            cur += len;
        }
    } catch (e) {}
}

function highlight(element) {
    if (!element || !Prism) return;
    const text = element.textContent || element.innerText || "";
    if (!text.trim()) {
        element.innerHTML = "";
        return;
    }
    const cursorpos = savecursorpos(element);
    try {
        const highlighted = Prism.highlight(text, Prism.languages.xml, 'xml');
        element.innerHTML = highlighted;
        if (cursorpos !== null) {
            restorecursorpos(element, cursorpos);
        }
    } catch (e) {
        console.error("prism.js error?!", e);
        element.textContent = text;
    }
}

function highlightjson(element) {
    if (!element || !Prism) return;
    const text = element.textContent || element.innerText || "";
    if (!text.trim()) {
        element.innerHTML = "";
        return;
    }
    const cursorpos = savecursorpos(element);
    try {
        const highlighted = Prism.highlight(text, Prism.languages.json, 'json');
        element.innerHTML = highlighted;
        if (cursorpos !== null) {
            restorecursorpos(element, cursorpos);
        }
    } catch (e) {
        console.error("prism.js error?!", e);
        element.textContent = text;
    }
}

/*//////////////////////////////////////////////////////////////////////*/

export {highlight, highlightjson};
