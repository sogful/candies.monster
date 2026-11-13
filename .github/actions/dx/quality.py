import json
from pathlib import Path
import subprocess
from PIL import Image

########################################################################

def variants(site):
    content = site / "content"
    catalog = json.loads((content / "assets.json").read_text(encoding="utf-8"))
    totals = {}
    for name, quality, rate, sound in [("medium", 65, 32000, "1"), ("low", 35, 22050, "-1")]:
        for relative in catalog["images"]:
            source = content / relative
            output = content / name / relative
            output.parent.mkdir(parents=True, exist_ok=True)
            with Image.open(source) as image:
                image.save(output, "WEBP", quality=quality, method=5)
        for relative in catalog["sounds"]:
            source = content / relative
            output = content / name / relative
            output.parent.mkdir(parents=True, exist_ok=True)
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-threads", "1", "-i", str(source), "-c:a", "libvorbis", "-q:a", sound, "-ar", str(rate), "-ac", "1", str(output)], check=True, timeout=60)
        totals[name] = sum((content / name / relative).stat().st_size for kind in ["images", "sounds"] for relative in catalog[kind])
    totals["high"] = sum((content / relative).stat().st_size for kind in ["images", "sounds"] for relative in catalog[kind])
    print(json.dumps(totals), flush=True)
    return totals
