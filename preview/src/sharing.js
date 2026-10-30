export function createsharing({getlevel, onerror}) {
    const shortcodecachekey = "yourlevels";

    function getcachedshortcode(b64data) {
        try {
            const cache = localStorage.getItem(shortcodecachekey);
            if (!cache) return null;
            const cacheobj = JSON.parse(cache);
            const entry = cacheobj[b64data];
            if (entry && entry.code) {
                return entry.code;
            }
        } catch (_) {}
        return null;
    }

    function setcachedshortcode(b64data, code) {
        try {
            let cacheobj = {};
            const cache = localStorage.getItem(shortcodecachekey);
            if (cache) {
                try {
                    cacheobj = JSON.parse(cache);
                } catch (_) {}
            }
            cacheobj[b64data] = {code, timestamp: Date.now(), data: b64data};
            localStorage.setItem(shortcodecachekey, JSON.stringify(cacheobj));
        } catch (_) {}
    }

    /*//////////////////////////////////////////////////////////////////////*/

    async function fetchlevelbycode(code) {
        try {
            const response = await fetch(`https://play.candies.monster/api/code/${code}`);
            const contenttype = response.headers.get("content-type") || "";
            
            if (!response.ok) {
                let message = `Failed to fetch?! ${response.status}`;
                try {
                    if (contenttype.includes("application/json")) {
                        const err = await response.json();
                        if (err && err.error) {
                            message = err.error;
                        }
                    } else {
                        const clonedresponse = response.clone();
                        const text = await clonedresponse.text();
                        if (text && text.trim()) {
                            const trimmed = text.trim();
                            if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
                                try {
                                    const err = JSON.parse(trimmed);
                                    if (err && err.error) {
                                        message = err.error;
                                    }
                                } catch {
                                    message = text.substring(0, 200);
                                }
                            } else {
                                message = text.substring(0, 200);
                            }
                        }
                    }
                } catch (parseerror) {
                    console.warn("Failed to parse error response", parseerror);
                }
                throw new Error(message);
            }
            const text = await response.text();
            return text;
        } catch (error) {
            let errormessage = error.message;
            if (errormessage.includes("is not valid JSON") || errormessage.includes("Unexpected token")) {
                errormessage = "Failed to load level data?! (invalid format)";
            }
            onerror(`Failed to load level from code?! ${errormessage}`);
            return null;
        }
    }

    /*//////////////////////////////////////////////////////////////////////*/

    function generatelinks() {
        if (!getlevel()) return;
        const fullurl = window.location.origin + window.location.pathname + "?data=" + getlevel();
        const fullurlelem = document.querySelector(".fullurl");
        const shorturlelem = document.querySelector(".shorturl");
        const toolongelem = document.querySelector(".toolong");
        const charcountelem = document.querySelector(".linkcharcount");
        
        if (fullurlelem) {
            const cleanurl = fullurl.replace(/^https?:\/\//, "");
            const croppedurl = cleanurl.length > 50 ? cleanurl.substring(0, 50) + "..." : cleanurl;
            fullurlelem.textContent = croppedurl;
            fullurlelem.href = fullurl;
            
            const urlbytes = new TextEncoder().encode(fullurl).length;
            const urlchars = fullurl.length;
            
            if (toolongelem) {
                if (urlbytes > 16384) {
                    toolongelem.style.display = "flex";
                } else {
                    toolongelem.style.display = "none";
                }
            }
            if (charcountelem) {
                charcountelem.textContent = `${urlchars.toLocaleString()} chars (${(urlbytes / 1024).toFixed(2)}kb)`;
            }
        }

        if (shorturlelem) {
            shorturlelem.textContent = "Loading...";
            shorturlelem.href = "";
            requestshorten(getlevel());
        }
    }

    function requestshorten(b64data) {
        const shorturl = document.querySelector(".shorturl");
        if (!shorturl) return;
        
        const cachedcode = getcachedshortcode(b64data);
        
        if (cachedcode) {
            const shortened = `https://play.candies.monster/${cachedcode}`;
            const displayshorturl = shortened.replace(/^https?:\/\//, "");
            shorturl.textContent = displayshorturl;
            shorturl.href = shortened;
            return;
        }
        
        fetch(`https://play.candies.monster/?data=${b64data}`)
            .then(response => response.json())
            .then(data => {
                if (data.shortened) {
                    const displayshorturl = data.shortened.replace(/^https?:\/\//, "");
                    shorturl.textContent = displayshorturl;
                    shorturl.href = data.shortened;
                    const code = data.shortened.split("/").pop();
                    if (code) {
                        setcachedshortcode(b64data, code);
                    }
                } else if (data.error) {
                    shorturl.textContent = "Rate limited :(";
                    shorturl.href = "";
                } else {
                    shorturl.textContent = "Error";
                    shorturl.href = "";
                }
            })
            .catch(error => {
                shorturl.textContent = "Error";
                shorturl.href = "";
            });
    }

    /*//////////////////////////////////////////////////////////////////////*/

    function copyurl(element) {
        if (!element) return;
        
        let text = "";
        if (element.tagName && element.tagName.toLowerCase() === "a" && element.href) {
            text = element.href;
        } else {
            text = element.value || element.textContent || "";
        }
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
            }).catch(() => {});
        } else if (element.select) {
            element.select();
            element.setSelectionRange(0, 99999);
            document.execCommand("copy");
        }
    }

    return {fetchlevelbycode, generatelinks, copyurl};
}
