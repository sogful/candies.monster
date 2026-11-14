import {highlight, highlightjson} from "./editor.js";
import {convertxmltojson} from "./conversion.js";

document.querySelectorAll(".clickable").forEach(function(element) {
    element.addEventListener("click", function() {
        document.querySelector(".click").currentTime = 0;
        document.querySelector(".click").play();
    });
});

/*//////////////////////////////////////////////////////////////////////*/

let converting = false;

const xmleditor = document.querySelector(".thexml");
const jsoneditor = document.querySelector(".thejson");

if (xmleditor) {
    highlight(xmleditor);
    xmleditor.addEventListener("input", function() {
        clearTimeout(this._t); this._t = setTimeout(() => {
            highlight(this);
            if (!converting) {
                converting = true;
                try {
                    const xmltext = this.textContent.trim();
                    if (xmltext) {
                        const jsonobj = convertxmltojson(xmltext);
                        const jsonstr = JSON.stringify(jsonobj, null, 2);
                        jsoneditor.textContent = jsonstr;
                        highlightjson(jsoneditor);
                    }
                } catch (e) {
                    console.error("xml2json error?!", e);
                }
                converting = false;
            }
        }, 300);
    });
    xmleditor.addEventListener("paste", function() {
        setTimeout(() => {
            highlight(this);
            if (!converting) {
                converting = true;
                try {
                    const xmltext = this.textContent.trim();
                    if (xmltext) {
                        const jsonobj = convertxmltojson(xmltext);
                        const jsonstr = JSON.stringify(jsonobj, null, 2);
                        jsoneditor.textContent = jsonstr;
                        highlightjson(jsoneditor);
                    }
                } catch (e) {
                    console.error("xml2json error?!", e);
                }
                converting = false;
            }
        }, 10);
    });
}

if (jsoneditor) {
    highlightjson(jsoneditor);
    jsoneditor.addEventListener("input", function() {
        clearTimeout(this._t); this._t = setTimeout(() => {
            highlightjson(this);
            if (!converting) {
                converting = true;
                try {
                    const jsontext = this.textContent.trim();
                    if (jsontext) {
                        const jsonobj = JSON.parse(jsontext);
                        const xmlstr = window.ctrconversion.jsonleveltoxml(jsonobj);
                        xmleditor.textContent = xmlstr;
                        highlight(xmleditor);
                    }
                } catch (e) {
                    console.error("json2xml error?!", e);
                }
                converting = false;
            }
        }, 300);
    });
    jsoneditor.addEventListener("paste", function() {
        setTimeout(() => {
            highlightjson(this);
            if (!converting) {
                converting = true;
                try {
                    const jsontext = this.textContent.trim();
                    if (jsontext) {
                        const jsonobj = JSON.parse(jsontext);
                        const xmlstr = window.ctrconversion.jsonleveltoxml(jsonobj);
                        xmleditor.textContent = xmlstr;
                        highlight(xmleditor);
                    }
                } catch (e) {
                    console.error("conversion error?! ", e);
                }
                converting = false;
            }
        }, 10);
    });
}

const xmlpicker = document.querySelector(".xmlfile");
const loadxmllink = document.querySelector(".loadxmllink");
const jsonpicker = document.querySelector(".jsonfile");
const loadjsonlink = document.querySelector(".loadjsonlink");
if (xmlpicker && loadxmllink) {
    loadxmllink.addEventListener("click", function(e) {
        e.preventDefault();
        xmlpicker.click();
    });
    xmlpicker.addEventListener("change", e => {
        const f = e.target.files[0];
        if (f) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result || "";
                xmleditor.textContent = content;
                highlight(xmleditor);
                if (!converting) {
                    converting = true;
                    try {
                        const jsonobj = convertxmltojson(content);
                        const jsonstr = JSON.stringify(jsonobj, null, 2);
                        jsoneditor.textContent = jsonstr;
                        highlightjson(jsoneditor);
                    } catch (err) {
                        console.error("xml2json error?!", err);
                    }
                    converting = false;
                }
            };
            reader.readAsText(f);
        }
        e.target.value = "";
    });
}
if (jsonpicker && loadjsonlink) {
    loadjsonlink.addEventListener("click", function(e) {
        e.preventDefault();
        jsonpicker.click();
    });
    jsonpicker.addEventListener("change", e => {
        const f = e.target.files[0];
        if (f) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result || "";
                if (!converting) {
                    converting = true;
                    try {
                        const jsonobj = JSON.parse(content);
                        const jsonstr = JSON.stringify(jsonobj, null, 2);
                        const xmlstr = window.ctrconversion.jsonleveltoxml(jsonobj);
                        jsoneditor.textContent = jsonstr;
                        xmleditor.textContent = xmlstr;
                        highlightjson(jsoneditor);
                        highlight(xmleditor);
                    } catch (err) {
                        console.error("load/conversion error?!", err);
                    }
                    converting = false;
                }
            };
            reader.readAsText(f);
        }
        e.target.value = "";
    });
}

/*//////////////////////////////////////////////////////////////////////*/

function savefile(content, filename, mime) {
    const blob = new Blob([content], {type: mime});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const savexmllink = document.querySelector(".savexmllink");
const savejsonlink = document.querySelector(".savejsonlink");
if (savexmllink) {
    savexmllink.addEventListener("click", function(e) {
        e.preventDefault();
        const content = (xmleditor.textContent || "").trim();
        if (content) savefile(content, "level.xml", "application/xml");
    });
}
if (savejsonlink) {
    savejsonlink.addEventListener("click", function(e) {
        e.preventDefault();
        const content = (jsoneditor.textContent || "").trim();
        if (content) savefile(content, "level.json", "application/json");
    });
}
