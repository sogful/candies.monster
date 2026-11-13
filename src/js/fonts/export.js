document.querySelector(".downloadbutton").addEventListener("click", async function(event) {
    event.preventDefault()
    if (!state.text) return
    const exportstate = {...state}
    if (exportstate.addtexttobutton) {
        await updatebuttonpreview()
        const previewwidth = document.querySelector(".buttonbackground").getBoundingClientRect().width
        const previewscale = currenttextscale
        const p_el = document.querySelector(".textpreview")
        const s_el = document.querySelector(".textshadow")
        const originaltransform = p_el.style.transform
        p_el.style.transform = "translate(-50%, -50%)"
        void p_el.offsetHeight

        const getactualbounds = (el) => {
            const range = document.createRange()
            range.selectNodeContents(el)
            return range.getBoundingClientRect()
        }
        const p_rect = getactualbounds(p_el)
        const s_rect = s_el.style.display !== "none" ? getactualbounds(s_el) : p_rect
        const minx = Math.min(p_rect.left, s_rect.left)
        const miny = Math.min(p_rect.top, s_rect.top)
        const maxx = Math.max(p_rect.right, s_rect.right)
        const maxy = Math.max(p_rect.bottom, s_rect.bottom)
        const textwidth = maxx - minx
        const textheight = maxy - miny

        p_el.style.transform = originaltransform
        const variant = {...currentbuttonvariant}
        let buttonimg
        try {
            buttonimg = new Image()
            buttonimg.src = document.querySelector(".buttonbackground").src
            await buttonimg.decode()
        } catch (e) {
            console.error("failed to load button image:", e)
            return
        }

        const paddingpch = 0.1
        const paddingpcv = 0.12
        const constrainedtextwidth = Math.min(950, Math.max(200, textwidth))
        const requiredbuttonwidth = constrainedtextwidth / (1 - paddingpch * 2)
        const previewmaxwidth = Math.min(950, window.innerWidth * 0.9, requiredbuttonwidth)
        const previewmaxheight = window.innerHeight * 0.8
        const buttonaspectratio = buttonimg.width / buttonimg.height

        let previewbuttonwidth, previewbuttonheight
        if (previewmaxwidth / previewmaxheight > buttonaspectratio) {
            previewbuttonheight = previewmaxheight
            previewbuttonwidth = previewbuttonheight * buttonaspectratio
            if (previewbuttonwidth > 950) {
                previewbuttonwidth = 950
                previewbuttonheight = previewbuttonwidth / buttonaspectratio
            }
        } else {
            previewbuttonwidth = Math.min(previewmaxwidth, 950)
            previewbuttonheight = previewbuttonwidth / buttonaspectratio
        }

        const previewavailablewidth = previewbuttonwidth * (1 - paddingpch * 2)
        const previewavailableheight = previewbuttonheight * (1 - paddingpcv * 2)
        const scalex = previewavailablewidth / textwidth
        const scaley = previewavailableheight / textheight
        const textscale = previewscale

        const exportbuttonwidth = variant.width
        const buttonwidth = exportbuttonwidth
        const buttonheight = buttonwidth / buttonaspectratio

        const f_sz = parseFloat(getComputedStyle(p_el).fontSize)
        const scale = f_sz / 68

        const html2canvasscale = 2
        const scaledtextwidth = textwidth * textscale
        const scaledtextheight = textheight * textscale
        const containerpadding = 50
        const containerwidth = scaledtextwidth + containerpadding * 2
        const containerheight = scaledtextheight + containerpadding * 2
        const container = document.createElement("div")
        container.style.cssText = `position:fixed;left:-9999px;top:0;width:${containerwidth}px;height:${containerheight}px;background:transparent;z-index:-1;overflow:visible;display:flex;justify-content:center;align-items:center;`
        document.body.appendChild(container)
        const clone = document.createElement("div")
        clone.style.cssText = `position:relative;width:${scaledtextwidth}px;height:${scaledtextheight}px;display:flex;justify-content:center;align-items:center;`

        const copystyle = (src, dest, extra = {}) => {
            const s = getComputedStyle(src)
            const originalfontsize = parseFloat(s.fontSize) || 68
            const scaledfontsize = originalfontsize * textscale
            const originalletterspacing = parseFloat(s.letterSpacing) || 0
            const scaledletterspacing = originalletterspacing * textscale

            let lineheightpx
            const lineheightvalue = s.lineHeight
            if (lineheightvalue.includes("px")) {
                lineheightpx = parseFloat(lineheightvalue) * textscale
            } else {
                const lineheightratio = parseFloat(lineheightvalue) || 1.2
                lineheightpx = scaledfontsize * lineheightratio
            }

            dest.style.fontFamily = s.fontFamily
            dest.style.fontSize = scaledfontsize + "px"
            dest.style.color = s.color
            dest.style.letterSpacing = scaledletterspacing + "px"
            dest.style.lineHeight = lineheightpx + "px"
            dest.style.whiteSpace = "pre"
            dest.style.textAlign = "center"
            dest.style.webkitTextStroke = s.webkitTextStroke
            dest.style.textStroke = s.textStroke
            dest.style.webkitTextFillColor = s.webkitTextFillColor
            dest.style.paintOrder = s.paintOrder
            dest.style.textShadow = s.textShadow
            Object.assign(dest.style, extra)
        }

        if (s_el.style.display !== "none") {
            const c_s = document.createElement("div")
            c_s.textContent = exportstate.text
            const ox = exportstate.shadowx * scale * textscale, oy = exportstate.shadowy * scale * textscale;
            copystyle(s_el, c_s, {
                position: "absolute", left: "50%", top: "50%",
                transform: `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px))`,
                zIndex: "1"
            })
            const shadowhex = exportstate.shadowcolor
            let shadowopacity = 1
            if (shadowhex.length === 9) {
                shadowopacity = parseInt(shadowhex.slice(7, 9), 16) / 255
            }
            const shadowrgb = hexrgbatohexrgb(shadowhex)
            const rgbmatch = shadowrgb.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i)
            const shadowrgbonly = rgbmatch
                ? `rgb(${parseInt(rgbmatch[1], 16)}, ${parseInt(rgbmatch[2], 16)}, ${parseInt(rgbmatch[3], 16)})`
                : hextorgba(shadowhex)
            c_s.style.opacity = shadowopacity.toString()
            c_s.style.color = shadowrgbonly
            if (exportstate.outlinesize > 0) {
                const scaledoutlinesize = exportstate.outlinesize * scale * textscale
                c_s.style.webkitTextStroke = `${scaledoutlinesize}px ${shadowrgbonly}`
                c_s.style.textStroke = `${scaledoutlinesize}px ${shadowrgbonly}`
                c_s.style.webkitTextFillColor = shadowrgbonly
                c_s.style.textFillColor = shadowrgbonly
                c_s.style.paintOrder = "stroke fill"
            } else {
                c_s.style.webkitTextStroke = "0px transparent"
                c_s.style.textStroke = "0px transparent"
            }
            clone.appendChild(c_s)
        }

        const c_p = document.createElement("div")
        c_p.textContent = exportstate.text
        copystyle(p_el, c_p, { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: "2" })
        if (exportstate.outlinesize > 0) {
            const scaledoutlinesize = exportstate.outlinesize * scale * textscale
            const outrgba = hextorgba(exportstate.outlinecolor)
            c_p.style.webkitTextStroke = `${scaledoutlinesize}px ${outrgba}`
            c_p.style.textStroke = `${scaledoutlinesize}px ${outrgba}`
        }
        clone.appendChild(c_p)
        container.appendChild(clone)

        await document.fonts.ready

        try {
            const textcanvas = await html2canvas(container, {
                backgroundColor: null, scale: 2, useCORS: true, logging: false
            })
            const canvas = document.createElement("canvas")
            canvas.width = buttonwidth
            canvas.height = buttonheight
            const ctx = canvas.getContext("2d")
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = "high"
            ctx.drawImage(buttonimg, 0, 0, buttonwidth, buttonheight)

            const tempcanvas = document.createElement("canvas")
            tempcanvas.width = textcanvas.width
            tempcanvas.height = textcanvas.height
            const tempctx = tempcanvas.getContext("2d")
            tempctx.drawImage(textcanvas, 0, 0)

            const imagedata = tempctx.getImageData(0, 0, tempcanvas.width, tempcanvas.height)
            const data = imagedata.data
            let minx = tempcanvas.width, miny = tempcanvas.height, maxx = 0, maxy = 0
            let found = false

            for (let y = 0; y < tempcanvas.height; y++) {
                for (let x = 0; x < tempcanvas.width; x++) {
                    const idx = (y * tempcanvas.width + x) * 4
                    if (data[idx + 3] > 0) {
                        found = true
                        minx = Math.min(minx, x)
                        miny = Math.min(miny, y)
                        maxx = Math.max(maxx, x)
                        maxy = Math.max(maxy, y)
                    }
                }
            }
            let croppedcanvas = textcanvas
            if (found && (minx < maxx && miny < maxy)) {
                const cropwidth = maxx - minx + 1
                const cropheight = maxy - miny + 1
                croppedcanvas = document.createElement("canvas")
                croppedcanvas.width = cropwidth
                croppedcanvas.height = cropheight
                const cropctx = croppedcanvas.getContext("2d")
                cropctx.drawImage(textcanvas, minx, miny, cropwidth, cropheight, 0, 0, cropwidth, cropheight)
            }

            const fit = Math.min(buttonwidth / previewwidth / 2, buttonwidth * 0.8 / croppedcanvas.width, buttonheight * 0.76 / croppedcanvas.height)
            const finaltextcanvas = document.createElement("canvas")
            finaltextcanvas.width = Math.max(1, Math.floor(croppedcanvas.width * fit))
            finaltextcanvas.height = Math.max(1, Math.floor(croppedcanvas.height * fit))
            const finalctx = finaltextcanvas.getContext("2d")
            finalctx.imageSmoothingEnabled = true
            finalctx.imageSmoothingQuality = "high"
            finalctx.drawImage(croppedcanvas, 0, 0, finaltextcanvas.width, finaltextcanvas.height)

            const textx = (buttonwidth - finaltextcanvas.width) / 2
            const texty = (buttonheight - finaltextcanvas.height) / 2

            ctx.drawImage(finaltextcanvas, textx, texty)

            let final = canvas
            if (exportstate.imagesize && exportstate.imagesize !== canvas.width) {
                const scaled = document.createElement("canvas")
                scaled.width = exportstate.imagesize
                scaled.height = canvas.height * (exportstate.imagesize / canvas.width)
                const scaledctx = scaled.getContext("2d")
                scaledctx.imageSmoothingEnabled = true
                scaledctx.imageSmoothingQuality = "high"
                scaledctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaled.width, scaled.height)
                final = scaled
            }

            final.toBlob(blob => {
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                const words = exportstate.text.trim().split(/\s+/).filter(w => w.length > 0)
                const firstfive = words.slice(0, 5)
                const filename = (words.length > 5 ? firstfive.join(" ") + "..." : firstfive.join(" ")) || "text"
                const sanitized = filename.replace(/[<>:"/\\|?*]/g, "").trim() || "text"
                a.href = url
                a.download = `${sanitized}.png`
                a.click()
                URL.revokeObjectURL(url)
                container.remove()
            }, "image/png")
        } catch (e) {
            console.error(e)
            container.remove()
        }
        return
    }

    const p_el = document.querySelector(".textpreview")
    const s_el = document.querySelector(".textshadow")
    const getactualbounds = (el) => {
        const range = document.createRange()
        range.selectNodeContents(el)
        return range.getBoundingClientRect()
    }
    const p_rect = getactualbounds(p_el)
    const s_rect = s_el.style.display !== "none" ? getactualbounds(s_el) : p_rect
    const minx = Math.min(p_rect.left, s_rect.left)
    const miny = Math.min(p_rect.top, s_rect.top)
    const maxx = Math.max(p_rect.right, s_rect.right)
    const maxy = Math.max(p_rect.bottom, s_rect.bottom)
    const f_sz = parseFloat(getComputedStyle(p_el).fontSize)
    const scale = f_sz / 68
    const pad = Math.max(60, (exportstate.outlinesize * scale) + 20)
    const w = (maxx - minx) + (pad * 2)
    const h = (maxy - miny) + (pad * 2)
    const container = document.createElement("div")
    container.style.cssText = `position:fixed;left:-9999px;top:0;width:${w}px;height:${h}px;background:transparent;z-index:-1;`
    document.body.appendChild(container)
    const clone = document.createElement("div")
    clone.style.cssText = `position:relative;width:${w}px;height:${h}px;display:flex;justify-content:center;align-items:center;`
    const copystyle = (src, dest, extra = {}) => {
        const s = getComputedStyle(src); dest.style.fontFamily = s.fontFamily;
        dest.style.fontSize = s.fontSize; dest.style.color = s.color;
        dest.style.letterSpacing = s.letterSpacing; dest.style.lineHeight = s.lineHeight;
        dest.style.whiteSpace = "pre"; dest.style.textAlign = "center";
        dest.style.webkitTextStroke = s.webkitTextStroke; dest.style.textStroke = s.textStroke;
        dest.style.webkitTextFillColor = s.webkitTextFillColor; dest.style.paintOrder = s.paintOrder;
        dest.style.textShadow = s.textShadow; Object.assign(dest.style, extra);
    }
    const c_p = document.createElement("div")
    c_p.textContent = exportstate.text
    copystyle(p_el, c_p, { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", zIndex: "2" })
    clone.appendChild(c_p)
    if (s_el.style.display !== "none") {
        const c_s = document.createElement("div")
        c_s.textContent = exportstate.text
        const ox = exportstate.shadowx * scale, oy = exportstate.shadowy * scale;
        copystyle(s_el, c_s, {
            position: "absolute", left: "50%", top: "50%",
            transform: `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px))`,
            zIndex: "1"
        })
        const shadowhex = exportstate.shadowcolor
        let shadowopacity = 1
        if (shadowhex.length === 9) {
            shadowopacity = parseInt(shadowhex.slice(7, 9), 16) / 255
        }
        const shadowrgb = hexrgbatohexrgb(shadowhex)
        const rgbmatch = shadowrgb.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i)
        const shadowrgbonly = rgbmatch
            ? `rgb(${parseInt(rgbmatch[1], 16)}, ${parseInt(rgbmatch[2], 16)}, ${parseInt(rgbmatch[3], 16)})`
            : hextorgba(shadowhex)
        c_s.style.opacity = shadowopacity.toString()
        c_s.style.color = shadowrgbonly
        if (exportstate.outlinesize > 0) {
            const scaledoutlinesize = exportstate.outlinesize * scale
            c_s.style.webkitTextStroke = `${scaledoutlinesize}px ${shadowrgbonly}`
            c_s.style.textStroke = `${scaledoutlinesize}px ${shadowrgbonly}`
            c_s.style.webkitTextFillColor = shadowrgbonly
            c_s.style.textFillColor = shadowrgbonly
            c_s.style.paintOrder = "stroke fill"
        } else {
            c_s.style.webkitTextStroke = "0px transparent"
            c_s.style.textStroke = "0px transparent"
        }
        clone.appendChild(c_s)
    }
    container.appendChild(clone); await document.fonts.ready
    try {
        const canvas = await html2canvas(clone, {
            backgroundColor: null, scale: 2, useCORS: true, logging: false, width: w, height: h
        })
        let final = canvas
        if (exportstate.imagesize && exportstate.imagesize !== canvas.width) {
            const scaled = document.createElement("canvas")
            scaled.width = exportstate.imagesize; scaled.height = canvas.height * (exportstate.imagesize / canvas.width)
            const ctx = scaled.getContext("2d"); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
            ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaled.width, scaled.height)
            final = scaled
        }
        final.toBlob(blob => {
            const url = URL.createObjectURL(blob); const a = document.createElement("a");
            const words = exportstate.text.trim().split(/\s+/).filter(w => w.length > 0)
            const firstfive = words.slice(0, 5)
            const filename = (words.length > 5 ? firstfive.join(" ") + "..." : firstfive.join(" ")) || "text"
            const sanitized = filename.replace(/[<>:"/\\|?*]/g, "").trim() || "text"
            a.href = url; a.download = `${sanitized}.png`; a.click();
            URL.revokeObjectURL(url); container.remove()
        }, "image/png")
    } catch (e) {
        console.error(e); container.remove()
    }
})
