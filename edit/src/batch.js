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
        const request = operation(transaction.objectStore("sessions"));
        transaction.oncomplete = () => resolve(request.result);
        transaction.onabort = () => reject(transaction.error);
        transaction.onerror = () => reject(transaction.error);
    });
}

export function loadbatch() {
    return batchrequest("readonly", store => store.get("last"));
}

export function storebatch(files) {
    return batchrequest("readwrite", store => files.length ? store.put(files, "last") : store.delete("last"));
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
