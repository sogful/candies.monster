import json
from pathlib import Path
import shutil
import subprocess

keepmenus = {
    "menu_buttons", "menu_level_ui", "menu_pause", "menu_results", "menu_options_packed",
    "menu_result_screen_halloween",
}
discard = {
    "CutTheRopeDXLogo", "candy_selection_fx", "skin_selection", "skin_bg",
    "xmas_hat_logo", "menu_main_bgr_horiz", "menu_bgr_default_horiz",
    "menu_campaign_bgr_horiz", "menu_loading_bgr_exp",
}

########################################################################

def slim(site, excluded, source):
    content = site / "content"
    catalog = json.loads((content / "assets.json").read_text(encoding="utf-8"))
    removed = set()
    for category, paths in catalog.items():
        for relative in paths:
            path = Path(relative)
            reject = category == "sounds" and path.parent.as_posix() == "sounds" and path.stem != "game_music"
            reject |= category == "images" and (path.stem in discard or (path.stem.startswith("menu_") and path.stem not in keepmenus))
            if reject:
                removed.add(relative)
                saved = excluded / "content" / relative
                saved.parent.mkdir(parents=True, exist_ok=True)
                shutil.move(str(content / relative), saved)
        catalog[category] = [relative for relative in paths if relative not in removed]
    metadata = json.loads((content / "tier0.json").read_text(encoding="utf-8"))
    metadata = {key: value for key, value in metadata.items() if not key.startswith("maps/") and str(Path(key).with_suffix(".webp")).replace("\\", "/") not in removed}
    for name, data in [("assets.json", catalog), ("tier0.json", metadata)]:
        (content / name).write_text(json.dumps(data, separators=(",", ":")) + "\n", encoding="utf-8")
    manifest = content / ".build-manifest.json"
    if manifest.exists():
        saved = excluded / "content/.build-manifest.json"
        saved.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(manifest), saved)
    for relative in catalog["sounds"]:
        path = content / relative
        original = source / "content" / Path(relative).with_suffix(".wav" if path.parent.name == "sfx" else ".flac")
        if not original.is_file():
            raise RuntimeError(f"Missing original preview sound: {original}")
        saved = excluded / "opus" / relative
        saved.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(path), saved)
        quality = "3" if path.parent.name == "sfx" else "4"
        subprocess.run(["ffmpeg", "-v", "error", "-threads", "1", "-i", str(original), "-c:a", "libvorbis", "-q:a", quality, str(path)], check=True, timeout=60)
    print(f"Preview content: {len(catalog['images'])} images, {len(catalog['sounds'])} sounds, {len(metadata)} metadata entries; removed {len(removed)} assets.", flush=True)
