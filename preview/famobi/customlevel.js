/*//////////////////////////////////////////////////////////////////////*/
// bridge between preview/index.html and the famobi engine.
// reads ?data= (raw xml, base64 xml, or gzipped+base64 xml), converts to
// the engine's json level format and parks it on window.customleveldata
// for BoxLevelData.get() to pick up.
/*//////////////////////////////////////////////////////////////////////*/

(function () {

    function postpreview(kind, message) {
        try {
            if (window.parent && window.parent !== window) {
                window.parent.postMessage({
                    source: "preview-game",
                    kind, game: "famobi", message,
                }, "*");
            }
        } catch (_) {}
    }

    function formaterrorarguments(args) {
        return args.map((arg) => {
            if (typeof arg === "string") return arg;
            try {return JSON.stringify(arg)}
            catch (_) {return String(arg)}
        }).join(" ");
    }

    const ogerror = console.error;
    console.error = function (...args) {
        ogerror.apply(console, args);
        postpreview("console-error", formaterrorarguments(args));
    };
    window.addEventListener("error", (event) => {
        postpreview("window-error",
            `${event.error?.name || "Error"}: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`);
    });
    window.addEventListener("unhandledrejection", (event) => {
        postpreview("unhandled-rejection", `Unhandled Promise Rejection: ${event.reason}`);
    });

    /*//////////////////////////////////////////////////////////////////////*/

    function decodebase64utf8(str) {
        let cleaned = str.replace(/\s/g, "").replace(/-/g, "+").replace(/_/g, "/");
        while (cleaned.length % 4 !== 0) cleaned += "=";

        const binary = atob(cleaned);
        let bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

        if (bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b) {
            if (typeof fflate === "undefined") {
                throw new Error("gzip data detected but fflate.js isn't loaded..");
            }
            bytes = fflate.decompressSync(bytes);
        }

        let decoded = new TextDecoder("utf-8").decode(bytes).trim();
        if (decoded.charCodeAt(0) === 0xFEFF) decoded = decoded.slice(1);
        return decoded;
    }

    /*//////////////////////////////////////////////////////////////////////*/

    function convertxmltojson(xmlstring) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlstring, "text/xml");
        if (doc.querySelector("parsererror")) {
            throw new Error("invalid xml structure");
        }
        const mapelement = doc.querySelector("map");
        if (!mapelement) throw new Error("no <map> element found in xml");

        const level = {settings: [], objects: []};

        const settingslayer = mapelement.querySelector("layer[name='settings']");
        if (settingslayer) {
            const mapsettings = settingslayer.querySelector("map");
            if (mapsettings) {
                level.settings.push({
                    name: 0,
                    height: parseInt(mapsettings.getAttribute("height")) || 480,
                    gridSize: parseInt(mapsettings.getAttribute("gridSize")) || 32,
                    width: parseInt(mapsettings.getAttribute("width")) || 320
                });
            }
            const gamedesign = settingslayer.querySelector("gameDesign");
            if (gamedesign) {
                const gamedesignsettings = {
                    name: 1,
                    ropePhysicsSpeed: parseFloat(gamedesign.getAttribute("ropePhysicsSpeed")) || 1,
                    special: parseInt(gamedesign.getAttribute("special")) || 1,
                    twoParts: gamedesign.getAttribute("twoParts") === "true"
                };
                // still no idea what special does, take a gamble
                gamedesignsettings.special = 2;
                if (gamedesign.getAttribute("twoParts") !== "true") delete gamedesignsettings.twoParts;
                if (gamedesign.getAttribute("nightLevel")) gamedesignsettings.nightLevel = gamedesign.getAttribute("nightLevel") === "true";
                if (gamedesign.getAttribute("water")) gamedesignsettings.water = parseInt(gamedesign.getAttribute("water"));
                if (gamedesign.getAttribute("waterSpeed")) gamedesignsettings.waterSpeed = parseInt(gamedesign.getAttribute("waterSpeed"));
                level.settings.push(gamedesignsettings);
            }
        }

        const objectlayer = mapelement.querySelector("layer[name='Objects']");
        if (objectlayer) {
            const objects = objectlayer.querySelectorAll("*");
            objects.forEach((obj) => {
                const tagname = obj.tagName.toLowerCase();
                const x = parseInt(obj.getAttribute("x")) || 0;
                const y = parseInt(obj.getAttribute("y")) || 0;
                const ctrobject = {name: 0, x, y};

                const idmapping = window.ctrconversion?.getidmapping();
                const jsonid = idmapping?.xmltojson?.[tagname];
                if (jsonid === undefined) {
                    console.warn("undefined object type, skipping:", tagname);
                    return;
                }
                ctrobject.name = jsonid;

                if (window.ctrconversion?.specialattributes) {
                    window.ctrconversion.specialattributes(ctrobject, tagname, obj);
                }
                if (obj.getAttribute("path")) ctrobject.path = obj.getAttribute("path");
                if (obj.getAttribute("moveSpeed")) ctrobject.moveSpeed = parseInt(obj.getAttribute("moveSpeed"));

                level.objects.push(ctrobject);
            });
        }

        if (level.settings.length === 0) {
            console.warn("no settings? adding defaults");
            level.settings = [
                {name: 0, height: 480, gridSize: 32, width: 320},
                {name: 1, ropePhysicsSpeed: 1, special: 1, twoParts: false}
            ];
        }

        // engine assumes a hidden bonus star (name 300) always exists and
        // crashes on update if not. inject an off-the-way one if missing.
        if (!level.objects.some((o) => o.name === 300)) {
            level.objects.push({name: 300, x: 1, y: 1});
        }
        return level;
    }

    /*//////////////////////////////////////////////////////////////////////*/

    function cleanurl() {
        const url = new URL(window.location);
        url.searchParams.delete("data");
        window.history.replaceState({}, "", url.toString());
    }

    function loadfromurl() {
        const dataparam = new URLSearchParams(window.location.search).get("data");
        if (!dataparam) return null;
        try {
            let raw = dataparam;
            try {
                const urldecoded = decodeURIComponent(raw);
                if (urldecoded && urldecoded !== raw) raw = urldecoded;
            } catch (_) {}

            let xml;
            const trimmed = raw.trim();
            if (trimmed.startsWith("<")) {
                xml = trimmed;
            } else {
                xml = decodebase64utf8(trimmed);
            }
            const level = convertxmltojson(xml);
            cleanurl();
            return level;
        } catch (error) {
            console.error("custom level load failed:", error.message || error);
            cleanurl();
            return null;
        }
    }

    const level = loadfromurl();
    if (level) {
        window.customleveldata = level;
    }
})();
