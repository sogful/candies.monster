#!/usr/bin/env python3
"""Convert ZeptoLab custom .raw texture files to PNG.

Version 2.1: Extract constant names and add docstrings
Version 2.0: Support ZSTD decompression
Version 1.0: Initial release

Based on decompiled ResourceMgr/Texture2D code:
- Header variants used by loaders:
  - bytes[2:4]  -> width  (little-endian u16)
  - bytes[4:6]  -> height (little-endian u16)
  - byte[6]     -> pixel format enum (0..4)
  - bytes[7:]   -> raw pixel payload
  - Some ZeptoLab games might have 15-byte header + zlib payload
"""

import argparse
import struct
import sys
import zlib
from pathlib import Path

import zstandard as zstd

ZSTD_MAGIC = b"\x28\xb5\x2f\xfd"
TRANSPARENT_PIXEL = b"\x00\x00\x00\x00"

# ZeptoLab .raw header magic values (first two bytes, little-endian)
COMPRESSED_MAGIC_ZLIB = 0x07BD
COMPRESSED_MAGIC_ZSTD = 0x08BD

# Header layout
HEADER_MIN_SIZE = 7
COMPRESSED_HEADER_SIZE = 15

# Pixel format enum values
FMT_RGBA8888 = 0
FMT_RGB565 = 1
FMT_RGBA4444 = 2
FMT_RGBA5551 = 3
FMT_A8 = 4

BYTES_PER_PIXEL: dict[int, int] = {
    FMT_RGBA8888: 4,
    FMT_RGB565: 2,
    FMT_RGBA4444: 2,
    FMT_RGBA5551: 2,
    FMT_A8: 1,
}


def u8_from_n(v: int, bits: int) -> int:
    """Scale an N-bit unsigned integer to the full 0-255 range with rounding."""
    max_in: int = (1 << bits) - 1
    return (v * 255 + (max_in // 2)) // max_in


def unpremultiply_rgba8888(data: bytes) -> bytes:
    """Convert premultiplied-alpha RGBA pixels to straight alpha."""
    out = bytearray(len(data))
    for i in range(0, len(data), 4):
        r: int = data[i]
        g: int = data[i + 1]
        b: int = data[i + 2]
        a: int = data[i + 3]
        if a == 0:
            out[i : i + 4] = TRANSPARENT_PIXEL
            continue
        if a < 255:
            r: int = min(255, (r * 255 + (a // 2)) // a)
            g: int = min(255, (g * 255 + (a // 2)) // a)
            b: int = min(255, (b * 255 + (a // 2)) // a)
        out[i : i + 4] = bytes((r, g, b, a))
    return bytes(out)


def decode_fmt_565(data: bytes, w: int, h: int) -> bytes:
    """Decode RGB565 packed pixels to RGBA8888."""
    out = bytearray(w * h * 4)
    o = 0
    for (p,) in struct.iter_unpack("<H", data):
        r: int = u8_from_n((p >> 11) & 0x1F, 5)
        g: int = u8_from_n((p >> 5) & 0x3F, 6)
        b: int = u8_from_n(p & 0x1F, 5)
        out[o : o + 4] = bytes((r, g, b, 255))
        o += 4
    return bytes(out)


def decode_fmt_4444(data: bytes, w: int, h: int) -> bytes:
    """Decode RGBA4444 packed pixels to RGBA8888."""
    out = bytearray(w * h * 4)
    o = 0
    for (p,) in struct.iter_unpack("<H", data):
        r: int = u8_from_n((p >> 12) & 0xF, 4)
        g: int = u8_from_n((p >> 8) & 0xF, 4)
        b: int = u8_from_n((p >> 4) & 0xF, 4)
        a: int = u8_from_n(p & 0xF, 4)
        out[o : o + 4] = bytes((r, g, b, a))
        o += 4
    return bytes(out)


def decode_fmt_5551(data: bytes, w: int, h: int) -> bytes:
    """Decode RGBA5551 packed pixels to RGBA8888."""
    out = bytearray(w * h * 4)
    o = 0
    for (p,) in struct.iter_unpack("<H", data):
        r: int = u8_from_n((p >> 11) & 0x1F, 5)
        g: int = u8_from_n((p >> 6) & 0x1F, 5)
        b: int = u8_from_n((p >> 1) & 0x1F, 5)
        a: int = 255 if (p & 0x1) else 0
        out[o : o + 4] = bytes((r, g, b, a))
        o += 4
    return bytes(out)


def decode_fmt_a8(data: bytes, w: int, h: int) -> bytes:
    """Decode A8 (alpha-only) pixels to white RGBA8888 with varying alpha."""
    out = bytearray(w * h * 4)
    o = 0
    for a in data:
        out[o : o + 4] = bytes((255, 255, 255, a))
        o += 4
    return bytes(out)


def parse_zeptolab_raw_bytes(
    blob: bytes, base_path: Path | None = None
) -> tuple[int, int, int, bytes]:
    """Parse ZeptoLab .raw bytes. If base_path is set, append .raw1, .raw2, ... when needed."""
    if len(blob) < HEADER_MIN_SIZE:
        raise ValueError("File too small to be a ZeptoLab .raw texture")

    magic: int = int.from_bytes(blob[0:2], "little")

    # Compressed raw: header is 15 bytes.
    # [0..1]=magic, [2..3]=w, [4..5]=h, [6]=fmt, [7..10]=out_len, [11..14]=comp_len
    if magic in (COMPRESSED_MAGIC_ZLIB, COMPRESSED_MAGIC_ZSTD):
        if len(blob) < COMPRESSED_HEADER_SIZE:
            raise ValueError("File too small for compressed header")
        width: int = int.from_bytes(blob[2:4], "little")
        height: int = int.from_bytes(blob[4:6], "little")
        pixel_format: int = blob[6]
        out_len: int = int.from_bytes(blob[7:11], "little")
        comp_len: int = int.from_bytes(blob[11:15], "little")
        if pixel_format not in BYTES_PER_PIXEL:
            raise ValueError(f"Unsupported pixel format {pixel_format}")

        comp = bytearray(blob[15:])

        if base_path is not None:
            part_idx = 1
            while len(comp) < comp_len:
                part = Path(f"{base_path}{part_idx}")
                if not part.exists():
                    break
                comp.extend(part.read_bytes())
                part_idx += 1
        if len(comp) < comp_len:
            raise ValueError(
                f"Compressed payload too short: need {comp_len} bytes, got {len(comp)} bytes"
            )
        comp_bytes = bytes(comp[:comp_len])
        if comp_bytes[:4] == ZSTD_MAGIC:
            dctx = zstd.ZstdDecompressor()
            payload: bytes = dctx.decompress(
                comp_bytes, max_output_size=out_len or (width * height * 4)
            )
        else:
            payload: bytes = zlib.decompress(comp_bytes)
        if out_len and len(payload) != out_len:
            raise ValueError(
                f"Decompressed size mismatch: header {out_len}, actual {len(payload)}"
            )
        return width, height, pixel_format, payload

    # Uncompressed raw.
    width: int = int.from_bytes(blob[2:4], "little")
    height: int = int.from_bytes(blob[4:6], "little")
    pixel_format: int = blob[6]
    if pixel_format not in BYTES_PER_PIXEL:
        raise ValueError(f"Unsupported pixel format {pixel_format}")
    return width, height, pixel_format, blob[7:]


def parse_zeptolab_raw(raw_path: Path) -> tuple[int, int, int, bytes]:
    return parse_zeptolab_raw_bytes(raw_path.read_bytes(), base_path=raw_path)


def decode_raw_payload_to_rgba(
    width: int,
    height: int,
    pixel_format: int,
    payload: bytes,
    *,
    unpremultiply: bool = True,
) -> bytes:
    if width <= 0 or height <= 0:
        raise ValueError(f"Invalid dimensions: {width}x{height}")

    expected: int = width * height * BYTES_PER_PIXEL[pixel_format]
    if len(payload) < expected:
        raise ValueError(
            f"Payload too short: need {expected} bytes, got {len(payload)} bytes"
        )
    payload = payload[:expected]

    if pixel_format == FMT_RGBA8888:
        rgba: bytes = payload
    elif pixel_format == FMT_RGB565:
        rgba = decode_fmt_565(payload, width, height)
    elif pixel_format == FMT_RGBA4444:
        rgba = decode_fmt_4444(payload, width, height)
    elif pixel_format == FMT_RGBA5551:
        rgba = decode_fmt_5551(payload, width, height)
    else:
        rgba = decode_fmt_a8(payload, width, height)

    if unpremultiply and pixel_format in (FMT_RGBA8888, FMT_RGBA4444, FMT_RGBA5551):
        rgba = unpremultiply_rgba8888(rgba)

    return rgba


def decryptrawpy(data):
    if hasattr(data, "tobytes"):
        data = data.tobytes()
    elif not isinstance(data, (bytes, bytearray)):
        data = bytes(data)

    width, height, pixel_format, payload = parse_zeptolab_raw_bytes(data, base_path=None)
    rgba = decode_raw_payload_to_rgba(
        width, height, pixel_format, payload, unpremultiply=True
    )
    return {
        "width": width,
        "height": height,
        "pixels": rgba,
        "used_fallback": False,
    }


def convert(
    raw_path: Path, out_path: Path, flip_y: bool = False, unpremultiply: bool = True
) -> None:
    from PIL import Image

    width, height, pixel_format, payload = parse_zeptolab_raw(raw_path)
    rgba = decode_raw_payload_to_rgba(
        width, height, pixel_format, payload, unpremultiply=unpremultiply
    )

    img: Image.Image = Image.frombytes("RGBA", (width, height), rgba)
    if flip_y:
        img = img.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
    img.save(out_path)


def main() -> None:
    """CLI entry point for raw-to-PNG conversion."""
    parser = argparse.ArgumentParser(
        description="Convert ZeptoLab .raw texture files to PNG"
    )
    parser.add_argument("raw", type=Path, help="Input .raw file")
    parser.add_argument("png", type=Path, nargs="?", help="Output .png path")
    parser.add_argument(
        "--flip-y",
        action="store_true",
        help="Flip output vertically (if texture appears upside down)",
    )
    parser.add_argument(
        "--no-unpremultiply",
        action="store_true",
        help="Keep premultiplied-alpha RGB values as-is",
    )
    args: argparse.Namespace = parser.parse_args()

    raw_path = args.raw
    out_path = args.png or raw_path.with_suffix(".png")
    convert(
        raw_path,
        out_path,
        flip_y=args.flip_y,
        unpremultiply=not args.no_unpremultiply,
    )
    print(f"wrote {out_path}")


if __name__ == "__main__":
    # Pyodide runs this whole file with __name__ == "__main__" but no CLI argv; skip argparse.
    if sys.platform != "emscripten":
        main()
