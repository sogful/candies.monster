import {dropdown} from "/assets/static/js/controls/dropdown.js";
import {feather} from "/assets/static/js/controls/feather.js";
import {levelroute} from "./route.js";
import {unsupported, requiredgame, objectrequirements} from "../catalogue/unsupported.js";
import {scene} from "../renderer/index.js";
import {player} from "../play/index.js";
import {level} from "../renderer/data.js";
import {discordmd} from "./markdown.js";
import {refresh} from "../catalogue/statistics.js";
import {share} from "./share.js";
import {tags} from "../catalogue/metadata.js";
import {downloadlevel, filename} from "./download.js";
import {inspection} from "./inspection.js";
import {comments} from "./comments.js";
import {discordbutton} from "./discord.js";
import {creatorlink} from "../catalogue/creator.js";
import {features} from "../catalogue/metadata.js";
import {rankings, candyinfo} from "../candylist/view.js";
import {communitycontrols, communitybase} from "./community.js";
import {homeemojis} from "./emojis.js";
import {filterscroll} from "../filters/controls.js";

export function leveldetails() {
    const root = document.documentElement;
    const main = document.querySelector(".levelcontent > .main");
    const panel = create("section", "leveldetail");
    panel.hidden = true;
    panel.setAttribute("aria-label", "level details");
    document.querySelector(".levelcontent").append(panel);
    const game = player();
    const favouriteobserver = typeof ResizeObserver === "function" ? new ResizeObserver(fitfavourite) : null;
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
        if (root.classList.contains("gameloading")) {game.stop(true); return}
        game.stop();
        const url = new URL(location.href);
        url.hash = root.classList.contains("oldmode") ? "levels" : "";
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
        const icons = {favourites: "/assets/images/level/star.webp", plays: "/assets/images/buttons/playcount.svg", objects: "/assets/images/objects/spider.png"};
        const icon = create("span", "levelstaticon");
        icon.append(image(icons[label], "", ""));
        row.append(icon, create("strong", "levelvalue", String(value)), create("span", "levellabel", label));
        return row;
    }

    function fitfavourite() {
        const label = panel.querySelector(".levelfavourites .levellabel");
        const full = label?.querySelector(".favouriteslong");
        if (full && !panel.hidden) label.classList.toggle("shortlabel", full.getBoundingClientRect().width > label.clientWidth + 0.5);
    }

    function positionhint() {
        const hint = panel.querySelector(".favouritehint");
        if (!hint || panel.hidden) return;
        hint.style.setProperty("--hintshift", "0px");
        const bounds = hint.getBoundingClientRect();
        const utilities = panel.querySelector(".levelutilities").getBoundingClientRect();
        const edge = Math.min(innerWidth - 8, utilities.left - 8);
        hint.style.setProperty("--hintshift", Math.min(50, edge - bounds.right) + "px");
    }

    /*//////////////////////////////////////////////////////////////////////*/

    function reactions(entry, row) {
        row.replaceChildren();
        void homeemojis.then(emojis => {
            row.replaceChildren();
            for (const reaction of (entry.reactions || []).filter(item => emojis.has(item.id)).slice(0, 5)) {
                if (!Number.isSafeInteger(reaction.count) || reaction.count < 1) continue;
                const item = create("span", "levelreaction");
                item.title = ":" + reaction.name + ":\n" + reaction.count + " from discord\n0 from level browser";
                item.append(image("https://cdn.discordapp.com/emojis/" + reaction.id + ".webp?size=32", "reactionemoji", reaction.name));
                item.querySelector("img").title = item.title;
                item.append(create("span", "reactioncount", String(reaction.count)));
                row.append(item);
            }
        }).catch(() => {});
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
        tags(entry, panel.querySelector(".levelinfotags > .leveltags"));
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
        const favouritelabel = favourites.querySelector(".levellabel");
        const full = create("span", "favouriteslong", "favourites");
        favouritelabel.replaceChildren(full, create("span", "favouritesshort", "faves"));
        favourites.append(image("/assets/images/clicktofav.png", "favouritehint", "Click to favourite"));
        favourites.addEventListener("pointerenter", positionhint);
        favourites.addEventListener("focusin", positionhint);
        if (communitybase) {
            favourites.classList.add("clickable");
            favourites.setAttribute("role", "button");
            favourites.setAttribute("aria-label", "Favourite level");
            favourites.tabIndex = 0;
        }
        favourites.addEventListener("click", () => panel.querySelector('.communityreaction[aria-label="Favourite"]')?.click());
        favourites.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {event.preventDefault(); favourites.click()}
        });
        const plays = stat("plays", entry.plays ?? "--");
        plays.classList.add("levelplays");
        const objects = stat("objects", entry.objects ?? "--");
        objects.classList.add("levelobjects");
        const reactionrow = create("div", "levelreactions");
        reactionrow.hidden = Boolean(communitybase);
        reactions(entry, reactionrow);
        statistics.append(favourites, plays, objects, reactionrow);
        statistics.append(communitycontrols(entry));
        hero.append(rankings(entry), primary, statistics);
        const information = create("div", "levelinformation");
        const body = create("div", "levelbody");
        const description = create("div", "leveldescription");
        description.append(discordmd(entry.description || entry.title));
        body.append(description);
        feather(body);
        const notable = create("div", "levelfeatures");
        notable.hidden = true;
        const tagrows = create("div", "levelinfotags");
        filterscroll(tagrows);
        tagrows.append(notable);
        const labels = create("div", "leveltags");
        tags(entry, labels);
        tagrows.append(labels);
        primary.append(play);
        if (entry.revisions?.length) {
            const label = create("div", "levelrevisions");
            const choices = create("select", "revisionselect clickable");
            choices.setAttribute("aria-label", "Level revision");
            const initial = entry.file.match(/files\/(\d+)/)?.[1];
            const date = id => {
                const created = new Date(Number((BigInt(id) >> 22n) + 1420070400000n));
                return created.toLocaleDateString() + " " + String(created.getHours()).padStart(2, "0") + ":" + String(created.getMinutes()).padStart(2, "0");
            };
            const original = create("option", "", initial ? date(initial) : "Original");
            original.value = "";
            choices.append(original);
            for (const file of entry.revisions) {
                const option = create("option", "", date(file.id));
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
            dropdown(choices);
            primary.append(label);
        }
        information.append(body, tagrows);
        candyinfo(entry, information);
        const actions = create("div", "levelactions");
        const download = create("a", "leveldownload clickable");
        download.setAttribute("aria-label", "download level");
        download.append(image("/assets/images/buttons/download.png", "", ""));
        const sharing = create("button", "levelsharebutton clickable");
        sharing.type = "button";
        sharing.setAttribute("aria-label", "share level");
        sharing.setAttribute("aria-expanded", "false");
        sharing.append(image("/assets/images/preview/share.png", "", ""));
        actions.append(download, sharing, share(entry, sharing));
        const utilities = create("div", "levelutilities");
        utilities.append(inspection(entry), actions, discordbutton(entry));
        const status = create("p", "levelstatus");
        status.setAttribute("role", "status");

        downloadlevel(download, entry, status);
        panel.append(control(), utilities, heading, hero, status, comments(entry), information);
        favouriteobserver?.disconnect();
        favouriteobserver?.observe(favouritelabel);
        favouriteobserver?.observe(full);
        fitfavourite();
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
        levelroute(open);
        root.classList.toggle("levelopen", open);
        document.dispatchEvent(new Event("levelviewchange"));
        main.inert = open || root.classList.contains("documentopen") || root.classList.contains("previewopen");
        const wasopen = !panel.hidden;
        panel.hidden = !open;
        if (!open) {
            favouriteobserver?.disconnect();
            for (const frame of panel.querySelectorAll(".candyframe")) frame.remove();
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
            if (ready) {
                const missing = create("div", "levelnotfound");
                missing.append(image("/assets/images/omnom/404/404.gif", "", ""), create("p", "levelstatus", "level not found"));
                panel.append(missing);
            }
            else {
                const loading = create("div", "levelloading");
                loading.setAttribute("role", "status");
                loading.setAttribute("aria-label", "Loading level");
                void import("/assets/static/js/images/loading.js").then(({loadingsvg}) => {
                    if (loading.isConnected) loading.innerHTML = loadingsvg;
                });
                panel.append(loading);
            }
        }
    }

    /*//////////////////////////////////////////////////////////////////////*/

    document.addEventListener("levelstatistics", event => update(event.detail));
    window.addEventListener("resize", positionhint, {passive: true});
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
