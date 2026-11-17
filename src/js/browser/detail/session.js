let token = "";

export function sessiontoken(value) {
    if (value !== undefined) {
        token = value || "";
        for (const name of ["localStorage", "sessionStorage"]) {
            try {
                if (token) window[name].setItem("communitysession", token);
                else window[name].removeItem("communitysession");
            } catch {}
        }
        return token;
    }
    for (const name of ["localStorage", "sessionStorage"]) {
        try {
            const saved = window[name].getItem("communitysession");
            if (/^[\w-]{43}$/.test(saved || "")) {
                token = saved;
                if (name === "sessionStorage") sessiontoken(token);
                return token;
            }
        } catch {}
    }
    return token;
}
