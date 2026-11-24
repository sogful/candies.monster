function xmlstrings(text) {
    if (/<!ENTITY/i.test(text)) throw new Error("This translation contains unsupported XML entities.");
    const doc = new DOMParser().parseFromString(text, "text/xml");
    if (doc.querySelector("parsererror")) throw new Error("The translation XML is invalid.");
    const rows = [];
    function add(key, locale, node, attribute) {
        if (node.children.length) return;
        rows.push({
            key, locale,
            read: () => attribute ? node.getAttribute(attribute) : node.textContent,
            write: value => {
                if (attribute) node.setAttribute(attribute, value);
                else node.textContent = value;
            }
        });
    }
    for (const entry of doc.querySelectorAll("string, entry, text, message")) {
        const key = entry.getAttribute("name") || entry.getAttribute("key") || entry.getAttribute("id");
        if (!key) continue;
        if (entry.children.length) {
            for (const child of entry.children) add(key, child.getAttribute("locale") || child.getAttribute("lang") || child.localName, child, child.hasAttribute("value") ? "value" : "");
        } else {
            add(key, entry.getAttribute("locale") || entry.getAttribute("lang") || "", entry, entry.hasAttribute("value") ? "value" : "");
        }
    }
    for (const key of doc.querySelectorAll("plist > dict > key")) {
        const value = key.nextElementSibling;
        if (value?.localName === "string") add(key.textContent, "", value, "");
    }
    const declaration = text.match(/^\s*<\?xml\b[^?]*\?>\s*/i)?.[0] ?? "";
    return {
        rows,
        serialize() {
            const xml = new XMLSerializer().serializeToString(doc);
            return /^\s*<\?xml\b/i.test(xml) ? xml : declaration + xml;
        }
    };
}

/*//////////////////////////////////////////////////////////////////////*/

function pliststrings(text) {
    const spans = [];
    const decode = value => value.replace(/\\(u[\da-f]{4}|U[\da-f]{4}|[\\"nrt])/gi, (quoted, code) => {
        if (code.length === 5) return String.fromCharCode(parseInt(code.slice(1), 16));
        return {n: "\n", r: "\r", t: "\t", "\\": "\\", '"': '"'}[code] ?? quoted;
    });
    const quotes = /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|("(?:\\.|[^"\\])*")\s*=\s*("(?:\\.|[^"\\])*")\s*;/g;
    for (const match of text.matchAll(quotes)) {
        if (!match[1]) continue;
        const offset = match.index + match[0].indexOf("=", match[1].length);
        const start = offset + match[0].slice(offset - match.index).indexOf('"');
        spans.push({key: decode(match[1].slice(1,-1)), start, end: start + match[2].length, value: decode(match[2].slice(1,-1))});
    }
    const rows = spans.map(span => ({
        key: span.key, locale: "",
        read: () => span.value,
        write: value => {span.value = value; span.changed = true}
    }));
    return {
        rows,
        serialize: () => {
            let output = text;
            for (const {start, end, value, changed} of spans.slice().reverse()) {
                if (changed) output = output.slice(0,start) + JSON.stringify(value) + output.slice(end);
            }
            return output;
        }
    };
}

function jsonstrings(text) {
    const data = JSON.parse(text);
    const rows = [];
    function walk(object, path = []) {
        if (!object || typeof object !== "object" || path.length > 40) return;
        for (const [key, value] of Object.entries(object)) {
            const next = [...path, key];
            if (typeof value === "string") {
                rows.push({key: next.join(" › "), locale: "", read: () => object[key], write: content => {object[key] = content}});
            } else walk(value, next);
        }
    }
    walk(data);
    return {rows, serialize: () => JSON.stringify(data, null, 2)};
}

export function translation(text, path) {
    const model = /^\s*</.test(text) ? xmlstrings(text) : /\.json$/i.test(path) ? jsonstrings(text) : pliststrings(text);
    if (!model.rows.length) throw new Error("This game translation format is unsupported.");
    const locales = [...new Set(model.rows.map(row => row.locale))];
    return {...model, locales};
}

/*//////////////////////////////////////////////////////////////////////*/

function wrapperlocale(path) {
    return /(?:^|\/)gl_wp_strings\/gl_wp_string_([a-z]+(?:_[a-z]+)?)\.xml$/i.exec(path)?.[1]
        .toLowerCase().replace("_latam", "-419").replace("_", "-");
}

export function stringgroups(assets) {
    const groups = [];
    const wrappers = new Map();
    for (const item of assets) {
        if (item.category !== "stringsgame") continue;
        const locale = wrapperlocale(item.path);
        if (locale) {
            let group = wrappers.get(item.scope);
            if (!group) {
                group = {label: "Gameloft", priority: 2, languages: new Map(), items: []};
                wrappers.set(item.scope, group);
                groups.push(group);
            }
            group.languages.set(locale === "in" ? "id" : locale, item);
            group.items.push(item);
            continue;
        }
        const name = item.path.split("/").at(-1).replace(/\.[^.]+$/, "");
        const awards = /SLAwards\.bundle/i.test(item.path);
        const main = !awards && /^(?:strings|game[_-]?strings|localizable)$/i.test(name);
        const label = awards ? "Awards"
            : /^menu[_-]?strings$/i.test(name) ? "Menu"
                : name.replace(/(\d+)_(\d+)$/g, "$1 × $2").replace(/[_-]+/g, " ")
                    .replace(/\b[a-z]/g, letter => letter.toUpperCase()).trim();
        groups.push({label, priority: main ? 0 : 1, items: [item]});
    }
    return groups.sort((a, b) => a.priority - b.priority || a.label.localeCompare(b.label));
}
