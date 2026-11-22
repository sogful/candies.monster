import json
from pathlib import Path
from math import ceil
import subprocess
from PIL import Image

########################################################################

def mediumscale(relative):
    if relative.startswith(("images/backgrounds/", "images/bgr_")):
        return 0.65
    if relative.startswith(("images/char_", "images/candies/")):
        return 0.8
    if relative in {"images/skin_selection.webp", "images/fingertrace_skin.webp", "images/candy_selection_fx.webp"}:
        return 0.75
    return 1


def texture(source, output, scale, quality):
    with Image.open(source) as image:
        dimensions = list(image.size)
        if scale != 1:
            size = (ceil(image.width * scale), ceil(image.height * scale))
            image = image.resize(size, Image.Resampling.LANCZOS)
        image.save(output, "WEBP", quality=quality, method=5)
        return dimensions


def audio(source, output, name, relative):
    music = relative == "sounds/game_music.ogg"
    quality = "2" if name == "medium" else "-1"
    rate = "44100" if name == "medium" and music else "32000" if name == "medium" else "22050"
    channels = "2" if name == "medium" and music else "1"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-threads", "1", "-i", str(source), "-c:a", "libvorbis", "-q:a", quality, "-ar", rate, "-ac", channels, str(output)], check=True, timeout=60)


def variants(site, source):
    content = site / "content"
    catalog = json.loads((content / "assets.json").read_text(encoding="utf-8"))
    totals = {}
    dimensions = {}
    for name, quality in [("medium", 35), ("low", 55)]:
        for relative in catalog["images"]:
            image = content / relative
            output = content / name / relative
            output.parent.mkdir(parents=True, exist_ok=True)
            interface = image.stem.startswith(("cursor", "menu_", "font_", "big_font", "small_font", "hud_", "loader", "zepto", "skin_", "fingertrace_skin"))
            scale = mediumscale(relative) if name == "medium" else 1 if interface else 0.5
            dimensions[relative] = texture(image, output, scale, 35 if interface else quality)
        for relative in catalog["sounds"]:
            output = content / name / relative
            output.parent.mkdir(parents=True, exist_ok=True)
            original = source / "content" / Path(relative).with_suffix(".wav" if "/sfx/" in relative else ".flac")
            audio(original if name == "medium" else content / relative, output, name, relative)
        totals[name] = sum((content / name / relative).stat().st_size for kind in ["images", "sounds"] for relative in catalog[kind])
    totals["high"] = sum((content / relative).stat().st_size for kind in ["images", "sounds"] for relative in catalog[kind])
    catalog["dimensions"] = dimensions
    (content / "assets.json").write_text(json.dumps(catalog, separators=(",", ":")) + "\n", encoding="utf-8")
    print(json.dumps(totals), flush=True)
    return totals
