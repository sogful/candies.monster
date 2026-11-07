import {gameroute, readhash, routehash} from "../links.js";
import {packageheader, versionpanel} from "../catalogue/versions.js";
import {findresults, searchindex} from "./catalogue.js";

/*//////////////////////////////////////////////////////////////////////*/

export function startsearch(options) {
    const form = document.querySelector(".archivesearch");
    const input = form.querySelector(".archivequery");
    const screen = document.querySelector(".searchresults");
    const status = screen.querySelector(".searchstatus");
    const empty = screen.querySelector(".searchempty");
    const clear = form.querySelector(".searchclear");
    const list = screen.querySelector(".searchmatches");
    const more = screen.querySelector(".searchmore");
    const columns = new Map();
    let shown = false;
    let request = 0;
    let frame = 0;
    let entries = [];
    let offset = 0;

    function dim(games = new Set()) {
        for (const platform of options.platforms) {
            const matches = platform.games?.some(game => games.has(game));
            for (let index = 0; index < (platform.nodes?.length || 0); index++) {
                platform.nodes[index].classList.toggle("searchdim", matches && !games.has(platform.games[index]));
            }
        }
    }

    function hide(write = true) {
        request++;
        if (!shown) return;
        shown = false;
        screen.hidden = true;
        document.body.classList.remove("searchopen");
        document.querySelector(".backbutton").classList.remove("active");
        if (write) options.write("", false);
    }

    function jump(text, route) {
        const link = document.createElement("a");
        link.className = "searchjump clickable";
        link.href = routehash(route);
        link.textContent = text;
        return link;
    }

    function header(record) {
        const group = document.createElement("section");
        group.className = "packagecolumn searchgroup";
        const heading = packageheader(record.game, record.index, record.package);
        const route = gameroute(record.game, record.index);
        const title = heading.querySelector(".gamename");
        title.firstChild.replaceWith(jump(record.name, route));
        const pkg = heading.querySelector(".package");
        if (pkg) pkg.replaceChildren(jump(record.package, route));
        const platform = document.createElement("div");
        platform.className = "searchplatform";
        platform.textContent = record.platform === "ios" ? "iOS" : "Android";
        heading.prepend(platform);
        const versions = document.createElement("div");
        versions.className = "packageversions searchversions";
        group.append(heading, versions);
        columns.set(record, versions);
        return group;
    }

    function append() {
        if (!shown || offset >= entries.length) return;
        const fragment = document.createDocumentFragment();
        const end = Math.min(offset + 40, entries.length);
        while (offset < end) {
            const {record, version} = entries[offset++];
            if (!version) {
                fragment.appendChild(header(record));
                continue;
            }
            const game = record.game;
            const fallback = Array.isArray(game.icon) ? game.icon[record.index] || game.icon[0] : game.icon;
            const panel = versionpanel(version, fallback, record.package === "com.zeptolab.ctr.ads", game, record.index);
            const title = panel.querySelector(".version");
            title.firstChild.replaceWith(jump(version.version, gameroute(game, record.index, version.version)));
            columns.get(record).appendChild(panel);
        }
        list.appendChild(fragment);
        more.hidden = offset >= entries.length;
    }

    async function run(write = true) {
        const query = input.value.trim();
        clear.hidden = !input.value;
        empty.hidden = true;
        if (!query) {
            options.close();
            dim();
            hide(false);
            if (write) options.write("", true);
            return;
        }
        const replace = shown;
        options.close();
        shown = true;
        screen.hidden = false;
        document.body.classList.add("searchopen");
        document.querySelector(".archiveinfo").open = false;
        document.querySelector(".backbutton").classList.add("active");
        if (write) options.write(query, replace);
        const current = ++request;
        status.textContent = "Searching...";
        try {
            await options.ready();
            if (current !== request) return;
            const found = findresults(searchindex(options.platforms), query);
            dim(found.games);
            entries = found.results.flatMap(result => [
                {record: result.record},
                ...result.versions.map(version => ({record: result.record, version}))
            ]);
            offset = 0;
            columns.clear();
            list.replaceChildren();
            screen.scrollTop = 0;
            const versions = found.results.reduce((count, result) => count + result.versions.length, 0);
            const games = found.results.length;
            status.textContent = games ? `${games} ${games === 1 ? "game" : "games"}, ${versions} ${versions === 1 ? "version" : "versions"}` : "";
            empty.hidden = games > 0;
            append();
        } catch (error) {
            if (current !== request) return;
            console.error("Unable to search versions", error);
            status.textContent = "Unable to search versions";
        }
    }

    /*//////////////////////////////////////////////////////////////////////*/

    input.addEventListener("input", event => {
        if (event.isComposing) return;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {frame = 0; void run()});
    });
    input.addEventListener("focus", () => {
        if (input.value.trim() && !shown) void run();
    });
    clear.addEventListener("click", () => {
        input.value = "";
        cancelAnimationFrame(frame);
        void run();
        input.focus();
    });
    form.addEventListener("submit", event => {
        event.preventDefault();
        screen.querySelector(".searchjump")?.click();
    });
    document.addEventListener("click", event => {
        const link = event.target.closest?.(".searchjump");
        if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        hide(false);
        void options.open(readhash(link.hash));
    });
    document.addEventListener("keydown", event => {
        if (event.defaultPrevented || event.key !== "Escape" || !shown || document.querySelector(".downloadpopup")?.hidden === false) return;
        event.preventDefault();
        hide();
    });
    screen.addEventListener("scroll", () => {
        if (screen.scrollHeight - screen.scrollTop - screen.clientHeight < 500) append();
    }, {passive: true});
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(items => {
            if (items.some(item => item.isIntersecting)) append();
        }, {root: screen, rootMargin: "400px"});
        observer.observe(more);
    }
    return {
        hide,
        get shown() {return shown},
        restore: async value => {input.value = value; await run(false)}
    };
}
