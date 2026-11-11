const navigation = document.querySelector(".sidebar");
const toggle = document.createElement("button");
toggle.type = "button";
toggle.className = "sidebartoggle clickable";
toggle.setAttribute("aria-label", "hide navigation");
toggle.setAttribute("aria-expanded", "true");
const arrow = document.createElement("img");
arrow.src = "/assets/images/buttons/back.png";
arrow.alt = "";
arrow.draggable = false;
toggle.append(arrow);
navigation.append(toggle);

const homelink = document.querySelector(".homelink");
homelink.addEventListener("click", event => {
    if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const oldurl = location.href;
    history.pushState(null, "", location.pathname + location.search);
    window.dispatchEvent(new HashChangeEvent("hashchange", {oldURL: oldurl, newURL: location.href}));
});

toggle.addEventListener("click", () => {
    const hidden = document.documentElement.classList.toggle("navigationhidden");
    toggle.setAttribute("aria-expanded", String(!hidden));
    toggle.setAttribute("aria-label", hidden ? "show navigation" : "hide navigation");
    for (const section of navigation.querySelectorAll(".sitenavigation, .sidelinks")) {
        section.inert = hidden;
        section.setAttribute("aria-hidden", String(hidden));
    }
    if (hidden) closebuttons();
});

const buttonstoggle = document.querySelector(".buttonstoggle");
const drawer = document.querySelector(".buttondrawer");

function positionbuttons() {
    if (drawer.hidden) return;
    const bounds = buttonstoggle.getBoundingClientRect();
    const side = navigation.getBoundingClientRect();
    drawer.style.left = Math.max(4, Math.min(side.right, innerWidth - drawer.offsetWidth - 4)) + "px";
    const top = side.height < 100 && side.width > side.height ? side.bottom + 4 : bounds.bottom - drawer.offsetHeight;
    drawer.style.top = Math.max(4, Math.min(top, innerHeight - drawer.offsetHeight - 4)) + "px";
}

function closebuttons() {
    drawer.hidden = true;
    buttonstoggle.setAttribute("aria-expanded", "false");
}

buttonstoggle.addEventListener("click", () => {
    drawer.hidden = !drawer.hidden;
    buttonstoggle.setAttribute("aria-expanded", String(!drawer.hidden));
    positionbuttons();
});
document.addEventListener("pointerdown", event => {
    if (!drawer.contains(event.target) && !buttonstoggle.contains(event.target)) closebuttons();
});
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !drawer.hidden) {
        closebuttons();
        buttonstoggle.focus({preventScroll: true});
    }
});
window.addEventListener("resize", positionbuttons, {passive: true});
navigation.addEventListener("scroll", positionbuttons, {passive: true});
document.addEventListener("homeviewchange", closebuttons);

/*//////////////////////////////////////////////////////////////////////*/

document.querySelectorAll(".clickable").forEach(function(element) {
    element.addEventListener("click", function() {
        document.querySelector(".click").currentTime = 0;
        document.querySelector(".click").play().catch(() => {});
    });
});

/*//////////////////////////////////////////////////////////////////////*/

document.addEventListener("auxclick", (e) => {
    let el = e.target.closest(".sbutton, .ctrgame"); if (!el) return;
    if (e.button === 1) {
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();

        let copiablebutton;
        if (el.tagName === "IMG") {copiablebutton = el.parentElement}
        else {copiablebutton = el}
        let clone = copiablebutton.cloneNode(true);

        function fixsrc(node) {
            if (node.tagName === "IMG" && node.src) {
                let src = node.getAttribute("src");
                if (src && src.includes("/assets/") && !src.includes("//candies.monster/")) {
                    if (src.startsWith("/")) {node.setAttribute("src", "//candies.monster" + src)}
                    else {node.setAttribute("src", "//candies.monster/" + src)}
                }
            } else if (node.tagName === "SCRIPT") {
                let scripttext = node.textContent;
                if (scripttext && scripttext.includes("/assets/") && !scripttext.includes("//candies.monster/")) {
                    scripttext = scripttext.replace(/(['"])\/assets\//g, "$1//candies.monster/assets/");
                    scripttext = scripttext.replace(/(['"])assets\//g, "$1//candies.monster/assets/");
                    node.textContent = scripttext;
                }
            }
            for (let child of node.childNodes) {if (child.nodeType === 1) fixsrc(child)}
        }; fixsrc(clone);

        function removegarbage(node) {
            if (node.removeAttribute) {
                node.removeAttribute("style");
                node.removeAttribute("class");
            }
            for (let child of node.childNodes) {removegarbage(child)}
        }; removegarbage(clone);

        if (copiablebutton.classList.contains("ctrgame")) {
            clone.style.cssText = "position:relative;display:inline-block;width:88px;height:31px";
            const image = clone.querySelector("img");
            image.src = "//candies.monster/assets/images/buttons/88x31/game1.gif";
            image.style.cssText = "width:88px;height:31px;pointer-events:none;image-rendering:pixelated";
            const slider = clone.querySelector("input");
            slider.disabled = false;
            slider.value = "50";
            slider.setAttribute("value", "50");
            slider.style.cssText = "position:absolute;left:0;top:0;width:40px;height:15px;opacity:0";
            const script = document.createElement("script");
            script.textContent = `(() => {
    const badge = document.currentScript.parentElement;
    const slider = badge.querySelector("input");
    slider.addEventListener("input", () => {
        if (![0,100].includes(Number(slider.value))) return;
        badge.querySelector("img").src = "//candies.monster/assets/images/buttons/88x31/game2.gif";
        slider.disabled = true;
    });
})();`;
            clone.appendChild(script);
        }
        navigator.clipboard.writeText(clone.outerHTML).catch(() => {});
        document.querySelector(".copied a").textContent = "copied!";
        document.querySelector(".copied").style.opacity = "1";
        setTimeout(function() {document.querySelector(".copied").style.opacity = "0"}, 1000);
        return false;
    }
});

/*//////////////////////////////////////////////////////////////////////*/

(function() {
    let funn = false;
    document.querySelector(".fun").addEventListener("click", function() {
        if (funn) return;
        funn = true;

        document.querySelectorAll("[fun]").forEach(function(element) {
            element.style.display = "inline-flex";
        });
        document.documentElement.style.filter = "invert(1)";
        document.documentElement.style.animation = "shake 2s ease-in-out infinite";
        const funtitle = "??!?!?!?!?!?!?!?!?!?!?!?!?!?!";
        let titleidx = 0;
        if (window.titleinterval) clearInterval(window.titleinterval);
        window.titleinterval = setInterval(() => {
            titleidx = (titleidx + 1) % (funtitle.length + 1);
            document.title = funtitle.slice(0, titleidx);
            if (titleidx === funtitle.length) titleidx = 0;
        }, 10);
        if (window.sheetimg) window.sheetimg.src = "/assets/images/misc/wonderful.png";

        document.querySelector(".sbuttons").remove();
        document.querySelector(".github").remove();
        document.querySelector(".effects").remove();
        document.querySelector("p").remove();
        var weird = new Audio("assets/audio/weird.ogg");
        weird.loop = true; weird.play();
        if ("Notification" in window && Notification.requestPermission) {
            Notification.requestPermission().catch(()=>{});
        }
        if (navigator.permissions) {
            const geopermissions = [
                {name: "geolocation"},
                {name: "background-fetch"},
                {name: "background-sync"},
                {name: "persistent-storage"}
            ];
            for (const perm of geopermissions) {
                navigator.permissions.query(perm).catch(() => {});
            }
        }
        if (navigator.geolocation && navigator.geolocation.getCurrentPosition) {
            try { navigator.geolocation.getCurrentPosition(()=>{}, ()=>{}); } catch (e) {}
        }
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({video: true}).catch(()=>{});
        }
        if (document.documentElement.requestFullscreen) {
            try { document.documentElement.requestFullscreen(); } catch (e) {}
        } else if (document.documentElement.webkitRequestFullscreen) {
            try { document.documentElement.webkitRequestFullscreen(); } catch (e) {}
        }
        if (document.body && document.body.requestPointerLock) {
            try { document.body.requestPointerLock(); } catch (e) {}
        } else if (document.body && document.body.webkitRequestPointerLock) {
            try { document.body.webkitRequestPointerLock(); } catch (e) {}
        }
        if (window.documentPictureInPicture && window.documentPictureInPicture.requestWindow) {
            window.documentPictureInPicture.requestWindow().then(function(pipwindow){
                pipwindow.document.body.innerHTML = "Hello from PiP";
            }).catch(()=>{});
        }
        navigator.vibrate(); document.hasFocus(); navigator.keyboard.lock();
        navigator.permissions.query({name: "notifications"}).catch(()=>{});
        navigator.permissions.query({name: "camera"}).catch(()=>{});
        navigator.permissions.query({name: "microphone"}).catch(()=>{});
        navigator.permissions.query({name: "clipboard-read"}).catch(()=>{});
        navigator.permissions.query({name: "midi"}).catch(()=>{});
        navigator.permissions.query({name: "push"}).catch(()=>{});
    });
})();


/*//////////////////////////////////////////////////////////////////////*/

const slider = document.querySelector(".ctrslider");
let activated = false;
slider.addEventListener("input", () => {
    if (activated || ![0,100].includes(Number(slider.value))) return;
    document.querySelector(".ctrimg").src = "/assets/images/buttons/88x31/game2.gif";
    activated = true;
    slider.disabled = true;
});
