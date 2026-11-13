import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

const source = await fs.readFile(new URL("../../../../src/js/unsupported.js", import.meta.url), "utf8");
const {requiredgame, objectrequirements} = await import("data:text/javascript;base64," + Buffer.from(source).toString("base64"));

test("unsupported games and named forks retain their specific requirements", () => {
    assert.equal(requiredgame({title: "THIS IS FOR ARCHIVECORE"}), "Archivecore");
    assert.equal(requiredgame({description: "https://github.com/SwordJhon/cuttherope-dx"}), "SwordJhon's DX fork");
    assert.equal(requiredgame({tags: [{name: "Cut the Rope 2"}]}), "Cut the Rope 2");
    assert.equal(requiredgame({tags: [{name: "Magic"}]}), "Cut the Rope: Magic");
});

test("missing Time Travel objects and modded switches disable only affected maps", () => {
    for (const type of ["clock", "fan", "laser", "discoball"]) {
        assert.equal(requiredgame({requirements: objectrequirements({objects: [{type}]})}), "Cut the Rope: Time Travel");
    }
    for (const type of ["shieldtrigger", "p_magnetswitcher"]) {
        assert.equal(requiredgame({requirements: objectrequirements({objects: [{type}]})}), "a compatible mod");
    }
    assert.equal(requiredgame({tags: [{name: "Time Travel"}], requirements: objectrequirements({objects: [{type: "bomb"}, {type: "pipe"}, {type: "pauseswitcher"}]})}), "");
});

test("requirement lists are stable and preserve the named mod over generic missing objects", () => {
    const requirements = objectrequirements({objects: [{type: "laser"}, {type: "clock"}, {type: "laser"}, {type: "candy"}]});
    assert.deepEqual(requirements, ["clock", "laser"]);
    assert.equal(requiredgame({title: "Archivecore", requirements}), "Archivecore");
});
