import {unsupported, requiredgame, objectrequirements} from "./unsupported.js";
import {scene} from "./renderer/index.js";
import {player} from "./play/index.js";
import {level} from "./renderer/data.js";
import {discordmd} from "./discordmd.js";
import {refresh} from "./statistics.js";
import {share} from "./share.js";
import {tags} from "./tags.js";
import {downloadlevel, filename} from "./download.js";
import {inspection} from "./inspection.js";
import {comments} from "./comments.js";
import {discordbutton} from "./discordlink.js";
import {creatorlink} from "./creator.js";
import {features} from "./features.js";

export function leveldetails() {
    const root = document.documentElement;
    const main = document.querySelector(".levelcontent > .main");
    const panel = create("section", "leveldetail");
    panel.hidden = true;
    panel.setAttribute("aria-label", "level details");
    document.querySelector(".levelcontent").append(panel);
    const game = player();
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
        game.stop();
        const url = new URL(location.href);
        url.hash = "";
        url.searchParams.delete("revision");
        history.pushState(null, "", url);
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

    /*//////////////////////////////////////////////////////////////////////*/

    function reactions(entry, row) {
        row.replaceChildren();
        for (const reaction of (entry.reactions || []).slice(0, 5)) {
            if (!Number.isSafeInteger(reaction.count) || reaction.count < 1) continue;
            const item = create("span", "levelreaction");
            if (/^\d{17,22}$/.test(reaction.id || "")) {
                item.append(image("https://cdn.discordapp.com/emojis/" + reaction.id + ".webp?size=32", "reactionemoji", reaction.name));
            } else item.append(create("span", "reactionemoji", reaction.name));
            item.append(create("span", "reactioncount", String(reaction.count)));
            row.append(item);
        }
    }

    function update(entry) {
        if (panel.hidden || current !== entry.id) return;
        if (entry.filechanged) {
            entry.filechanged = false;
            panel.replaceChildren();
            scene(null);
            scene(entry);
            content(entry);
            return;
        }
        panel.querySelector(".levelfavourites .levelvalue").textContent = String(entry.rating ?? 0);
        panel.querySelector(".levelplays .levelvalue").textContent = String(entry.plays ?? "--");
        panel.querySelector(".levelauthor").replaceWith(creatorlink(entry, "levelauthor"));
        panel.querySelector(".levelname").textContent = entry.title;
        panel.querySelector(".leveldownload").download = filename(entry);
        document.title = entry.title + " by " + entry.creator;
        panel.querySelector(".leveldescription").replaceChildren(discordmd(entry.description || entry.title));
        tags(entry, panel.querySelector(".leveltags"));
        reactions(entry, panel.querySelector(".levelreactions"));
        const rating = document.querySelector('.level[data-level="' + entry.id + '"] .rating p');
        if (rating) rating.textContent = String(entry.rating ?? "--");
        const plays = document.querySelector('.level[data-level="' + entry.id + '"] .cardplays p');
        if (plays) plays.textContent = String(entry.plays ?? 0);
    }

    function content(entry) {
        const heading = create("header", "levelheading");
        heading.append(create("h1", "levelname", entry.title), creatorlink(entry, "levelauthor"));
        const hero = create("div", "levelhero");
        const primary = create("div", "levelprimary");
        const play = create("button", "levelplay clickable");
        play.type = "button";
        play.setAttribute("aria-label", "play " + entry.title);
        play.append(image("/assets/images/misc/play.png", "", "play"));
        let notice = null;
        function restrict() {
            const engine = requiredgame(entry);
            if (engine === entry.engine && Boolean(notice) === Boolean(engine || !entry.file)) return;
            notice?.();
            notice = null;
            entry.engine = engine;
            if (engine || !entry.file) {
                play.setAttribute("aria-disabled", "true");
                play.setAttribute("aria-description", engine ? "Requires " + engine : "Level file unavailable");
                notice = unsupported(play, engine);
            } else {
                play.removeAttribute("aria-disabled");
                play.removeAttribute("aria-description");
            }
        }
        restrict();
        play.addEventListener("click", event => {
            event.preventDefault();
            if (entry.engine || !entry.file) return;
            void game.open(entry, play, status);
        });
        const statistics = create("div", "levelstatistics");
        const favourites = stat("favourites", entry.rating ?? 0);
        favourites.classList.add("levelfavourites");
        const plays = stat("plays", entry.plays ?? "--");
        plays.classList.add("levelplays");
        const objects = stat("objects", entry.objects ?? "--");
        objects.classList.add("levelobjects");
        const reactionrow = create("div", "levelreactions");
        reactions(entry, reactionrow);
        statistics.append(favourites, plays, objects, reactionrow);
        hero.append(create("div", "levelspace"), primary, statistics);
        const information = create("div", "levelinformation");
        const body = create("div", "levelbody");
        const description = create("div", "leveldescription");
        description.append(discordmd(entry.description || entry.title));
        body.append(description);
        const notable = create("div", "levelfeatures");
        notable.hidden = true;
        body.append(notable);
        const labels = create("div", "leveltags");
        tags(entry, labels);
        body.append(labels);
        if (entry.revisions?.length) {
            const label = create("label", "levelrevisions", "Revision ");
            const choices = create("select", "revisionselect clickable");
            choices.setAttribute("aria-label", "Level revision");
            const original = create("option", "", "Original");
            original.value = "";
            choices.append(original);
            for (const file of entry.revisions) {
                const created = new Date(Number((BigInt(file.id) >> 22n) + 1420070400000n));
                const option = create("option", "", file.name + " (" + created.toLocaleDateString() + ")");
                option.value = file.id;
                choices.append(option);
            }
            choices.value = entry.revision || "";
            choices.addEventListener("change", () => {
                const url = new URL(location.href);
                if (choices.value) url.searchParams.set("revision", choices.value);
                else url.searchParams.delete("revision");
                history.pushState(null, "", url);
                render();
            });
            label.append(choices);
            body.append(label);
        }
        information.append(body);
        const actions = create("div", "levelactions");
        const download = create("a", "leveldownload clickable");
        download.setAttribute("aria-label", "download level");
        download.append(image("/assets/images/buttons/download.png", "", ""));
        const sharing = create("button", "levelsharebutton clickable");
        sharing.type = "button";
        sharing.setAttribute("aria-label", "share level");
        sharing.setAttribute("aria-expanded", "false");
        sharing.append(image("/preview/assets/images/share.png", "", ""));
        actions.append(download, sharing, share(entry, sharing));
        const utilities = create("div", "levelutilities");
        utilities.append(inspection(entry), actions, discordbutton(entry));
        primary.append(play);
        const status = create("p", "levelstatus");
        status.setAttribute("role", "status");

        downloadlevel(download, entry, status);
        panel.append(control(), utilities, heading, hero, status, comments(entry), information);
        void refresh(entry).then(() => update(entry)).catch(() => {});
        void level(entry.file).then(map => {
            entry.objects = map.objects.length;
            entry.requirements = objectrequirements(map);
            entry.requirementsfile = entry.file;
            if (current === entry.id && objects.isConnected) {
                restrict();
                objects.querySelector(".levelvalue").textContent = String(entry.objects);
                features(map, notable);
            }
        }).catch(() => {});
    }

    function render() {
        game.stop();
        const match = /^#(?:level\/)?(\d+)$/.exec(location.hash);
        if (match && location.hash.startsWith("#level/")) history.replaceState(null, "", location.pathname + location.search + "#" + match[1]);
        const open = Boolean(match);
        root.classList.toggle("levelopen", open);
        main.inert = open || root.classList.contains("documentopen") || root.classList.contains("previewopen");
        const wasopen = !panel.hidden;
        panel.hidden = !open;
        if (!open) {
            scene(null);
            if (current && !location.hash) document.title = "candies.monster";
            return;
        }
        const id = match[1];
        const revision = new URLSearchParams(location.search).get("revision") || "";
        if (wasopen && current === id && panel.dataset.ready === String(ready) && panel.dataset.revision === revision) return;
        current = id;
        panel.dataset.revision = revision;
        panel.dataset.ready = String(ready);
        panel.replaceChildren();
        panel.scrollTop = 0;
        const entry = entries.find((item, index) => String(item.id ?? index + 1) === id);
        if (entry) {
            const selected = entry.revisions?.find(file => file.id === revision);
            const shown = selected ? {...entry, revision, requirements: [], filename: selected.name, objects: null, file: new URL("/levels/" + (selected.thread || id) + "/files/" + selected.id, entry.detailurl).href} : entry;
            scene(shown);
            document.title = entry.title + " by " + entry.creator;
            content(shown);
        } else {
            panel.append(control());
            if (ready) panel.append(create("p", "levelstatus", "level not found"));
            else {
                const loading = create("div", "levelloading");
                loading.setAttribute("role", "status");
                loading.setAttribute("aria-label", "Loading level");
                void import("/assets/static/imageloading.js").then(({loadingsvg}) => {
                    if (loading.isConnected) loading.innerHTML = loadingsvg;
                });
                panel.append(loading);
            }
        }
    }

    /*//////////////////////////////////////////////////////////////////////*/

    document.addEventListener("levelstatistics", event => update(event.detail));
    window.addEventListener("hashchange", render);
    window.addEventListener("popstate", render);
    document.addEventListener("homeviewchange", render);
    document.addEventListener("keydown", event => {
        if (root.classList.contains("gameopen") || root.classList.contains("gameloading")) return;
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
            history.pushState(null, "", location.pathname + location.search + "#" + encodeURIComponent(id));
            render();
            panel.querySelector(".levelback")?.focus({preventScroll: true});
        }
    };
}
