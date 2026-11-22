import hashlib
import json
from pathlib import Path
import re
import sys

customization = {
    "images/backgrounds/skin_bg.webp",
    "images/candy_selection_fx.webp",
    "images/fingertrace_skin.webp",
    "images/skin_selection.webp",
}

########################################################################

def framework(site):
    script = site / "_framework/dotnet.js"
    boot = re.search(r"/\*json-start\*/(.*?)/\*json-end\*/", script.read_text(encoding="utf-8"), re.S)
    if not boot:
        raise RuntimeError("The DX runtime resource manifest is missing.")
    config = json.loads(boot.group(1))
    return ["_framework/dotnet.js", *["_framework/" + name for name in resources(config["resources"])]]


def resources(value):
    if isinstance(value, dict):
        if isinstance(value.get("name"), str):
            yield value["name"]
        for item in value.values():
            yield from resources(item)
    if isinstance(value, list):
        for item in value:
            yield from resources(item)


def packimages(pack, images):
    names = [*pack.get("boxBackground", []), *pack.get("boxCover", [])]
    return {path for name in names for path in (f"images/backgrounds/{name}.webp", f"images/{name}.webp") if path in images}


def optionalimages(content, images):
    metadata = json.loads((content / "tier0.json").read_text(encoding="utf-8"))
    packs = [pack for entry in json.loads(metadata["packlist.json"])
             for pack in json.loads(metadata[entry["boxDataName"] + ".json"])]
    retains = packimages(packs[0], images) if packs else set()
    choices = set().union(*(packimages(pack, images) for pack in packs[1:]))
    candies = {path for path in images if re.fullmatch(r"images/candies/obj_candy_(?:0[2-9]|[1-9]\d)\.webp", path)}
    return (choices - retains) | candies | (customization & images)


########################################################################

def manifest(site):
    content = site / "content"
    assets = json.loads((content / "assets.json").read_text(encoding="utf-8"))
    common = ["index.html", "favicon.ico", "content/assets.json", "content/tier0.json", *framework(site)]
    common += [path.name for path in site.iterdir() if path.suffix in {".js", ".css"}]
    for directory in ["loading", "splash"]:
        common += [path.relative_to(site).as_posix() for path in (site / directory).rglob("*") if path.is_file()]
    common += ["content/" + path for path in assets["fonts"]]
    packs = {"common": common}
    cosmetics = optionalimages(content, set(assets["images"]))
    optional = {}
    for quality in ["high", "medium", "low"]:
        prefix = "content/" + (quality + "/" if quality != "high" else "")
        packs[quality] = [prefix + path for path in [*assets["images"], *assets["sounds"]] if path not in cosmetics]
        for path in sorted(cosmetics):
            relative = prefix + path
            optional[relative] = hashlib.sha256((site / relative).read_bytes()).hexdigest()[:16]

    sizes = {}
    versions = {}
    compress = []
    for name, entries in packs.items():
        packs[name] = sorted(set(entries))
        digest = hashlib.sha256()
        sizes[name] = 0
        for entry in packs[name]:
            path = site / entry
            if not path.resolve().is_relative_to(site.resolve()):
                raise RuntimeError(f"Invalid DX offline asset: {entry}")
            data = path.read_bytes()
            if not data:
                raise RuntimeError(f"Empty DX offline asset: {entry}")
            if name == "common" and len(data) >= 32768 and path.suffix in {".wasm", ".js", ".json", ".ttf", ".otf"}:
                compress.append(entry)
            digest.update(entry.encode("utf-8") + b"\0" + hashlib.sha256(data).digest())
            sizes[name] += len(data)
        versions[name] = digest.hexdigest()[:16]
    summary = [versions, optional, compress]
    version = hashlib.sha256(json.dumps(summary, separators=(",", ":")).encode("utf-8")).hexdigest()[:16]
    result = {"version": version, "versions": versions, "bytes": sizes, "compress": compress, "optional": optional, **packs}
    (site / "offline.json").write_text(json.dumps(result, separators=(",", ":")) + "\n", encoding="utf-8", newline="\n")
    return result


if __name__ == "__main__":
    manifest(Path(sys.argv[1]))
