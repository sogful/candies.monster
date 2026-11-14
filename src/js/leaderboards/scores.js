export function identity(name) {
    return name.normalize("NFC").trim().toLowerCase();
}

/*//////////////////////////////////////////////////////////////////////*/

export function suspicious(boards) {
    const players = new Set();
    const reasons = new Map();
    for (const board of boards) {
        const limit = (board.levels || 25) * 6000;
        for (const row of board.scores) {
            if (!/^\d+$/.test(row.score)) continue;
            const score = row.score.replace(/^0+(?=\d)/, "");
            const ceiling = String(limit);
            if (score.length < ceiling.length || score.length === ceiling.length && score <= ceiling) continue;
            players.add(identity(row.name));
            reasons.set(board.id + ":" + row.rank, "Above the maximum possible score");
        }
    }
    for (const board of boards) {
        for (const row of board.scores) {
            const key = board.id + ":" + row.rank;
            if (!reasons.has(key) && players.has(identity(row.name))) reasons.set(key, "Impossible score on another box");
        }
    }
    return reasons;
}

/*//////////////////////////////////////////////////////////////////////*/

export function formatscore(score) {
    return score.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
