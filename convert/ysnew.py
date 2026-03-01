"""Decrypt ZeptoLab's custom RAW format to PNG

Based on decompiled ResourceMgr/Texture2D code:
- Header variants used by loaders:
  - bytes[2:4]  -> width  (little-endian u16)
  - bytes[4:6]  -> height (little-endian u16)
  - byte[6]     -> pixel format enum (0..4)
  - Experiments HD: bytes[7:] is raw pixel payload
  - Time Travel HD: 15-byte header + zlib payload
"""

import struct
import zlib
import sys
from pathlib import Path
import zstandard as zstd


BYTES_PER_PIXEL = {
    0: 4,  # RGBA8888
    1: 2,  # RGB565
    2: 2,  # RGBA4444
    3: 2,  # RGBA5551
    4: 1,  # A8
}


def u8_from_n(v: int, bits: int) -> int:
    max_in = (1 << bits) - 1
    return (v * 255 + (max_in // 2)) // max_in


def unpremultiply_rgba8888(data: bytes) -> bytes:
    out = bytearray(len(data))
    for i in range(0, len(data), 4):
        r = data[i]
        g = data[i + 1]
        b = data[i + 2]
        a = data[i + 3]
        if a == 0:
            out[i : i + 4] = b"\x00\x00\x00\x00"
            continue
        if a < 255:
            r = min(255, (r * 255 + (a // 2)) // a)
            g = min(255, (g * 255 + (a // 2)) // a)
            b = min(255, (b * 255 + (a // 2)) // a)
        out[i : i + 4] = bytes((r, g, b, a))
    return bytes(out)


def decode_fmt_565(data: bytes, w: int, h: int) -> bytes:
    out = bytearray(w * h * 4)
    o = 0
    for (p,) in struct.iter_unpack("<H", data):
        r = u8_from_n((p >> 11) & 0x1F, 5)
        g = u8_from_n((p >> 5) & 0x3F, 6)
        b = u8_from_n(p & 0x1F, 5)
        out[o : o + 4] = bytes((r, g, b, 255))
        o += 4
    return bytes(out)


def decode_fmt_4444(data: bytes, w: int, h: int) -> bytes:
    out = bytearray(w * h * 4)
    o = 0
    for (p,) in struct.iter_unpack("<H", data):
        r = u8_from_n((p >> 12) & 0xF, 4)
        g = u8_from_n((p >> 8) & 0xF, 4)
        b = u8_from_n((p >> 4) & 0xF, 4)
        a = u8_from_n(p & 0xF, 4)
        out[o : o + 4] = bytes((r, g, b, a))
        o += 4
    return bytes(out)


def decode_fmt_5551(data: bytes, w: int, h: int) -> bytes:
    out = bytearray(w * h * 4)
    o = 0
    for (p,) in struct.iter_unpack("<H", data):
        r = u8_from_n((p >> 11) & 0x1F, 5)
        g = u8_from_n((p >> 6) & 0x1F, 5)
        b = u8_from_n((p >> 1) & 0x1F, 5)
        a = 255 if (p & 0x1) else 0
        out[o : o + 4] = bytes((r, g, b, a))
        o += 4
    return bytes(out)


def decode_fmt_a8(data: bytes, w: int, h: int) -> bytes:
    out = bytearray(w * h * 4)
    o = 0
    for a in data:
        out[o : o + 4] = bytes((255, 255, 255, a))
        o += 4
    return bytes(out)


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


def _decompress_payload(data):
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


def decryptrawpy(data):
    # normalize to bytes
    if hasattr(data, "tobytes"):
        data = data.tobytes()
    elif not isinstance(data, (bytes, bytearray)):
        data = bytes(data)

    # parse header
    if len(data) < 7:
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
        # Check if this uses the new format with pixel format enum
        if len(data) >= 7:
            pixel_format = data[6]
            if pixel_format in BYTES_PER_PIXEL:
                # New format: byte[6] is pixel format enum
                print(f"Pixel format enum: {pixel_format}")
                payload = data[7:]
                expected = width * height * BYTES_PER_PIXEL[pixel_format]
                
                if len(payload) < expected:
                    payload = payload + bytes(expected - len(payload))
                payload = payload[:expected]
                
                if pixel_format == 0:
                    pixels = payload
                elif pixel_format == 1:
                    pixels = decode_fmt_565(payload, width, height)
                elif pixel_format == 2:
                    pixels = decode_fmt_4444(payload, width, height)
                elif pixel_format == 3:
                    pixels = decode_fmt_5551(payload, width, height)
                else:  # pixel_format == 4
                    pixels = decode_fmt_a8(payload, width, height)
                
                # Unpremultiply for formats that may have premultiplied alpha
                if pixel_format in (0, 2, 3):
                    pixels = unpremultiply_rgba8888(pixels)
                
                return {
                    "width": width,
                    "height": height,
                    "pixels": pixels,
                    "magic": magic,
                    "used_fallback": False,
                }
        
        # Legacy format: raw RGBA starting at byte 16
        payload = data[16:] if len(data) >= 16 else data[7:]

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
        # Check for 15-byte header format (Time Travel HD)
        if len(data) >= 15:
            pixel_format = data[6]
            if pixel_format in BYTES_PER_PIXEL:
                # New format: 15-byte header with pixel format enum
                out_len = int.from_bytes(data[7:11], "little")
                comp_len = int.from_bytes(data[11:15], "little")
                
                print(f"Pixel format enum: {pixel_format}")
                print(f"Expected decompressed size: {out_len} bytes")
                print(f"Compressed size: {comp_len} bytes")
                
                comp = data[15:]
                if len(comp) < comp_len:
                    raise ValueError(
                        f"Compressed payload too short: need {comp_len} bytes, got {len(comp)} bytes"
                    )
                
                try:
                    decompressed = zlib.decompress(comp[:comp_len])
                except zlib.error:
                    # Fallback to old decompression method
                    decompressed, ctype = _decompress_payload(data)
                    print(f"Compression: {ctype} (fallback)")
                else:
                    print(f"Compression: zlib")
                    if out_len and len(decompressed) != out_len:
                        print(f"Warning: Decompressed size mismatch: header {out_len}, actual {len(decompressed)}")
                
                print(f"Decompressed size: {len(decompressed):,} bytes")
                
                expected = width * height * BYTES_PER_PIXEL[pixel_format]
                if len(decompressed) < expected:
                    decompressed = decompressed + bytes(expected - len(decompressed))
                payload = decompressed[:expected]
                
                if pixel_format == 0:
                    pixels = payload
                elif pixel_format == 1:
                    pixels = decode_fmt_565(payload, width, height)
                elif pixel_format == 2:
                    pixels = decode_fmt_4444(payload, width, height)
                elif pixel_format == 3:
                    pixels = decode_fmt_5551(payload, width, height)
                else:  # pixel_format == 4
                    pixels = decode_fmt_a8(payload, width, height)
                
                # Unpremultiply for formats that may have premultiplied alpha
                if pixel_format in (0, 2, 3):
                    pixels = unpremultiply_rgba8888(pixels)
                
                return {
                    "width": width,
                    "height": height,
                    "pixels": pixels,
                    "magic": magic,
                    "used_fallback": False,
                }
        
        # Legacy format: scan for compressed payload
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
