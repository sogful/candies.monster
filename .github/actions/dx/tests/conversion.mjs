import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await fs.readFile(new URL("../../../../assets/static/js/levels/conversion.js", import.meta.url), "utf8");

function convert(value) {
    const context = {window: {}};
    vm.runInNewContext(source, context);
    return context.window.ctrconversion.jsonleveltoxml(value);
}

/*//////////////////////////////////////////////////////////////////////*/

test("JSON levels use the case-sensitive DX object names", () => {
    const xml = convert({objects: [53, 120, 131, 4].map(name => ({name, x: 10, y: 20}))});
    for (const name of ["gravitySwitch", "rotatedCircle", "steamTube", "tutorialText"]) assert(xml.includes("<" + name + " "));
});

test("JSON conversion preserves scalar map and game settings with escaped values", () => {
    const xml = convert({
        settings: [
            {name: 0, width: 960, height: 720, levelName: 'A "test" & <map>'},
            {name: 1, globalGravityX: 20, globalGravityY: -784, candiesConnected: true, candiesConnectedLength: 50, mapOffsetX: -2, custom_value: "retained", nested: {ignored: true}}
        ],
        objects: [{name: 4, x: -2, y: 0, text: 'say "hello" & <goodbye>'}]
    });
    for (const attribute of ['width="960"', 'height="720"', 'globalGravityX="20"', 'globalGravityY="-784"', 'candiesConnected="true"', 'candiesConnectedLength="50"', 'mapOffsetX="-2"', 'custom_value="retained"']) assert(xml.includes(attribute));
    assert(xml.includes('levelName="A &quot;test&quot; &amp; &lt;map&gt;"'));
    assert(xml.includes('text="say &quot;hello&quot; &amp; &lt;goodbye&gt;"'));
    assert(!xml.includes("nested="));
});

test("minimal and array JSON levels retain default dimensions and physics", () => {
    for (const value of [{}, [{}]]) {
        const xml = convert(value);
        assert(xml.includes('<map gridSize="32" width="320" height="480" />'));
        assert(xml.includes('<gameDesign ropePhysicsSpeed="1" special="1" twoParts="false" />'));
    }
});
