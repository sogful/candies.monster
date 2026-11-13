export function normalized(value) {
    return String(value || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}

/*//////////////////////////////////////////////////////////////////////*/

function near(first, second) {
    const limit = first.length >= 7 ? 2 : first.length >= 4 ? 1 : 0;
    if (Math.abs(first.length - second.length) > limit) return false;
    let row = Array.from({length: second.length + 1}, (_, index) => index);
    let previous = null;
    for (let left = 1; left <= first.length; left++) {
        const next = [left];
        for (let right = 1; right <= second.length; right++) {
            next[right] = Math.min(next[right - 1] + 1, row[right] + 1, row[right - 1] + Number(first[left - 1] !== second[right - 1]));
            if (previous && right > 1 && first[left - 1] === second[right - 2] && first[left - 2] === second[right - 1]) next[right] = Math.min(next[right], previous[right - 2] + 1);
        }
        if (Math.min(...next) > limit) return false;
        previous = row;
        row = next;
    }
    return row[second.length] <= limit;
}

export function matches(query, value) {
    const words = normalized(query).match(/[\p{L}\p{N}]+/gu) || [];
    const targets = normalized(value).match(/[\p{L}\p{N}]+/gu) || [];
    return !words.length || words.some(word => targets.some(target => target.includes(word) || near(word, target)));
}
