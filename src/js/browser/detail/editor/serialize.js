function escaped(text) {
    return text.replace(/([\\`*_~|[\]])/g, "\\$1");
}

export function serialize(root) {
    function render(node, literal = false) {
        if (node.nodeType === Node.TEXT_NODE) return literal ? node.textContent : escaped(node.textContent);
        if (node.nodeType !== Node.ELEMENT_NODE || node.matches(".editorattachment")) return "";
        const tag = node.tagName.toLowerCase();
        if (tag === "br") return "\n";
        const text = [...node.childNodes].map(child => render(child, literal || ["code", "pre"].includes(tag))).join("");
        if (["b", "strong"].includes(tag)) return "**" + text + "**";
        if (["i", "em"].includes(tag)) return "*" + text + "*";
        if (tag === "u") return "__" + text + "__";
        if (["s", "strike", "del"].includes(tag) || node.style.textDecoration.includes("line-through")) return "~~" + text + "~~";
        if (["code", "pre"].includes(tag)) {
            const runs = text.match(/`+/g) || [];
            const fence = "`".repeat(Math.max(tag === "pre" ? 3 : 1, ...runs.map(run => run.length + 1)));
            return tag === "pre" ? "\n" + fence + "\n" + text.trim() + "\n" + fence + "\n" : fence + text + fence;
        }
        if (tag === "a") {
            const url = new URL(node.getAttribute("href") || "", location.href);
            return ["http:", "https:"].includes(url.protocol) ? "[" + text + "](" + url.href.replace(/\(/g, "%28").replace(/\)/g, "%29") + ")" : text;
        }
        if (/^h[123]$/.test(tag)) return "\n" + "#".repeat(Number(tag[1])) + " " + text.trim() + "\n";
        if (node.classList.contains("editorsmall")) return "\n-# " + text.trim() + "\n";
        if (tag === "blockquote") return "\n" + text.trim().split("\n").map(line => "> " + line).join("\n") + "\n";
        if (["ul", "ol"].includes(tag)) return "\n" + [...node.children].map((item, index) => (tag === "ol" ? index + 1 + ". " : "- ") + [...item.childNodes].map(child => render(child)).join("").trim()).join("\n") + "\n";
        if (["div", "p"].includes(tag)) return text + "\n";
        return text;
    }
    return [...root.childNodes].map(node => render(node)).join("").replace(/\n{3,}/g, "\n\n").trim();
}
