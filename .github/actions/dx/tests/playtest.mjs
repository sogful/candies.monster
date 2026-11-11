import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs/promises";
import path from "node:path";
import {createsession} from "../../../../preview/src/playtest.js";
import {createcontroller} from "../../../../preview/src/game.js";

const storage = new Map();
globalThis.localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
};

/*//////////////////////////////////////////////////////////////////////*/

function nextmessage(channel) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("No playtest response")), 30000);
        channel.addEventListener("message", (event) => {
            clearTimeout(timer);
            resolve(JSON.parse(event.data));
        }, {once: true});
    });
}

test("upstream ready handshake receives the full XML and session cleanup removes storage", async () => {
    const errors = [];
    const session = createsession({onerror: (message) => errors.push(message), onclose: () => {}});
    const game = new BroadcastChannel("ctrdx-playtest");
    try {
        const xml = `<map>${"level data ".repeat(5000)}</map>`;
        const nonce = session.start(xml);
        const stored = JSON.parse(localStorage.getItem("ctrdx-playtest:" + nonce));
        assert.deepEqual(JSON.parse(stored.message), {v: 1, type: "level", nonce, xml});
        const response = nextmessage(game);
        game.postMessage("invalid JSON");
        game.postMessage({v: 1, type: "ready", nonce});
        game.postMessage(JSON.stringify({v: 9, type: "ready", nonce: "another session"}));
        game.postMessage(JSON.stringify({v: 1, type: "ready", nonce, line: "CTRDX_PLAYTEST"}));
        assert.deepEqual(await response, {v: 1, type: "level", nonce, xml});
        const newer = session.start("<map />");
        assert.notEqual(newer, nonce);
        assert.equal(localStorage.getItem("ctrdx-playtest:" + nonce), null);
        assert.deepEqual(errors, []);
    } finally {
        session.close();
        game.close();
    }
    assert.equal(storage.size, 0);
});

test("an embedded DX request stays short for large levels; legacy engines retain their limit", async () => {
    const listeners = new Map();
    globalThis.location = {origin: "https://candies.monster"};
    globalThis.window = {addEventListener: (name, callback) => listeners.set(name, callback)};
    const frame = {src: "about:blank", contentWindow: {}, classList: {add() {}, remove() {}}};
    let closed = 0;
    let toolong = 0;
    const controller = createcontroller({frame, onerror: assert.fail, onclose: () => closed++, ontoolong: () => toolong++});
    const options = {xml: `<map>${" ".repeat(20000)}</map>`, base64: "A".repeat(30000), background: 2, candy: "3"};
    await controller.open("dx", options);
    const url = new URL(frame.src);
    assert.ok(url.searchParams.get("playtest"));
    assert.equal(url.searchParams.has("data"), false);
    assert.equal(url.searchParams.get("background"), "2");
    assert.ok(url.href.length < 250);
    const nonce = url.searchParams.get("playtest");
    const forwarded = [];
    frame.classList.contains = () => true;
    frame.contentWindow.ctrdxPreviewKey = (code, down) => forwarded.push({code, down});
    let prevented = 0;
    const key = {code: "KeyR", target: {}, preventDefault: () => prevented++};
    listeners.get("keydown")(key);
    listeners.get("keyup")(key);
    assert.deepEqual(forwarded, [{code: "KeyR", down: true}, {code: "KeyR", down: false}]);
    assert.equal(prevented, 2);
    listeners.get("keydown")({...key, ctrlKey: true});
    listeners.get("keydown")({...key, target: {isContentEditable: true}});
    assert.equal(forwarded.length, 2);
    listeners.get("keydown")({...key, code: "Space"});
    listeners.get("blur")();
    assert.deepEqual(forwarded.slice(-2), [{code: "Space", down: true}, {code: "Space", down: false}]);
    listeners.get("message")({origin: location.origin, source: {}, data: {type: "ctrdx-exit", nonce}});
    assert.equal(closed, 0);
    listeners.get("message")({origin: location.origin, source: frame.contentWindow, data: {type: "ctrdx-exit", nonce: "old session"}});
    assert.equal(closed, 0);
    listeners.get("message")({origin: location.origin, source: frame.contentWindow, data: {type: "ctrdx-exit", nonce}});
    assert.equal(closed, 1);
    await controller.open("h5dx", options);
    assert.equal(toolong, 1);
    assert.equal(frame.src, "about:blank");
    controller.close();
    assert.equal(storage.size, 0);
});

test("blocked storage falls back to the channel; blocking both reports an actionable error", () => {
    const original = globalThis.localStorage;
    const originalchannel = globalThis.BroadcastChannel;
    const session = createsession({onerror: assert.fail, onclose: () => {}});
    try {
        globalThis.localStorage = {setItem() {throw new Error("blocked")}, removeItem() {throw new Error("blocked")}};
        assert.ok(session.start("<map />"));
        session.close();
        globalThis.BroadcastChannel = class {constructor() {throw new Error("blocked")}};
        assert.throws(() => session.start("<map />"), /Allow site storage/);
    } finally {
        session.close();
        globalThis.localStorage = original;
        globalThis.BroadcastChannel = originalchannel;
    }
});

/*//////////////////////////////////////////////////////////////////////*/

test("embedded loading waits for both readiness signals and rejects unrelated messages", async () => {
    const listeners = new Map();
    globalThis.location = {origin: "https://candies.monster"};
    globalThis.window = {addEventListener: (name, callback) => listeners.set(name, callback)};
    const frame = {src: "about:blank", contentWindow: {}, classList: {add() {}, remove() {}}};
    const progress = [];
    let ready = 0;
    const controller = createcontroller({frame, onerror: assert.fail, onclose() {}, ontoolong: assert.fail, onprogress: value => progress.push(value), onready: () => ready++});
    try {
        await controller.open("dx", {xml: "<map />"});
        const nonce = new URL(frame.src).searchParams.get("playtest");
        const send = (type, extra = {}, source = frame.contentWindow, origin = location.origin) => listeners.get("message")({origin, source, data: {type, nonce, ...extra}});
        send("ctrdx-level-ready", {}, {});
        send("ctrdx-runtime-ready", {}, frame.contentWindow, "https://elsewhere.example");
        send("ctrdx-progress", {percent: 80, nonce: "stale"});
        assert.equal(ready, 0);
        assert.equal(progress.length, 0);
        send("ctrdx-level-ready");
        assert.equal(ready, 0);
        send("ctrdx-progress", {percent: Infinity});
        assert.equal(progress.length, 0);
        send("ctrdx-progress", {percent: 120, stage: "images", loaded: 8, total: 10});
        assert.deepEqual(progress, [{percent: 99, stage: "images", loaded: 8, total: 10}]);
        send("ctrdx-runtime-ready");
        send("ctrdx-level-ready");
        assert.equal(ready, 1);
        controller.close();
        send("ctrdx-runtime-ready");
        assert.equal(ready, 1);
    } finally {controller.close()}
});

test("the published game can read its stored startup level when BroadcastChannel is blocked", async () => {
    const script = process.env.CTRDX_SOURCE
        ? path.join(process.env.CTRDX_SOURCE, "src/CutTheRopeDX.Browser/wwwroot/playtest.js")
        : new URL("../../../../preview/dx/dist/wwwroot/playtest.js", import.meta.url);
    const source = await fs.readFile(script, "utf8");
    const game = await import("data:text/javascript;base64," + Buffer.from(source).toString("base64"));
    const original = globalThis.localStorage;
    const originalchannel = globalThis.BroadcastChannel;
    const message = JSON.stringify({v: 1, type: "level", nonce: "fixture", xml: "<map />"});
    try {
        globalThis.BroadcastChannel = class {constructor() {throw new Error("blocked")}};
        globalThis.localStorage = {getItem: () => JSON.stringify({storedAt: Date.now(), message})};
        assert.doesNotThrow(() => game.open());
        assert.equal(game.storedLevel("fixture"), message);
        assert.doesNotThrow(() => game.post("ready"));
        assert.deepEqual(game.drain(), []);
    } finally {
        globalThis.localStorage = original;
        globalThis.BroadcastChannel = originalchannel;
    }
});

/*//////////////////////////////////////////////////////////////////////*/

test("editor pause actions require an editor session and its current origin, frame and nonce", async () => {
    const listeners = new Map();
    globalThis.location = {origin: "https://candies.monster"};
    globalThis.window = {addEventListener: (name, callback) => listeners.set(name, callback)};
    const frame = {src: "about:blank", contentWindow: {}, classList: {add() {}, remove() {}}};
    const actions = [];
    const controller = createcontroller({frame, onerror: assert.fail, onclose() {}, ontoolong: assert.fail, onaction: action => actions.push(action)});
    try {
        await controller.open("dx", {xml: "<map />", view: "editor"});
        const url = new URL(frame.src);
        assert.equal(url.searchParams.get("view"), "editor");
        const nonce = url.searchParams.get("playtest");
        const send = (action, extra = {}) => listeners.get("message")({origin: location.origin, source: frame.contentWindow, data: {type: "ctrdx-editor-action", action, nonce}, ...extra});
        send("edit", {origin: "https://elsewhere.example"});
        send("edit", {source: {}});
        send("edit", {data: {type: "ctrdx-editor-action", action: "edit", nonce: "stale"}});
        send("unknown");
        assert.deepEqual(actions, []);
        send("version");
        send("edit");
        assert.deepEqual(actions, ["version", "edit"]);
        await controller.open("dx", {xml: "<map />", view: "level"});
        send("edit", {data: {type: "ctrdx-editor-action", action: "edit", nonce: new URL(frame.src).searchParams.get("playtest")}});
        assert.deepEqual(actions, ["version", "edit"]);
        controller.close();
        send("edit");
        assert.deepEqual(actions, ["version", "edit"]);
    } finally {controller.close()}
});
