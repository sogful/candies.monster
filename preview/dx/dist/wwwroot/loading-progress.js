const stagebands = [
    { type: "runtime", from: 0, to: 30 },
    { type: "metadata", from: 30, to: 35 },
    { type: "images", from: 35, to: 75 },
    { type: "sounds", from: 75, to: 95 },
];
const fallbackband = { from: 95, to: 100 };

let highwatermark = 0;

export function setLoadingProgress(type, loaded, total) {
    const band = stagebands.find((b) => b.type === type) ?? fallbackband;
    const stagefraction = total > 0 ? loaded / total : 0;
    const overall = band.from + stagefraction * (band.to - band.from);
    highwatermark = Math.max(highwatermark, overall);

    const bar = document.querySelector(".previewprogress");
    if (bar !== null) {
        bar.style.width = `${highwatermark}%`;
    }
}
