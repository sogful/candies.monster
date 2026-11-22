import hashlib
import json
from pathlib import Path
import re
import sys

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


def manifest(site):
    content = site / "content"
    assets = json.loads((content / "assets.json").read_text(encoding="utf-8"))
    common = ["index.html", "favicon.ico", "content/assets.json", "content/tier0.json", *framework(site)]
    common += [path.name for path in site.iterdir() if path.suffix in {".js", ".css"}]
    for directory in ["loading", "splash"]:
        common += [path.relative_to(site).as_posix() for path in (site / directory).rglob("*") if path.is_file()]
    common += ["content/" + path for path in assets["fonts"]]
    packs = {"common": common}
    for quality in ["high", "medium", "low"]:
        prefix = "content/" + (quality + "/" if quality != "high" else "")
        packs[quality] = [prefix + path for kind in ["images", "sounds"] for path in assets[kind]]

    sizes = {}
    versions = {}
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
            digest.update(entry.encode("utf-8") + b"\0" + hashlib.sha256(data).digest())
            sizes[name] += len(data)
        versions[name] = digest.hexdigest()[:16]
    version = hashlib.sha256("".join(versions.values()).encode("ascii")).hexdigest()[:16]
    result = {"version": version, "versions": versions, "bytes": sizes, **packs}
    (site / "offline.json").write_text(json.dumps(result, separators=(",", ":")) + "\n", encoding="utf-8", newline="\n")
    return result


if __name__ == "__main__":
    manifest(Path(sys.argv[1]))
