import {createcontroller} from "./game.js";
import {createerrors} from "./errors.js";
import {encodeurl, decodebase64utf8, analyzexml, calculategzipped, normalizetoxml} from "./data.js";
import {createsharing} from "./sharing.js";

(function() {
    let spritejson = null; let sheetloaded = false;
    let favicons = []; let index = 0; const delay = 300;
    let sheetimg = null;

    fetch("/assets/images/icon.json")
        .then(response => response.json()).then(data => {
            spritejson = data.frames; sheetimg = new Image();
            sheetimg.onload = () => {
                sheetloaded = true;
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                favicons = spritejson.map(frame => {
                    canvas.width = frame.frame.w;
                    canvas.height = frame.frame.h;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(
                        sheetimg,
                        frame.frame.x, frame.frame.y, frame.frame.w, frame.frame.h,
                        0, 0, frame.frame.w, frame.frame.h
                    ); return canvas.toDataURL("image/png");
                }); favicongif();
            }; sheetimg.src = "/assets/images/icon.webp";
        });
    function favicongif() {
        if (!sheetloaded || favicons.length === 0) {setTimeout(favicongif, 50); return}
        const link = document.querySelector("link[rel='icon']") || document.createElement("link");
        link.rel = "icon"; link.href = favicons[index];
        document.head.appendChild(link);
        index = (index + 1) % favicons.length;
        setTimeout(favicongif, delay);
    }
})();

/*//////////////////////////////////////////////////////////////////////*/

(async function () {

    const urlparam = new URLSearchParams(window.location.search);

    const paramaliases = {
        noui: ["noui", "nu", "u"],
        shareonly: ["embed", "shareonly", "so", "s"],
        nomusic: ["nomusic", "nm", "m"],
        candy: ["candy", "ca", "c"],
        jolly: ["jolly", "jl", "j"],
        background: ["background", "bg", "b"],
        version: ["version", "ver", "v"],
    };

    function getrawparam(logicalname) {
        const aliases = paramaliases[logicalname] || [logicalname];
        for (const key of aliases) {
            if (urlparam.has(key)) {
                return urlparam.get(key) ?? "";
            }
        }
        return null;
    }
    function getflagparam(logicalname) {
        const raw = getrawparam(logicalname);
        if (raw == null) return false;
        const value = String(raw).toLowerCase();
        return value === "" || value === "true" || value === "1";
    }
    function getstringparam(logicalname) {
        const raw = getrawparam(logicalname);
        return raw == null || raw === "" ? null : String(raw);
    }
    function getintegerparam(logicalname) {
        const raw = getrawparam(logicalname);
        if (raw == null || raw === "") return null;
        const value = parseInt(String(raw), 10);
        return Number.isFinite(value) ? value : null;
    }

    if (getflagparam("noui")) {document.body.classList.add("noui")}
    if (getflagparam("shareonly")) {document.body.classList.add("shareonly")}

    const levelnomusic = getflagparam("nomusic");
    const levelcandy = getstringparam("candy");
    const leveljolly = getflagparam("jolly");
    const levelbackgroundraw = getintegerparam("background");
    const levelbackground = levelbackgroundraw != null && (
        (levelbackgroundraw >= 1 && levelbackgroundraw <= 11) || levelbackgroundraw === 16
    ) ? levelbackgroundraw : null;

    const levelversionraw = getstringparam("version");
    const levelversion = ["dx", "h5dx", "famobi"].includes(levelversionraw) ? levelversionraw : null;

    function autoopenversion() {
        if (levelversion) {
            opengame(levelversion);
            return;
        }
        try {
            const savedgame = localStorage.getItem(gameversionkey);
            if (savedgame === "dx" || savedgame === "famobi" || savedgame === "h5dx") {
                opengame(savedgame);
            }
        } catch (_) {}
    }

    const storagekey = "leveldata";
    const gameversionkey = "gameselected";

    const datapanel = document.querySelector(".datapanel");
    const choicepanel = document.querySelector(".choicepanel");
    const details = document.querySelector(".details");
    const detailstext = document.querySelector(".detailstext");
    const resetbutton = document.querySelector(".resetdata");
    const loadbutton = document.querySelector(".loadbutton");
    const fileinput = document.querySelector(".fileinput");
    const uploadinputs = Array.from(document.querySelectorAll(".uploadinput"));
    const inputbox = document.querySelector(".theotherbox");
    const dragoverlay = document.querySelector(".drag");
    const errorsel = document.querySelector(".errors");
    const fatalel = document.querySelector(".fatal");
    const changeverbtn = document.querySelector(".changever");
    const backbtn = document.querySelector(".back");
    const frame = document.querySelector(".gameframe");
    const oopsaudio = document.querySelector(".oopsaudio");
    const clickaudio = document.querySelector(".click");
    const loading = document.querySelector(".loading");

    const nopicker = false;
    
    const hasurldata = urlparam.has("data") || urlparam.has("code");
    let hasstoreddata = false;
    try {hasstoreddata = !!localStorage.getItem(storagekey)} 
    catch (_) {}
    if (!hasurldata && !hasstoreddata) {datapanel?.classList.add("show")}

    let levelbase64 = null;
    const {fetchlevelbycode, generatelinks, copyurl} = createsharing({
        getlevel: () => levelbase64,
        onerror: (message) => showerror(message),
    });
    let lateststats = null;
    let keeploadingbuddy = false;
    
    function hideloading() {
        if (loading && !keeploadingbuddy) {
            loading.style.opacity = "0";
            setTimeout(() => {
                loading.remove();
            }, 500);
        }
    }
    window.addEventListener("load", () => {
        hideloading();
    });

    const pointercapable = matchMedia("(hover: hover) and (pointer: fine)");
    const uiedgethreshold = 140;
    function checkuiedge(event) {
        const nearedge = event.clientX <= uiedgethreshold
            || event.clientX >= window.innerWidth - uiedgethreshold
            || event.clientY <= uiedgethreshold
            || event.clientY >= window.innerHeight - uiedgethreshold;
        document.body.classList.toggle("uinear", nearedge);
    }
    function syncuiedgelistener() {
        document.removeEventListener("mousemove", checkuiedge);
        document.body.classList.remove("uinear");
        if (pointercapable.matches) {
            document.addEventListener("mousemove", checkuiedge, {passive: true});
        }
    }
    pointercapable.addEventListener("change", syncuiedgelistener);
    syncuiedgelistener();

    window.addEventListener("message", (event) => {
        if (event.origin !== window.location.origin) return;
        if (event.data?.type === "ctrdx-edge-proximity" && pointercapable.matches) {
            document.body.classList.toggle("uinear", !!event.data.near);
        }
    });

    /*//////////////////////////////////////////////////////////////////////*/

    document.querySelectorAll(".clickable").forEach((element) => {
        element.addEventListener("click", () => {
            if (!clickaudio) return;
            clickaudio.currentTime = 0;
            clickaudio.play().catch(() => {});
        });
    });

    /*//////////////////////////////////////////////////////////////////////*/

    function updatestatsfromxml(xml) {
        lateststats = analyzexml(xml);
        updatedetails();
        void calculategzipped(xml).then((size) => {
            if (size == null || !lateststats) return;
            lateststats.gzippedbytes = size;
            updatedetails();
        });
    }

    /*//////////////////////////////////////////////////////////////////////*/

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
            const highlighted = Prism.highlight(text, Prism.languages.xml, "xml");
            element.innerHTML = highlighted;
            if (cursorpos !== null) {
                restorecursorpos(element, cursorpos);
            }
        } catch (e) {
            console.error("Prism.js error?!", e);
            element.textContent = text;
        }
    }

    /*//////////////////////////////////////////////////////////////////////*/

    function cleanurl() {
        const url = new URL(window.location.href);
        if (url.searchParams.has("data")) {
            url.searchParams.delete("data");
            window.history.replaceState({}, "", url.toString());
        }
        if (url.searchParams.has("code")) {
            url.searchParams.delete("code");
            window.history.replaceState({}, "", url.toString());
        }
    }

    function showdatapanel() {
        datapanel?.classList.add("show");
        choicepanel?.classList.add("hidden");
        document.body.classList.remove("playing");
        closegame();
    }

    function showchoicepanel() {
        datapanel?.classList.remove("show");
        choicepanel?.classList.remove("hidden");
    }

    /*//////////////////////////////////////////////////////////////////////*/

    function toggleeditor(hasdata) {
        const fulleditor = document.querySelector(".fulleditor");
        fulleditor?.classList.remove("hidden");
        loadbutton?.classList.remove("hidden");
    }

    function updatedetails() {
        if (!levelbase64 || !lateststats) {
            details?.classList.add("hidden");
            return;
        }
        details?.classList.remove("hidden");
        detailstext.textContent = "";
        const mainline = document.createElement("span");
        mainline.textContent = `${lateststats.objectcount} obj // ${lateststats.charcount} chars`;
        detailstext.appendChild(mainline);
        if (lateststats.gzippedbytes != null && Number.isFinite(lateststats.gzippedbytes)) {
            detailstext.appendChild(document.createElement("br"));
            const gzipline = document.createElement("span");
            gzipline.className = "detailsgzip";
            gzipline.textContent = `${lateststats.gzippedbytes.toLocaleString()} gzipped`;
            detailstext.appendChild(gzipline);
        }
    }

    function setleveldata(base64, showchoice = false) {
        if (!base64) return;
        const trimmed = base64.trim();
        if (trimmed.startsWith("<") || trimmed.startsWith("{") || trimmed.startsWith("[")) {
            setlevelfromxml(trimmed, showchoice);
            return;
        }
        levelbase64 = trimmed;
        try {
            localStorage.setItem(storagekey, levelbase64);
        } catch (storageerror) {
            console.warn("storage error:", storageerror);
        }
        try {
            const xml = decodebase64utf8(levelbase64);
            updatestatsfromxml(xml);
        } catch (error) {
            lateststats = null;
            showerror(`Failed to decode level: ${error}`);
        }
        toggleeditor(true);
        if (nopicker) {opengame(levelversion || "dx")}
        else if (showchoice) {showchoicepanel()}
        resetbutton.disabled = false;
        updatelink();
    }

    function updatelink() {
        const linkbar = document.querySelector(".linkbar");
        if (levelbase64) {
            linkbar?.classList.add("active");
        } else {
            linkbar?.classList.remove("active");
            document.querySelector(".linkpopup")?.classList.remove("active");
        }
    }
    
    /*//////////////////////////////////////////////////////////////////////*/

    function setlevelfromxml(xml, showchoice = false) {
        if (!xml) {
            showerror("No XML data provided");
            return;
        }
        try {
            const trimmed = xml.trim();
            if (!trimmed.match(/<map[\s>]/)) {
                throw new Error("xml doesn't contain <map> element");
            }
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(trimmed, "text/xml");
                const parseerror = doc.querySelector("parsererror");
                if (parseerror) {
                    throw new Error("invalid xml structure..");
                }
                const mapelement = doc.querySelector("map");
                if (!mapelement) {
                    throw new Error("xml doesn't contain <map> element");
                }
            } catch (parseerror) {
                throw new Error(`xml validation failed: ${parseerror.message}`);
            }
            const base64 = encodeurl(trimmed);
            setleveldata(base64, showchoice);
        } catch (error) {
            showerror(`Failed to encode level: ${error.message || error}`);
        }
    }

    async function restorestoredlevel() {
        const urlcode = new URLSearchParams(window.location.search).get("code");
        if (urlcode) {
            keeploadingbuddy = true;
            const data = await fetchlevelbycode(urlcode);
            keeploadingbuddy = false;
            if (data) {
                const trimmed = data.trim();
                if (trimmed.startsWith("<") || trimmed.startsWith("{") || trimmed.startsWith("[")) {
                    setlevelfromxml(trimmed, !nopicker);
                } else {
                    setleveldata(trimmed, !nopicker);
                }
                cleanurl();
                if (!nopicker) {autoopenversion()}
                hideloading();
                return;
            }
            hideloading();
        }
        const urldata = new URLSearchParams(window.location.search).get("data");
        if (urldata) {
            let trimmed = urldata.trim();
            let urldecoded = null;
            try {
                urldecoded = decodeURIComponent(trimmed);
            } catch (e) {}
            if (urldecoded && urldecoded !== trimmed) {
                trimmed = urldecoded;
            }
            
            if (trimmed.startsWith("<") || trimmed.startsWith("{") || trimmed.startsWith("[")) {
                setlevelfromxml(trimmed, !nopicker);
            } else {
                try {
                    const decoded = decodebase64utf8(trimmed);
                    if (decoded.startsWith("<") || decoded.startsWith("{") || decoded.startsWith("[")) {
                        const trimmeddecoded = decoded.trim();
                        if (trimmeddecoded.startsWith("<")) {
                            if (!trimmeddecoded.match(/<map[\s>]/)) {
                                console.error("decompressed xml doesn't contain <map>..", trimmeddecoded.substring(0, 200));
                                throw new Error("xml doesn't contain <map> element..");
                            }
                            try {
                                const parser = new DOMParser();
                                const testdoc = parser.parseFromString(trimmeddecoded, "text/xml");
                                if (testdoc.querySelector("parsererror")) {
                                    console.error("xml parse error?!", testdoc.querySelector("parsererror")?.textContent);
                                    throw new Error("xml parse error");
                                }
                            } catch (parseerror) {
                                console.error("xml validation failed?!", parseerror);
                                throw parseerror;
                            }
                        }
                        setlevelfromxml(trimmeddecoded, !nopicker);
                    } else {
                        setleveldata(trimmed, !nopicker);
                    }
                } catch (e) {
                    showerror(`Failed to process level data?! ${e.message}`);
                    setleveldata(trimmed, !nopicker);
                }
            }
            cleanurl();
            if (!nopicker) {autoopenversion()}
            hideloading();
            return;
        }
        const stored = localStorage.getItem(storagekey);
        if (stored) {
            setleveldata(stored, !nopicker);
            if (!nopicker) {autoopenversion()}
        } else {
            resetbutton.disabled = true;
            toggleeditor(false);
            showdatapanel();
        }
        hideloading();
    }
    /*//////////////////////////////////////////////////////////////////////*/

    loadbutton?.addEventListener("click", () => {
        const xml = inputbox?.textContent?.trim() ?? "";
        setlevelfromxml(xml, true);
    });

    uploadinputs.forEach((element) => {
        element.addEventListener("click", () => fileinput?.click());
    });
    fileinput?.addEventListener("change", (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        void file.text().then((text) => {
            const xml = normalizetoxml(text);
            inputbox.textContent = xml;
            highlight(inputbox);
            setlevelfromxml(xml);
        });
        event.target.value = "";
    });

    document.addEventListener("dragover", (event) => {
        event.preventDefault();
        dragoverlay.classList.add("visible");
    });
    document.addEventListener("dragenter", (event) => {
        event.preventDefault();
        dragoverlay.classList.add("visible");
    });
    document.addEventListener("dragleave", (event) => {
        if (event.target === document || event.target === document.body) {
            dragoverlay.classList.remove("visible");
        }
    });
    document.addEventListener("drop", (event) => {
        event.preventDefault();
        dragoverlay.classList.remove("visible");
        const file = event.dataTransfer?.files?.[0];
        if (file) {
            void file.text().then((text) => {
                const xml = normalizetoxml(text);
                inputbox.textContent = xml;
                highlight(inputbox);
                setlevelfromxml(xml);
            });
        }
    });

    /*//////////////////////////////////////////////////////////////////////*/

    const gametoolong = document.querySelector(".YOURTOOLONG");
    let gameopening = false;
    const gamecontroller = createcontroller({
        frame,
        onerror: (message) => showerror(message),
        onclose: () => closegame(),
        ontoolong: () => gametoolong?.classList.add("active"),
    });

    async function opengame(game) {
        if (!levelbase64) {
            showdatapanel();
            return;
        }
        gameopening = true;
        try {localStorage.setItem(gameversionkey, game)} catch {}
        changeverbtn.classList.add("active");
        document.body.classList.add("playing");
        choicepanel?.classList.add("hidden");
        datapanel?.classList.remove("show");
        gametoolong?.classList.remove("active");
        try {
            await gamecontroller.open(game, {
                xml: decodebase64utf8(levelbase64), base64: levelbase64,
                nomusic: levelnomusic, candy: levelcandy,
                jolly: leveljolly, background: levelbackground,
            });
        } catch (error) {
            closegame();
            showerror(error.message || String(error));
        }
    }

    function closegame() {
        gameopening = false;
        gamecontroller.close();
        changeverbtn.classList.remove("active");
        gametoolong?.classList.remove("active");
        document.body.classList.remove("playing");
        if (levelbase64) {
            if (nopicker) {
                datapanel?.classList.add("show");
                choicepanel?.classList.add("hidden");
            } else {
                choicepanel?.classList.remove("hidden");
            }
        }
        try {
            localStorage.removeItem(gameversionkey);
        } catch (_) {}
    }

    changeverbtn.addEventListener("click", () => {closegame()});

    backbtn?.addEventListener("click", () => {
        if (document.body.classList.contains("shareonly")) {
            window.parent.postMessage("exitpreview", "*");
        } else {closegame()}
    });

    document.querySelectorAll(".choice").forEach((choice) => {
        choice.addEventListener("click", () => {
            const game = choice.getAttribute("data-game");
            opengame(game);
        });
    });

    resetbutton.addEventListener("click", () => {
        levelbase64 = null;
        lateststats = null;
        try {
            localStorage.removeItem(storagekey);
            localStorage.removeItem(gameversionkey);
        } catch (_) {}
        updatedetails();
        resetbutton.disabled = true;
        toggleeditor(false);
        showdatapanel();
        closegame();
        updatelink();
    });

    const link = document.querySelector(".link");
    const linkpopup = document.querySelector(".linkpopup");
    link?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (linkpopup?.classList.contains("active")) {
            linkpopup.classList.remove("active");
        } else {
            generatelinks();
            linkpopup?.classList.add("active");
        }
    });

    document.addEventListener("click", (e) => {
        if (linkpopup?.classList.contains("active") && 
            !linkpopup.contains(e.target) && 
            !link?.contains(e.target)) {
            linkpopup.classList.remove("active");
        }
    });

    document.querySelectorAll(".copybtn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const target = btn.getAttribute("data-copy");
            if (target) {
                const element = document.querySelector(`.${target}`);
                if (element) {
                    copyurl(element);
                }
            }
        });
    });

    if (inputbox) {
        highlight(inputbox);
        inputbox.addEventListener("input", function() {
            clearTimeout(this.highlighttimeout);
            this.highlighttimeout = setTimeout(() => {
                highlight(this);
            }, 100);
        });
        inputbox.addEventListener("paste", function() {
            setTimeout(() => {highlight(this)}, 10);
        });
    }

    /*//////////////////////////////////////////////////////////////////////*/

    const showerror = createerrors({errorsel, fatalel, oopsaudio});

    await restorestoredlevel();
    updatedetails();
    updatelink();
    if (levelbase64) {
        if (!frame.classList.contains("active") && !gameopening) {
            if (nopicker) {opengame(levelversion || "dx")}
            else {showchoicepanel()}
        }
        resetbutton.disabled = false;
    }
})();
