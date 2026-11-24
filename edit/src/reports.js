export const debugsymbols = report => /DWARF|STABS|Breakpad|debug/i.test(report.format);

export function reportblob(kind, reports) {
    return new Blob([JSON.stringify({kind, version: 1, reports}, null, 2)], {type: "application/json"});
}

function validtext(value) {
    return typeof value === "string" && value.length <= 262144;
}

function validreport(kind, item) {
    return item && validtext(item.format) && validtext(item.architecture)
        && Array.isArray(item.notes) && item.notes.length <= 30 && item.notes.every(validtext)
        && Array.isArray(item.entries) && item.entries.every(entry => entry && validtext(entry.name)
            && (kind === "strings" || validtext(entry.type) && validtext(entry.address)));
}

function symbolrows(text) {
    const result = [];
    for (const section of text.replace(/^(?:\r?\n)+|(?:\r?\n)+$/g, "").split(/(?:\r?\n){2,}/)) {
        const lines = section.split(/\r?\n/);
        const header = lines.indexOf("address\ttype\tsymbol");
        if (header < 0 || header > 1) throw new Error("Choose a symbol report exported by Package Editor.");
        const [format = "Symbols", architecture = ""] = header ? lines[0].split("\t") : [];
        const entries = lines.slice(header + 1).map(line => {
            const [address, type, ...name] = line.split("\t");
            if (!name.length) throw new Error("A symbol report row is incomplete.");
            return {address, type, name: name.join("\t")};
        });
        result.push({format, architecture, entries, notes: []});
    }
    return result;
}

export async function readreport(kind, file) {
    if (file.size > 64 * 1024 * 1024) throw new Error("Choose a report smaller than 64 MB.");
    const text = await file.text();
    let reports;
    if (/\.json$/i.test(file.name)) {
        let parsed;
        try {parsed = JSON.parse(text)}
        catch {throw new Error("This report is not valid JSON.")}
        if (parsed?.version !== 1 || parsed.kind !== kind) throw new Error("Choose a matching report exported by Package Editor.");
        reports = parsed.reports;
    } else if (kind === "symbols") {
        reports = symbolrows(text);
    } else {
        const entries = text.replace(/\r?\n$/, "").split(/\r?\n/).map(name => ({name}));
        reports = [{format: "Text file", architecture: "", entries, notes: []}];
    }
    if (!Array.isArray(reports) || !reports.length || reports.length > 256 || !reports.every(item => validreport(kind, item))) {
        throw new Error("The report contains invalid entries.");
    }
    if (reports.reduce((total, report) => total + report.entries.length, 0) > 1000000) {
        throw new Error("The report contains more than 1,000,000 entries.");
    }
    return reports;
}
