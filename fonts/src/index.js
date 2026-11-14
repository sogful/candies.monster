// click sfx
document.querySelectorAll(".clickable").forEach(function(element) {
    element.addEventListener("click", function() {
        document.querySelector(".click").currentTime = 0;
        document.querySelector(".click").play();
    });
});

/*//////////////////////////////////////////////////////////////////////*/

// presets
const presets = {
    default: {
        fontcolor: "#ffffff",
        outlinecolor: "#000000cc",
        outlinesize: 6,
        shadowcolor: "#2b0f00cc",
        shadowx: 0, shadowy: 4
    },
    plain: {
        fontcolor: "#000000cc",
        outlinecolor: "#00000000",
        outlinesize: 0,
        shadowcolor: "#00000000",
        shadowx: 0, shadowy: 0
    },
    cyan: {
        fontcolor: "#9faef1ff",
        outlinecolor: "#00000000",
        outlinesize: 0,
        shadowcolor: "#00000000",
        shadowx: 0, shadowy: 0
    }
}

// state
const state = {
    text: "",
    font: "Good Dog",
    kerning: 0,
    imagesize: 1000,
    fontcolor: presets.default.fontcolor,
    outlinecolor: presets.default.outlinecolor,
    outlinesize: presets.default.outlinesize,
    shadowcolor: presets.default.shadowcolor,
    shadowx: presets.default.shadowx,
    shadowy: presets.default.shadowy,
    addtexttobutton: false,
    useactivebutton: false,
    buttoncolor: null
}

/*//////////////////////////////////////////////////////////////////////*/

const textinput = document.querySelector(".textinput")
const textpreview = document.querySelector(".textpreview")
const fontbuttons = document.querySelectorAll(".fontbutton")
const settinginputs = {
    kerning: document.querySelector(".kerning"),
    imagesize: document.querySelector(".imagesize"),
    fontcolor: document.querySelector(".fontcolor"),
    fontcolorpicker: document.querySelector(".fontcolorpicker"),
    fontcoloropacity: document.querySelector(".fontcoloropacity"),
    fontcoloropacityvalue: document.querySelector(".fontcoloropacityvalue"),
    outlinecolor: document.querySelector(".outlinecolor"),
    outlinecolorpicker: document.querySelector(".outlinecolorpicker"),
    outlinecoloropacity: document.querySelector(".outlinecoloropacity"),
    outlinecoloropacityvalue: document.querySelector(".outlinecoloropacityvalue"),
    outlinesize: document.querySelector(".outlinesize"),
    shadowcolor: document.querySelector(".shadowcolor"),
    shadowcolorpicker: document.querySelector(".shadowcolorpicker"),
    shadowcoloropacity: document.querySelector(".shadowcoloropacity"),
    shadowcoloropacityvalue: document.querySelector(".shadowcoloropacityvalue"),
    shadowx: document.querySelector(".shadowx"),
    shadowy: document.querySelector(".shadowy"),
    buttoncolor: document.querySelector(".buttoncolor"),
    buttoncolorpicker: document.querySelector(".buttoncolorpicker")
}

function hextoopacity(hex) {
    if (!hex || typeof hex !== "string" || hex.length < 7) return 100
    if (hex.length === 9) {
        const alpha = parseInt(hex.slice(7, 9), 16)
        if (isNaN(alpha)) return 100
        return Math.round(alpha / 255 * 100)
    }
    return 100
}
function opacitytohexalpha(opacity) {
    const alpha = Math.round((opacity / 100) * 255)
    return alpha.toString(16).padStart(2, "0")
}
function updatecolorwithopacity(colorhex, opacity) {
    const rgbhex = hexrgbatohexrgb(colorhex)
    return rgbhex + opacitytohexalpha(opacity)
}

fontbuttons.forEach(btn => {
    btn.addEventListener("click", function() {
        fontbuttons.forEach(b => b.classList.remove("active"))
        this.classList.add("active")
        state.font = this.dataset.font
        updatepreview()
    })
})
fontbuttons.forEach(btn => {
    if (!btn.querySelector("img")) {
        const img = document.createElement("img")
        img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='328' height='138'/%3E"
        img.classList.add("buttonart")
        img.draggable = false
        btn.insertBefore(img, btn.firstChild)
        const span = document.createElement("span")
        span.textContent = btn.textContent.trim()
        btn.appendChild(span)
        btn.textContent = ""
    }
})

Object.keys(settinginputs).forEach(k => {
    if (!settinginputs[k]) return

    if (k === "fontcolor" || k === "outlinecolor" || k === "shadowcolor" || k === "buttoncolor" || k === "fontcolorpicker" || k === "outlinecolorpicker" || k === "shadowcolorpicker" || k === "buttoncolorpicker") {
        const basekey = k.replace("picker", "")
        const ispicker = k.endsWith("picker")
        settinginputs[k].addEventListener("input", function() {
            let v = this.value.trim()
            if (v.startsWith("#")) {
                v = v.slice(1)
            }
            v = v.slice(0, 8)
            v = "#" + v

            if (basekey === "buttoncolor") {
                if (/^#[0-9a-fA-F]{6}$/i.test(v)) {
                    state[basekey] = v.toLowerCase()
                    if (ispicker) {
                        if (settinginputs[basekey]) {
                            settinginputs[basekey].value = v.toLowerCase()
                        }
                    } else {
                        if (settinginputs[basekey + "picker"]) {
                            settinginputs[basekey + "picker"].value = v.toLowerCase()
                        }
                    }
                } else if (v === "#" || v === "") {
                    state[basekey] = null
                }
            } else if (ispicker) {
                const rgbhex = v
                const opacityinput = settinginputs[basekey + "opacity"]
                let opacity = opacityinput ? parseFloat(opacityinput.value) : 100
                if (isNaN(opacity)) {
                    opacity = hextoopacity(state[basekey] || "#000000ff")
                }
                const newv = updatecolorwithopacity(rgbhex, opacity)
                state[basekey] = newv
                settinginputs[basekey].value = newv
                if (opacityinput) {
                    settinginputs[basekey + "opacityvalue"].value = opacity
                }
            } else {
                if (/^#[0-9a-fA-F]{6}$/.test(v)) {
                    const opacityinput = settinginputs[basekey + "opacity"]
                    let opacity = opacityinput ? parseFloat(opacityinput.value) : 100
                    if (isNaN(opacity)) {
                        opacity = hextoopacity(state[basekey] || "#000000ff")
                    }
                    v = updatecolorwithopacity(v, opacity)
                    state[basekey] = v
                    settinginputs[basekey + "picker"].value = hexrgbatohexrgb(v)
                } else if (/^#[0-9a-fA-F]{8}$/.test(v)) {
                    state[basekey] = v
                    settinginputs[basekey + "picker"].value = hexrgbatohexrgb(v)
                    const opacity = hextoopacity(v)
                    if (settinginputs[basekey + "opacity"]) {
                        settinginputs[basekey + "opacity"].value = opacity
                        settinginputs[basekey + "opacityvalue"].value = opacity
                    }
                } else {state[basekey] = v}
            } updatepreview()
        })
    } else if (k.endsWith("opacity") || k.endsWith("opacityvalue")) {
        const basekey = k.replace("opacity", "").replace("value", "")
        const isvalue = k.endsWith("value")
        const otherkey = isvalue ? basekey + "opacity" : basekey + "opacityvalue"

        settinginputs[k].addEventListener("input", function() {
            let opacity = parseFloat(this.value)
            if (isNaN(opacity)) {
                const currentopacity = hextoopacity(state[basekey] || "#000000ff")
                opacity = currentopacity
                this.value = opacity
            }
            opacity = Math.max(0, Math.min(100, opacity))
            if (settinginputs[otherkey]) {
                settinginputs[otherkey].value = opacity
            }
            const currentcolor = state[basekey] || "#000000"
            const newcolor = updatecolorwithopacity(currentcolor, opacity)
            state[basekey] = newcolor
            settinginputs[basekey].value = newcolor

            if (basekey === "outlinecolor" && opacity > 0 && state.outlinesize === 0) {
                state.outlinesize = presets.default.outlinesize
                if (settinginputs.outlinesize) {
                    settinginputs.outlinesize.value = state.outlinesize
                }
            }
            if (basekey === "shadowcolor" && opacity > 0 && state.shadowx === 0 && state.shadowy === 0) {
                state.shadowy = presets.default.shadowy
                if (settinginputs.shadowy) {
                    settinginputs.shadowy.value = state.shadowy
                }
            }

            updatepreview()
        })
    } else {
        settinginputs[k].addEventListener("input", function() {
            const value = Number(this.value)
            if (!Number.isFinite(value)) return
            const minimum = this.min === "" ? -1000 : Number(this.min)
            const maximum = this.max === "" ? 1000 : Number(this.max)
            state[k] = Math.min(maximum, Math.max(minimum, value))
            updatepreview()
        })
    }
})

textinput.addEventListener("input", function() {
    state.text = this.value
    updatepreview()
    if (state.addtexttobutton) {
        clearTimeout(window.buttpreviewtimeout)
        window.buttpreviewtimeout = setTimeout(updatebuttonpreview, 50)
    }
})
textinput.addEventListener("focus", function() { updatepreview() })
textinput.addEventListener("blur", function() { updatepreview() })

// checkboxes!
const addtexttobuttoncheckbox = document.querySelector(".addtexttobutton")
const useactivebuttoncheckbox = document.querySelector(".useactivebutton")
const activebuttoncontainer = document.getElementById("activebuttoncontainer")
const buttoncolorpicker = document.querySelector(".buttoncolorpicker")

if (addtexttobuttoncheckbox) {
    addtexttobuttoncheckbox.addEventListener("change", function() {
        state.addtexttobutton = this.checked
        if (activebuttoncontainer) {
            activebuttoncontainer.style.display = this.checked ? "flex" : "none"
        }
        if (!this.checked && useactivebuttoncheckbox) {
            useactivebuttoncheckbox.checked = false
            state.useactivebutton = false
        }
        if (!this.checked) {
            state.buttoncolor = null
            if (settinginputs.buttoncolor) {
                settinginputs.buttoncolor.value = "#ff0000"
            }
            if (settinginputs.buttoncolorpicker) {
                settinginputs.buttoncolorpicker.value = "#ff0000"
            }
        }
        updatebuttoncolorchecks()

        const buttonbg = document.querySelector(".buttonbackground")
        const textpreview = document.querySelector(".textpreview")
        const textshadow = document.querySelector(".textshadow")
        if (!this.checked) {
            if (buttonbg) {
                buttonbg.style.display = "none"
                buttonbg.src = ""
            }
            if (textpreview) {
                textpreview.style.transform = "translate(-50%, -50%)"
            }
            if (textshadow) {
                const shadowtransform = textshadow.style.transform || ""
                textshadow.style.transform = shadowtransform.replace(/scale\([^)]+\)/g, "").trim()
            }
            currenttextscale = 1
        }
        updatepreview()
        if (this.checked) {
            setTimeout(() => {
                if (state.addtexttobutton && currenttextscale !== 1) {
                    updateshadowtransform(currenttextscale)
                }
            }, 100)
        }
    })
}
if (useactivebuttoncheckbox) {
    useactivebuttoncheckbox.addEventListener("change", function() {
        state.useactivebutton = this.checked
        updatepreview()
    })
}

function updatebuttoncolorchecks() {
    const showcolorstuff = state.addtexttobutton
    document.querySelector(".buttondimensions")?.toggleAttribute("hidden", !showcolorstuff)
    const buttoncolorcontainer = document.getElementById("buttoncolorcontainer")
    if (buttoncolorcontainer) {
        buttoncolorcontainer.style.display = showcolorstuff ? "flex" : "none"
    }
}

/*//////////////////////////////////////////////////////////////////////*/

function applypresetstyling(e, p) {
    if (!p || !e) return
    e.style.color = p.fontcolor
    if (p.outlinesize > 0) {
        const outrgba = hextorgba(p.outlinecolor)
        e.style.webkitTextStroke = `${p.outlinesize}px ${outrgba}`
        e.style.textStroke = `${p.outlinesize}px ${outrgba}`
    } else {
        e.style.webkitTextStroke = "none"
        e.style.textStroke = "none"
    }
    if (p.shadowx !== 0 || p.shadowy !== 0) {
        const shadrgba = hextorgba(p.shadowcolor)
        e.style.textShadow = `${p.shadowx}px ${p.shadowy}px 0 ${shadrgba}`
    } else {
        e.style.textShadow = "none"
    }
}
document.querySelectorAll(".preset").forEach(btn => {
    const pname = btn.dataset.preset
    const p = presets[pname]
    btn.addEventListener("click", function() {
        if (p) {
            Object.assign(state, p)
            settinginputs.fontcolor.value = state.fontcolor
            settinginputs.fontcolorpicker.value = hexrgbatohexrgb(state.fontcolor)
            const fontopacity = hextoopacity(state.fontcolor)
            if (settinginputs.fontcoloropacity) {
                settinginputs.fontcoloropacity.value = fontopacity
                settinginputs.fontcoloropacityvalue.value = fontopacity
            }
            settinginputs.outlinecolor.value = state.outlinecolor
            settinginputs.outlinecolorpicker.value = hexrgbatohexrgb(state.outlinecolor)
            const outlineopacity = hextoopacity(state.outlinecolor)
            if (settinginputs.outlinecoloropacity) {
                settinginputs.outlinecoloropacity.value = outlineopacity
                settinginputs.outlinecoloropacityvalue.value = outlineopacity
            }
            settinginputs.outlinesize.value = state.outlinesize
            settinginputs.shadowcolor.value = state.shadowcolor
            settinginputs.shadowcolorpicker.value = hexrgbatohexrgb(state.shadowcolor)
            const shadowopacity = hextoopacity(state.shadowcolor)
            if (settinginputs.shadowcoloropacity) {
                settinginputs.shadowcoloropacity.value = shadowopacity
                settinginputs.shadowcoloropacityvalue.value = shadowopacity
            }
            settinginputs.shadowx.value = state.shadowx
            settinginputs.shadowy.value = state.shadowy
            updatepreview()
        }
    })
})

let buttonimagecache = {}
let currentbuttonvariant = null
let buttonrevision = 0
let currenttextscale = 1

function updateshadowtransform(textscale) {
    const textshadow = document.querySelector(".textshadow")
    if (!textshadow || !state.addtexttobutton) return

    const computedfontsize = parseFloat(getComputedStyle(document.querySelector(".textpreview")).fontSize) || 68
    const scalefactor = computedfontsize / 68
    const shadowoffsetscale = textscale !== 1 ? textscale : 1
    const scaledshadowx = state.shadowx * scalefactor * shadowoffsetscale
    const scaledshadowy = state.shadowy * scalefactor * shadowoffsetscale

    if (textscale !== 1) {
        textshadow.style.transform = `translate(calc(-50% + ${scaledshadowx}px), calc(-50% + ${scaledshadowy}px)) scale(${textscale})`
    } else {
        textshadow.style.transform = `translate(calc(-50% + ${scaledshadowx}px), calc(-50% + ${scaledshadowy}px))`
    }

    if (state.outlinesize > 0) {
        const outlinescale = 1
        const scaledoutlinesize = state.outlinesize * scalefactor * outlinescale
        const shadowhex = state.shadowcolor
        const shadowrgb = hexrgbatohexrgb(shadowhex)
        const rgbmatch = shadowrgb.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i)
        const shadowrgbonly = rgbmatch
            ? `rgb(${parseInt(rgbmatch[1], 16)}, ${parseInt(rgbmatch[2], 16)}, ${parseInt(rgbmatch[3], 16)})`
            : hextorgba(shadowhex)
        textshadow.style.webkitTextStroke = `${scaledoutlinesize}px ${shadowrgbonly}`
        textshadow.style.textStroke = `${scaledoutlinesize}px ${shadowrgbonly}`
    }
}

async function updatebuttonpreview() {
    const request = ++buttonrevision
    const buttonbg = document.querySelector(".buttonbackground")
    const textpreview = document.querySelector(".textpreview")
    const textshadow = document.querySelector(".textshadow")
    if (!buttonbg || !textpreview) return

    if (!state.addtexttobutton) {
        buttonbg.style.display = "none"
        buttonbg.src = ""
        textpreview.style.transform = "translate(-50%, -50%)"
        if (textshadow) {
            const shadowtransform = textshadow.style.transform || ""
            textshadow.style.transform = shadowtransform.replace(/scale\([^)]+\)/g, "").trim()
        }
        currenttextscale = 1
        return
    }
    const p_el = document.querySelector(".textpreview")
    const originaltransform = p_el.style.transform
    p_el.style.transform = "translate(-50%, -50%)"
    void p_el.offsetHeight

    const getactualbounds = (el) => {
        const range = document.createRange()
        if (el.textContent && el.textContent.trim() && el.textContent !== "Input here...") {
            range.selectNodeContents(el)
        } else {
            const placeholder = document.createTextNode("Input here...")
            range.selectNodeContents(placeholder)
        }
        return range.getBoundingClientRect()
    }
    const p_rect = getactualbounds(p_el)
    const fontsize = parseFloat(getComputedStyle(p_el).fontSize) || 68
    const stroke = Math.max(parseFloat(getComputedStyle(p_el).webkitTextStrokeWidth) || 0, fontsize * 0.08)
    const shadowx = Math.abs(state.shadowx * fontsize / 68)
    const shadowy = Math.abs(state.shadowy * fontsize / 68)
    let textwidth = p_rect.width + stroke * 2 + shadowx * 2
    const lineheight = parseFloat(getComputedStyle(p_el).lineHeight) || fontsize * 1.2
    const linecount = (state.text || "Input here!").split("\n").length
    let textheight = Math.max(p_rect.height, linecount * lineheight) + stroke * 2 + shadowy * 2

    if (textwidth === 0 || textheight === 0) {
        const computedfontsize = parseFloat(getComputedStyle(p_el).fontSize) || 68
        textwidth = 200 
        textheight = computedfontsize * 1.2
    }

    p_el.style.transform = originaltransform
    const variant = await determinebuttonvariant(textwidth, textheight)
    updatebuttoncolorchecks()

    try {
        const img = await loadbuttonimage(variant, state.useactivebutton)
        if (request !== buttonrevision) return
        currentbuttonvariant = variant

        buttonbg.src = img.src

        buttonbg.style.display = "block"

        const paddingpch = 0.1
        const paddingpcv = 0.12
        const constrainedtextwidth = Math.min(950, Math.max(200, textwidth))
        const requiredbuttonwidth = constrainedtextwidth / (1 - paddingpch * 2)
        const maxbuttonwidth = Math.min(950, window.innerWidth * 0.9, requiredbuttonwidth)
        const maxbuttonheight = window.innerHeight * 0.8
        const buttonaspectratio = img.width / img.height

        let buttonwidth, buttonheight
        if (maxbuttonwidth / maxbuttonheight > buttonaspectratio) {
            buttonheight = maxbuttonheight
            buttonwidth = buttonheight * buttonaspectratio
            if (buttonwidth > 950) {
                buttonwidth = 950
                buttonheight = buttonwidth / buttonaspectratio
            }
        } else {
            buttonwidth = Math.min(maxbuttonwidth, 950)
            buttonheight = buttonwidth / buttonaspectratio
        }

        buttonbg.style.width = buttonwidth + "px"
        buttonbg.style.height = buttonheight + "px"
        const availablewidth = buttonwidth * (1 - paddingpch * 2)
        const availableheight = buttonheight * (1 - paddingpcv * 2)
        const scalex = availablewidth / textwidth
        const scaley = availableheight / textheight
        const textscale = Math.min(scalex, scaley, 1)
        currenttextscale = textscale
        textpreview.style.transform = `translate(-50%, -50%) scale(${textscale})`
        const focused = document.activeElement === textinput
        updatecursoroverlay(textinput.selectionStart || 0, focused, !state.text, fontsize * textscale, textscale)
        if (focused && textinput.selectionStart !== textinput.selectionEnd) {
            updateselectionoverlay(textinput.selectionStart, textinput.selectionEnd, fontsize * textscale, textscale)
        }

        if (textshadow) {
            updateshadowtransform(textscale)
        }
    } catch (e) {
        if (request === buttonrevision) buttonbg.style.display = "none"
    }
}

function updatepreview() {
    const displaytext = state.text || ""
    const isplaceholder = !state.text
    const isfocused = document.activeElement === textinput
    let cursorpos = 0
    let selectionstart = 0
    let selectionend = 0
    if (isfocused && !isplaceholder) {
        cursorpos = textinput.selectionStart || 0
        selectionstart = textinput.selectionStart || 0
        selectionend = textinput.selectionEnd || 0
    }
    textpreview.textContent = displaytext ? displaytext + (displaytext.endsWith("\n") ? "\u200b" : "") : "Input here!"

    textpreview.style.fontFamily = state.font
    textpreview.style.color = isplaceholder ? "rgba(255,255,255,0.5)" : hextorgba(state.fontcolor)
    textpreview.style.letterSpacing = state.kerning + "px"
    textpreview.style.whiteSpace = "pre"
    textpreview.style.textAlign = "center"
    textpreview.style.lineHeight = "1.2"

    textinput.style.fontFamily = state.font
    textinput.style.letterSpacing = state.kerning + "px"
    autoresize()

    const computedfontsize = parseFloat(getComputedStyle(textpreview).fontSize)
    const scalefactor = computedfontsize / 68

    textinput.style.fontSize = computedfontsize + "px"

    if (state.outlinesize > 0 && !isplaceholder) {
        const outrgba = hextorgba(state.outlinecolor)
        const scaledoutlinesize = state.outlinesize * scalefactor
        textpreview.style.webkitTextStroke = `${scaledoutlinesize}px ${outrgba}`
        textpreview.style.textStroke = `${scaledoutlinesize}px ${outrgba}`
        textpreview.style.paintOrder = "stroke fill"
        textpreview.style.webkitTextFillColor = hextorgba(state.fontcolor)
        textpreview.style.textFillColor = hextorgba(state.fontcolor)
    } else {
        textpreview.style.webkitTextStroke = "0px transparent"
        textpreview.style.textStroke = "0px transparent"
        textpreview.style.paintOrder = "normal"
        textpreview.style.webkitTextFillColor = ""
        textpreview.style.textFillColor = ""
    }
    textpreview.style.textShadow = "none"
    const effectivefontsize = state.addtexttobutton && currenttextscale !== 1 
        ? computedfontsize * currenttextscale 
        : computedfontsize
    updatecursoroverlay(cursorpos, isfocused, isplaceholder, effectivefontsize, currenttextscale)
    if (isfocused && !isplaceholder && selectionstart !== selectionend) {
        updateselectionoverlay(selectionstart, selectionend, effectivefontsize, currenttextscale)
    } else {
        const selectionoverlay = document.querySelector(".selectionoverlay")
        selectionoverlay.innerHTML = ""
    }
    const textshadow = document.querySelector(".textshadow")
    if ((state.shadowx !== 0 || state.shadowy !== 0) && !isplaceholder) {
        textshadow.style.display = "block"
        textshadow.textContent = displaytext + (displaytext.endsWith("\n") ? "\u200b" : "")
        textshadow.style.fontFamily = state.font
        textshadow.style.fontSize = computedfontsize + "px"
        textshadow.style.letterSpacing = state.kerning + "px"
        textshadow.style.whiteSpace = "pre"
        textshadow.style.textAlign = "center"
        textshadow.style.lineHeight = "1.2"
        const shadrgba = hextorgba(state.shadowcolor)
        const shadowhex = state.shadowcolor
        let shadowopacity = 1
        if (shadowhex.length === 9) {
            shadowopacity = parseInt(shadowhex.slice(7, 9), 16) / 255
        }
        const shadowrgb = hexrgbatohexrgb(shadowhex)
        const rgbmatch = shadowrgb.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i)
        const shadowrgbonly = rgbmatch
            ? `rgb(${parseInt(rgbmatch[1], 16)}, ${parseInt(rgbmatch[2], 16)}, ${parseInt(rgbmatch[3], 16)})`
            : shadrgba
        textshadow.style.opacity = shadowopacity.toString()
        textshadow.style.color = shadowrgbonly
        textshadow.style.textShadow = "none"
        if (state.outlinesize > 0) {
            const outlinescale = 1
            const scaledoutlinesize = state.outlinesize * scalefactor * outlinescale
            textshadow.style.webkitTextStroke = `${scaledoutlinesize}px ${shadowrgbonly}`
            textshadow.style.textStroke = `${scaledoutlinesize}px ${shadowrgbonly}`
            textshadow.style.webkitTextFillColor = shadowrgbonly
            textshadow.style.textFillColor = shadowrgbonly
        } else {
            textshadow.style.webkitTextStroke = "0px transparent"
            textshadow.style.textStroke = "0px transparent"
        }
        const shadowoffsetscale = state.addtexttobutton && currenttextscale !== 1 ? currenttextscale : 1
        const scaledshadowx = state.shadowx * scalefactor * shadowoffsetscale
        const scaledshadowy = state.shadowy * scalefactor * shadowoffsetscale
        if (state.addtexttobutton && currenttextscale !== 1) {
            textshadow.style.transform = `translate(calc(-50% + ${scaledshadowx}px), calc(-50% + ${scaledshadowy}px)) scale(${currenttextscale})`
        } else {
            textshadow.style.transform = `translate(calc(-50% + ${scaledshadowx}px), calc(-50% + ${scaledshadowy}px))`
        }
    } else {textshadow.style.display = "none"}

    if (state.addtexttobutton) {
        clearTimeout(window.buttpreviewtimeout)
        window.buttpreviewtimeout = setTimeout(updatebuttonpreview, 50)
        if (textshadow && currenttextscale !== 1) {
            requestAnimationFrame(() => updateshadowtransform(currenttextscale))
        }
    } else {
        if (currenttextscale !== 1) {
            textpreview.style.transform = "translate(-50%, -50%)"
            if (textshadow) {
                const shadowtransform = textshadow.style.transform || ""
                textshadow.style.transform = shadowtransform.replace(/scale\([^)]+\)/g, "").trim()
            }
            currenttextscale = 1
        }
    }
}
function escapehtml(t) {
    const d = document.createElement("div")
    d.textContent = t
    return d.innerHTML
}

/*//////////////////////////////////////////////////////////////////////*/

function updatecursoroverlay() {
    synceditor()
}

function updateselectionoverlay() {
    synceditor()
}

/*//////////////////////////////////////////////////////////////////////*/

function autoresize() {
    const maxwidth = Math.min(950, Math.max(200, window.innerWidth * 0.9))
    const maxheight = window.innerHeight * 0.9
    let min = 8
    let max = 200
    let best = min
    textpreview.style.whiteSpace = "pre"
    while (min <= max) {
        const fontsize = Math.floor((min + max) / 2)
        textpreview.style.fontSize = fontsize + "px"
        void textpreview.offsetHeight
        const width = textpreview.scrollWidth
        const height = textpreview.scrollHeight
        if (width <= maxwidth && height <= maxheight) {
            best = fontsize
            min = fontsize + 1
        } else {
            max = fontsize - 1
        }
    }
    textpreview.style.fontSize = best + "px"
    textpreview.style.whiteSpace = "pre"
    void textpreview.offsetHeight
}

/*//////////////////////////////////////////////////////////////////////*/

const buttonrenderer = import("/assets/static/js/buttons/render.js")
const buttondimensions = document.createElement("div")
buttondimensions.className = "configline buttondimensions"
buttondimensions.hidden = !state.addtexttobutton
for (const name of ["width", "height"]) {
    const label = document.createElement("label")
    label.className = "settinglabel"
    label.textContent = "Button " + name + " "
    const input = document.createElement("input")
    input.type = "number"
    input.className = "settinginput numberinput button" + name
    input.min = "0"
    input.max = "4096"
    input.placeholder = "Auto"
    input.addEventListener("input", updatepreview)
    label.append(input)
    buttondimensions.append(label)
}
const palette = document.createElement("select")
palette.className = "settinginput buttonpalette"
palette.setAttribute("aria-label", "Button color")
for (const name of ["red", "gold", "green", "purple", "custom"]) {
    const option = document.createElement("option")
    option.value = name
    option.textContent = name[0].toUpperCase() + name.slice(1)
    palette.append(option)
}
palette.addEventListener("change", updatepreview)
document.querySelector(".buttoncolor").addEventListener("input", () => {palette.value = "custom"; updatepreview()})
document.querySelector(".buttoncolorpicker").addEventListener("input", () => {palette.value = "custom"; updatepreview()})
buttondimensions.append(palette)
document.querySelector(".numberline").before(buttondimensions)

async function determinebuttonvariant(textwidth, textheight) {
    const width = Number(document.querySelector(".buttonwidth").value)
    const height = Number(document.querySelector(".buttonheight").value)
    return {
        width: Math.max(32, Math.min(4096, width || (state.imagesize || 1000))),
        height: Math.max(32, Math.min(4096, height || (width || state.imagesize || 1000) / Math.max(0.3, textwidth / 0.9 / (textheight / 0.7)) ))
    }
}

async function loadbuttonimage(variant, active) {
    const {render} = await buttonrenderer
    const color = active ? "gold" : palette.value
    const canvas = await render(variant.width, variant.height, color)
    const img = new Image()
    img.src = canvas.toDataURL()
    await img.decode()
    return color === "custom" && state.buttoncolor ? applyhueshift(img, state.buttoncolor) : img
}

/*//////////////////////////////////////////////////////////////////////*/

const configs = document.querySelector(".configs")
const draghandle = document.querySelector(".configs .draghandle")
let isdragging = false
let dragstartx = 0; let dragstarty = 0
let configstartx = 0
let configstarty = 0
function mobilemode() {return window.innerWidth < 700}
function resetconfigpos() {
    if (mobilemode() && configs) {
        configs.style.left = "auto"
        configs.style.right = "auto"
        configs.style.bottom = "0"
        configs.style.top = "auto"
        configs.style.transform = "none"
    }
}
if (draghandle && configs) {
    draghandle.addEventListener("mousedown", function(e) {
        if (mobilemode()) {e.preventDefault(); return}
        isdragging = true
        dragstartx = e.clientX
        dragstarty = e.clientY
        const rect = configs.getBoundingClientRect()
        configstartx = rect.left
        configstarty = rect.top
        e.preventDefault()
    })
    document.addEventListener("mousemove", function(e) {
        if (isdragging && !mobilemode()) {
            const deltax = e.clientX - dragstartx
            const deltay = e.clientY - dragstarty
            configs.style.left = (configstartx + deltax) + "px"
            configs.style.top = (configstarty + deltay) + "px"
            configs.style.right = "auto"
            configs.style.bottom = "auto"
            configs.style.transform = "none"
        } else if (isdragging && mobilemode()) {
            isdragging = false
            resetconfigpos()
        }
    })
    document.addEventListener("mouseup", function() {
        if (isdragging && mobilemode()) {resetconfigpos()}
        isdragging = false
    })
    window.addEventListener("resize", function() {
        if (mobilemode()) {
            resetconfigpos()
            if (isdragging) {isdragging = false}
        }
    })
}

settinginputs.fontcolorpicker.value = hexrgbatohexrgb(state.fontcolor)
settinginputs.outlinecolorpicker.value = hexrgbatohexrgb(state.outlinecolor)
settinginputs.shadowcolorpicker.value = hexrgbatohexrgb(state.shadowcolor)

if (settinginputs.fontcoloropacity) {
    const fontopacity = hextoopacity(state.fontcolor)
    settinginputs.fontcoloropacity.value = fontopacity
    settinginputs.fontcoloropacityvalue.value = fontopacity
}
if (settinginputs.outlinecoloropacity) {
    const outlineopacity = hextoopacity(state.outlinecolor)
    settinginputs.outlinecoloropacity.value = outlineopacity
    settinginputs.outlinecoloropacityvalue.value = outlineopacity
}
if (settinginputs.shadowcoloropacity) {
    const shadowopacity = hextoopacity(state.shadowcolor)
    settinginputs.shadowcoloropacity.value = shadowopacity
    settinginputs.shadowcoloropacityvalue.value = shadowopacity
}

updatepreview()
document.fonts.ready.then(updatepreview)
window.addEventListener("resize", function() {
    setTimeout(updatepreview, 100)
})
