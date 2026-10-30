const channelname = "ctrdx-playtest";
const storageprefix = "ctrdx-playtest:";

/*//////////////////////////////////////////////////////////////////////*/

export function createsession({onerror, onclose}) {
    let channel = null;
    let nonce = null;
    let message = null;

    function close() {
        channel?.close();
        channel = null;
        if (nonce) {
            try {localStorage.removeItem(storageprefix + nonce)} catch {}
        }
        nonce = null;
        message = null;
    }

    function receive(event) {
        if (typeof event.data !== "string") return;
        let data;
        try {data = JSON.parse(event.data)} catch {return}
        if (data?.nonce !== nonce) return;
        if (data.v !== 1) {
            onerror("DX uses an unsupported playtest protocol. Update the preview integration.");
            return;
        }
        if (data.type === "ready") {
            channel.postMessage(message);
        } else if (data.type === "error") {
            onerror(typeof data.message === "string" ? data.message : "DX could not load this level.");
        } else if (data.type === "bye") {
            close();
            onclose();
        }
    }

    function start(xml) {
        close();
        nonce = crypto.randomUUID();
        message = JSON.stringify({v: 1, type: "level", nonce, xml});
        try {
            channel = new BroadcastChannel(channelname);
            channel.onmessage = receive;
        } catch {}
        let stored = false;
        try {
            localStorage.setItem(storageprefix + nonce, JSON.stringify({storedAt: Date.now(), message}));
            stored = true;
        } catch {}
        if (!stored && !channel) {
            close();
            throw new Error("Allow site storage or BroadcastChannel to preview this level in DX.");
        }
        return nonce;
    }

    return {start, close};
}
