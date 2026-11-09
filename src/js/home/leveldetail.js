export function leveldetails() {
    const root = document.documentElement;
    const main = document.querySelector(".levelcontent > .main");
    const panel = create("section", "leveldetail");
    panel.hidden = true;
    panel.setAttribute("aria-label", "level details");
    document.querySelector(".levelcontent").append(panel);
    const files = new Map();
    let entries = [];
    let ready = false;
    let current = "";

    /*//////////////////////////////////////////////////////////////////////*/

    function create(tag, classname, text) {
        const node = document.createElement(tag);
        node.className = classname;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function image(source, classname, alternative = "") {
        const node = create("img", classname);
        node.src = source;
        node.alt = alternative;
        node.draggable = false;
        node.decoding = "async";
        return node;
    }

    function back() {
        history.pushState(null, "", location.pathname + location.search);
        render();
        const card = document.querySelector('.level[data-level="' + current + '"]');
        card?.focus({preventScroll: true});
    }

    function control() {
        const button = create("button", "levelback clickable");
        button.type = "button";
        button.setAttribute("aria-label", "back to levels");
        button.append(image("/assets/images/buttons/back.png", ""));
        button.addEventListener("click", back);
        return button;
    }

    function stat(label, value) {
        const row = create("div", "levelstat");
        row.append(create("strong", "levelvalue", String(value)), create("span", "levellabel", label));
        return row;
    }

    function preview(file) {
        if (!files.has(file)) {
            files.set(file, fetch(file).then(response => {
                if (!response.ok) throw new Error("Preview unavailable");
                return response.text();
            }).then(data => "/preview/?data=" + encodeURIComponent(data)).catch(error => {
                files.delete(file);
                throw error;
            }));
        }
        return files.get(file);
    }

    /*//////////////////////////////////////////////////////////////////////*/

    function content(entry) {
        const heading = create("header", "levelheading");
        heading.append(create("h1", "levelname", entry.title), create("p", "levelauthor", `by ${entry.creator}`));
        const hero = create("div", "levelhero");
        const rating = create("div", "levelscore");
        rating.append(image("/assets/images/omnom/omnom.webp", "levelnom", "Om Nom"));
        const stars = create("div", "levelstars");
        stars.append(create("span", "", String(entry.rating)), image("/assets/images/stars/star1.png", "", "stars"));
        rating.append(stars);
        const play = create("a", "levelplay clickable");
        play.setAttribute("aria-label", "play " + entry.title);
        play.setAttribute("aria-disabled", "true");
        play.setAttribute("aria-busy", "true");
        play.append(image("/assets/images/misc/play.png", "", "play"));
        play.addEventListener("click", event => {
            if (!play.href) event.preventDefault();
        });
        const statistics = create("div", "levelstatistics");
        statistics.append(stat("downloads", entry.downloads || 0), stat("likes", entry.likes || 0), stat("objects", entry.objects || 0));
        hero.append(rating, play, statistics);
        const progress = create("div", "levelprogress");
        const collected = create("div", "levelprogressrow");
        collected.append(create("span", "", "stars collected"));
        const bar = create("div", "levelprogressbar");
        const fill = create("span", "levelprogressfill");
        const amount = Math.max(0, Math.min(3, Number(entry.stars) || 0));
        fill.style.width = amount / 3 * 100 + "%";
        bar.append(fill, create("span", "levelprogresstext", `${amount} / 3`));
        collected.append(bar);
        progress.append(collected, create("p", "levelbest", "best time: " + (entry.besttime || "--")));
        const information = create("div", "levelinformation");
        information.append(create("p", "leveldescription", entry.description || entry.title));
        const features = create("div", "levelfeatures");
        for (const name of entry.features || []) {
            if (!/^[a-z]+$/.test(name)) continue;
            features.append(image(`/assets/images/objects/${name}.png`, "", name));
        }
        information.append(features);
        const download = create("a", "levelaction clickable", "download level");
        download.href = entry.file;
        download.download = entry.file.split("/").pop();
        information.append(download);
        const status = create("p", "levelstatus");
        status.setAttribute("role", "status");
        panel.append(control(), heading, hero, progress, information, status);
        preview(entry.file).then(url => {
            if (!play.isConnected) return;
            play.href = url;
            play.removeAttribute("aria-disabled");
            play.removeAttribute("aria-busy");
        }).catch(() => {
            if (!status.isConnected) return;
            status.textContent = "preview unavailable";
            play.removeAttribute("aria-busy");
        });
    }

    function render() {
        const match = /^#level\/(\d+)$/.exec(location.hash);
        const open = Boolean(match);
        root.classList.toggle("levelopen", open);
        main.inert = open || root.classList.contains("documentopen");
        const wasopen = !panel.hidden;
        panel.hidden = !open;
        if (!open) {
            if (current && !location.hash) document.title = "candies.monster";
            return;
        }
        const id = match[1];
        if (wasopen && current === id && panel.dataset.ready === String(ready)) return;
        current = id;
        panel.dataset.ready = String(ready);
        panel.replaceChildren();
        panel.scrollTop = 0;
        const entry = entries.find((item, index) => String(item.id ?? index + 1) === id);
        if (entry) {
            document.title = entry.title + " - candies.monster";
            content(entry);
        } else {
            panel.append(control(), create("p", "levelstatus", ready ? "level not found" : "loading level..."));
        }
    }

    /*//////////////////////////////////////////////////////////////////////*/

    window.addEventListener("hashchange", render);
    window.addEventListener("popstate", render);
    document.addEventListener("homeviewchange", render);
    document.addEventListener("keydown", event => {
        if (event.key !== "Escape" || event.defaultPrevented || !root.classList.contains("levelopen")) return;
        event.preventDefault();
        back();
    });
    render();
    return {
        setentries(data) {
            entries = data;
            ready = true;
            render();
        },
        open(id) {
            history.pushState(null, "", location.pathname + location.search + "#level/" + encodeURIComponent(id));
            render();
            panel.querySelector(".levelback")?.focus({preventScroll: true});
        }
    };
}
