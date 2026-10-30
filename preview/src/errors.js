export function createerrors({errorsel, fatalel, oopsaudio}) {
    const errorentries = new Map();
    let fataltimeout = null;
    let fatalactive = false;

    /*//////////////////////////////////////////////////////////////////////*/

    function formaterrorarguments(args) {
        return args
            .map((arg) => {
                if (typeof arg === "string") return arg;
                try {
                    return JSON.stringify(arg);
                } catch (_) {
                    return String(arg);
                }
            })
            .join(" ");
    }

    function playfatalalert() {
        if (!oopsaudio) return;
        if (oopsaudio.dataset.active) return;
        oopsaudio.dataset.active = "true";
        oopsaudio.currentTime = 0;
        oopsaudio.play().catch(() => {});
    }

    function hidefatalalert() {
        if (oopsaudio) {
            delete oopsaudio.dataset.active;
        }
        fatalel.classList.remove("active");
        fatalactive = false;
        errorentries.forEach((entry) => {
            if (entry.fadetimeout) {
                clearTimeout(entry.fadetimeout);
                entry.fadetimeout = null;
            }
            if (entry.element && entry.element.classList.contains("fading")) {
                entry.element.classList.remove("fading");
            }
        });
    }

    function showerror(message) {
        const clean = message;
        const now = Date.now();
        
        try {window.parent.postMessage({type: "errorlog", message: clean}, "*")}
        catch (e) {}
        
        let entry = errorentries.get(clean);
        if (!entry) {
            const el = document.createElement("div");
            el.textContent = clean;
            errorsel.appendChild(el);
            entry = {count: 1, element: el, timestamps: [now], fadetimeout: null};
            errorentries.set(clean, entry);
        } else {
            entry.count += 1;
            entry.timestamps = entry.timestamps.filter((ts) => now - ts < 1000);
            entry.timestamps.push(now);
            entry.element.textContent = `(${entry.count}) ${clean}`;
            if (entry.fadetimeout) {
                clearTimeout(entry.fadetimeout);
                entry.fadetimeout = null;
            }
            if (entry.element.classList.contains("fading")) {
                entry.element.classList.remove("fading");
            }
        }

        if (!fatalactive) {
            entry.fadetimeout = window.setTimeout(() => {
                if (entry.element && !fatalactive) {
                    entry.element.classList.add("fading");
                    entry.fadetimeout = window.setTimeout(() => {
                        if (entry.element && entry.element.parentNode) {
                            entry.element.remove();
                        }
                        errorentries.delete(clean);
                    }, 500);
                }
            }, 5000);
        }

        if (entry.timestamps.length >= 5) {
            fatalactive = true;
            fatalel.classList.add("active");
            playfatalalert();
            errorentries.forEach((e) => {
                if (e.fadetimeout) {
                    clearTimeout(e.fadetimeout);
                    e.fadetimeout = null;
                }
                if (e.element && e.element.classList.contains("fading")) {
                    e.element.classList.remove("fading");
                }
            });
            clearTimeout(fataltimeout);
            fataltimeout = window.setTimeout(() => {
                hidefatalalert();
            }, 1000);
        }
    }

    const ogerror = console.error;
    console.error = function (...args) {
        ogerror.apply(console, args);
        showerror(formaterrorarguments(args));
    };
    window.addEventListener("error", (event) => {
        showerror(`${event.error?.name || "Error"}: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`);
    });
    window.addEventListener("unhandledrejection", (event) => {
        showerror(`Unhandled Promise Rejection: ${event.reason}`);
    });
    window.addEventListener("message", (event) => {
        if (event.origin !== window.location.origin) return;
        const data = event.data;
        if (!data || data.source !== "preview-game" || !data.message) return;
        const prefix = data.game ? `[${data.game}] ` : "";
        showerror(prefix + data.message);
    });

    return showerror;
}
