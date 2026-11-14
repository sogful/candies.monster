import {spinner} from "/assets/static/js/images/spinner.js";
import {suspicious, formatscore} from "./scores.js";

const navigation = document.querySelector(".scoreboxes");
const rows = document.querySelector(".scorerows");
const table = document.querySelector(".scoretable");
const status = document.querySelector(".scorestatus");
let boards = [];
let reasons = new Map();
let selected = "";

/*//////////////////////////////////////////////////////////////////////*/

function sound() {
    const audio = document.querySelector(".click");
    audio.currentTime = 0;
    void audio.play().catch(() => {});
}

function element(tag, classname, text) {
    const node = document.createElement(tag);
    node.className = classname;
    if (text !== undefined) node.textContent = text;
    return node;
}

function select(write = false) {
    const board = boards.find(item => item.id === location.hash.slice(1)) || boards[0];
    if (!board) return;
    selected = board.id;
    if (write) history.replaceState(null, "", "#" + selected);
    for (const button of navigation.querySelectorAll("button")) button.setAttribute("aria-pressed", String(button.dataset.board === selected));
    const visible = board.scores.filter(row => !reasons.has(board.id + ":" + row.rank));
    rows.replaceChildren(...visible.map((row, index) => {
        const line = element("tr", "scorerow");
        const rank = element("td", "scorerank", "#" + (index + 1));
        const player = element("td", "scoreplayer", row.name);
        const score = element("td", "scorevalue", formatscore(row.score));
        line.append(rank, player, score);
        return line;
    }));
    table.hidden = !visible.length;
    status.hidden = Boolean(visible.length);
    status.replaceChildren();
    if (!visible.length) {
        const image = element("img", "scoreempty");
        image.src = "/assets/images/omnom/404/404.gif";
        image.alt = "";
        status.append(image, element("p", "", "no results :("));
    }
}

/*//////////////////////////////////////////////////////////////////////*/

navigation.addEventListener("click", event => {
    const button = event.target.closest("button[data-board]");
    if (!button) return;
    sound();
    if (selected === button.dataset.board) return;
    location.hash = button.dataset.board;
});
window.addEventListener("hashchange", () => select());

spinner(status, "Loading leaderboards");
try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    let data;
    try {
        const response = await fetch("https://leaderboard.candies.monster/leaderboards", {signal: controller.signal});
        if (!response.ok) throw new Error("Leaderboards unavailable");
        data = await response.json();
        if (!Array.isArray(data.boards)) throw new Error("Invalid leaderboards");
    } finally {clearTimeout(timer)}
    boards = data.boards;
    reasons = suspicious(boards);
    navigation.replaceChildren(...boards.map((board, index) => {
        const button = element("button", "scorebox buttonart");
        const image = element("img", "scoreboximage");
        image.src = "/assets/images/leaderboards/" + board.id + ".webp";
        image.alt = "";
        image.width = 44;
        image.height = 44;
        button.append(image, element("span", "", board.title.replace(/\s+Box$/i, "")));
        button.type = "button";
        button.dataset.board = board.id;
        return button;
    }));
    select(true);
} catch {
    status.textContent = "Couldn't load leaderboards.";
}
