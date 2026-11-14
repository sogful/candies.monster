const repairs = {
    "8312725fdab34367cbde745db6f58dfe93336401a775a53ebd4328f55351d197": text => text.slice(text.indexOf("<map>")),
    "103d1b5be4a8d4a47e466dff2bc97e124e46ce601c8f436bc1b714213274d3b3": text => text.slice(text.indexOf("<map>")),
    "ebb12fab4983eae23ca34ae37a268e37dbca01265593b94530c194eb9e272524": text => text.replace('text=""Jumpy" by HitSpace"', 'text="&quot;Jumpy&quot; by HitSpace"'),
    "006171ccfb03898de4f7a79e04cfd1d4edefa3b9f04182d44acd6e3d9abdef93": text => text.replace(/"(?=[a-zA-Z][a-zA-Z0-9]*=)/g, '" '),
    "5f59095aa9ff40cd9d4c4d25d8aac8dab7cbcb7f0a5bb1dc91dd04503409a897": text => text.slice(0, text.indexOf("</map>") + 6),
    "dc140b2bce7eb3818ecea587d3443320960780e7edb513edb6d07b1af87db033": text => text.replace(/<img\b[^>]*>/g, tag => tag.endsWith("/>") ? tag : tag.slice(0, -1) + "/>"),
    "e9fa622d6a79050650b1d615fba9f8091bba7c51b4e914cad279b0884c9abf33": text => text.replace(/text="<[^"]*"/g, attribute => attribute.replace(/</g, "&lt;"))
};

export async function repairxml(text) {
    if (!text.trimStart().startsWith("</map>") && !text.trimStart().startsWith("I want that this level will be added") && !text.includes("</map><map>") && !text.includes("<img ") && !text.includes('text="<') && !text.includes('text=""') && !text.includes('"wheel=')) return text;
    const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text.trim()));
    const hash = [...new Uint8Array(bytes)].map(value => value.toString(16).padStart(2, "0")).join("");
    return repairs[hash] ? repairs[hash](text.trim()) : text;
}
