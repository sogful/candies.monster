from pathlib import Path
from urllib.request import Request, urlopen
from concurrent.futures import ThreadPoolExecutor
import gzip
import hashlib
import json

root = Path(__file__).resolve().parents[3]
folder = root / "assets/static/data/levels"
archive = folder / "files.json.gz"
existing = json.loads(gzip.decompress(archive.read_bytes()))["files"] if archive.exists() else {}


def fetch(url):
    request = Request(url, headers={"User-Agent": "cdm-bundle/1.0"})
    with urlopen(request, timeout=40) as response:
        data = response.read(2 * 1024 * 1024 + 1)
    if len(data) > 2 * 1024 * 1024:
        raise ValueError("Level response too large")
    return data.decode("utf-8-sig")


catalogue = json.loads(fetch("https://levels.candies.monster/levels"))
selected = []
for level in catalogue["levels"]:
    for file in level.get("files", []):
        if file["id"] == level.get("primaryfile") or "primaryfile" not in level and file["name"].lower().endswith((".xml", ".json")):
            selected.append(level["id"] + "/" + file["id"])
            break


def read(key):
    if key in existing:
        return key, existing[key]
    level, file = key.split("/")
    text = fetch("https://levels.candies.monster/levels/" + level + "/files/" + file)
    if not text.lstrip().startswith(("<", "{", "[")):
        raise ValueError("Invalid level attachment: " + key)
    return key, text


with ThreadPoolExecutor(max_workers=2) as pool:
    files = dict(pool.map(read, selected))
payload = json.dumps({"updated": catalogue["updated"], "files": files}, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
compressed = gzip.compress(payload, compresslevel=9, mtime=0)
digest = hashlib.sha256(compressed).hexdigest()[:16]
manifest = {"url": "/assets/static/data/levels/files.json.gz?v=" + digest, "updated": catalogue["updated"], "files": len(files), "bytes": len(payload)}
archive.write_bytes(compressed)
(folder / "bundle.json").write_text(json.dumps(manifest, indent=4) + "\n", encoding="utf-8")
print("Bundled", len(files), "levels in", len(compressed), "bytes")
