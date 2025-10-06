import os
import argparse
from PIL import Image, PngImagePlugin
import zstandard as zstd
import zlib
import json
import shutil

import tkinter as tk
from tkinter import filedialog

parser = argparse.ArgumentParser(description="decrypt .raw to .png, or encrypt .png to .raw.")
parser.add_argument("-e", "--encrypt", action="store_true", help="write pngs that were decrypted back to their respective .raw files!")
args = parser.parse_args()

root = tk.Tk()
root.withdraw()

##############################################################

# run the script to decrypt:
def decompr(path, yourfolder, decrypted_root):
    with open(path, "rb") as f:
        data = f.read()

    width = int.from_bytes(data[2:4], "little")
    height = int.from_bytes(data[4:6], "little")

    # see which compression type the files are using.
    # detect zstd by 4-byte magic or locate a valid zlib header
    comptype = None
    zstd_magic = b"\x28\xB5\x2F\xFD" # magic num

    start = None
    if zstd_magic in data:
        start = data.index(zstd_magic)
        payload = data[start:]
        pixels = zstd.ZstdDecompressor().decompress(payload)
        comptype = "zstd" # modern android versions
    else:
        idx = 0
        found = False
        while True:
            try:
                i = data.index(b"\x78", idx)
            except ValueError:
                break
            if i + 1 < len(data):
                cmf = data[i]
                flg = data[i + 1]
                if (cmf * 256 + flg) % 31 == 0:
                    start = i
                    found = True
                    break
            idx = i + 1
        if found:
            payload = data[start:]
            pixels = zlib.decompress(payload)
            comptype = "zlib" # older android versions
        else:
            raise ValueError("nothing found..")

    if len(pixels) != width * height * 4:
        raise ValueError(f"size mismatch?! {len(pixels)} vs {width*height*4}")

    img = Image.frombytes("RGBA", (width, height), pixels)

    rel_dir = os.path.relpath(os.path.dirname(path), yourfolder)
    target_dir = os.path.join(decrypted_root, rel_dir)
    os.makedirs(target_dir, exist_ok=True)
    out_path = os.path.join(target_dir, os.path.splitext(os.path.basename(path))[0] + ".png")

    # add metadata to the png so the script knows what to encrypt it to
    meta = PngImagePlugin.PngInfo()
    meta.add_text("decryption", comptype)
    meta.add_text("originalfile", os.path.basename(path))
    img.save(out_path, pnginfo=meta)

    sidecar = {
        "decryption": comptype,
        "originalfile": os.path.basename(path),
        "width": width,
        "height": height,
    }
    try:
        with open(out_path + ".json", "w", encoding="utf-8") as f:
            json.dump(sidecar, f)
    except Exception:
        pass

# add -e to encrypt back:
def compr(path, yourfolder, original_root):
    img = Image.open(path)

    info = img.info if hasattr(img, "info") else {}
    comptype = info.get("decryption")
    originalfile = info.get("originalfile")

    if not comptype:
        try:
            with open(path + ".json", "r", encoding="utf-8") as f:
                side = json.load(f)
            comptype = side.get("decryption") or comptype
            if not originalfile:
                originalfile = side.get("originalfile")
        except Exception:
            pass

    if not comptype:
        raise ValueError("not apart of decryption so skipped")

    width, height = img.size
    pixels = img.tobytes()

    if len(pixels) != width * height * 4:
        raise ValueError("unexpected pixel buffer length?!")

    if comptype == "zstd":
        cctx = zstd.ZstdCompressor()
        payload = cctx.compress(pixels)
    elif comptype == "zlib":
        payload = zlib.compress(pixels)
    else:
        raise ValueError(f"odd type in metadata: {comptype}")

    header = b"\x00\x00" + width.to_bytes(2, "little") + height.to_bytes(2, "little")
    raw_bytes = header + payload

    out_name = (os.path.splitext(originalfile)[0] + ".raw") if originalfile else (os.path.splitext(os.path.basename(path))[0] + ".raw")
    out_dir = os.path.dirname(path)
    out_path = os.path.join(out_dir, out_name)

    # backup existing .raw to --original-- mirroring structure
    if os.path.exists(out_path):
        rel_dir = os.path.relpath(out_dir, yourfolder)
        backup_dir = os.path.join(original_root, rel_dir)
        os.makedirs(backup_dir, exist_ok=True)
        backup_path = os.path.join(backup_dir, os.path.basename(out_path))
        try:
            shutil.copy2(out_path, backup_path)
        except Exception:
            pass

    with open(out_path, "wb") as f:
        f.write(raw_bytes)
    
##############################################################

if args.encrypt:
    yourfolder = filedialog.askdirectory(title="select the folder to check for .png files (ALSO includes its subfolders)")
    if not yourfolder:
        raise Exception("okay dude whatever")

    original_root = os.path.join(yourfolder, "--original--")
    success_count = 0
    fail_count = 0

    for dirpath, _, filenames in os.walk(yourfolder):
        for fn in filenames:
            if fn.lower().endswith(".png"):
                try:
                    compr(os.path.join(dirpath, fn), yourfolder, original_root)
                    success_count += 1
                except Exception as e:
                    fail_count += 1
                    print(f"fail: {os.path.join(os.path.relpath(dirpath, yourfolder), fn)} ({e})")

    print(f"encryption complete! {success_count} success, {fail_count} failed")
    print(f"original .raw files have been backed up to {yourfolder}/--original--.")
else:
    yourfolder = filedialog.askdirectory(title="select the folder to check for .raw files (ALSO includes its subfolders)")
    if not yourfolder:
        raise Exception("okay dude whatever")

    decrypted_root = os.path.join(yourfolder, "--decrypted--")
    success_count = 0
    fail_count = 0

    for dirpath, _, filenames in os.walk(yourfolder):
        for fn in filenames:
            if fn.lower().endswith(".raw"):
                try:
                    decompr(os.path.join(dirpath, fn), yourfolder, decrypted_root)
                    success_count += 1
                except Exception as e:
                    fail_count += 1
                    print(f"fail: {os.path.join(os.path.relpath(dirpath, yourfolder), fn)} ({e})")

    print(f"decryption complete! {success_count} success, {fail_count} failed")
    print(f".png files have been saved to {yourfolder}/--decrypted--. ")
