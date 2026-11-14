function node(tag, classname, text) {
    const element = document.createElement(tag);
    element.className = classname;
    if (text !== undefined) element.textContent = text;
    return element;
}

function address(text) {
    try {
        const url = new URL(text);
        return ["https:", "http:", "mailto:"].includes(url.protocol) ? url.href : null;
    } catch {return null}
}

/*//////////////////////////////////////////////////////////////////////*/

function inline(text, parent, depth = 0, mentions = {}) {
    if (depth > 8) {parent.append(document.createTextNode(text)); return}
    let plain = "";
    function flush() {
        if (plain) parent.append(document.createTextNode(plain));
        plain = "";
    }
    for (let index = 0; index < text.length;) {
        if (text[index] === "\\" && index + 1 < text.length) {
            plain += text[index + 1];
            index += 2;
            continue;
        }
        const remaining = text.slice(index);
        const mention = /^<(@[!&]?|#)(\d{17,22})>/.exec(remaining);
        if (mention) {
            flush();
            const id = mention[2];
            const channel = mention[1] === "#";
            const role = mention[1] === "@&";
            const details = (channel ? mentions.channels : role ? mentions.roles : mentions.users)?.[id];
            const label = typeof details === "string" ? details : details?.name;
            const element = node(role ? "span" : "a", "mdmention", (channel ? "#" : "@") + (label || (channel ? "channel" : role ? "role" : "user")));
            element.title = element.textContent;
            if (!role) {
                element.href = channel ? "https://discord.com/channels/" + (mentions.guild || "@me") + "/" + id : "https://discord.com/users/" + id;
                element.target = "_blank";
                element.rel = "noopener noreferrer";
            }
            parent.append(element);
            index += mention[0].length;
            continue;
        }
        const emoji = /^<(a?):([a-z\d_]{2,32}):(\d{17,22})>/i.exec(remaining);
        if (emoji) {
            flush();
            const image = node("img", "mdemoji");
            image.alt = ":" + emoji[2] + ":";
            image.title = image.alt;
            image.src = "https://cdn.discordapp.com/emojis/" + emoji[3] + (emoji[1] ? ".gif" : ".webp") + "?size=32";
            image.loading = "lazy";
            parent.append(image);
            index += emoji[0].length;
            continue;
        }
        const linked = /^\[([^\]\n]+)\]\((<?(?:https?:\/\/|mailto:)(?:[^\s()]|\([^\n()]*\))+>?)\)/i.exec(remaining);
        const automatic = /^<?https?:\/\/[^\s<>]+>?/i.exec(remaining);
        if (linked || automatic) {
            const match = linked || automatic;
            const raw = linked ? linked[2].replace(/^<|>$/g, "") : match[0].replace(/^<|>$/g, "").replace(/[.,!?;:]+$/, "");
            const href = address(raw);
            if (href) {
                flush();
                const link = node("a", "mdlink");
                link.href = href;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                inline(linked ? linked[1] : raw, link, linked ? depth + 1 : 9, mentions);
                parent.append(link);
                index += (linked || match[0].startsWith("<")) ? match[0].length : raw.length;
                continue;
            }
        }
        let formatted = false;
        for (const [mark, tag, classname] of [["`", "code", "mdcode"], ["**", "strong", "mdbold"], ["__", "u", "mdunderline"], ["~~", "s", "mdstrike"], ["||", "button", "mdspoiler"], ["*", "em", "mditalic"], ["_", "em", "mditalic"]]) {
            if (!remaining.startsWith(mark)) continue;
            const end = text.indexOf(mark, index + mark.length);
            if (end <= index + mark.length) continue;
            flush();
            const element = node(tag, classname);
            const content = text.slice(index + mark.length, end);
            if (mark === "`") element.textContent = content;
            else inline(content, element, depth + 1, mentions);
            if (mark === "||") {
                element.type = "button";
                element.setAttribute("aria-label", "show spoiler");
                element.setAttribute("aria-pressed", "false");
                element.addEventListener("click", () => {
                    const revealed = element.classList.toggle("mdrevealed");
                    element.setAttribute("aria-pressed", String(revealed));
                    element.setAttribute("aria-label", revealed ? "hide spoiler" : "show spoiler");
                });
            }
            parent.append(element);
            index = end + mark.length;
            formatted = true;
            break;
        }
        if (!formatted) plain += text[index++];
    }
    flush();
}

/*//////////////////////////////////////////////////////////////////////*/

export function discordmd(text, depth = 0, mentions = {}) {
    const root = node("div", "discordmd");
    const lines = String(text).slice(0, 20000).replace(/\r\n?/g, "\n").split("\n");
    for (let index = 0; index < lines.length;) {
        const line = lines[index];
        if (!line.trim()) {index++; continue}
        if (line.startsWith("```")) {
            const code = [];
            index++;
            while (index < lines.length && !lines[index].startsWith("```")) code.push(lines[index++]);
            if (index < lines.length) index++;
            root.append(node("pre", "mdblockcode", code.join("\n")));
            continue;
        }
        if (/^> ?/.test(line) && depth < 6) {
            const content = [];
            while (index < lines.length && /^> ?/.test(lines[index])) content.push(lines[index++].replace(/^> ?/, ""));
            const block = node("blockquote", "mdquote");
            block.append(discordmd(content.join("\n"), depth + 1, mentions));
            root.append(block);
            continue;
        }
        const listed = /^\s*(?:([-*])|(\d+)[.)])\s+(.+)$/.exec(line);
        if (listed) {
            const ordered = Boolean(listed[2]);
            const list = node(ordered ? "ol" : "ul", "mdlist");
            if (ordered) list.start = Math.min(9999, Number(listed[2]));
            while (index < lines.length) {
                const item = /^\s*(?:([-*])|(\d+)[.)])\s+(.+)$/.exec(lines[index]);
                if (!item || Boolean(item[2]) !== ordered) break;
                const element = node("li", "mditem");
                inline(item[3], element, 0, mentions);
                list.append(element);
                index++;
            }
            root.append(list);
            continue;
        }
        const heading = /^(#{1,3})\s+(.+)$/.exec(line);
        const small = /^-#\s+(.+)$/.exec(line);
        const classname = heading ? "mdheading " + ["mdlarge", "mdmedium", "mdsmallheading"][heading[1].length - 1] : small ? "mdsmall" : "mdparagraph";
        const element = node(heading ? "h" + heading[1].length : "p", classname);
        inline(heading ? heading[2] : small ? small[1] : line, element, 0, mentions);
        root.append(element);
        index++;
    }
    return root;
}
