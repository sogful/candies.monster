// Maps each loading stage onto a fixed band of the single 0-100% bar, in the order stages
// actually run. Anything not listed here (a category name from content/assets.json we don't
// know about ahead of time) falls into the trailing band, so it still ends near 100% instead of
// being silently ignored.
const STAGE_BANDS = [
    { type: "runtime", from: 0, to: 30 },
    { type: "metadata", from: 30, to: 35 },
    { type: "images", from: 35, to: 75 },
    { type: "sounds", from: 75, to: 95 },
];
const FALLBACK_BAND = { from: 95, to: 100 };

// Stages run one after another, each restarting its own loaded/total count from zero - a naive
// per-stage percentage would make the bar visibly jump backward at every stage boundary. This
// tracks the furthest point reached and never lets the displayed width retreat from it.
let highWaterMark = 0;

export function setLoadingProgress(type, loaded, total) {
    const band = STAGE_BANDS.find((b) => b.type === type) ?? FALLBACK_BAND;
    const stageFraction = total > 0 ? loaded / total : 0;
    const overall = band.from + stageFraction * (band.to - band.from);
    highWaterMark = Math.max(highWaterMark, overall);

    const bar = document.getElementById("progress");
    if (bar !== null) {
        bar.style.width = `${highWaterMark}%`;
    }
}
