document.querySelectorAll(".product img, .searchbutton").forEach(function(el) {el.classList.add("clickable")});

document.addEventListener("click", function(e) {
    if (e.target.closest(".clickable")) {
        document.querySelector(".click").currentTime = 0;
        document.querySelector(".click").play();
    }
});

/*//////////////////////////////////////////////////////////////////////*/

let descframe = 0;
let descrevision = 0;
function listingsize(value) {
    const size = [75, 100, 150, 200, 250].includes(Number(value)) ? Number(value) : 150;
    document.querySelector(".products").parentElement.style.setProperty("--productsize", size + "px");
    for (const image of document.querySelectorAll(".product > img[srcset]")) image.sizes = size + "px";
    cancelAnimationFrame(descframe);
    descframe = requestAnimationFrame(initdesc);
}
document.addEventListener("DOMContentLoaded", () => {
    for (const link of document.querySelectorAll(".scalelink")) {
        link.addEventListener("click", event => {
            event.preventDefault();
            localStorage.setItem("productsize", link.dataset.size);
            listingsize(link.dataset.size);
        });
    }
    listingsize(localStorage.getItem("productsize"));
    document.fonts.ready.then(() => listingsize(localStorage.getItem("productsize")));
});

/*//////////////////////////////////////////////////////////////////////*/

// image expand
const overlay = document.createElement("div");
overlay.className = "imageoverlay";
const overlayLink = document.createElement("a");
overlayLink.target = "_blank";
overlayLink.style.display = "flex";
const overlayimage = document.createElement("img");
overlayLink.appendChild(overlayimage);
overlay.appendChild(overlayLink);
document.body.appendChild(overlay);
overlay.addEventListener("click", function(e) {
    if (e.target === overlay) {
        overlay.classList.remove("active");
    }
});
document.querySelectorAll(".products img").forEach(function(img) {
    if (img.closest(".searchbutton") || img.closest(".search") || img.closest("div[search]")) {return}
    img.addEventListener("click", function() {
        overlayimage.src = img.dataset.raw || img.src;
        overlayLink.href = img.dataset.raw || img.src;
        overlay.classList.add("active");
    });
});

// search button generator
document.querySelectorAll("div[search]").forEach(function(searchdiv) {
    const query = searchdiv.getAttribute("search");
    if (!query) return;

    const encodedquery = encodeURIComponent(query);
    const googlequery = encodeURIComponent(query + " -site:youtube.* -site:fandom.*");
    const picclickquery = encodedquery;

    if (!searchdiv.hasAttribute("nogoogle")) {
        const googlebutton = document.createElement("a");
        googlebutton.className = "searchbutton clickable";
        googlebutton.href = `https://www.google.com/search?q=${googlequery}&nfpr=1`;
        googlebutton.target = "_blank";
        const googleimg = document.createElement("img");
        googleimg.src = "/assets/images/icons/platforms/google.svg";
        googlebutton.appendChild(googleimg);

        searchdiv.appendChild(googlebutton);
    }

    if (!searchdiv.hasAttribute("noebay")) {
        const picclickbutton = document.createElement("a");
        picclickbutton.className = "searchbutton clickable";
        picclickbutton.href = `https://picclick.com/?q=${picclickquery}`;
        picclickbutton.target = "_blank";
        const picclickimg = document.createElement("img");
        picclickimg.src = "/assets/images/icons/platforms/picclick.svg";
        picclickbutton.appendChild(picclickimg);

        searchdiv.appendChild(picclickbutton);
    }
});

document.querySelectorAll(".product").forEach(function(product) {
    const searchdivs = Array.from(product.querySelectorAll(".search, div[search]"));
    if (searchdivs.length === 0) return;
    if (searchdivs[0].parentElement.classList.contains("searchcontainer")) return;

    const firstsearch = searchdivs[0];
    const parent = firstsearch.parentElement;
    const addbefore = firstsearch.nextSibling;

    const container = document.createElement("div");
    container.className = "searchcontainer";

    if (addbefore) {parent.insertBefore(container, addbefore)} 
    else {parent.appendChild(container)}
    searchdivs.forEach(function(div) {
        container.appendChild(div);
    });
});
document.querySelectorAll("a:not([target])").forEach(function(link) {
    const href = link.getAttribute("href");
    if (href && href !== "#" && !href.startsWith("#")) {link.target = "_blank"}
});

function initdesc() {
    const revision = ++descrevision;
    const entries = [];
    for (const product of document.querySelectorAll(".product")) {
        const image = product.querySelector(":scope > img");
        const name = image ? image.nextElementSibling : product.firstElementChild;
        if (!name) continue;
        let outer = product.querySelector(".productdescwrapper");
        let desc = outer?.querySelector(".productdesc");
        if (!desc) {
            const extras = [];
            for (let next = name.nextElementSibling; next && next.tagName !== "DIV"; next = next.nextElementSibling) {
                if (next.matches("a,span")) extras.push(next);
            }
            if (!extras.length) continue;
            outer = document.createElement("div");
            outer.className = "productdescwrapper";
            desc = document.createElement("div");
            desc.className = "productdesc";
            desc.append(...extras);
            outer.append(desc);
            name.after(outer);
        }
        for (const control of outer.querySelectorAll(".productmore,.productless")) control.remove();
        desc.classList.add("collapsed");
        entries.push({outer, desc});
    }
    requestAnimationFrame(() => {
        if (revision !== descrevision) return;
        const measured = entries.map(entry => ({...entry, collapsed: entry.desc.clientHeight, full: entry.desc.scrollHeight}));
        for (const {outer, desc, collapsed, full} of measured) {
            if (!(collapsed > 0 && full > collapsed + 10 && full > 20)) {
                desc.classList.remove("collapsed");
                continue;
            }
            const more = document.createElement("span");
            more.className = "productmore clickable";
            more.textContent = " (more)";
            const less = document.createElement("span");
            less.className = "productless clickable";
            less.textContent = " (less)";
            less.style.display = "none";
            outer.append(more, less);
            more.onclick = () => {
                desc.classList.remove("collapsed");
                more.style.display = "none";
                less.style.display = "inline";
            };
            less.onclick = () => {
                desc.classList.add("collapsed");
                less.style.display = "none";
                more.style.display = "inline";
            };
        }
    });
}
