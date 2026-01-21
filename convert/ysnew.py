"""Decrypt ZeptoLab's custom RAW format to PNG"""

import zlib
import sys
from pathlib import Path
import zstandard as zstd


def _decompress_payload(data):
    """Find and decompress payload using zstd or zlib."""
    zstd_magic = b"\x28\xb5\x2f\xfd"

    # Try Zstandard first
    zstd_start = data.find(zstd_magic, 8)
    if zstd_start != -1:
        try:
            dctx = zstd.ZstdDecompressor()
            return dctx.decompress(data[zstd_start:]), "zstd"
        except (zstd.ZstdError, OSError):
            pass

    # Fallback: scan for zlib stream
    for i in range(8, len(data) - 1):
        cmf = data[i]
        flg = data[i + 1]
        if cmf == 0x78 and ((cmf << 8) + flg) % 31 == 0:
            try:
                return zlib.decompress(data[i:]), "zlib"
            except zlib.error:
                continue

    raise ValueError("could not decompress data with zstd or zlib")


def _rgba4444_to_rgba8888(buf):
    out = bytearray(len(buf) * 2)
    j = 0
    for i in range(0, len(buf), 2):
        v = buf[i] | (buf[i + 1] << 8)

        r = ((v >> 12) & 0xF) * 17
        g = ((v >> 8) & 0xF) * 17
        b = ((v >> 4) & 0xF) * 17
        a = (v & 0xF) * 17

        out[j] = r
        out[j + 1] = g
        out[j + 2] = b
        out[j + 3] = a
        j += 4

    return bytes(out)


def decryptrawpy(data):
    # normalize to bytes
    if hasattr(data, "tobytes"):
        data = data.tobytes()
    elif not isinstance(data, (bytes, bytearray)):
        data = bytes(data)

    # parse header
    if len(data) < 16:
        raise ValueError("file too small")

    magic = int.from_bytes(data[0:2], "little")
    width = int.from_bytes(data[2:4], "little")
    height = int.from_bytes(data[4:6], "little")

    if not (16 <= width <= 8192 and 16 <= height <= 8192):
        raise ValueError(f"unreasonable dimensions {width}x{height}")

    print(f"Magic: {magic:#06x}")
    print(f"Declared dimensions: {width}x{height}")

    # --- Variant A: 07BC = RAW RGBA (iOS HD) ------------------------------------
    if magic == 0x07BC:
        expected_rgba = width * height * 4
        payload = data[16:]

        # Pad if necessary
        if len(payload) < expected_rgba:
            payload = payload + bytes(expected_rgba - len(payload))

        pixels = payload[:expected_rgba]

        # Check if this might be BGR instead of RGB
        # Sample some pixels to detect if channels are swapped
        bgr_detected = False

        # Sample 100 colored pixels to check
        sample_count = 0
        blue_dominant = 0
        red_dominant = 0

        for i in range(min(width * height, 10000)):
            r = pixels[i * 4]
            g = pixels[i * 4 + 1]
            b = pixels[i * 4 + 2]
            a = pixels[i * 4 + 3]

            # Only check non-transparent, colored pixels
            if a > 50 and (r != g or g != b):
                sample_count += 1
                if b > r + 50 and b > g + 30:  # Strong blue
                    blue_dominant += 1
                if r > b + 50 and r > g + 30:  # Strong red
                    red_dominant += 1

                if sample_count >= 100:
                    break

        # If blue is much more dominant than red, likely BGR
        if sample_count > 20 and blue_dominant > red_dominant * 2:
            print(f"BGR format detected (blue={blue_dominant}, red={red_dominant})")
            print("Converting BGR to RGB...")
            bgr_detected = True

            # Swap R and B channels
            pixels_array = bytearray(pixels)
            for i in range(width * height):
                r = pixels_array[i * 4]
                b = pixels_array[i * 4 + 2]
                pixels_array[i * 4] = b  # R = old B
                pixels_array[i * 4 + 2] = r  # B = old R
            pixels = bytes(pixels_array)

        return {
            "width": width,
            "height": height,
            "pixels": pixels,
            "magic": magic,
            "bgr_swapped": bgr_detected,
            "used_fallback": False,
        }

    # --- Compressed variants: 07BD and 08BD ---------------------------------
    if magic in (0x07BD, 0x08BD):
        decompressed, ctype = _decompress_payload(data)
        print(f"Compression: {ctype}")
        print(f"Decompressed size: {len(decompressed):,} bytes")

        pixel_count = width * height
        bpp = len(decompressed) // pixel_count
        print(f"Bytes per pixel: {bpp}")

        # Handle the actual format based on decompressed size
        if bpp == 4:
            # RGBA8888 - straight alpha, no unpremultiplication
            print("Format: RGBA8888 (straight alpha)")
            pixels = decompressed[: pixel_count * 4]

        elif bpp == 2:
            # Both 0x07BD and 0x08BD with 2 bpp are RGBA4444
            print("Format: RGBA4444")
            pixels = _rgba4444_to_rgba8888(decompressed[: pixel_count * 2])

        else:
            raise ValueError(f"unsupported pixel format: {bpp} bytes per pixel")

        return {
            "width": width,
            "height": height,
            "pixels": pixels,
            "magic": magic,
            "used_fallback": False,
        }

    raise ValueError(f"unknown Zepto RAW magic {magic:#06x}")


if __name__ == "__main__":
    try:
        from PIL import Image
        
        def process_file(infile: Path):
            """Main function to process file or every raw file in a folder"""
            data = infile.read_bytes()
            try:
                result = decryptrawpy(data)
            except (ValueError, OSError) as e:
                print(f"❌ [FAIL] {infile.name}: {e}")
                return

            w = result["width"]
            h = result["height"]
            pixels = result["pixels"]
            magic = result["magic"]

            outfile = infile.with_suffix(".png")

            img = Image.frombytes("RGBA", (w, h), pixels)
            img.save(outfile)

            print(f"✅ [OK] {infile.name} → {outfile.name} ({w}×{h}, magic={magic:#06x})")

        # --- CLI ---
        if len(sys.argv) < 2:
            print("ℹ️ Usage: raw2png.py input.raw OR raw2png.py folder/")
            sys.exit(1)

        target = Path(sys.argv[1])

        # Case 1: user passed a single file
        if target.is_file():
            process_file(target)
            sys.exit(0)

        # Case 2: user passed a folder
        if target.is_dir():
            raws = sorted(list(target.glob("*.raw")) + list(target.glob("*.raw.zst")))
            if not raws:
                print("⚠️ Warning: No .raw files found in folder.")
                sys.exit(1)

            print(f"✅ Found {len(raws)} .raw files in {target}")
            for f in raws:
                process_file(f)

            print("✅ Done.")
            sys.exit(0)

        print("⚠️ Warning: Input must be a file or folder.")
    except ImportError:
        pass
