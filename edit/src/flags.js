const flags = new Set("ar br de en es fr he id it ja ko nl pt ru th tr zh zh-hant".split(" "));
const names = new Intl.DisplayNames(["en"], {type: "language"});
const aliases = {br: "pt-BR", cn: "zh", in: "id", iw: "he", jp: "ja", kr: "ko", tw: "zh-Hant"};

function languagetag(locale) {
    const tag = String(locale ?? "").toLowerCase().replaceAll("_", "-");
    if (/^zh-(?:tw|hk|mo)$/.test(tag)) return "zh-Hant";
    return aliases[tag] ?? tag;
}

export function languagename(locale) {
    const tag = languagetag(locale);
    if (!tag) return "Default";
    try {return names.of(tag) || tag}
    catch {return tag}
}

export function languageflag(locale) {
    const tag = languagetag(locale).toLowerCase();
    const code = /^zh-hant(?:-|$)/.test(tag) ? "zh-hant" : tag === "pt-br" ? "br" : tag.split("-")[0];
    return flags.has(code) ? "/assets/images/flags/" + code + ".webp" : "";
}
