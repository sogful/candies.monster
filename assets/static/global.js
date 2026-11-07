import("./imageloading.js").catch(error => console.warn("Image loading indicator unavailable.", error));

/*//////////////////////////////////////////////////////////////////////*/

class slslasheffect {
    constructor(slcanvas) {
        this.slcanvas = slcanvas; this.slctx = slcanvas.getContext("2d");
        this.slpoints = []; this.slisdrawing = false;
        this.slmaxpoints = 60; this.slfadetime = 320; this.sllinewidth = 5;
        this.slcolor = "#ffffff"; this.slsmoothdist = 12;
        this.slrequest = 0; this.slpointer = null;
        this.slpainted = false;
        this.slmotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        this.slsetupevents();
    }

    slsetupevents() {
        if ("PointerEvent" in window) {
            document.addEventListener("pointerdown", e => {
                if (e.isPrimary === false) return;
                this.slpointer = e.pointerId;
                this.slstartdrawing(e);
            }, {passive: true});
            document.addEventListener("pointermove", e => {
                if (e.pointerId === this.slpointer) this.sladdpoint(e);
            }, {passive: true});
            for (const slevent of ["pointerup", "pointercancel"]) {
                document.addEventListener(slevent, e => {
                    if (e.pointerId === this.slpointer) this.slstopdrawing();
                }, {passive: true});
            }
        } else {
            document.addEventListener("mousedown", e => this.slstartdrawing(e), {passive: true});
            document.addEventListener("mousemove", e => this.sladdpoint(e), {passive: true});
            document.addEventListener("mouseup", () => this.slstopdrawing(), {passive: true});
            document.addEventListener("touchstart", e => {
                if (e.touches[0]) this.slstartdrawing(e.touches[0]);
            }, {passive: true});
            document.addEventListener("touchmove", e => {
                if (e.touches[0]) this.sladdpoint(e.touches[0]);
            }, {passive: true});
            document.addEventListener("touchend", () => this.slstopdrawing(), {passive: true});
            document.addEventListener("touchcancel", () => this.slstopdrawing(), {passive: true});
        }
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) this.slclear();
        });
        window.addEventListener("blur", () => this.slclear());
        const slmotionchange = () => this.slclear();
        if (this.slmotion.addEventListener) this.slmotion.addEventListener("change", slmotionchange);
        else this.slmotion.addListener(slmotionchange);
    }

    slgetcanvaspoint(sle) {
        const slscalex = this.slcanvas.width / window.innerWidth;
        const slscaley = this.slcanvas.height / window.innerHeight;
        return {slx: sle.clientX * slscalex, sly: sle.clientY * slscaley};
    }

    slstartdrawing(sle) {
        if (document.hidden || this.slmotion.matches) return;
        this.slisdrawing = true;
        const slp = this.slgetcanvaspoint(sle);
        this.slpoints = [{slx: slp.slx, sly: slp.sly, sltime: Date.now()}];
        this.slanimate();
    }
    sladdpoint(sle) {
        if (!this.slisdrawing || document.hidden || this.slmotion.matches) return;
        const slp = this.slgetcanvaspoint(sle);
        const slnow = Date.now();
        this.slpoints = this.slpoints.filter(slp => slnow - slp.sltime < this.slfadetime);
        if (this.slpoints.length) {
            const sllast = this.slpoints[this.slpoints.length - 1];
            const sldx = slp.slx - sllast.slx, sldy = slp.sly - sllast.sly;
            if (sldx * sldx + sldy * sldy < 4) {
                this.slpoints[this.slpoints.length - 1] =
                {slx: (sllast.slx + slp.slx) / 2, sly: (sllast.sly + slp.sly) / 2, sltime: slnow};
                this.slanimate();
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
                this.slanimate();
                return;
            }
        }
        this.slpoints.push({slx: slp.slx, sly: slp.sly, sltime: slnow});
        if (this.slpoints.length > this.slmaxpoints) this.slpoints.shift();
        this.slanimate();
    }
    slstopdrawing() {
        this.slisdrawing = false;
        this.slpointer = null;
    }
    sleasefading(slage) {
        const slt = Math.min(1, Math.max(0, slage / this.slfadetime));
        return 1 - (slt < 0.5 ? 4 * slt * slt * slt : 1 - Math.pow(-2 * slt + 2, 3) / 2);
    }
    sldraw() {
        const slnow = Date.now();
        this.slpoints = this.slpoints.filter(slp => slnow - slp.sltime < this.slfadetime);
        const slctx = this.slctx, slpts = this.slpoints, sllen = slpts.length;
        if (this.slpainted || sllen > 1) slctx.clearRect(0, 0, this.slcanvas.width, this.slcanvas.height);
        this.slpainted = sllen > 1;
        if (sllen < 2) return;
        slctx.save();
        slctx.lineCap = "round"; slctx.lineJoin = "round";

        for (let sli = 1; sli < sllen; sli++) {
            const slp0 = slpts[sli - 1], slp1 = slpts[sli];
            const slage0 = slnow - slp0.sltime; const slage1 = slnow - slp1.sltime;
            if (slage1 > this.slfadetime) continue;
            const slo0 = this.sleasefading(slage0); const slo1 = this.sleasefading(slage1);
            const slsubsteps = 4;
            for (let sls = 0; sls < slsubsteps; sls++) {
                const slt0 = sls / slsubsteps; const slt1 = (sls + 1) / slsubsteps;
                const slxa = slp0.slx + (slp1.slx - slp0.slx) * slt0; const slya = slp0.sly + (slp1.sly - slp0.sly) * slt0;
                const slxb = slp0.slx + (slp1.slx - slp0.slx) * slt1; const slyb = slp0.sly + (slp1.sly - slp0.sly) * slt1;
                const slopa = slo0 + (slo1 - slo0) * slt0; const slopb = slo0 + (slo1 - slo0) * slt1;
                const slopacity = Math.max(0, Math.min(1, (slopa + slopb) * 0.5));
                slctx.beginPath(); slctx.moveTo(slxa, slya); slctx.lineTo(slxb, slyb);
                slctx.strokeStyle = this.slcolor; slctx.globalAlpha = slopacity;
                slctx.lineWidth = this.sllinewidth * ((slopa + slopb) * 0.5);
                slctx.stroke();
            }
        }
        slctx.restore();
    }

    slanimate() {
        if (this.slrequest || document.hidden || this.slmotion.matches || !this.slpoints.length) return;
        this.slrequest = requestAnimationFrame(() => {
            this.slrequest = 0;
            this.sldraw();
            if (this.slpoints.length) this.slanimate();
        });
    }
    slclear() {
        if (this.slrequest) cancelAnimationFrame(this.slrequest);
        this.slrequest = 0;
        this.slpoints = []; this.slisdrawing = false;
        this.slpointer = null;
        if (this.slpainted) this.slctx.clearRect(0, 0, this.slcanvas.width, this.slcanvas.height);
        this.slpainted = false;
    }
    slsetcolor(slcolor) {this.slcolor = slcolor}
    slsetlinewidth(slw) {this.sllinewidth = slw}
}
function slinit() {
    const slslashcanvas = document.createElement("canvas");
    slslashcanvas.className = "slashcanvas"; slslashcanvas.style.position = "fixed";
    slslashcanvas.style.top = "0"; slslashcanvas.style.left = "0";
    slslashcanvas.style.width = "100vw"; slslashcanvas.style.height = "100vh";
    slslashcanvas.style.zIndex = "2147483647"; slslashcanvas.style.pointerEvents = "none";
    document.body.appendChild(slslashcanvas);

    function slresize() {
        if (slslashcanvas.width === window.innerWidth && slslashcanvas.height === window.innerHeight) return;
        slslashcanvas.width = window.innerWidth; slslashcanvas.height = window.innerHeight;
        if (window.slslasheffect) window.slslasheffect.slclear();
    }
    slresize(); window.addEventListener("resize", slresize);
    window.slslasheffect = new slslasheffect(slslashcanvas);
}
if (document.body) slinit();
else document.addEventListener("DOMContentLoaded", slinit, {once: true});
