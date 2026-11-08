const list = document.querySelector(".levels");
const motion = matchMedia("(prefers-reduced-motion: reduce)");
const advert = document.querySelector(".morestuff");
const ads = Array.from(advert.querySelectorAll(".carousel a"));
let adindex = 0;
let definitions = null;
let loading = null;
let active = null;
const tooltip = document.createElement("div");
tooltip.className = "tooltip";
tooltip.hidden = true;
document.body.appendChild(tooltip);

/*//////////////////////////////////////////////////////////////////////*/

for (const direction of ["previous", "next"]) {
    const control = document.querySelector("." + direction);
    const arrow = control.querySelector(".arrow");
    const sprite = direction === "previous" ? "up" : "down";
    function release() {arrow.src = `/assets/images/levels/controls/${sprite}.png`}
    function scroll() {
        const card = list.querySelector(".level");
        const distance = card.getBoundingClientRect().width + parseFloat(getComputedStyle(list).gap);
        list.scrollBy({left: direction === "previous" ? -distance : distance, behavior: motion.matches ? "instant" : "smooth"});
        arrow.src = `/assets/images/levels/controls/${sprite}active.png`;
    }
    control.addEventListener("pointerdown", event => {
        if (event.button !== 0) return;
        control.setPointerCapture(event.pointerId);
        scroll();
    });
    control.addEventListener("pointerup", release);
    control.addEventListener("pointercancel", release);
    control.addEventListener("lostpointercapture", release);
    control.addEventListener("keydown", event => {
        if (!["Enter", " "].includes(event.key)) return;
        event.preventDefault();
        scroll();
        release();
    });
}

list.addEventListener("keydown", event => {
    const more = event.target.closest(".morefeatures");
    if (!more || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    more.click();
});

function showad(change) {
    adindex = (adindex + change + ads.length) % ads.length;
    ads.forEach((link, index) => {link.hidden = index !== adindex});
}

document.querySelector(".adleft").addEventListener("click", () => showad(-1));
document.querySelector(".adright").addEventListener("click", () => showad(1));
document.querySelector(".adclose").addEventListener("click", () => {advert.open = false});

/*//////////////////////////////////////////////////////////////////////*/

function loadfeatures() {
    if (!loading) {
        loading = fetch(new URL("../../data/features.json", import.meta.url)).then(response => {
            if (!response.ok) throw new Error("Feature descriptions unavailable");
            return response.json();
        }).then(data => {
            definitions = data;
            return data;
        }).catch(error => {
            loading = null;
            throw error;
        });
    }
    return loading;
}

async function showtooltip(element) {
    const request = active = element;
    try {
        const data = definitions || await loadfeatures();
        if (active !== request || !element.isConnected) return;
        const entry = data.find(item => element.matches(item.selector));
        if (!entry) return;
        tooltip.innerHTML = `<div class="tooltiptitle">${entry.title}</div><div class="tooltipdesc">${entry.description}</div>${entry.footer ? `<div class="tooltipfooter">${entry.footer}</div>` : ""}`;
        const bubble = tooltip.querySelector(".greatness");
        if (bubble) bubble.textContent = "Bable";
        tooltip.hidden = false;
        const anchor = element.getBoundingClientRect();
        const box = tooltip.getBoundingClientRect();
        tooltip.style.left = `${Math.max(8, Math.min(innerWidth - box.width - 8, anchor.left + anchor.width / 2 - box.width / 2))}px`;
        const above = anchor.top - box.height - 10;
        tooltip.style.top = `${Math.max(8, Math.min(innerHeight - box.height - 8, above >= 8 ? above : anchor.bottom + 10))}px`;
    } catch {active = null}
}

function hide() {
    active = null;
    tooltip.hidden = true;
}

document.addEventListener("click", event => {
    const more = event.target.closest(".morefeatures");
    if (more) {
        event.preventDefault();
        more.closest(".features").classList.add("expanded");
        more.setAttribute("aria-expanded", "true");
    }
    const feature = event.target.closest(".features img");
    if (feature) {
        if (active === feature) hide();
        else void showtooltip(feature);
    } else if (!tooltip.contains(event.target)) hide();
    for (const features of document.querySelectorAll(".features.expanded")) {
        if (features.contains(event.target)) continue;
        features.classList.remove("expanded");
        features.querySelector(".morefeatures").setAttribute("aria-expanded", "false");
    }
    if (advert.open && !advert.contains(event.target)) advert.open = false;
});

document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    hide();
    for (const features of document.querySelectorAll(".features.expanded")) {
        features.classList.remove("expanded");
        features.querySelector(".morefeatures").setAttribute("aria-expanded", "false");
    }
    advert.open = false;
});
list.addEventListener("scroll", hide, {passive: true});
window.addEventListener("resize", hide, {passive: true});
