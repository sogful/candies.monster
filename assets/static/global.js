// font fallback
(function () {
    var applied = false;

    function ring(cx, cy, radii, dirs) {
        var parts = [];
        for (var k = 0; k < radii.length; k++)
            for (var i = 0; i < dirs; i++) {
                var a = (i / dirs) * 2 * Math.PI, r = radii[k];
                parts.push((cx + Math.cos(a) * r).toFixed(3) + "em " + (cy + Math.sin(a) * r).toFixed(3) + "em 0 #000");
            }
        return parts;
    }
    function strokewidth(r) {
        var m = (r.style.webkitTextStrokeWidth || "").match(/([\d.]+)em/) ||
                r.cssText.match(/text-stroke(?:-width)?:\s*([\d.]+)em/);
        return m ? parseFloat(m[1]) : 0.175;
    }

    function apply() {
        if (applied) return true;
        var out = [];
        function walk(rules) {
            for (var i = 0; i < rules.length; i++) {
                var r = rules[i];
                if (r.cssRules && r.cssRules.length) {walk(r.cssRules); continue}
                if (!r.selectorText || !r.style || r.cssText.indexOf("text-stroke") === -1) continue;
                var w = strokewidth(r), radii = [w * 0.26, w * 0.52]; // visible outline ~= stroke width / 2
                var drop = r.style.textShadow, ox = 0, oy = 0.15, ems = drop && drop.match(/-?\d*\.?\d+em/g);
                if (ems && ems.length >= 2) {ox = parseFloat(ems[0]); oy = parseFloat(ems[1])}
                else if (ems && ems.length === 1) {oy = parseFloat(ems[0])}
                oy -= 0.02;
                var parts = ring(0, 0, radii, 16);
                if (drop) {
                    parts = parts.concat(ring(ox, oy, radii, 12));
                    parts.push(ox.toFixed(3) + "em " + oy.toFixed(3) + "em 0 #000");
                }
                out.push(r.selectorText + "{paint-order:normal!important;-webkit-text-stroke:0!important;text-shadow:" + parts.join(",") + "!important}");
            }
        }
        for (var s = 0; s < document.styleSheets.length; s++) {
            var rules;
            try {rules = document.styleSheets[s].cssRules} catch (e) {continue}
            if (rules) walk(rules);
        }
        if (!out.length) return false;
        var style = document.createElement("style");
        style.textContent = out.join("\n");
        (document.head || document.documentElement).appendChild(style);
        applied = true;
        return true;
    }

    function fix() {
        if (!apply() && document.readyState === "loading")
            document.addEventListener("DOMContentLoaded", apply, {once: true});
    }
    var svg =
        '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">' +
        '<text x="20" y="30" font-size="34" font-family="Arial" font-weight="bold" ' +
        'text-anchor="middle" fill="#fff" stroke="#000" stroke-width="9" paint-order="stroke">H</text></svg>';
    var img = new Image();
    img.onload = function () {
        var honored = false;
        try {
            var c = document.createElement("canvas");
            c.width = 40; c.height = 40;
            var ctx = c.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var p = ctx.getImageData(20, 20, 1, 1).data;
            honored = p[0] > 150 && p[1] > 150 && p[2] > 150;
        } catch (e) {honored = false}
        if (!honored) fix();
    };
    img.onerror = fix;
    img.src = "data:image/svg+xml;base64," + btoa(svg);
})();

/*//////////////////////////////////////////////////////////////////////*/

// coool cursor.........
// a bunch of "sl" to avoid conflicts
class slslasheffect {
    constructor(slcanvas) {
        this.slcanvas = slcanvas; this.slctx = slcanvas.getContext('2d');
        this.slpoints = []; this.slisdrawing = false;
        this.slmaxpoints = 60; this.slfadetime = 320; this.sllinewidth = 5; 
        this.slcolor = 'white'; this.slsmoothdist = 12;
        this.slsetupevents(); this.slanimate();
    }

    slsetupevents() {
        document.addEventListener('mousedown', e => this.slstartdrawing(e));
        document.addEventListener('mousemove', e => this.sladdpoint(e));
        document.addEventListener('mouseup', () => this.slstopdrawing());
        document.addEventListener('touchstart', e => {e.preventDefault(); this.slstartdrawing(e.touches[0])});
        document.addEventListener('touchmove', e => {e.preventDefault(); this.sladdpoint(e.touches[0])});
        document.addEventListener('touchend', () => this.slstopdrawing());
        document.addEventListener('touchcancel', () => this.slstopdrawing());
    }

    slgetcanvaspoint(sle) {
        const slscalex = this.slcanvas.width / window.innerWidth;
        const slscaley = this.slcanvas.height / window.innerHeight;
        return {slx: sle.clientX * slscalex, sly: sle.clientY * slscaley};
    }

    slstartdrawing(sle) {
        this.slisdrawing = true;
        const slp = this.slgetcanvaspoint(sle);
        this.slpoints = [{slx: slp.slx, sly: slp.sly, sltime: Date.now()}];
    }
    sladdpoint(sle) {
        if (!this.slisdrawing) return;
        const slp = this.slgetcanvaspoint(sle);
        const slnow = Date.now();
        if (this.slpoints.length) {
            const sllast = this.slpoints[this.slpoints.length - 1];
            const sldx = slp.slx - sllast.slx, sldy = slp.sly - sllast.sly;
            if (sldx * sldx + sldy * sldy < 4) {
                this.slpoints[this.slpoints.length - 1] =
                {slx: (sllast.slx + slp.slx) / 2, sly: (sllast.sly + slp.sly) / 2, sltime: slnow};
                return;
            }
            const sldist = Math.sqrt(sldx * sldx + sldy * sldy);
            if (sldist > this.slsmoothdist) {
                const slsteps = Math.ceil(sldist / this.slsmoothdist);
                for (let sli = 1; sli <= slsteps; sli++) {
                    const slt = sli / slsteps;
                    this.slpoints.push({slx: sllast.slx + sldx * slt, sly: sllast.sly + sldy * slt, sltime: slnow});
                    if (this.slpoints.length > this.slmaxpoints) this.slpoints.shift();
                }
                return;
            }
        }; this.slpoints.push({slx: slp.slx, sly: slp.sly, sltime: slnow});
        if (this.slpoints.length > this.slmaxpoints) this.slpoints.shift();
    }
    slstopdrawing() {this.slisdrawing = false}
    sleasefading(slage) {
        const slt = Math.min(1, Math.max(0, slage / this.slfadetime));
        return 1 - (slt < 0.5 ? 4 * slt * slt * slt : 1 - Math.pow(-2 * slt + 2, 3) / 2);
    }
    sldraw() {
        const slctx = this.slctx, slpts = this.slpoints, sllen = slpts.length;
        slctx.clearRect(0, 0, this.slcanvas.width, this.slcanvas.height);
        if (sllen < 2) return; const slnow = Date.now(); slctx.save();
        slctx.lineCap = 'round'; slctx.lineJoin = 'round';

        for (let sli = 1; sli < sllen; sli++) {
            const slp0 = slpts[sli - 1], slp1 = slpts[sli];
            const slage0 = slnow - slp0.sltime; const slage1 = slnow - slp1.sltime;
            if (slage1 > this.slfadetime) continue;
            const slo0 = this.sleasefading(slage0); const slo1 = this.sleasefading(slage1);
            const slsubsteps = 4;
            for (let sls = 0; sls < slsubsteps; sls++) {
                const slt0 = sls / slsubsteps; const slt1 = (sls + 1) / slsubsteps;
                const slxA = slp0.slx + (slp1.slx - slp0.slx) * slt0; const slyA = slp0.sly + (slp1.sly - slp0.sly) * slt0;
                const slxB = slp0.slx + (slp1.slx - slp0.slx) * slt1; const slyB = slp0.sly + (slp1.sly - slp0.sly) * slt1;
                const slopA = slo0 + (slo1 - slo0) * slt0; const slopB = slo0 + (slo1 - slo0) * slt1;
                const slopacity = Math.max(0, Math.min(1, (slopA + slopB) * 0.5));
                slctx.beginPath(); slctx.moveTo(slxA, slyA); slctx.lineTo(slxB, slyB);
                slctx.strokeStyle = this.slcolor; slctx.globalAlpha = slopacity;
                slctx.lineWidth = this.sllinewidth * ((slopA + slopB) * 0.5);
                slctx.stroke();
            }
        }; slctx.restore(); this.slpoints = slpts.filter(slp => slnow - slp.sltime < this.slfadetime);
    }
    
    slanimate() {this.sldraw(); requestAnimationFrame(() => this.slanimate())}
    slclear() {this.slpoints = []; this.slisdrawing = false}
    slsetcolor(slcolor) {this.slcolor = slcolor}
    slsetlinewidth(slw) {this.sllinewidth = slw}
}
function slinit() {
    const slslashcanvas = document.createElement('canvas');
    slslashcanvas.id = 'slashcanvas'; slslashcanvas.style.position = 'fixed';
    slslashcanvas.style.top = '0'; slslashcanvas.style.left = '0';
    slslashcanvas.style.width = '100vw'; slslashcanvas.style.height = '100vh';
    slslashcanvas.style.zIndex = '2147483647'; slslashcanvas.style.pointerEvents = 'none';
    document.body.appendChild(slslashcanvas);

    function slresize() {slslashcanvas.width = window.innerWidth; slslashcanvas.height = window.innerHeight}
    slresize(); window.addEventListener('resize', slresize);
    window.slslasheffect = new slslasheffect(slslashcanvas);
}
if (document.body) slinit();
else document.addEventListener("DOMContentLoaded", slinit, {once: true});