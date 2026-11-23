import {reporterror} from "./diagnostics.js";

const status = document.querySelector(".progressinfo");
const errors = document.querySelector(".errors");
const errorlog = document.querySelector(".errorlog");
const copyerrors = document.querySelector(".copyerrors");
const counts = document.querySelector(".counts");
const inputs = [...document.querySelectorAll("input[type=file]")];
let running = false;
let zipready;

function report(succeeded, failed) {
    counts.textContent = `${succeeded} succeeded // ${failed} failed`;
    errorlog.hidden = !failed;
    copyerrors.hidden = !failed;
}

function failure(stage, error, name = "") {
    const message = error?.message || String(error);
    const detail = [name, `${stage}: ${message}`].filter(Boolean).join("\n");
    errors.value += (errors.value ? "\n\n" : "") + detail;
    reporterror(stage, message);
}

function save(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
}

function path(file) {
    return (file.webkitRelativePath || file.name).replaceAll("\\", "/");
}

const texturepattern = /\.raw(\d*)(\.zst)?$/i;

function texture(name) {
    return texturepattern.test(name);
}

function group(files) {
    const groups = new Map();
    for (const file of files) {
        const name = path(file);
        const match = name.match(texturepattern);
        if (!match) continue;
        const base = name.replace(texturepattern, match[2] ? ".raw.zst" : ".raw");
        if (!groups.has(base)) groups.set(base, []);
        groups.get(base).push(file);
    }
    for (const parts of groups.values()) {
        parts.sort((first, second) => Number(path(first).match(texturepattern)[1]) - Number(path(second).match(texturepattern)[1]));
    }
    return groups;
}

async function zipclass() {
    if (!zipready) zipready = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "/assets/static/dependencies/jszip.min.js";
        script.onload = () => resolve(window.JSZip);
        script.onerror = () => {
            zipready = null;
            reject(new Error("Could not load ZIP support. Try again."));
        };
        document.head.append(script);
    });
    return zipready;
}

/*//////////////////////////////////////////////////////////////////////*/

async function convert(files, folder = false) {
    if (running || !files.length) return;
    running = true;
    inputs.forEach(input => {input.disabled = true});
    document.querySelector(".stats").style.display = "flex";
    document.querySelector(".errorconsole").style.display = "block";
    errors.value = "";
    copyerrors.textContent = "Copy errors";
    report(0, 0);
    status.textContent = "Preparing...";
    let worker;
    let stage = "selection";
    try {
        const selected = [...files];
        const groups = group(selected);
        const reverse = !groups.size;
        if (reverse) {
            for (const file of selected) if (/\.png$/i.test(file.name)) groups.set(path(file), [file]);
        }
        if (!groups.size && selected.length === 1) groups.set(path(selected[0]), selected);
        if (!groups.size) throw new Error("No .raw, .raw.zst or .png textures found.");
        const batch = folder || groups.size > 1 || [...groups.values()].some(parts => parts.length > 1);
        stage = "zip setup";
        const archive = batch ? new (await zipclass())() : null;
        stage = reverse ? "encoding png" : "decoding raw";
        worker = new Worker(new URL("./worker.js", import.meta.url), {type: "module"});
        let id = 0;
        let succeeded = 0;
        let failed = 0;
        let stalled = false;
        for (const [name, parts] of groups) {
            status.textContent = `Converting ${succeeded + failed + 1}/${groups.size}: ${name}`;
            try {
                stage = "reading files";
                if (parts.reduce((total, file) => total + file.size, 0) > 134217728) throw new Error("Texture exceeds 128mb.");
                if (texture(name) && path(parts[0]).match(texturepattern)?.[1]) throw new Error("The first texture part is missing. Select the folder containing all parts.");
                const buffers = await Promise.all(parts.map(file => file.arrayBuffer()));
                stage = reverse ? "encoding png" : "decoding raw";
                const request = ++id;
                const bytes = await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        stalled = true;
                        worker.terminate();
                        reject(new Error("Conversion exceeded the 60-second time limit."));
                    }, 60000);
                    worker.onmessage = event => {
                        if (event.data.id !== request) return;
                        clearTimeout(timeout);
                        if (event.data.error) reject(new Error(event.data.error));
                        else resolve(event.data.bytes);
                    };
                    worker.onerror = event => {
                        clearTimeout(timeout);
                        reject(new Error(event.message ? "Texture worker failed. " + event.message : "Texture worker failed."));
                    };
                    worker.postMessage({id: request, parts: buffers, reverse}, buffers);
                });
                const extension = !reverse && name.endsWith(".raw.zst") && !groups.has(name.slice(0, -4)) ? /\.raw\.zst$/ : /\.[^/.]+$/;
                const output = name.replace(extension, reverse ? ".raw" : ".png");
                stage = "saving output";
                if (archive) archive.file(output, bytes);
                else save(new Blob([bytes], {type: reverse ? "application/octet-stream" : "image/png"}), output);
                succeeded++;
            } catch (error) {
                failed++;
                failure(stage, error, name);
            }
            report(succeeded, failed);
            if (stalled) break;
        }
        if (archive && succeeded) {
            stage = "saving output";
            status.textContent = "Saving ZIP...";
            for (const file of selected) if (texture(file.name) || reverse && /\.png$/i.test(file.name)) archive.file(`original/${path(file)}`, file);
            save(await archive.generateAsync({type: "blob", compression: "STORE"}), "raw2png.zip");
        }
        status.textContent = failed ? "Finished. See errors below." : "Done!";
    } catch (error) {
        failure(stage, error);
        report(0, 1);
        status.textContent = "Conversion failed.";
    } finally {
        worker?.terminate();
        inputs.forEach(input => {input.disabled = false; input.value = ""});
        running = false;
    }
}

/*//////////////////////////////////////////////////////////////////////*/

document.querySelector(".inputsingle").addEventListener("change", event => convert(event.target.files));
document.querySelector(".inputfolder").addEventListener("change", event => convert(event.target.files, true));
copyerrors.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(errors.value);
        copyerrors.textContent = "Copied";
    } catch {
        errors.focus();
        errors.select();
        copyerrors.textContent = "Press Ctrl+C to copy";
    }
});
document.querySelectorAll(".clickable").forEach(element => {
    element.addEventListener("click", () => {
        const audio = document.querySelector(".click");
        audio.currentTime = 0;
        audio.play().catch(() => {});
    });
});

const overlay = document.querySelector(".drag");
let drags = 0;
document.addEventListener("dragenter", event => {
    event.preventDefault();
    drags++;
    if (!running) overlay.style.display = "flex";
});
document.addEventListener("dragleave", event => {
    event.preventDefault();
    drags = Math.max(0, drags - 1);
    if (!drags) overlay.style.display = "none";
});
document.addEventListener("dragover", event => event.preventDefault());
document.addEventListener("drop", async event => {
    event.preventDefault();
    drags = 0;
    overlay.style.display = "none";
    if (running) return;
    const entries = [...(event.dataTransfer.items || [])].map(item => item.webkitGetAsEntry?.()).filter(Boolean);
    if (!entries.some(entry => entry.isDirectory)) {
        convert(event.dataTransfer.files);
        return;
    }
    const files = [];
    async function collect(entry, prefix = "") {
        if (entry.isFile) {
            const file = await new Promise((resolve, reject) => entry.file(resolve, reject));
            Object.defineProperty(file, "webkitRelativePath", {value: prefix + file.name});
            files.push(file);
        } else {
            const reader = entry.createReader();
            while (true) {
                const children = await new Promise((resolve, reject) => reader.readEntries(resolve, reject));
                if (!children.length) break;
                for (const child of children) await collect(child, `${prefix}${entry.name}/`);
            }
        }
    }
    try {
        for (const entry of entries) await collect(entry);
        convert(files, true);
    } catch (error) {
        document.querySelector(".stats").style.display = "flex";
        document.querySelector(".errorconsole").style.display = "block";
        errors.value = "";
        copyerrors.textContent = "Copy errors";
        failure("reading files", error);
        report(0, 1);
        status.textContent = "Could not read the dropped folder.";
    }
});
