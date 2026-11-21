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


/*//////////////////////////////////////////////////////////////////////*/

test("image preload retries a failed response body and falls back when a preset image is missing", async () => {
    const root = "../../../../preview/dx/dist/wwwroot/";
    const fetchsource = readFileSync(new URL(root + "fetch.js", import.meta.url), "utf8");
    const bytes = readFileSync(new URL(root + "content/medium/images/hud_ui.webp", import.meta.url));
    const file = "./content/images/hud_ui.webp";
    const preset = "./content/medium/images/hud_ui.webp";
    const responses = [
        {ok: true, arrayBuffer: async () => {throw new TypeError("interrupted body")}},
        new Response(bytes),
        new Response(null, {status: 404}),
        new Response(bytes),
        new Response("<html>unexpected success page</html>"),
        new Response("<html>unexpected success page</html>"),
        new Response(null, {status: 503})
    ];
    const calls = [];
    const context = {
        ctrdxquality: {url: () => preset},
        fetch: async (url, options) => {
            calls.push([url, options?.cache]);
            return responses.shift();
        }
    };
    vm.runInNewContext(fetchsource.replace(/^import.*\n/m, "").replace(/^export /gm, "")
        + "\nObject.assign(globalThis, {fetchBytes, takeStashed, failure: () => assetloadfailure});", context);
    assert.equal(await context.fetchBytes(file), bytes.length);
    const output = new Uint8Array(bytes.length);
    assert.equal(context.takeStashed(file, output), bytes.length);
    assert.deepEqual(Buffer.from(output), bytes);
    assert.equal(await context.fetchBytes(file), bytes.length);
    assert.equal(context.failure(), null);
    assert.equal(await context.fetchBytes(file), -1);
    assert.equal(responses.length, 0);
    assert.deepEqual(calls, [
        [preset, undefined], [preset, "reload"],
        [preset, undefined], [file, undefined],
        [preset, undefined], [preset, "reload"], [file, undefined]
    ]);
    assert.equal(diagnostic("boot-error: Error: " + context.failure().message),
        "boot-error: Error asset: images/hud_ui.webp\nreason: asset request failed\nstatus: 503");
    assert.equal(diagnostic("boot-error: Error: Could not preload content 'images/hud_ui.webp'.\nreason: asset request failed\nstatus: 503 private"),
        "boot-error: Error asset: images/hud_ui.webp\nreason: asset request failed");
});
