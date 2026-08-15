// animated favicon
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

    // url parameter aliases!
    const paramaliases = {
        noui: ["noui", "nu", "u"],
        shareonly: ["shareonly", "so", "s"],
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
            const savedgame = localStorage.getItem(game_version_key);
            if (savedgame === "dx" || savedgame === "famobi" || savedgame === "h5dx") {
                opengame(savedgame);
            }
        } catch (_) {}
    }

    const storage_key = "leveldata";
    const game_version_key = "gameselected";
    const shortcode_cache_key = "yourlevels";

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
    const closebtn = document.querySelector(".close");
    const frame = document.querySelector(".gameframe");
    const oopsaudio = document.querySelector(".oopsaudio");
    const clickaudio = document.querySelector(".click");
    const loading = document.querySelector(".loading");

    // there's more than one version now so no need for this
    const nopicker = false;
    
    const hasurldata = urlparam.has("data") || urlparam.has("code");
    let hasstoreddata = false;
    try {hasstoreddata = !!localStorage.getItem(storage_key)} 
    catch (_) {}
    if (!hasurldata && !hasstoreddata) {datapanel?.classList.add("show")}

    let levelbase64 = null;
    let lateststats = null;
    const errorentries = new Map();
    let fataltimeout = null;
    let fatalactive = false;
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
        if (event.data?.type === "idfkman" && pointercapable.matches) {
            document.body.classList.toggle("uinear", !!event.data.near);
        }
    });

    /*//////////////////////////////////////////////////////////////////////*/

    /* const notice_key = "dismissed";
    const notice_seen_key = "seen";

    const yetanothernotice = document.querySelector(".yetanothernotice");
    const noticeclose = document.querySelector(".noticeclose");

    let shouldshownotice = false;
    try {
        const dismissed = localStorage.getItem(notice_key) === "true";
        const seen = dismissed || localStorage.getItem(notice_seen_key) === "true";
        if (!seen && yetanothernotice) {
            shouldshownotice = true;
            localStorage.setItem(notice_seen_key, "true");
        }
    } catch (e) {}

    if (shouldshownotice && yetanothernotice) {
        yetanothernotice.classList.remove("hidden");
    }

    noticeclose?.addEventListener("click", () => {
        try {
            localStorage.setItem(notice_key, "true");
        } catch (e) {}
        if (yetanothernotice) {
            yetanothernotice.classList.add("hidden");
        }
    }); */

    document.querySelectorAll(".clickable").forEach((element) => {
        element.addEventListener("click", () => {
            if (!clickaudio) return;
            clickaudio.currentTime = 0;
            clickaudio.play().catch(() => {});
        });
    });

    /*//////////////////////////////////////////////////////////////////////*/

    function encodeurl(str) {
        const bytes = new TextEncoder().encode(str);
        let bin = "";
        for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
        let base64 = btoa(bin);
        base64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
        return base64;
    }
    
    function getcachedshortcode(b64data) {
        try {
            const cache = localStorage.getItem(shortcode_cache_key);
            if (!cache) return null;
            const cacheobj = JSON.parse(cache);
            const entry = cacheobj[b64data];
            if (entry && entry.code) {
                return entry.code;
            }
        } catch (_) {}
        return null;
    }
    function setcachedshortcode(b64data, code) {
        try {
            let cacheobj = {};
            const cache = localStorage.getItem(shortcode_cache_key);
            if (cache) {
                try {
                    cacheobj = JSON.parse(cache);
                } catch (_) {}
            }
            cacheobj[b64data] = { code, timestamp: Date.now(), data: b64data };
            localStorage.setItem(shortcode_cache_key, JSON.stringify(cacheobj));
        } catch (_) {}
    }

    function decodebase64utf8(str) {
        let cleaned = str.replace(/\s/g, "");
        let urlsafecleaned = cleaned.replace(/-/g, "+").replace(/_/g, "/");
        while (urlsafecleaned.length % 4 !== 0) {
            urlsafecleaned += "=";
        }

        function base64tobytes(b64) {
            const binarystring = atob(b64);
            const bytes = new Uint8Array(binarystring.length);
            for (let i = 0; i < binarystring.length; i++) {
                bytes[i] = binarystring.charCodeAt(i);
            }
            return bytes;
        }
        function trydecode(b64) {
            let bytes = base64tobytes(b64);
            if (bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b) {
                if (typeof fflate === "undefined") {
                    throw new Error("gzip data detected but fflate.js isn't loaded..");
                }
                try {
                    bytes = fflate.decompressSync(bytes);
                } catch (decompError) {
                    throw new Error(`gzip decompression failed?! ${decompError.message || decompError}`);
                }
            }
            const decoder = new TextDecoder("utf-8");
            let decoded = decoder.decode(bytes);
            decoded = decoded.trim();
            if (decoded.charCodeAt(0) === 0xFEFF) {decoded = decoded.slice(1)}
            return decoded;
        }

        try {
            return trydecode(urlsafecleaned);
        } catch (e) {
            try {
                let standardcleaned = cleaned;
                while (standardcleaned.length % 4 !== 0) {
                    standardcleaned += "=";
                }
                return trydecode(standardcleaned);
            } catch (e2) {
                throw new Error("invalid base64 string :(");
            }
        }
    }

    function analyzexml(xml) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(xml, "text/xml");
            const objectslayer = doc.querySelector("layer[name='Objects']");
            const objectcount = objectslayer ? objectslayer.children.length : 0;
            return {charcount: xml.length, objectcount, gzippedBytes: null};
        } catch (error) {
            console.warn("analysis error:", error);
            return {charcount: xml.length, objectcount: 0, gzippedBytes: null};
        }
    }

    async function calculategzipped(xml) {
        try {
            const encoder = new TextEncoder();
            const inputbytes = encoder.encode(xml);

            if (typeof fflate !== "undefined" && typeof fflate.gzipSync === "function") {
                const compressed = fflate.gzipSync(inputbytes);
                return compressed.length;
            }

            if (typeof CompressionStream !== "function") {return null}
            const cs = new CompressionStream("gzip");
            const writer = cs.writable.getWriter();
            await writer.write(inputbytes);
            await writer.close();
            const chunks = [];
            const reader = cs.readable.getReader();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (value) chunks.push(value);
            }
            let totallength = 0;
            for (const chunk of chunks) {totallength += chunk.byteLength}
            return totallength;
        } catch (error) {return null}
    }

    function updatestatsfromxml(xml) {
        lateststats = analyzexml(xml);
        updatedetails();
        void calculategzipped(xml).then((size) => {
            if (size == null || !lateststats) return;
            lateststats.gzippedBytes = size;
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

    /* xml highlighting */
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
        if (lateststats.gzippedBytes != null && Number.isFinite(lateststats.gzippedBytes)) {
            detailstext.appendChild(document.createElement("br"));
            const gzipline = document.createElement("span");
            gzipline.className = "detailsgzip";
            gzipline.textContent = `${lateststats.gzippedBytes.toLocaleString()} gzipped`;
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
            localStorage.setItem(storage_key, levelbase64);
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
        const link = document.querySelector(".link");
        if (levelbase64) {
            link?.classList.add("active");
        } else {
            link?.classList.remove("active");
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
                const mapElement = doc.querySelector("map");
                if (!mapElement) {
                    throw new Error("xml doesn't contain <map> element");
                }
            } catch (parseErr) {
                throw new Error(`xml validation failed: ${parseErr.message}`);
            }
            const base64 = encodeurl(trimmed);
            setleveldata(base64, showchoice);
        } catch (error) {
            showerror(`Failed to encode level: ${error.message || error}`);
        }
    }

    function normalizetoxml(text) {
        let t = (text || "").trim();
        if (!t) return t;
        const fromjson = (str) => {
            const obj = JSON.parse(str);
            if (window.ctrconversion?.jsonleveltoxml) {
                return window.ctrconversion.jsonleveltoxml(obj);
            }
            return str;
        };
        if (t[0] === "<") return t;
        if (t[0] === "{" || t[0] === "[") {
            try {return fromjson(t)} catch (_) {return t}
        }
        try {
            const decoded = decodebase64utf8(t).trim();
            if (decoded[0] === "{" || decoded[0] === "[") {
                try {return fromjson(decoded)} catch (_) {return decoded}
            }
            return decoded;
        } catch (_) {return t}
    }

    // the NEW(tm)(tm) level code system to fix 16kb errors from github pages
    async function fetchlevelbycode(code) {
        try {
            const response = await fetch(`https://play.candies.monster/api/code/${code}`);
            const contentType = response.headers.get("content-type") || "";
            
            if (!response.ok) {
                let message = `Failed to fetch?! ${response.status}`;
                try {
                    if (contentType.includes("application/json")) {
                        const err = await response.json();
                        if (err && err.error) {
                            message = err.error;
                        }
                    } else {
                        const clonedresponse = response.clone();
                        const text = await clonedresponse.text();
                        if (text && text.trim()) {
                            const trimmed = text.trim();
                            if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
                                try {
                                    const err = JSON.parse(trimmed);
                                    if (err && err.error) {
                                        message = err.error;
                                    }
                                } catch {
                                    message = text.substring(0, 200);
                                }
                            } else {
                                message = text.substring(0, 200);
                            }
                        }
                    }
                } catch (parseerror) {
                    console.warn("error parsing error response 😭 bro 😭😭 what 😭😭😭", parseerror);
                }
                throw new Error(message);
            }
            const text = await response.text();
            return text;
        } catch (error) {
            let errorMessage = error.message;
            if (errorMessage.includes("is not valid JSON") || errorMessage.includes("Unexpected token")) {
                errorMessage = "Failed to load level data?! (invalid format)";
            }
            showerror(`Failed to load level from code?! ${errorMessage}`);
            return null;
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
                            } catch (parseErr) {
                                console.error("xml validation failed?!", parseErr);
                                throw parseErr;
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
        const stored = localStorage.getItem(storage_key);
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

    function generatelinks() {
        if (!levelbase64) return;
        const fullurl = window.location.origin + window.location.pathname + "?data=" + levelbase64;
        const fullurlelem = document.querySelector(".fullurl");
        const shorturlelem = document.querySelector(".shorturl");
        const toolongelem = document.querySelector(".toolong");
        const charcountelem = document.querySelector(".linkcharcount");
        
        if (fullurlelem) {
            const cleanurl = fullurl.replace(/^https?:\/\//, '');
            const croppedurl = cleanurl.length > 50 ? cleanurl.substring(0, 50) + '...' : cleanurl;
            fullurlelem.textContent = croppedurl;
            fullurlelem.href = fullurl;
            
            const urlbytes = new TextEncoder().encode(fullurl).length;
            const urlchars = fullurl.length;
            
            if (toolongelem) {
                if (urlbytes > 16384) {
                    toolongelem.style.display = "flex";
                } else {
                    toolongelem.style.display = "none";
                }
            }
            if (charcountelem) {
                charcountelem.textContent = `${urlchars.toLocaleString()} chars (${(urlbytes / 1024).toFixed(2)}kb)`;
            }
        }

        if (shorturlelem) {
            shorturlelem.textContent = "Loading...";
            shorturlelem.href = "";
            requestshorten(levelbase64);
        }
    }

    function requestshorten(b64data) {
        const shorturl = document.querySelector(".shorturl");
        if (!shorturl) return;
        
        const cachedcode = getcachedshortcode(b64data);
        
        if (cachedcode) {
            const shortened = `https://play.candies.monster/${cachedcode}`;
            const displayshorturl = shortened.replace(/^https?:\/\//, '');
            shorturl.textContent = displayshorturl;
            shorturl.href = shortened;
            return;
        }
        
        fetch(`https://play.candies.monster/?data=${b64data}`)
            .then(response => response.json())
            .then(data => {
                if (data.shortened) {
                    const displayshorturl = data.shortened.replace(/^https?:\/\//, '');
                    shorturl.textContent = displayshorturl;
                    shorturl.href = data.shortened;
                    const code = data.shortened.split("/").pop();
                    if (code) {
                        setcachedshortcode(b64data, code);
                    }
                } else if (data.error) {
                    shorturl.textContent = "Rate limited :(";
                    shorturl.href = "";
                } else {
                    shorturl.textContent = "Error";
                    shorturl.href = "";
                }
            })
            .catch(error => {
                shorturl.textContent = "Error";
                shorturl.href = "";
            });
    }

    function copyurl(element) {
        if (!element) return;
        
        let text = "";
        if (element.tagName && element.tagName.toLowerCase() === "a" && element.href) {
            text = element.href;
        } else {
            text = element.value || element.textContent || "";
        }
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
            }).catch(() => {});
        } else if (element.select) {
            element.select();
            element.setSelectionRange(0, 99999);
            document.execCommand("copy");
        }
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

    function buildgameurl(path) {
        const url = new URL(path, window.location.origin);
        if (levelbase64) {url.searchParams.set("data", levelbase64)}
        if (levelnomusic) {url.searchParams.set("nomusic", "")}
        if (levelcandy) {url.searchParams.set("candy", levelcandy)}
        if (leveljolly) {url.searchParams.set("jolly", "")}
        if (levelbackground != null) {url.searchParams.set("background", String(levelbackground))}
        url.searchParams.set("_", Date.now().toString());
        return url.toString();
    }

    const YOURTOOLONG = document.querySelector(".YOURTOOLONG");
    const URLBYTELIMIT = 16384;
    let opengameseq = 0;
    let gameopening = false;

    function probablytoolong(doc) {
        if (!doc) return false;
        try {
            const title = (doc.title || "").toLowerCase();
            const body = (doc.body && doc.body.innerText || "").toLowerCase();
            return /\b(431|414)\b/.test(title + " " + body) ||
                   /request header fields too large|uri too long|too long/.test(title + " " + body);
        } catch (_) {return false}
    }

    async function opengame(game) {
        if (!levelbase64) {
            showdatapanel();
            return;
        }
        // in case paths need to be changed the index list is here
        const sources = {
            dx: "/preview/dx/dist/wwwroot/index.html",
            h5dx: "/preview/h5dx/dist/index.html",
            famobi: "/preview/famobi/index.html",
        };
        const path = sources[game];
        if (!path) return;
        gameopening = true;
        try {
            localStorage.setItem(game_version_key, game);
        } catch (storageerror) {
            console.warn("storage error:", storageerror);
        }
        const url = buildgameurl(path);
        const urlbytes = new TextEncoder().encode(url).length;
        closebtn.classList.add("active");
        document.body.classList.add("playing");
        choicepanel?.classList.add("hidden");
        datapanel?.classList.remove("show");

        const seq = ++opengameseq;
        const showtoolong = () => {
            if (seq !== opengameseq) return;
            YOURTOOLONG?.classList.add("active");
            frame.classList.remove("active");
            if (frame.src !== "about:blank") {frame.src = "about:blank"}
        };

        if (urlbytes > URLBYTELIMIT) {
            showtoolong();
            return;
        }

        let toolong = false;
        try {
            const resp = await fetch(url, {method: "GET", cache: "no-store", credentials: "same-origin"});
            if (resp.status === 414 || resp.status === 431) toolong = true;
        } catch (_) {}
        if (seq !== opengameseq) return;
        if (toolong) {
            showtoolong();
            return;
        }

        const onframeload = () => {
            if (seq !== opengameseq) return;
            try {
                if (probablytoolong(frame.contentDocument)) showtoolong();
            } catch (_) {}
        };
        if (frame._toolongcheck) {
            frame.removeEventListener("load", frame._toolongcheck);
        }
        frame._toolongcheck = onframeload;
        frame.addEventListener("load", onframeload);

        YOURTOOLONG?.classList.remove("active");
        frame.src = url;
        frame.classList.add("active");
    }

    function closegame() {
        gameopening = false;
        frame.classList.remove("active");
        closebtn.classList.remove("active");
        YOURTOOLONG?.classList.remove("active");
        document.body.classList.remove("playing");
        if (levelbase64) {
            if (nopicker) {
                datapanel?.classList.add("show");
                choicepanel?.classList.add("hidden");
            } else {
                choicepanel?.classList.remove("hidden");
            }
        }
        if (frame.src !== "about:blank") {
            frame.src = "about:blank";
        }
        try {
            localStorage.removeItem(game_version_key);
        } catch (_) {}
    }

    closebtn.addEventListener("click", () => {
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
            localStorage.removeItem(storage_key);
            localStorage.removeItem(game_version_key);
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

    // error stuff (vee two)
    function formaterrorarguments(args) {
        return args
            .map((arg) => {
                if (typeof arg === "string") return arg;
                try {
                    return JSON.stringify(arg);
                } catch (_) {
                    return String(arg);
                }
            })
            .join(" ");
    }

    function playfatalalert() {
        if (!oopsaudio) return;
        if (oopsaudio.dataset.active) return;
        oopsaudio.dataset.active = "true";
        oopsaudio.currentTime = 0;
        oopsaudio.play().catch(() => {});
    }

    function hidefatalalert() {
        if (oopsaudio) {
            delete oopsaudio.dataset.active;
        }
        fatalel.classList.remove("active");
        fatalactive = false;
        errorentries.forEach((entry) => {
            if (entry.fadetimeout) {
                clearTimeout(entry.fadetimeout);
                entry.fadetimeout = null;
            }
            if (entry.element && entry.element.classList.contains("fading")) {
                entry.element.classList.remove("fading");
            }
        });
    }

    function showerror(message) {
        const clean = message;
        const now = Date.now();
        
        try {window.parent.postMessage({type: "errorlog", message: clean}, "*")}
        catch (e) {}
        
        let entry = errorentries.get(clean);
        if (!entry) {
            const el = document.createElement("div");
            el.textContent = clean;
            errorsel.appendChild(el);
            entry = { count: 1, element: el, timestamps: [now], fadetimeout: null };
            errorentries.set(clean, entry);
        } else {
            entry.count += 1;
            entry.timestamps = entry.timestamps.filter((ts) => now - ts < 1000);
            entry.timestamps.push(now);
            entry.element.textContent = `(${entry.count}) ${clean}`;
            if (entry.fadetimeout) {
                clearTimeout(entry.fadetimeout);
                entry.fadetimeout = null;
            }
            if (entry.element.classList.contains("fading")) {
                entry.element.classList.remove("fading");
            }
        }

        if (!fatalactive) {
            entry.fadetimeout = window.setTimeout(() => {
                if (entry.element && !fatalactive) {
                    entry.element.classList.add("fading");
                    entry.fadetimeout = window.setTimeout(() => {
                        if (entry.element && entry.element.parentNode) {
                            entry.element.remove();
                        }
                        errorentries.delete(clean);
                    }, 500);
                }
            }, 5000);
        }

        if (entry.timestamps.length >= 5) {
            fatalactive = true;
            fatalel.classList.add("active");
            playfatalalert();
            errorentries.forEach((e) => {
                if (e.fadetimeout) {
                    clearTimeout(e.fadetimeout);
                    e.fadetimeout = null;
                }
                if (e.element && e.element.classList.contains("fading")) {
                    e.element.classList.remove("fading");
                }
            });
            clearTimeout(fataltimeout);
            fataltimeout = window.setTimeout(() => {
                hidefatalalert();
            }, 1000);
        }
    }

    const ogerror = console.error;
    console.error = function (...args) {
        ogerror.apply(console, args);
        showerror(formaterrorarguments(args));
    };
    window.addEventListener("error", (event) => {
        showerror(`${event.error?.name || "Error"}: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`);
    });
    window.addEventListener("unhandledrejection", (event) => {
        showerror(`Unhandled Promise Rejection: ${event.reason}`);
    });
    window.addEventListener("message", (event) => {
        if (event.origin !== window.location.origin) return;
        const data = event.data;
        if (!data || data.source !== "preview-game" || !data.message) return;
        const prefix = data.game ? `[${data.game}] ` : "";
        showerror(prefix + data.message);
    });

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
