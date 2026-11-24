let database;

function openstorage() {
    database ??= new Promise((resolve, reject) => {
        const request = indexedDB.open("cdm-package-editor", 1);
        request.onupgradeneeded = () => request.result.createObjectStore("sessions");
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        request.onblocked = () => reject(new Error("Package storage is blocked."));
    });
    return database;
}

async function batchrequest(mode, operation) {
    const db = await openstorage();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("sessions", mode);
        const result = operation(transaction.objectStore("sessions"));
        transaction.oncomplete = () => resolve(result());
        transaction.onabort = () => reject(transaction.error);
        transaction.onerror = () => reject(transaction.error);
    });
}

export function loadbatch() {
    return batchrequest("readonly", store => {
        const last = store.get("last");
        const edits = store.get("edits");
        const batchid = store.get("batchid");
        return () => {
            const batch = last.result;
            const saved = edits.result;
            const id = batchid.result;
            if (!batch?.sessions || !id) return batch;
            if (saved?.id !== id || saved.sessions.length !== batch.sessions.length) return {...batch, id};
            return {
                id, active: saved.active,
                sessions: batch.sessions.map(({file}, index) => ({...saved.sessions[index], file}))
            };
        };
    });
}

function snapshots(sessions) {
    return sessions.map(({strings, restoredstrings, ...session}) => {
        const drafts = new Map(restoredstrings);
        for (const [key, draft] of strings) {
            drafts.set(key, {text: draft.model.serialize(), textformat: draft.textformat});
        }
        return {...session, restoredstrings: drafts};
    });
}

export function storebatch(sessions, active) {
    const data = snapshots(sessions);
    const id = data.length ? crypto.randomUUID() : "";
    return batchrequest("readwrite", store => {
        if (id) {
            store.put({sessions: data, active}, "last");
            store.put(id, "batchid");
        } else {
            store.delete("last");
            store.delete("batchid");
        }
        store.delete("edits");
        return () => id;
    });
}

export function storebatchedits(sessions, active, id) {
    const data = snapshots(sessions).map(({file, ...session}) => session);
    return batchrequest("readwrite", store => {
        const request = store.get("batchid");
        let stored = false;
        request.onsuccess = () => {
            if (request.result !== id) return;
            store.put({id, sessions: data, active}, "edits");
            stored = true;
        };
        return () => stored;
    });
}

export async function distinctfiles(files, existing) {
    const result = [];
    for (const file of files) {
        let duplicate = false;
        for (const other of [...existing, ...result]) {
            if (file === other || file.size === other.size && await samebytes(file, other)) {
                duplicate = true;
                break;
            }
        }
        if (!duplicate) result.push(file);
    }
    return result;
}

async function samebytes(file, other) {
    const chunk = 4 * 1024 * 1024;
    for (let start = 0; start < file.size; start += chunk) {
        const [first, second] = await Promise.all([file, other].map(item => item.slice(start, start + chunk).arrayBuffer()));
        const a = new Uint8Array(first);
        const b = new Uint8Array(second);
        if (a.some((byte, index) => b[index] !== byte)) return false;
    }
    return true;
}
