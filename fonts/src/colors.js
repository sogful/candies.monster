function hextorgba(h) {
    if (!h || typeof h !== "string" || h.length < 7) return "rgba(0,0,0,1)"
    const r = parseInt(h.slice(1, 3), 16) || 0
    const g = parseInt(h.slice(3, 5), 16) || 0
    const b = parseInt(h.slice(5, 7), 16) || 0
    let a = 1
    if (h.length >= 9) {
        const alpha = parseInt(h.slice(7, 9), 16)
        a = isNaN(alpha) ? 1 : alpha / 255
    }
    return `rgba(${r},${g},${b},${a})`
}
function hexrgbatohexrgb(h) {
    if (!h || typeof h !== "string" || h.length < 7) return "#000000"
    return h.slice(0, 7)
}
function rgbtohsl(r, g, b) {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2

    if (max === min) {
        h = s = 0
    } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
            case g: h = ((b - r) / d + 2) / 6; break
            case b: h = ((r - g) / d + 4) / 6; break
        }
    }
    return [h * 360, s, l]
}
function hsltorgb(h, s, l) {
    h /= 360
    let r, g, b

    if (s === 0) {
        r = g = b = l
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1
            if (t > 1) t -= 1
            if (t < 1/6) return p + (q - p) * 6 * t
            if (t < 1/2) return q
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
            return p
        }
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        r = hue2rgb(p, q, h + 1/3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1/3)
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}
function applyhueshift(img, targetColorHex) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height

        ctx.drawImage(img, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        const targetR = parseInt(targetColorHex.slice(1, 3), 16)
        const targetG = parseInt(targetColorHex.slice(3, 5), 16)
        const targetB = parseInt(targetColorHex.slice(5, 7), 16)
        const [targetH] = rgbtohsl(targetR, targetG, targetB)

        const refR = 0xe3
        const refG = 0x53
        const refB = 0x3e
        const [refH] = rgbtohsl(refR, refG, refB)
        const hueShift = targetH - refH

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]
            const a = data[i + 3]

            if (a === 0) continue
            const [h, s, l] = rgbtohsl(r, g, b)
            let newH = (h + hueShift + 360) % 360
            const [newR, newG, newB] = hsltorgb(newH, s, l)

            data[i] = newR
            data[i + 1] = newG
            data[i + 2] = newB
        }

        ctx.putImageData(imageData, 0, 0)
        const shiftedimage = new Image()
        shiftedimage.onload = () => resolve(shiftedimage)
        shiftedimage.src = canvas.toDataURL()
    })
}
