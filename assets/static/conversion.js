// xml <-> json
// this is messy, don't mind the two lists for now

(function() {
    const idmapping = {
        xmltojson: {
            "candy": 52,
            "candyl": 50,
            "candyr": 51,
            "target": 2,
            "star": 3,
            "bubble": 54,
            "pump": 55,
            "sock": 56,
            "spike2": 58,
            "spike3": 80,
            "gravityswitch": 53,
            "spike4": 60,
            "electro": 80,
            "bouncer1": 81,
            "rotatedcircle": 120,
            "ghost": 130,
            "steamtube": 131,
            "lantern": 132,
            "gap": 133,
            "lightbulb": 134,
            "transporter": 135,
            "hiddenelement": 300,
            "grab": 100,

            "tutorialtext": 4,
            "tutorial01": 5,
            "tutorial1": 5,
            "tutorial02": 6,
            "tutorial2": 6,
            "tutorial03": 7,
            "tutorial3": 7,
            "tutorial04": 8,
            "tutorial4": 8,
            "tutorial05": 9,
            "tutorial5": 9,
            "tutorial06": 10,
            "tutorial6": 10,
            "tutorial07": 11,
            "tutorial7": 11,
            "tutorial08": 12,
            "tutorial8": 12,
            "tutorial09": 13,
            "tutorial9": 13,
            "tutorial10": 14,
            "tutorial11": 15,
            "tutorial12": 16,
            "tutorial13": 17,
            "tutorial14": 18,

            "spike": 57,
            "spike1": 59
        },
        jsontoxml: {
            "52": "candy",
            "50": "candyL",
            "51": "candyR",
            "2": "target",
            "3": "star",
            "54": "bubble",
            "55": "pump",
            "56": "sock",
            "58": "spike2",
            "80": "spike3",
            "53": "gravityswitch",
            "60": "spike4",
            "81": "bouncer1",
            "120": "rotatedcircle",
            "130": "ghost",
            "131": "steamtube",
            "132": "lantern",
            "133": "gap",
            "134": "lightbulb",
            "135": "transporter",
            "300": "hiddenelement",
            "100": "grab",

            "4": "tutorialtext",
            "5": "tutorial01",
            "6": "tutorial02",
            "7": "tutorial03",
            "8": "tutorial04",
            "9": "tutorial05",
            "10": "tutorial06",
            "11": "tutorial07",
            "12": "tutorial08",
            "13": "tutorial09",
            "14": "tutorial10",
            "15": "tutorial11",
            "16": "tutorial12",
            "17": "tutorial13",
            "18": "tutorial14",

            "57": "spike",
            "59": "spike1"
        }
    };
    function objectid(value, fallback) {
        if (value == null || value === "") {
            return fallback;
        }
        const parsed = parseInt(value, 10);
        return Number.isNaN(parsed) ? fallback : parsed;
    }
    function specialattributes(ctrobject, tagname, obj) {
        if (tagname === "star") {
            ctrobject.timeout = parseInt(obj.getAttribute("timeout")) || -1;
        }
        if (tagname === "pump") {
            ctrobject.angle = parseInt(obj.getAttribute("angle")) || 0;
        }
        if (tagname === "sock") {
            ctrobject.angle = parseInt(obj.getAttribute("angle")) || 0;
            ctrobject.group = parseInt(obj.getAttribute("group")) || 0;
        }
        if (tagname === "spike2" || tagname === "spike" || tagname === "spike1" || tagname === "spike4" || tagname === "bouncer1") {
            ctrobject.angle = parseInt(obj.getAttribute("angle")) || 0;
            ctrobject.size = parseInt(obj.getAttribute("size")) || 1;
        }
        if (tagname === "spike3" || tagname === "electro") {
            ctrobject.angle = parseInt(obj.getAttribute("angle")) || 0;
            ctrobject.size = parseInt(obj.getAttribute("size")) || (tagname === "electro" ? 5 : 1);
            ctrobject.initialDelay = parseFloat(obj.getAttribute("initialDelay")) || 0;
            ctrobject.offTime = parseFloat(obj.getAttribute("offTime")) || (tagname === "electro" ? 3 : 0);
            ctrobject.onTime = parseFloat(obj.getAttribute("onTime")) || (tagname === "electro" ? 2 : 0);
            ctrobject.toggled = false;
            if (obj.getAttribute("path")) ctrobject.path = obj.getAttribute("path");
            if (obj.getAttribute("rotateSpeed")) ctrobject.rotateSpeed = parseInt(obj.getAttribute("rotateSpeed"));
        }
        if (tagname === "spike4") {
            ctrobject.toggled = parseInt(obj.getAttribute("toggled")) || 0;
        }
        if (tagname === "rotatedcircle") {
            ctrobject.oneHandle = obj.getAttribute("oneHandle") === "true";
            const rotatedCircleSize = objectid(obj.getAttribute("size"), 100);
            ctrobject.size = rotatedCircleSize;
            ctrobject.handleAngle = objectid(obj.getAttribute("handleAngle"), 0);
        }
        if (tagname === "ghost") {
            ctrobject.angle = parseInt(obj.getAttribute("angle")) || 0;
            ctrobject.radius = parseInt(obj.getAttribute("radius")) || 100;
            ctrobject.bouncer = obj.getAttribute("bouncer") === "true";
            ctrobject.bubble = obj.getAttribute("bubble") === "true";
            ctrobject.grab = obj.getAttribute("grab") === "true";
        }
        if (tagname === "steamtube") {
            ctrobject.angle = parseInt(obj.getAttribute("angle")) || 0;
        }
        if (tagname === "lantern") {
            ctrobject.candyCaptured = obj.getAttribute("candyCaptured") === "true";
        }
        if (tagname === "gap") {
            ctrobject.angle = parseInt(obj.getAttribute("angle")) || 0;
            ctrobject.activeTime = parseFloat(obj.getAttribute("activeTime")) || 2;
            ctrobject.radius = parseInt(obj.getAttribute("radius")) || 50;
            ctrobject.index = parseInt(obj.getAttribute("index")) || 1;
        }
        if (tagname === "lightbulb") {
            ctrobject.litRadius = parseInt(obj.getAttribute("litRadius")) || 10;
            ctrobject.bulbNumber = obj.getAttribute("bulbNumber") || "first";
        }
        if (tagname === "transporter") {
            ctrobject.angle = parseInt(obj.getAttribute("angle")) || 0;
            ctrobject.direction = obj.getAttribute("direction") || "forward";
            ctrobject.type = obj.getAttribute("type") || "manual";
            ctrobject.width = parseInt(obj.getAttribute("width")) || 50;
            ctrobject.length = parseInt(obj.getAttribute("length")) || 100;
            ctrobject.velocity = parseInt(obj.getAttribute("velocity")) || 0;
        }
        if (tagname === "hiddenelement") {
            ctrobject.radius = parseInt(obj.getAttribute("radius")) || 30;
        }
        if (tagname === "grab") {
            ctrobject.spider = obj.getAttribute("spider") === "true";
            ctrobject.gun = obj.getAttribute("gun") === "true";
            ctrobject.wheel = obj.getAttribute("wheel") === "true";
            ctrobject.part = obj.getAttribute("part") || "L";
            ctrobject.hidePath = obj.getAttribute("hidePath") !== "false";
            ctrobject.moveOffset = parseInt(obj.getAttribute("moveOffset")) || 0;
            ctrobject.moveVertical = obj.getAttribute("moveVertical") === "true";
            ctrobject.length = parseInt(obj.getAttribute("length")) || 90;
            ctrobject.moveLength = parseInt(obj.getAttribute("moveLength")) || -1;
            const grabRadiusAttr = obj.getAttribute("radius");
            let grabRadius = objectid(grabRadiusAttr, Number.NaN);
            if (Number.isNaN(grabRadius)) {
                grabRadius = objectid(obj.getAttribute("size"), Number.NaN);
            }
            ctrobject.radius = Number.isNaN(grabRadius) ? -1 : grabRadius;
            ctrobject.kickable = obj.getAttribute("kickable") === "true";
            ctrobject.kicked = obj.getAttribute("kicked") === "true";
            ctrobject.invisible = obj.getAttribute("invisible") === "true";
            ctrobject.helicopter = obj.getAttribute("helicopter") === "true";
            ctrobject.bindBulb = obj.getAttribute("bindBulb") === "true";
            const grabbulbnumberattr = obj.getAttribute("bulbNumber");
            if (grabbulbnumberattr != null && grabbulbnumberattr !== "") {
                ctrobject.bulbNumber = grabbulbnumberattr;
            }
            if (ctrobject.spider) {
                ctrobject.gun = false; 
                ctrobject.wheel = false;
            }
        }
        if (tagname.indexOf("tutorial") === 0) {
            ctrobject.locale = obj.getAttribute("locale") || "en";
        }

        if (tagname === "tutorial03" || tagname === "tutorial3") {
            ctrobject.rotateSpeed = parseInt(obj.getAttribute("rotateSpeed")) || 100;
        }
        if (tagname === "tutorial04" || tagname === "tutorial4") {
            ctrobject.rotateSpeed = parseInt(obj.getAttribute("rotateSpeed")) || 100;
        }
        if (tagname === "tutorialtext") {
            ctrobject.text = obj.getAttribute("text") || "";
            ctrobject.width = parseInt(obj.getAttribute("width")) || 100;
            ctrobject.height = parseInt(obj.getAttribute("height")) || 60;
        }
        if (tagname === "tutorial07" || tagname === "tutorial7") {
            ctrobject.rotateSpeed = parseInt(obj.getAttribute("rotateSpeed")) || 100;
        }
        if (tagname === "tutorial10") {
            ctrobject.special = parseInt(obj.getAttribute("special")) || 2;
            ctrobject.rotateSpeed = parseInt(obj.getAttribute("rotateSpeed")) || 100;
        }
        
        const rawsizeattribute = obj.getAttribute("size");
        if (
            rawsizeattribute != null &&
            rawsizeattribute !== "" &&
            (ctrobject.size === undefined || ctrobject.size === null)
        ) {
            const parsedSize = objectid(rawsizeattribute, Number.NaN);
            if (!Number.isNaN(parsedSize)) {
                ctrobject.size = parsedSize;
            }
        }
        if (obj.getAttribute("path")) ctrobject.path = obj.getAttribute("path");
        if (obj.getAttribute("moveSpeed")) ctrobject.moveSpeed = parseInt(obj.getAttribute("moveSpeed"));
    }
    window.ctrconversion = {
        getidmapping: () => idmapping,
        objectid: objectid,
        specialattributes: specialattributes
    };
})();

