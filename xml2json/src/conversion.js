function convertxmltojson(xmlstring) {
    try {
        const parser = new DOMParser();
        const xmldoc = parser.parseFromString(xmlstring, "text/xml");
        const mapelement = xmldoc.querySelector("map");

        if (!mapelement) {
            throw new Error("no <map> element found in xml");
        }
        const level = {
            settings: [],
            objects: []
        };

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

                gamedesignsettings.special = 2;

                if (gamedesign.getAttribute("twoParts") !== "true") {
                    delete gamedesignsettings.twoParts;
                }

                if (gamedesign.getAttribute("nightLevel")) gamedesignsettings.nightLevel = gamedesign.getAttribute("nightLevel") === "true";
                if (gamedesign.getAttribute("water")) gamedesignsettings.water = parseInt(gamedesign.getAttribute("water"));
                if (gamedesign.getAttribute("waterSpeed")) gamedesignsettings.waterSpeed = parseInt(gamedesign.getAttribute("waterSpeed"));

                level.settings.push(gamedesignsettings);
            }
        }

        const objectlayer = mapelement.querySelector("layer[name='Objects']");
        if (objectlayer) {
            const objects = objectlayer.querySelectorAll("*");
            let objectcount = 0;

            objects.forEach(obj => {
                const tagname = obj.tagName.toLowerCase();
                const x = parseInt(obj.getAttribute("x")) || 0;
                const y = parseInt(obj.getAttribute("y")) || 0;

                let ctrobject = { name: 0, x: x, y: y };

                const idmapping = window.ctrconversion?.getidmapping();
                const jsonid = idmapping?.xmltojson?.[tagname];
                if (jsonid === undefined) {
                    return;
                }
                ctrobject.name = jsonid;

                if (window.ctrconversion?.specialattributes) {
                    window.ctrconversion.specialattributes(ctrobject, tagname, obj);
                }

                level.objects.push(ctrobject); objectcount++;
            });
        }

        if (level.settings.length === 0) {
            level.settings = [
                { name: 0, height: 480, gridSize: 32, width: 320 },
                { name: 1, ropePhysicsSpeed: 1, special: 2 }
            ];
        }

        return level;
    } catch (error) {
        console.error("error while converting:", error);
        throw error;
    }
}

export {convertxmltojson};
