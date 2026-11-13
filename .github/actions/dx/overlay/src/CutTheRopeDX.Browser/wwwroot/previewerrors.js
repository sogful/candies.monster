(() => {
    const reported = new Set();

    function report(message) {
        if (globalThis.parent === globalThis || typeof message !== "string") return;
        const detail = message.trim().slice(0, 8192);
        if (!detail || reported.has(detail) || reported.size >= 32) return;
        reported.add(detail);
        globalThis.parent.postMessage({
            type: "ctrdx-error",
            nonce: new URLSearchParams(location.search).get("playtest"),
            message: detail
        }, location.origin);
    }

    globalThis.ctrdxpreviewerror = report;

    for (const method of ["log", "error"]) {
        const original = console[method];
        console[method] = function (...values) {
            const result = original.apply(this, values);
            const message = values.filter(value => typeof value === "string").join("\n");
            if (/ctrdx-(?:frame-error|frame-request-error|context-lost):/.test(message)) {
                try {report(message)} catch {}
            }
            return result;
        };
    }
})();
