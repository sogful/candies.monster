import json
from pathlib import Path
import subprocess
from PIL import Image

########################################################################

def variants(site):
    content = site / "content"
    catalog = json.loads((content / "assets.json").read_text(encoding="utf-8"))
    totals = {}
    dimensions = {}
    for name, quality, rate, sound in [("medium", 35, 22050, "-1"), ("low", 55, 22050, "-1")]:
        for relative in catalog["images"]:
            source = content / relative
            output = content / name / relative
            output.parent.mkdir(parents=True, exist_ok=True)
            with Image.open(source) as image:
                dimensions[relative] = list(image.size)
                interface = source.stem.startswith(("cursor", "menu_", "font_", "big_font", "small_font", "hud_", "loader", "zepto"))
                if name == "low" and not interface:
                    image = image.resize((max(1, (image.width + 1) // 2), max(1, (image.height + 1) // 2)), Image.Resampling.LANCZOS)
                image.save(output, "WEBP", quality=35 if interface else quality, method=5)
        for relative in catalog["sounds"]:
            source = content / relative
            output = content / name / relative
            output.parent.mkdir(parents=True, exist_ok=True)
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-threads", "1", "-i", str(source), "-c:a", "libvorbis", "-q:a", sound, "-ar", str(rate), "-ac", "1", str(output)], check=True, timeout=60)
        totals[name] = sum((content / name / relative).stat().st_size for kind in ["images", "sounds"] for relative in catalog[kind])
    totals["high"] = sum((content / relative).stat().st_size for kind in ["images", "sounds"] for relative in catalog[kind])
    catalog["dimensions"] = dimensions
    (content / "assets.json").write_text(json.dumps(catalog, separators=(",", ":")) + "\n", encoding="utf-8")
    print(json.dumps(totals), flush=True)
    return totals
