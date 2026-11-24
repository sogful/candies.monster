import zlib
import zstandard as zstd

    
def _parse_header(data):
    if len(data) < 16:
        raise ValueError("file too small")
    
    magic_le = int.from_bytes(data[0:2], "little")
    if magic_le != 0x08BD:
        raise ValueError(f"unsupported magic {magic_le:#06x}, not a Zepto RAW")

    width = int.from_bytes(data[2:4], "little")
    height = int.from_bytes(data[4:6], "little")

    if not (16 <= width <= 8192 and 16 <= height <= 8192):
        raise ValueError(f"unreasonable dimensions {width}x{height}")

    return width, height


def _decompress_payload(data):
    zstd_magic = b"\x28\xb5\x2f\xfd"

    zstd_start = data.find(zstd_magic, 8)
    if zstd_start != -1:
        try:
            dctx = zstd.ZstdDecompressor()
            return dctx.decompress(data[zstd_start:]), "zstd"
        except (zstd.ZstdError, OSError):
            pass

    for i in range(8, len(data) - 1):
        cmf = data[i]
        flg = data[i + 1]
        if cmf == 0x78 and ((cmf << 8) + flg) % 31 == 0:
            try:
                return zlib.decompress(data[i:]), "zlib"
            except zlib.error:
                continue

    raise ValueError("could not decompress data with zstd or zlib")

def _unpremultiply_rgba(buf):
    out = bytearray(buf)
    for i in range(0, len(out), 4):
        alpha = out[i + 3]
        if alpha > 0:
            out[i] = int(min(255, out[i] * 255 / alpha))
            out[i + 1] = int(min(255, out[i + 1] * 255 / alpha))
            out[i + 2] = int(min(255, out[i + 2] * 255 / alpha))
    return bytes(out)


def decryptrawpy(data):
    if hasattr(data, "tobytes"):
        data = data.tobytes()
    elif not isinstance(data, (bytes, bytearray)):
        data = bytes(data)

    width, height = _parse_header(data)
    expected_bytes = width * height * 4

    decompressed_data, compression_type = _decompress_payload(data)

    if len(decompressed_data) < expected_bytes:
        raise ValueError(
            f"decompressed {len(decompressed_data)} bytes with {compression_type}, "
            f"expected at least {expected_bytes} for {width}x{height}"
        )

    if expected_bytes % 4 != 0:
        raise ValueError(
            f"expected_bytes {expected_bytes} is not divisible by 4 "
            f"for {width}x{height}"
        )

    pixel_bytes = decompressed_data[:expected_bytes]
    pixels = _unpremultiply_rgba(pixel_bytes)

    return {
        "width": width,
        "height": height,
        "pixels": pixels,
        "used_fallback": False,
    }