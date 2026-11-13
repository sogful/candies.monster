import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../overlay/src/CutTheRopeDX.Browser/wwwroot/aspect.js", import.meta.url), "utf8");

function create(saved, blocked = false) {
    const styles = new Map();
    const storage = new Map([["ctrdxaspect", saved]]);
    const context = {
        document: {documentElement: {style: {setProperty: (name, value) => styles.set(name, value)}}},
        localStorage: {
            getItem: key => {if (blocked) throw new Error("blocked"); return storage.get(key)},
            setItem: (key, value) => {if (blocked) throw new Error("blocked"); storage.set(key, value)},
        },
    };
    vm.runInNewContext(source, context);
    return {api: context.ctrdxaspect, styles, storage};
}

/*//////////////////////////////////////////////////////////////////////*/

test("new or invalid preferences start at 16:9 and valid choices survive new visits", () => {
    for (const saved of [null, "", "wrong", "__proto__"]) assert.equal(create(saved).api.get(), "16:9");
    for (const ratio of ["16:9", "4:3", "9:16", "Dynamic"]) {
        const first = create(null);
        first.api.set(ratio);
        assert.equal(first.api.get(), ratio);
        assert.equal(create(first.storage.get("ctrdxaspect")).api.get(), ratio);
        if (ratio === "Dynamic") {
            assert.equal(first.styles.get("--previewwidth"), "none");
            assert.equal(first.styles.get("--previewheight"), "none");
        } else {
            const [width, height] = ratio.split(":");
            assert.equal(first.styles.get("--previewwidth"), `calc(100vh * ${width} / ${height})`);
            assert.equal(first.styles.get("--previewheight"), `calc(100vw * ${height} / ${width})`);
        }
    }
});

test("blocked storage keeps ratio switching usable and invalid values cannot replace it", () => {
    const current = create(null, true);
    current.api.set("9:16");
    current.api.set("constructor");
    assert.equal(current.api.get(), "9:16");
    assert.equal(current.styles.get("--previewheight"), "calc(100vw * 16 / 9)");
});
