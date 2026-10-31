import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs/promises";
import path from "node:path";

const script = process.env.CTRDX_SOURCE
    ? path.join(process.env.CTRDX_SOURCE, "src/CutTheRopeDX.Browser/wwwroot/audio.js")
    : new URL("../../../../preview/dx/dist/wwwroot/audio.js", import.meta.url);
const source = await fs.readFile(script, "utf8");
let sequence = 0;

async function fixture(run) {
    const names = ["AudioContext", "fetch", "document", "addEventListener", "removeEventListener"];
    const previous = names.map((name) => Object.getOwnPropertyDescriptor(globalThis, name));
    const warnings = [];
    const warn = console.warn;
    try {
        globalThis.AudioContext = class {
            createGain() {return {gain: {value: 0}, connect() {}}}
            async decodeAudioData(bytes) {
                if (new Uint8Array(bytes)[0] === 0) {
                    throw new DOMException("Unable to decode audio data", "EncodingError");
                }
                return {duration: 2};
            }
        };
        globalThis.document = {addEventListener() {}};
        globalThis.addEventListener = () => {};
        globalThis.removeEventListener = () => {};
        console.warn = (message) => warnings.push(message);
        const audio = await import("data:text/javascript;base64," + Buffer.from(source).toString("base64") + "#" + ++sequence);
        await run(audio, warnings);
    } finally {
        console.warn = warn;
        names.forEach((name, index) => {
            if (previous[index]) Object.defineProperty(globalThis, name, previous[index]);
            else delete globalThis[name];
        });
    }
}

/*//////////////////////////////////////////////////////////////////////*/

test("a failed audio decode retries with a fresh download and retains the recovered sound", async () => {
    await fixture(async (audio, warnings) => {
        const caches = [];
        globalThis.fetch = async (url, options) => {
            caches.push(options?.cache ?? "default");
            return new Response(new Uint8Array([caches.length === 1 ? 0 : 1]));
        };
        assert.equal(await audio.decode("sound", "/sound.ogg"), 1);
        assert.deepEqual(caches, ["default", "reload"]);
        assert.equal(audio.durationOf("sound"), 2);
        assert.equal(await audio.decode("sound", "/sound.ogg"), 1);
        assert.equal(caches.length, 2);
        assert.deepEqual(warnings, []);
    });
});

test("an undecodable sound does not abort startup, retry forever, or disable healthy sounds", async () => {
    await fixture(async (audio, warnings) => {
        let requests = 0;
        globalThis.fetch = async (url) => {
            requests++;
            return new Response(new Uint8Array([url === "/bad.ogg" ? 0 : 1]), {headers: {"content-type": "audio/ogg"}});
        };
        assert.equal(await audio.decode("bad", "/bad.ogg"), 1);
        assert.equal(audio.play("bad", false, 1), 0);
        assert.equal(audio.durationOf("bad"), 0);
        assert.equal(await audio.decode("bad", "/bad.ogg"), 1);
        assert.equal(requests, 2);
        assert.equal(warnings.length, 1);
        assert.match(warnings[0], /\/bad\.ogg \(1 bytes, audio\/ogg\)/);
        assert.equal(await audio.decode("good", "/good.ogg"), 1);
        assert.equal(audio.durationOf("good"), 2);
    });
});

test("HTTP and network failures remain failures rather than silent audio", async () => {
    await fixture(async (audio, warnings) => {
        globalThis.fetch = async () => new Response("missing", {status: 404});
        assert.equal(await audio.decode("missing", "/missing.ogg"), 0);
        globalThis.fetch = async () => {throw new TypeError("offline")};
        await assert.rejects(audio.decode("offline", "/offline.ogg"), /offline/);
        assert.deepEqual(warnings, []);
    });
});
