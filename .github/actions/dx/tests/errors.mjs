import {readFileSync} from "node:fs";
import vm from "node:vm";
import test from "node:test";
import assert from "node:assert/strict";

const source = readFileSync(new URL("../overlay/src/CutTheRopeDX.Browser/wwwroot/previewerrors.js", import.meta.url), "utf8");

/*//////////////////////////////////////////////////////////////////////*/

test("native failures retain details, nonce and origin without forwarding warnings", () => {
    const messages = [];
    const logs = [];
    const context = {
        URLSearchParams,
        location: {search: "?playtest=testnonce", origin: "https://candies.monster"},
        parent: {postMessage: (message, origin) => messages.push({message, origin})},
        console: {
            log: (...values) => logs.push(values),
            error: (...values) => logs.push(values),
            warn: (...values) => logs.push(values)
        }
    };
    vm.runInNewContext(source, context);
    context.console.log("boot complete");
    context.console.warn("ctrdx-frame-error: warning only");
    assert.equal(messages.length, 0);
    context.console.log("ctrdx-frame-error: missing texture\nGameScene.Initialize");
    context.console.log("ctrdx-frame-error: missing texture\nGameScene.Initialize");
    assert.equal(messages.length, 1);
    assert.equal(messages[0].message.message, "ctrdx-frame-error: missing texture\nGameScene.Initialize");
    assert.equal(messages[0].message.nonce, "testnonce");
    assert.equal(messages[0].origin, "https://candies.monster");
    context.ctrdxpreviewerror("x".repeat(9000));
    assert.equal(messages[1].message.message.length, 8192);
    context.ctrdxpreviewerror({message: "invalid"});
    assert.equal(messages.length, 2);
    for (let count = 0; count < 50; count++) context.ctrdxpreviewerror("failure " + count);
    assert.equal(messages.length, 32);
    assert.equal(logs.length, 4);
});
