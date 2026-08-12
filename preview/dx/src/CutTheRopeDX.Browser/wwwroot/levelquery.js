// Reads a single param from the page's URL query string. Used once at boot to pick up a
// level-editor-supplied custom level (see the candies.monster preview tool's `data` param),
// without fighting dotnet.js's own withApplicationArgumentsFromQuery() argv mapping.

export function getParam(name) {
    return new URLSearchParams(globalThis.location.search).get(name);
}
