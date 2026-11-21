import {readFileSync} from "node:fs";
import vm from "node:vm";
import test from "node:test";
import assert from "node:assert/strict";
import {diagnostic} from "../../../../src/js/browser/play/diagnostics.js";

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

/*//////////////////////////////////////////////////////////////////////*/

test("startup forwards the exception name and stack to the local crash dialog", () => {
    const html = readFileSync(new URL("../../../../preview/dx/dist/wwwroot/index.html", import.meta.url), "utf8");
    const boot = html.slice(html.indexOf("let reported = false;"), html.indexOf("reload.addEventListener"));
    const messages = [];
    const context = {
        parent: {},
        ctrdxpreviewerror: message => messages.push(message),
        ctrdxStopHint() {}, console: {error() {}}, bubble: {}, start: {}, reload: {},
        splash: {classList: {add() {}, remove() {}}}, document: {getElementById: () => null}
    };
    vm.runInNewContext(boot, context);
    context.ctrdxFail("boot-error", {name: "TypeError", message: "Failed to fetch", stack: "at /preview/dx/dist/wwwroot/fetch.js:10:23"});
    context.ctrdxFail("boot-error", "follow-up failure");
    assert.deepEqual(messages, ["boot-error: TypeError: Failed to fetch\nat /preview/dx/dist/wwwroot/fetch.js:10:23"]);
});

test("reports retain the stage, known reason and shipped code location", () => {
    const message = "boot-error: TypeError: Failed to fetch dynamically imported module: https://example.test/?token=private@example.net\n"
        + "    at PrivateName (https://candies.monster/preview/dx/dist/wwwroot/main.js:55:19)\n"
        + "    at https://example.test/preview/dx/dist/wwwroot/main.js:90:2\n"
        + "    at https://candies.monster/preview/dx/dist/wwwroot/private-name.js:8:4\n"
        + "    at https://candies.monster/preview/dx/dist/wwwroot/main.js?playtest=private:10:8\n"
        + "    at C:\\Users\\PrivateName\\main.js:10:7";
    const expected = "boot-error: TypeError\nreason: module load failed\nphase: loading\nstage: runtime\nquality: Medium\nat /preview/dx/dist/wwwroot/main.js:55:19";
    assert.equal(diagnostic(message, {phase: "loading", stage: "runtime", quality: "Medium", level: "PrivateName"}), expected);
    assert.equal(diagnostic(expected), expected);
    assert.equal(diagnostic("boot-error: unknown\nreason: private@example.net\nstage: private@example.net"), "boot-error:");
    assert.equal(diagnostic("unsupported-error: This browser cannot draw the 3D graphics the game needs."), "unsupported-error:\nreason: webgl unavailable");
    assert.equal(diagnostic("ctrdx-context-lost: simulation paused; reload required", {phase: "gameplay"}),
        "ctrdx-context-lost:\nreason: webgl context lost\nphase: gameplay");
    assert.equal(diagnostic("TypeError: Cannot read properties of undefined (reading 'PrivateName')"), "TypeError\nreason: read from undefined");
    assert.equal(diagnostic("boot-error: Error: System.InvalidOperationException: Could not preload content 'images/obj_bouncer.webp'."),
        "boot-error: System.InvalidOperationException asset: images/obj_bouncer.webp\nreason: asset preload failed");
});
