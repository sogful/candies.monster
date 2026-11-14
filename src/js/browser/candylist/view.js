import {candycontent} from "../catalogue/metadata.js";

export function rankings(entry) {
    const container = document.createElement("div");
    container.className = "levelspace candyrankings";
    if (entry.candylist?.length) {
        const label = document.createElement("span");
        label.className = "candylabel";
        label.textContent = "Candylist";
        container.append(label);
    }
    for (const row of entry.candylist || []) {
        const link = document.createElement("a");
        link.className = "candyrank clickable";
        link.href = "https://candylist.vercel.app/#/" + encodeURIComponent(row.slug);
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.title = row.title;
        const rank = document.createElement("span");
        rank.textContent = "#" + row.rank;
        const star = document.createElement("img");
        star.src = "/assets/images/stars/star" + row.stars + ".png";
        star.alt = row.stars + " stars";
        const score = document.createElement("span");
        score.textContent = (row.pauseless ? "pauseless " : "") + "(" + Math.round(row.points) + "p)";
        link.append(rank, star, score);
        container.append(link);
    }
    return container;
}

/*//////////////////////////////////////////////////////////////////////*/

export function candyinfo(entry, information) {
    const rows = entry.candylist || [];
    if (!rows.length) return;
    const tags = document.createElement("div");
    tags.className = "leveltags candytags";
    const label = document.createElement("span");
    label.className = "candylabel";
    label.textContent = "Candylist";
    tags.append(label);
    for (const name of [...new Set(rows.flatMap(row => row.tags || []))]) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "leveltag clickable";
        button.append(candycontent(name));
        button.addEventListener("click", () => document.dispatchEvent(new CustomEvent("candyfilter", {detail: name})));
        tags.append(button);
    }
    information.querySelector(".levelbody").append(tags);
    const videos = rows.filter(row => /^[\w-]{11}$/.test(row.video || ""));
    if (!videos.length) return;
    information.classList.add("candyinformation");
    const video = document.createElement("div");
    video.className = "candyvideo";
    const frame = document.createElement("iframe");
    frame.className = "candyframe";
    frame.title = "Completion of " + entry.title;
    frame.loading = "lazy";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.allow = "fullscreen; picture-in-picture; encrypted-media";
    frame.allowFullscreen = true;
    function select(row) {frame.src = "https://www.youtube-nocookie.com/embed/" + row.video}
    if (videos.length > 1) {
        const picker = document.createElement("select");
        picker.className = "candyvideos clickable";
        picker.setAttribute("aria-label", "Completion video");
        for (const row of videos) {
            const option = document.createElement("option");
            option.textContent = row.title;
            option.value = row.slug;
            picker.append(option);
        }
        picker.addEventListener("change", () => select(videos.find(row => row.slug === picker.value)));
        video.append(picker);
    }
    select(videos[0]);
    video.append(frame);
    information.append(video);
}
