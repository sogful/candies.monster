import {serialize} from "./serialize.js";
import {attachments} from "./media.js";
import {spinner} from "/assets/static/js/images/spinner.js";

const drafts = new Map();

function element(tag, classname, text) {
    const node = document.createElement(tag);
    node.className = classname;
    if (text !== undefined) node.textContent = text;
    return node;
}

export function commenteditor(entry, submit, section, posting = true) {
    if (document.querySelector(".commenteditor")) return;
    const dialog = element("section", "commenteditor");
    dialog.setAttribute("aria-label", "Comment editor");
    const layout = element("div", "editorlayout");
    const loading = element("div", "editorloading");
    loading.hidden = true;
    spinner(loading, "Uploading comment");
    const view = section.querySelector(".commentview");
    const thread = section.querySelector(".commentthread");
    const position = thread.scrollTop;
    view.hidden = true;
    section.classList.add("commentediting");
    const heading = element("header", "editorheading");
    const close = element("button", "editorclose clickable");
    close.type = "button";
    close.setAttribute("aria-label", "Close editor");
    const cross = element("img", "");
    cross.src = "/assets/images/icons/x.png";
    cross.alt = "";
    close.append(cross);
    const toolbar = element("div", "editortoolbar");
    toolbar.setAttribute("role", "toolbar");
    toolbar.setAttribute("aria-label", "Comment formatting");
    heading.append(toolbar, close);
    const root = element("div", "editorcontent");
    root.contentEditable = "true";
    root.setAttribute("role", "textbox");
    root.setAttribute("aria-label", "Comment text");
    root.setAttribute("aria-multiline", "true");
    root.spellcheck = true;
    const draft = drafts.get(entry.id);
    if (draft) root.innerHTML = draft.html;
    const footer = element("footer", "editorfooter");
    const count = element("span", "editorcount");
    const status = element("p", "editorstatus");
    status.setAttribute("role", "status");
    const send = element("button", "editorsend descbutton clickable", "Send");
    send.type = "button";
    footer.append(count, status);
    if (posting) footer.append(send);
    else {
        footer.classList.add("editorreadonly");
        const notice = element("p", "editorunavailable", "comments disabled in this test, sorry!");
        notice.setAttribute("role", "status");
        footer.append(notice);
    }
    layout.append(heading, root, footer);
    dialog.append(layout, loading);
    section.append(dialog);
    let range = null;
    let busy = false;
    const changed = () => {
        const text = serialize(root);
        count.textContent = text.length + "/2000";
        send.disabled = !posting || busy || text.length > 2000 || !text && !media.values().length;
        root.contentEditable = String(!busy);
        for (const button of toolbar.querySelectorAll("button")) button.disabled = busy;
        close.disabled = busy;
        dialog.setAttribute("aria-busy", String(busy));
        layout.inert = busy;
        loading.hidden = !busy;
        const copy = root.cloneNode(true);
        copy.querySelectorAll(".editorattachment").forEach(node => node.remove());
        drafts.set(entry.id, {html: copy.innerHTML, files: media.saved()});
    };
    const media = attachments(root, status, changed, draft?.files || []);
    function selection() {
        const current = getSelection();
        if (current.rangeCount && root.contains(current.anchorNode)) range = current.getRangeAt(0).cloneRange();
    }
    function restore() {
        root.focus({preventScroll: true});
        if (range) {const selected = getSelection(); selected.removeAllRanges(); selected.addRange(range)}
    }
    function command(name, value) {
        restore();
        document.execCommand(name, false, value);
        selection();
        changed();
    }
    function control(label, icon, action) {
        const item = element("button", "editortool clickable");
        item.type = "button";
        item.title = label;
        item.setAttribute("aria-label", label);
        const image = element("img", "");
        image.src = "/assets/images/icons/editor/" + icon + ".png";
        image.alt = "";
        item.append(image);
        item.addEventListener("pointerdown", event => {selection(); event.preventDefault()});
        item.addEventListener("click", action);
        toolbar.append(item);
    }
    for (const [label, icon, name] of [["Bold", "bold", "bold"], ["Italic", "italic", "italic"], ["Underline", "underline", "underline"], ["Strikethrough", "strikethrough", "strikeThrough"], ["Bullet list", "list", "insertUnorderedList"]]) control(label, icon, () => command(name));
    for (const [label, icon, tag] of [["Heading 1", "h3", "h1"], ["Heading 2", "h4", "h2"], ["Heading 3", "h5", "h3"], ["Normal text", "text", "p"], ["Quote", "cite", "blockquote"], ["Code block", "code", "pre"]]) control(label, icon, () => command("formatBlock", tag));
    control("Small text", "tiny", () => {
        command("formatBlock", "p");
        const node = getSelection().anchorNode;
        (node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement)?.closest("p")?.classList.toggle("editorsmall");
        changed();
    });
    control("Inline code", "monospace", () => {
        restore();
        const selected = getSelection();
        const current = selected.rangeCount ? selected.getRangeAt(0) : null;
        if (!current || !root.contains(current.commonAncestorContainer)) return;
        const code = document.createElement("code");
        code.textContent = current.toString() || "code";
        current.deleteContents();
        current.insertNode(code);
        current.selectNodeContents(code);
        selection();
        changed();
    });
    control("Link", "link", () => {
        selection();
        const box = element("form", "editorlinkbox");
        const input = element("input", "editorlinkinput");
        input.type = "url";
        input.placeholder = "https://";
        input.required = true;
        input.setAttribute("aria-label", "Link address");
        const add = element("button", "clickable", "Add link");
        const cancel = element("button", "clickable", "Cancel");
        add.type = "submit";
        cancel.type = "button";
        cancel.addEventListener("click", () => {box.remove(); restore()});
        box.addEventListener("submit", event => {
            event.preventDefault();
            const url = new URL(input.value);
            if (!["https:", "http:"].includes(url.protocol)) {input.setCustomValidity("Use an HTTP or HTTPS link"); input.reportValidity(); return}
            box.remove();
            restore();
            if (getSelection().isCollapsed) command("insertText", url.href);
            else command("createLink", url.href);
        });
        box.append(input, add, cancel);
        toolbar.after(box);
        input.focus();
    });
    control("Add images or GIFs", "media", () => media.open());
    root.addEventListener("input", changed);
    root.addEventListener("keyup", selection);
    root.addEventListener("pointerup", selection);
    root.addEventListener("paste", event => {
        event.preventDefault();
        command("insertText", event.clipboardData.getData("text/plain"));
    });
    root.addEventListener("drop", event => event.preventDefault());
    function unbullet(event) {
        if (event.type === "keydown" ? event.key !== "Backspace" : event.inputType !== "deleteContentBackward") return;
        const selected = getSelection();
        if (!selected.isCollapsed || !selected.rangeCount) return;
        const node = selected.anchorNode;
        const item = (node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement)?.closest("li");
        if (!item || !root.contains(item)) return;
        const before = selected.getRangeAt(0).cloneRange();
        before.selectNodeContents(item);
        before.setEnd(selected.anchorNode, selected.anchorOffset);
        if (before.toString().replace(/\u200b/g, "")) return;
        event.preventDefault();
        selection();
        command("outdent");
    }
    root.addEventListener("keydown", unbullet);
    root.addEventListener("beforeinput", unbullet);
    send.addEventListener("click", async () => {
        if (!posting || busy) return;
        busy = true;
        changed();
        status.textContent = "";
        let complete = false;
        try {
            await submit(serialize(root), media.values());
            drafts.delete(entry.id);
            complete = true;
            finish(true);
        } catch (error) {status.textContent = error.message}
        finally {busy = false; if (!complete) changed()}
    });
    function finish(posted = false) {
        dialog.remove();
        view.hidden = false;
        section.classList.remove("commentediting");
        thread.scrollTop = posted ? thread.scrollHeight : position;
    }
    close.addEventListener("click", () => {if (!busy) finish()});
    dialog.addEventListener("keydown", event => {
        if (event.key === "Escape") {event.preventDefault(); if (!busy) finish()}
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {event.preventDefault(); send.click()}
    });
    root.focus();
    changed();
}
