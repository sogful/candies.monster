import {sessiontoken} from "./session.js";
import {configuration} from "../catalogue/service.js";
import {commenteditor} from "./editor/index.js";
import {emojipicker, homeemojis} from "./emojis.js";

const settings = await configuration;
export const communitybase = settings.community || "";
const reactiondata = fetch("/assets/static/data/levels/reactions.json").then(response => {
    if (!response.ok) throw new Error("Reactions unavailable");
    return response.json();
});

const callback = new URLSearchParams(location.hash.slice(1));
if (communitybase && /^[\w-]{43}$/.test(callback.get("community") || "")) {
    sessiontoken(callback.get("community"));
    const level = callback.get("level") || "";
    history.replaceState(history.state, "", location.pathname + location.search + (/^\d{17,22}$/.test(level) ? "#" + level : ""));
}

let user;
let account;
let checked = 0;

window.addEventListener("storage", event => {
    if (event.key !== "communitysession") return;
    sessiontoken(event.newValue);
    account = null;
    user = null;
    checked = 0;
});

export async function communityrequest(path, method = "GET", value) {
    const token = sessiontoken();
    const response = await fetch(communitybase + path, {method, headers: {...(token ? {Authorization: "Bearer " + token} : {}), ...(value === undefined ? {} : {"Content-Type": "application/json"})}, body: value === undefined ? undefined : JSON.stringify(value), credentials: "omit"});
    const data = await response.json();
    if (!response.ok) {
        if (response.status === 401) {sessiontoken(null); account = null; user = null}
        throw new Error(data.error || "Request failed");
    }
    return data;
}

export function identity() {
    if (Date.now() - checked > 60000) {account = null; checked = Date.now()}
    account ||= communityrequest("/session").then(value => {
        user = value.user;
        if (!user) sessiontoken(null);
        return user;
    }).catch(error => {account = null; throw error});
    return account;
}

export function signin() {
    const target = new URL(location.href);
    location.assign(communitybase + "/oauth/start?return=" + encodeURIComponent(target.href));
}

function button(text, classname) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = classname + " clickable";
    item.textContent = text;
    return item;
}

export function communitycontrols(entry) {
    const row = document.createElement("div");
    row.className = "communityreactions";
    if (!communitybase || !entry.detailurl?.startsWith(communitybase + "/")) {row.hidden = true; return row}
    const status = document.createElement("span");
    status.className = "communitystatus";
    status.setAttribute("role", "status");
    let choices = [];
    let homes = new Set();
    let state = {counts: [], selected: []};
    function render() {
        const favourite = row.closest(".leveldetail")?.querySelector(".levelfavourites");
        favourite?.setAttribute("aria-pressed", String(state.selected.includes("⭐")));
        favourite?.removeAttribute("aria-busy");
        if (entry.discordrating !== undefined) {
            entry.sitefavourites = state.counts.find(value => value.emoji === "⭐")?.count || 0;
            entry.rating = entry.discordrating + entry.sitefavourites;
            document.dispatchEvent(new CustomEvent("levelstatistics", {detail: entry}));
        }
        row.replaceChildren();
        const displayed = new Map();
        for (const reaction of entry.reactions || []) {
            if (!homes.has(reaction.id)) continue;
            const key = reaction.id || reaction.name;
            displayed.set(key, {...reaction, key, count: reaction.count || 0, discord: reaction.count || 0});
        }
        for (const reaction of state.counts) {
            if (!homes.has(reaction.emoji) || !reaction.count) continue;
            const previous = displayed.get(reaction.emoji);
            displayed.set(reaction.emoji, {...(choices.find(item => item.key === reaction.emoji) || {name: reaction.emoji}), ...previous, key: reaction.emoji, count: (previous?.count || 0) + reaction.count, browser: reaction.count});
        }
        for (const reaction of [{key: "⭐", name: "star"}, ...displayed.values()]) {
            const emoji = reaction.key;
            const count = reaction.count || state.counts.find(value => value.emoji === emoji)?.count || 0;
            const allowed = emoji === "⭐" || choices.some(choice => choice.key === emoji) || state.selected.includes(emoji);
            const item = allowed ? button("", "communityreaction") : document.createElement("span");
            if (!allowed) item.className = "communityreaction";
            if (reaction.id) {
                const image = document.createElement("img");
                image.className = "reactionemoji";
                image.src = "https://cdn.discordapp.com/emojis/" + reaction.id + ".webp?size=32";
                image.alt = ":" + reaction.name + ":";
                item.append(image, document.createTextNode(" " + count));
            } else item.textContent = emoji + " " + count;
            item.title = ":" + reaction.name + ":\n" + (reaction.discord || 0) + " from discord\n" + (reaction.browser || 0) + " from level browser";
            item.querySelector("img")?.setAttribute("title", item.title);
            item.setAttribute("aria-label", emoji === "⭐" ? "Favourite" : "React " + reaction.name);
            item.setAttribute("aria-pressed", String(state.selected.includes(emoji)));
            item.addEventListener("click", async () => {
                if (!allowed) return;
                if (!await identity()) {signin(); return}
                item.disabled = true;
                if (emoji === "⭐") row.closest(".leveldetail")?.querySelector(".levelfavourites")?.setAttribute("aria-busy", "true");
                try {
                    state = await communityrequest("/community/" + entry.id + "/reactions", "PUT", {emoji, selected: !state.selected.includes(emoji)});
                    render();
                } catch (error) {
                    status.textContent = error.message;
                    item.disabled = false;
                    row.closest(".leveldetail")?.querySelector(".levelfavourites")?.removeAttribute("aria-busy");
                }
            });
            row.append(item);
        }
        const plus = button("", "reactionadd");
        plus.setAttribute("aria-label", "Add a reaction");
        const icon = document.createElement("img");
        icon.src = "/assets/images/icons/plus.svg";
        icon.alt = "";
        plus.append(icon);
        plus.addEventListener("click", async () => {
            if (!await identity()) {signin(); return}
            emojipicker(plus, choices, async emoji => {
                state = await communityrequest("/community/" + entry.id + "/reactions", "PUT", {emoji: emoji.key, selected: !state.selected.includes(emoji.key)});
                render();
            });
        });
        row.append(plus);
        row.append(status);
    }
    void Promise.all([identity(), reactiondata, homeemojis]).then(([, items, emojis]) => {choices = items; homes = emojis; return communityrequest("/community/" + entry.id + "/reactions")}).then(value => {state = value; render()}).catch(error => {status.textContent = error.message; row.append(status)});
    return row;
}

export function composer(entry, reload, section) {
    const form = document.createElement("form");
    form.className = "commentcomposer";
    if (!communitybase || !entry.detailurl?.startsWith(communitybase + "/")) {form.hidden = true; return form}
    const status = document.createElement("p");
    status.className = "communitystatus";
    status.setAttribute("role", "status");
    void identity().then(person => {
        if (!form.isConnected) return;
        const label = document.createElement("span");
        label.className = "communityidentity";
        label.textContent = person?.name || "";
        const logout = button("Sign out", "communitylogout descbutton");
        logout.addEventListener("click", async () => {
            try {
                await communityrequest("/logout", "POST", {});
                sessiontoken(null);
                location.reload();
            } catch (error) {status.textContent = error.message}
        });
        const input = button("Add a comment", "commentadd descbutton");
        input.disabled = Boolean(entry.forum && entry.forum !== settings.forum);
        if (input.disabled) input.title = "Comments are closed in archive forums";
        let nonce = "";
        let previous = "";
        input.addEventListener("click", async () => {
            if (!await identity()) {signin(); return}
            commenteditor(entry, async (content, attachments) => {
                const signature = JSON.stringify([content, attachments]);
                if (previous !== signature || !nonce) nonce = [...crypto.getRandomValues(new Uint8Array(16))].map(value => value.toString(16).padStart(2, "0")).join("");
                previous = signature;
                await communityrequest("/community/" + entry.id + "/comments", "POST", {content, attachments, nonce});
                nonce = "";
                await reload();
            }, section, settings.comments !== false);
        });
        if (person) {
            const account = document.createElement("div");
            account.className = "commentaccount";
            account.append(label, logout);
            form.append(account);
        }
        form.append(input, status);
    }).catch(error => {status.textContent = error.message; form.append(status)});
    return form;
}
