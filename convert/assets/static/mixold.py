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
    zstd_magic = b"\\x28\\xb5\\x2f\\xfd"

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


def _strict_decryptrawpy(data):
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


def _legacy_decryptrawpy(data):
    import math

    if hasattr(data, "tobytes"):
        data = data.tobytes()
    elif not isinstance(data, bytes):
        data = bytes(data)
    
    if len(data) < 6:
        raise ValueError("file too small")
    
    pixels = None
    width = height = 0
    
    non_zero_count = sum(1 for b in data[:1000] if b != 0)
    total_non_zero = sum(1 for b in data if b != 0)
    
    if len(data) >= 16:
        header_bytes = data[:16]
        
        possible_dims = []
        
        for i in range(0, 12, 2):
            if i + 2 <= len(data):
                val = int.from_bytes(data[i:i+2], "little")
                if 16 <= val <= 4096:
                    possible_dims.append(val)
        
        if len(possible_dims) >= 2:
            for i in range(len(possible_dims)):
                for j in range(i+1, len(possible_dims)):
                    w, h = possible_dims[i], possible_dims[j]
                    pixel_count = w * h
                    expected_bytes = pixel_count * 4
                    
                    
                    if expected_bytes <= len(data) and expected_bytes > len(data) * 0.5:
                        pixel_data = data[:expected_bytes]
                        pixels = pixel_data
                        width, height = w, h
                        
                        rgba_pixels = bytearray(pixels)
                        for i in range(0, len(rgba_pixels), 4):
                            if i + 3 < len(rgba_pixels):
                                rgba_pixels[i], rgba_pixels[i+2] = rgba_pixels[i+2], rgba_pixels[i]
                        
                        return {"width": width, "height": height, "pixels": bytes(rgba_pixels), "used_fallback": False}
    
    if non_zero_count > 100 or total_non_zero > len(data) * 0.1:
        pixel_data = data
        
        if len(pixel_data) % 4 == 0:
            pixel_count = len(pixel_data) // 4
            
            factors = []
            for i in range(1, int(math.sqrt(pixel_count)) + 1):
                if pixel_count % i == 0:
                    factors.append((i, pixel_count // i))
                    if i != pixel_count // i:
                        factors.append((pixel_count // i, i))
            
            factors.sort(key=lambda x: abs(x[0] - x[1]))
            
            for w, h in factors:
                if 16 <= w <= 4096 and 16 <= h <= 4096 and w * h == pixel_count:
                    aspect_ratio = max(w, h) / min(w, h)
                    if aspect_ratio <= 8:
                        width, height = w, h
                        pixels = pixel_data
                        break
            
            if pixels is not None:
                rgba_pixels = bytearray(pixels)
                for i in range(0, len(rgba_pixels), 4):
                    if i + 3 < len(rgba_pixels):
                        rgba_pixels[i], rgba_pixels[i+2] = rgba_pixels[i+2], rgba_pixels[i]
                
                return {"width": width, "height": height, "pixels": bytes(rgba_pixels), "used_fallback": False}
    
    zstd_magic = bytes((0x28, 0xB5, 0x2F, 0xFD))
    zstd_start = data.find(zstd_magic)
    
    zlib_start = -1
    for i in range(len(data)-1):
        cmf = data[i]
        if cmf == 0x78:
            flg = data[i+1]
            if ((cmf * 256) + flg) % 31 == 0:
                zlib_start = i
                break
    
    decompressed_data = None
    compression_type = None
    
    if zstd_start != -1:
        payload = data[zstd_start:]
        try:
            dctx = zstd.ZstdDecompressor()
            decompressed_data = dctx.decompress(payload)
            compression_type = "zstd"
        except Exception as e:
            pass
    
    if decompressed_data is None and zlib_start != -1:
        payload = data[zlib_start:]
        try:
            decompressed_data = zlib.decompress(payload)
            compression_type = "zlib"
        except Exception as e:
            pass
    
    if decompressed_data is None:
        for offset in range(0, len(data) - 100, 100):
            if offset + 100 <= len(data):
                if data[offset:offset+4] == zstd_magic:
                    payload = data[offset:]
                    try:
                        dctx = zstd.ZstdDecompressor()
                        decompressed_data = dctx.decompress(payload)
                        compression_type = "zstd"
                        break
                    except Exception as e:
                        pass
                
                if offset + 1 < len(data) and data[offset] == 0x78:
                    flg = data[offset+1]
                    if ((data[offset] * 256) + flg) % 31 == 0:
                        payload = data[offset:]
                        try:
                            decompressed_data = zlib.decompress(payload)
                            compression_type = "zlib"
                            break
                        except Exception as e:
                            print(f"zlib decompression failed at offset {offset}: {e}")
        
        if decompressed_data is None and len(data) >= 16:
            header_bytes = data[:16]
            
            for i in range(4, 16, 2):
                if i + 2 <= len(data):
                    offset = int.from_bytes(data[i:i+2], "little")
                    if 0 < offset < len(data) - 100:
                        if offset + 4 <= len(data) and data[offset:offset+4] == zstd_magic:
                            payload = data[offset:]
                            try:
                                dctx = zstd.ZstdDecompressor()
                                decompressed_data = dctx.decompress(payload)
                                compression_type = "zstd"
                                break
                            except Exception as e:
                                print(f"zstd decompression failed at header offset {offset}: {e}")
                        
                        if offset + 1 < len(data) and data[offset] == 0x78:
                            flg = data[offset+1]
                            if ((data[offset] * 256) + flg) % 31 == 0:
                                payload = data[offset:]
                                try:
                                    decompressed_data = zlib.decompress(payload)
                                    compression_type = "zlib"
                                    break
                                except Exception as e:
                                    print(f"zlib decompression failed at header offset {offset}: {e}")
        
        if decompressed_data is None:
            raise ValueError("could not decompress data with zstd or zlib")
    
    pixel_count = len(decompressed_data) // 4
    if len(decompressed_data) % 4 != 0:
        raise ValueError(f"decompressed data size {len(decompressed_data)} is not divisible by 4")
    
    pixels = None
    width = height = 0
    
    # method 1
    width_height_candidates = []
    
    if len(data) >= 10:
        width_height_candidates.extend([
            (int.from_bytes(data[2:4], "little"), int.from_bytes(data[4:6], "little")),
            (int.from_bytes(data[6:8], "little"), int.from_bytes(data[8:10], "little")),
        ])
    
    for offset in range(0, min(20, len(data) - 8)):
        if offset + 8 <= len(data):
            w1 = int.from_bytes(data[offset:offset+2], "little")
            h1 = int.from_bytes(data[offset+2:offset+4], "little")
            w2 = int.from_bytes(data[offset+4:offset+6], "little")
            h2 = int.from_bytes(data[offset+6:offset+8], "little")
            width_height_candidates.extend([(w1, h1), (w2, h2)])
            
            if offset + 8 <= len(data):
                w32 = int.from_bytes(data[offset:offset+4], "little")
                h32 = int.from_bytes(data[offset+4:offset+8], "little")
                width_height_candidates.extend([(w32, h32)])
    
    for offset in range(0, min(20, len(data) - 8)):
        if offset + 8 <= len(data):
            w1 = int.from_bytes(data[offset:offset+2], "big")
            h1 = int.from_bytes(data[offset+2:offset+4], "big")
            w2 = int.from_bytes(data[offset+4:offset+6], "big")
            h2 = int.from_bytes(data[offset+6:offset+8], "big")
            width_height_candidates.extend([(w1, h1), (w2, h2)])
            
            if offset + 8 <= len(data):
                w32 = int.from_bytes(data[offset:offset+4], "big")
                h32 = int.from_bytes(data[offset+4:offset+8], "big")
                width_height_candidates.extend([(w32, h32)])
    
    width_height_candidates = list(set([(w, h) for w, h in width_height_candidates 
                                      if w > 0 and h > 0 and w < 50000 and h < 50000]))
    
    def dimension_score(w, h):
        common_dims = [(320, 480), (480, 800), (640, 480), (800, 480), (480, 320), (480, 640),
                       (1024, 768), (768, 1024), (1280, 720), (720, 1280), (1920, 1080), (1080, 1920),
                       (2048, 2048), (1024, 1024), (512, 512), (256, 256), (4096, 4096)]
        if (w, h) in common_dims:
            return 100
        
        if w >= 2048 or h >= 2048:
            aspect_ratio = max(w, h) / min(w, h)
            if aspect_ratio <= 2:
                return 90
            elif aspect_ratio <= 4:
                return 80
            else:
                return 60
        
        w_score = 10 if w % 16 == 0 else 5 if w % 8 == 0 else 1
        h_score = 10 if h % 16 == 0 else 5 if h % 8 == 0 else 1
        aspect_ratio = max(w, h) / min(w, h)
        aspect_penalty = max(0, (aspect_ratio - 3) * 2)
        return w_score + h_score - aspect_penalty
    
    valid_header_candidates = [(w, h) for w, h in width_height_candidates 
                              if w * h == pixel_count and 
                                 w >= 16 and h >= 16 and
                                 max(w, h) / min(w, h) <= 10 and
                                 w <= 8192 and h <= 8192]
    valid_header_candidates.sort(key=lambda x: dimension_score(x[0], x[1]), reverse=True)
    
    for w, h in valid_header_candidates:
        pixels = decompressed_data
        width, height = w, h
        break
    
    # method 2 (fallback which almost always leaves corrupted images)
    used_fallback = False
    if pixels is None:
        common_ratios = [(480, 800), (320, 480), (800, 480), (480, 320), (640, 480), (480, 640), 
                         (720, 1280), (1280, 720), (1080, 1920), (1920, 1080), (1024, 768), (768, 1024),
                         (2048, 2048), (1024, 1024), (512, 512), (256, 256), (4096, 4096), (2048, 1024), (1024, 2048)]
        
        for w, h in common_ratios:
            if w * h == pixel_count:
                pixels = decompressed_data
                width, height = w, h
                used_fallback = True
                break
    
    # method 3
    if pixels is None:
        factors = []
        for i in range(1, int(math.sqrt(pixel_count)) + 1):
            if pixel_count % i == 0:
                factors.append((i, pixel_count // i))
                if i != pixel_count // i:
                    factors.append((pixel_count // i, i))
        
        def reasonableness_score(w, h):
            aspect_ratio = max(w, h) / min(w, h)
            width_multiple = 1 if w % 16 == 0 else 0.5 if w % 8 == 0 else 0.1
            height_multiple = 1 if h % 16 == 0 else 0.5 if h % 8 == 0 else 0.1
            return width_multiple + height_multiple - (aspect_ratio - 1) * 0.1
        
        reasonable_factors = [(w, h) for w, h in factors 
                             if 16 <= w <= 50000 and 16 <= h <= 50000 and w * h == pixel_count]
        reasonable_factors.sort(key=lambda x: reasonableness_score(x[0], x[1]), reverse=True)
        
        for w, h in reasonable_factors:
            pixels = decompressed_data
            width, height = w, h
            break
    
    if pixels is None:
        error_msg = f"could not find valid dimensions for {pixel_count} pixels"
        error_msg += f", decompressed {len(decompressed_data)} bytes using {compression_type}"
        error_msg += f", tried {len(width_height_candidates)} header candidates: {width_height_candidates[:5]}"
        raise ValueError(error_msg)
    
    return {"width": width, "height": height, "pixels": pixels, "used_fallback": used_fallback}


def decryptrawpy(data):
    try:
        return _strict_decryptrawpy(data)
    except ValueError as strict_error:
        legacy_result = _legacy_decryptrawpy(data)
        legacy_result.setdefault("used_fallback", True)
        legacy_result["legacy_mode"] = True
        return legacy_result