import {drawframe, quadparse} from "/assets/static/js/images/atlas.js";

// click sfx
document.querySelectorAll(".clickable").forEach(function(element) {
    element.addEventListener("click", function() {
        document.querySelector(".click").currentTime = 0;
        document.querySelector(".click").play();
    });
});

/*//////////////////////////////////////////////////////////////////////*/

let sheetfilename = "sprite";
const commonxml = await fetch("/assets/static/data/commonxml.json").then(response => {if (!response.ok) throw new Error("Sheet metadata unavailable"); return response.json()});

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
    } catch (e) {
        // Ignore errors
    }
}

// xml highlighting
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
        console.error("Prism.js error?!", e);
        element.textContent = text;
    }
}

const xmleditor = document.querySelector(".thexml");
if (xmleditor) {
    highlight(xmleditor);
    xmleditor.addEventListener("input", function() {
        clearTimeout(this._t); this._t = setTimeout(() => {
            highlight(this); parserender()
        }, 100)
    });
    xmleditor.addEventListener("paste", function() {
        setTimeout(() => {
            highlight(this); parserender()
        }, 10)
    });
}

/*//////////////////////////////////////////////////////////////////////*/

// drag overlay
let dragcount = 0;
document.addEventListener("dragenter", function(e) {
    e.preventDefault();
    dragcount++;
    if (dragcount === 1) {
        const dragoverlay = document.querySelector(".drag");
        dragoverlay.style.display = "flex"; dragoverlay.style.opacity = "0";
        setTimeout(() => {dragoverlay.style.opacity = "1"}, 10);
    }
});
document.addEventListener("dragleave", function(e) {
    e.preventDefault(); dragcount--;
    if (dragcount === 0) {
        const dragoverlay = document.querySelector(".drag");
        dragoverlay.style.opacity = "0";
        setTimeout(() => {dragoverlay.style.display = "none"}, 500);
    }
});
document.addEventListener("dragover", function(e) {e.preventDefault()});
document.addEventListener("drop", function(e) {
    e.preventDefault(); dragcount = 0; document.querySelector(".drag").style.opacity = "0";
    setTimeout(() => {document.querySelector(".drag").style.display = "none"}, 500);
    const files = e.dataTransfer.files; if (files.length > 0) {handledrop(files[0])}
});

function handledrop(file) {
    if (!file) return;
    if (file.type && file.type.startsWith("image/")) { loadimagefile(file) }
    else {loadxml(file)}
}

/*//////////////////////////////////////////////////////////////////////*/

// shit picker
const imgpicker = document.querySelector(".imgfile");
const xmlpicker = document.querySelector(".xmlfile");
const imageuploadbox = document.querySelector(".imageupload");
const imageuploadtext = imageuploadbox.querySelector("a");

imageuploadbox.addEventListener("click", function() {imgpicker.click()});
imgpicker.addEventListener("change", e => {
    const f = e.target.files[0]; if (f) loadimagefile(f)
});

function loadxml(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result || ""; xmleditor.textContent = content;
        highlight(xmleditor); parserender()
    }; reader.readAsText(file)
}

function layoutimage() {
    const img = document.querySelector(".sheet");
    const inner = document.querySelector(".sheetinner");
    if (!img || !img.naturalWidth || !inner) return;
    const s = Math.min(inner.clientWidth / img.naturalWidth, inner.clientHeight / img.naturalHeight);
    const w = Math.max(1, Math.floor(img.naturalWidth * s));
    const h = Math.max(1, Math.floor(img.naturalHeight * s));
    img.style.width = w + "px";
    img.style.height = h + "px";
}
 function loadimagefile(file) {
    const url = URL.createObjectURL(file); const img = document.querySelector(".sheet");
    const upload = document.querySelector(".uploadinput");
    const backbutton = document.querySelector(".backbutton");
    img.onload = () => {
        URL.revokeObjectURL(url);
        if (upload) upload.style.display = "none";
         if (img) {img.style.display = "block"; layoutimage()}
         if (backbutton) backbutton.style.display = "block";
         const exportbutton = document.querySelector(".exportbutton");
         if (exportbutton) exportbutton.style.display = "flex";
         parserender()
    }; img.src = url
    if (file && file.name) {
        const base = file.name.replace(/\.[^/.]+$/, "");
        sheetfilename = base.replace(/[^\w\-]+/g, "_");
        // autoassign
        if (commonxml[sheetfilename]) {
            xmleditor.textContent = commonxml[sheetfilename];
            highlight(xmleditor);
            parserender(); showassigned();
        }
    }
}

function showassigned() {
    let n = document.querySelector('.preassigned');
    if (!n) {
        n = document.createElement('div');
        n.className = 'preassigned';
        n.textContent = 'Existing xml assigned!';
        const wrap = document.querySelector('.sheetwrap');
        if (wrap) wrap.appendChild(n);
    }
    n.style.display = 'block'; n.style.opacity = '1';
    setTimeout(() => {n.style.opacity = '0'; setTimeout(()=>{n.style.display='none'}, 300)}, 1200);
}

/*//////////////////////////////////////////////////////////////////////*/

function getscale(img) {
    if (!img || !img.naturalWidth) return {sx:1, sy:1};
    return {sx: img.clientWidth / img.naturalWidth, sy: img.clientHeight / img.naturalHeight}
}
function cleanoverlay() {
    while (document.querySelector(".overlay").firstChild)
    document.querySelector(".overlay").removeChild(document.querySelector(".overlay").firstChild)
}

function parserender() {

    const xml = xmleditor.textContent.trim();
    const rects = quadparse(xml);
    const img = document.querySelector(".sheet");

    if (!img || !img.src) {cleanoverlay(); return}
    cleanoverlay(); layoutimage();

    const scale = getscale(img);
    const inner = document.querySelector(".sheetinner");
    const offx = (inner.clientWidth - img.clientWidth) / 2 + 16;
    const offy = (inner.clientHeight - img.clientHeight) / 2 + 16;

    rects.forEach(r => {
        const div = document.createElement("div");

        div.className = "spritebox dim clickable";
        div.style.left = (offx + r.x * scale.sx) + "px";
        div.style.top = (offy + r.y * scale.sy) + "px";
        div.style.width = Math.max(0, r.w * scale.sx) + "px";
        div.style.height = Math.max(0, r.h * scale.sy) + "px";
        div.title = `Sprite #${r.idx} (x${r.x}, y${r.y} // ${r.w}x${r.h})`; // alt text of hype moments and aura
                                                                            // (i almost never use these but it's nice in this case)

        div.addEventListener("mouseenter", () => setfocus(div));
        div.addEventListener("mouseleave", () => clearfocus());
        div.addEventListener("click", () => downloadsprite(img, r));
        document.querySelector(".overlay").appendChild(div);
    });
}

function setfocus(target) {
    document.querySelectorAll(".spritebox").forEach(b => b.classList.remove("focus"));
    if (target) target.classList.add("focus")
}
function clearfocus() {
    document.querySelectorAll(".spritebox").forEach(b => b.classList.remove("focus"))
}

 function downloadsprite(img, rect) {
    if (!img || !img.naturalWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, rect.w); canvas.height = Math.max(1, rect.h);
    const ctx = canvas.getContext("2d"); ctx.imageSmoothingEnabled = false;
    try {drawframe(ctx, img, rect)}
    catch (e) {return}
    canvas.toBlob(blob => {
        if (!blob) return; const a = document.createElement("a"); 
        const url = URL.createObjectURL(blob);
         a.href = url; a.download = `${sheetfilename} - #${rect.idx} x${rect.x}y${rect.y} ${rect.w}x${rect.h}.png`;
        document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
    }, "image/png");
}
window.addEventListener("resize", parserender);

const sheet = document.querySelector(".sheet");
if (sheet) {sheet.addEventListener("load", parserender)}
const sheetwrap = document.querySelector(".sheetwrap");
if (sheetwrap) {
    const observer = new ResizeObserver(parserender);
    observer.observe(sheetwrap);
}
const imageuploadtextinit = imageuploadtext.textContent;
imageuploadtext.textContent = imageuploadtextinit;

// back button
const backbutton = document.querySelector(".backbutton");
if (backbutton) {
    backbutton.addEventListener("click", function() {
        const img = document.querySelector(".sheet");
        const upload = document.querySelector(".uploadinput");
        const xmleditor = document.querySelector(".thexml");
        const exportbutton = document.querySelector(".exportbutton");

        if (img) {img.style.display = "none"; img.src = ""}
        if (upload) upload.style.display = "flex";
        if (backbutton) backbutton.style.display = "none";
        if (exportbutton) exportbutton.style.display = "none";
        if (xmleditor) {xmleditor.textContent = ""; highlight(xmleditor)}
        cleanoverlay();
    });
}

// export button
function idgen() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 3; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    } return result;
}
async function exportall() {
    const img = document.querySelector(".sheet");
    if (!img || !img.naturalWidth) return;

    const xml = xmleditor.textContent.trim();
    const rects = quadparse(xml);
    if (rects.length === 0) return;

    const zip = new JSZip();
    let processed = 0;

    for (const rect of rects) {
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, rect.w);
        canvas.height = Math.max(1, rect.h);
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;

        try {
            drawframe(ctx, img, rect);
            const blob = await new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error("png encoding failed?!"));
                }, "image/png");
            });

            const filename = `${sheetfilename} - #${rect.idx} x${rect.x}y${rect.y} ${rect.w}x${rect.h}.png`;
            zip.file(filename, blob);
            processed++;
        } catch (e) {} // you will never EVER know if it failed. sorry bud
    }

    if (processed === 0) return;
    const zipblob = await zip.generateAsync({type: "blob", compression: "DEFLATE"});
    const uniqueid = idgen();
    const url = URL.createObjectURL(zipblob);
    const a = document.createElement("a");
    a.href = url; a.download = `${sheetfilename}_${uniqueid}.zip`; // filename won't work if it's a dragged in file, but will export anyways
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

const exportbutton = document.querySelector(".exportbutton");
if (exportbutton) {
    exportbutton.addEventListener("click", function() {exportall()});
}
