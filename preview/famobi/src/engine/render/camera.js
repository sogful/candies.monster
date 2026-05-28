  // Camera - orthographic 2-d camera. Holds:
  //   position    - world point the camera looks at
  //   origin      - the on-screen pivot (centred via centerPivot)
  //   rotation    - degrees
  //   zoom        - linear scale
  //   size        - viewport size in pixels
  //   hD          - inherited from TransformStack; here it's the
  //                 projection matrix (NDC -> [-1, 1])
  //   JB          - the inverse projection (pixel -> NDC), built
  //                 alongside hD in Lb()
  //   Wm          - this node's local matrix (translate * scale * rot)
  //   pk          - inherited; world matrix = hD * Wm
  //   KB          - inverse of Wm (world -> camera-local)
  //   Kv          - composite KB * JB used by hit-testing to project
  //                 a pixel back into world space
  class Camera extends TransformStack {
    constructor() {
      super();
      this.origin = new Vec4(0, 0, 0, 1);
      this.position = new Vec4(0, 0, 0, 1);
      this.rotation = 0;
      this.zoom = 1;
      this.invLocalM = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.invProjM = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.screenToWorldM = new Mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      this.size = new Vec4(0, 0, 0, 1);
      this.setSize(new Vec4(1000, 1000, 0, 1));
    }
    setZoom(zoomLevel) {
      if (this.zoom != zoomLevel) {
        this.zoom = zoomLevel;
        this.rebuild();
      }
    }
    centerPivot() {
      let origin = this.origin;
      let size = this.size;
      origin.x = size.x / 2;
      origin.y = size.y / 2;
      this.rebuild();
    }
    // Lb - set viewport size and rebuild the projection (hD) + inverse
    // projection (JB) matrices. The projection maps the [0, w] x [0, h]
    // pixel range onto NDC [-1, 1] x [1, -1] (y flipped).
    setSize(viewportSize) {
      let w = viewportSize.x;
      let h = viewportSize.y;
      this.size.x = viewportSize.x;
      this.size.y = viewportSize.y;
      let proj = this.parentM;
      proj.m11 = 2 / w;  proj.m12 = 0;       proj.m13 = 0;       proj.m14 = -1;
      proj.m21 = 0;      proj.m22 = -2 / h;  proj.m23 = 0;       proj.m24 = 1;
      proj.m31 = 0;      proj.m32 = 0;       proj.m33 = -0.001;  proj.m34 = 0;
      proj.m41 = 0;      proj.m42 = 0;       proj.m43 = 0;       proj.m44 = 1;
      // build the inverse manually since proj is a known scale+shift
      let projTx = proj.m14;
      let projTy = proj.m24;
      let inv = this.invProjM;
      inv.m11 = w / 2;  inv.m12 = 0;        inv.m13 = 0;     inv.m14 = -inv.m11 * projTx + inv.m12 * projTy;
      inv.m21 = 0;      inv.m22 = -h / 2;   inv.m23 = 0;     inv.m24 = -inv.m21 * projTx + inv.m22 * projTy;
      inv.m31 = 0;      inv.m32 = 0;        inv.m33 = -1000; inv.m34 = 0;
      inv.m41 = 0;      inv.m42 = 0;        inv.m43 = 0;     inv.m44 = 1;
      this.rebuild();
    }
    // Sr - recompute Wm (local), KB (inverse of Wm), Kv (KB * JB).
    // Wm = translate(-position) * scale(zoom) * rotate(rotation) +
    //      translate(origin) (so the on-screen pivot lands at origin).
    rebuild() {
      // ---- Wm = identity ------------------------------------------
      let local = this.localM;
      local.m11 = 1; local.m12 = 0; local.m13 = 0; local.m14 = 0;
      local.m21 = 0; local.m22 = 1; local.m23 = 0; local.m24 = 0;
      local.m31 = 0; local.m32 = 0; local.m33 = 1; local.m34 = 0;
      local.m41 = 0; local.m42 = 0; local.m43 = 0; local.m44 = 1;
      // ---- translate by -position ---------------------------------
      let px = this.position.x;
      let py = this.position.y;
      local.m14 += -px;
      local.m24 += -py;
      // ---- scale by zoom ------------------------------------------
      let sx = this.zoom;
      let sy = this.zoom;
      local.m11 *= sx;  local.m12 *= sx;  local.m14 *= sx;
      local.m21 *= sy;  local.m22 *= sy;  local.m24 *= sy;
      // ---- rotate (rotation in degrees) ---------------------------
      let theta = this.rotation * DEG2RAD;
      let sinT = Math.sin(theta);
      let cosT = Math.cos(theta);
      let r11 = local.m11, r21 = local.m21;
      local.m11 = cosT * r11 - sinT * r21;
      local.m21 = sinT * r11 + cosT * r21;
      let r12 = local.m12, r22 = local.m22;
      local.m12 = cosT * r12 - sinT * r22;
      local.m22 = sinT * r12 + cosT * r22;
      let r14 = local.m14, r24 = local.m24;
      local.m14 = cosT * r14 - sinT * r24;
      local.m24 = sinT * r14 + cosT * r24;
      // ---- shift back so pivot lands at origin --------------------
      local.m14 += px;
      local.m24 += py;
      local.m14 += this.origin.x - this.position.x;
      local.m24 += this.origin.y - this.position.y;
      // copy back into Wm (some fields written twice in original,
      // preserved for parity)
      let wm = this.localM;
      wm.m11 = local.m11; wm.m12 = local.m12; wm.m14 = local.m14;
      wm.m21 = local.m21; wm.m22 = local.m22; wm.m24 = local.m24;
      this.recomputeWorld();
      // ---- KB = inverse(Wm) -------------------------------------
      // standard 4x4 cofactor inverse. The intermediate s* variables
      // are 2x2 sub-determinants reused across cofactor rows.
      let kb = this.invLocalM;
      let m = this.localM;
      let m11 = m.m11, m12 = m.m12, m13 = m.m13, m14 = m.m14;
      let m21 = m.m21, m22 = m.m22, m23 = m.m23, m24 = m.m24;
      let m31 = m.m31, m32 = m.m32, m33 = m.m33, m34 = m.m34;
      let m41 = m.m41, m42 = m.m42, m43 = m.m43, m44 = m.m44;
      let s11 = m11 * m22 - m12 * m21;
      let s12 = m11 * m23 - m13 * m21;
      let s13 = m11 * m24 - m14 * m21;
      let s14 = m12 * m23 - m13 * m22;
      let s15 = m12 * m24 - m14 * m22;
      let s16 = m13 * m24 - m14 * m23;
      let s21 = m31 * m42 - m32 * m41;
      let s22 = m31 * m43 - m33 * m41;
      let s23 = m31 * m44 - m34 * m41;
      let s24 = m32 * m43 - m33 * m42;
      let s25 = m32 * m44 - m34 * m42;
      let s26 = m33 * m44 - m34 * m43;
      let invDet = 1 / (s11 * s26 - s12 * s25 + s13 * s24 + s14 * s23 - s15 * s22 + s16 * s21);
      kb.m11 = ( m22 * s26 - m23 * s25 + m24 * s24) * invDet;
      kb.m12 = (-m12 * s26 + m13 * s25 - m14 * s24) * invDet;
      kb.m13 = ( m42 * s16 - m43 * s15 + m44 * s14) * invDet;
      kb.m14 = (-m32 * s16 + m33 * s15 - m34 * s14) * invDet;
      kb.m21 = (-m21 * s26 + m23 * s23 - m24 * s22) * invDet;
      kb.m22 = ( m11 * s26 - m13 * s23 + m14 * s22) * invDet;
      kb.m23 = (-m41 * s16 + m43 * s13 - m44 * s12) * invDet;
      kb.m24 = ( m31 * s16 - m33 * s13 + m34 * s12) * invDet;
      kb.m31 = ( m21 * s25 - m22 * s23 + m24 * s21) * invDet;
      kb.m32 = (-m11 * s25 + m12 * s23 - m14 * s21) * invDet;
      kb.m33 = ( m41 * s15 - m42 * s13 + m44 * s11) * invDet;
      kb.m34 = (-m31 * s15 + m32 * s13 - m34 * s11) * invDet;
      kb.m41 = (-m21 * s24 + m22 * s22 - m23 * s21) * invDet;
      kb.m42 = ( m11 * s24 - m12 * s22 + m13 * s21) * invDet;
      kb.m43 = (-m41 * s14 + m42 * s12 - m43 * s11) * invDet;
      kb.m44 = ( m31 * s14 - m32 * s12 + m33 * s11) * invDet;
      // ---- Kv = KB * JB -----------------------------------------
      let kv = this.screenToWorldM;
      let a = this.invLocalM;
      let b = this.invProjM;
      let r_12 = a.m11 * b.m12 + a.m12 * b.m22 + a.m13 * b.m32 + a.m14 * b.m42;
      let r_13 = a.m11 * b.m13 + a.m12 * b.m23 + a.m13 * b.m33 + a.m14 * b.m43;
      let r_14 = a.m11 * b.m14 + a.m12 * b.m24 + a.m13 * b.m34 + a.m14 * b.m44;
      let r_21 = a.m21 * b.m11 + a.m22 * b.m21 + a.m23 * b.m31 + a.m24 * b.m41;
      let r_22 = a.m21 * b.m12 + a.m22 * b.m22 + a.m23 * b.m32 + a.m24 * b.m42;
      let r_23 = a.m21 * b.m13 + a.m22 * b.m23 + a.m23 * b.m33 + a.m24 * b.m43;
      let r_24 = a.m21 * b.m14 + a.m22 * b.m24 + a.m23 * b.m34 + a.m24 * b.m44;
      let r_31 = a.m31 * b.m11 + a.m32 * b.m21 + a.m33 * b.m31 + a.m34 * b.m41;
      let r_32 = a.m31 * b.m12 + a.m32 * b.m22 + a.m33 * b.m32 + a.m34 * b.m42;
      let r_33 = a.m31 * b.m13 + a.m32 * b.m23 + a.m33 * b.m33 + a.m34 * b.m43;
      let r_34 = a.m31 * b.m14 + a.m32 * b.m24 + a.m33 * b.m34 + a.m34 * b.m44;
      let r_41 = a.m41 * b.m11 + a.m42 * b.m21 + a.m43 * b.m31 + a.m44 * b.m41;
      let r_42 = a.m41 * b.m12 + a.m42 * b.m22 + a.m43 * b.m32 + a.m44 * b.m42;
      let r_43 = a.m41 * b.m13 + a.m42 * b.m23 + a.m43 * b.m33 + a.m44 * b.m43;
      let r_44 = a.m41 * b.m14 + a.m42 * b.m24 + a.m43 * b.m34 + a.m44 * b.m44;
      kv.m11 = a.m11 * b.m11 + a.m12 * b.m21 + a.m13 * b.m31 + a.m14 * b.m41;
      kv.m12 = r_12; kv.m13 = r_13; kv.m14 = r_14;
      kv.m21 = r_21; kv.m22 = r_22; kv.m23 = r_23; kv.m24 = r_24;
      kv.m31 = r_31; kv.m32 = r_32; kv.m33 = r_33; kv.m34 = r_34;
      kv.m41 = r_41; kv.m42 = r_42; kv.m43 = r_43; kv.m44 = r_44;
    }
  }
  Camera.i = true;
  Camera.s = TransformStack;
  Object.assign(Camera.prototype, {
    l: Camera
  });
