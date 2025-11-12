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
(function () {
    const slslashcanvas = document.createElement('canvas');
    slslashcanvas.id = 'slashcanvas'; slslashcanvas.style.position = 'fixed';
    slslashcanvas.style.top = '0'; slslashcanvas.style.left = '0';
    slslashcanvas.style.width = '100vw'; slslashcanvas.style.height = '100vh'; 
    slslashcanvas.style.zIndex = '2147483647'; slslashcanvas.style.pointerEvents = 'none';
    document.body.appendChild(slslashcanvas);

    function slresize() {slslashcanvas.width = window.innerWidth; slslashcanvas.height = window.innerHeight}
    slresize(); window.addEventListener('resize', slresize);
    window.slslasheffect = new slslasheffect(slslashcanvas);
})();