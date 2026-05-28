  class PointLink {
    constructor(a, b, c) {
      this.other = a;
      this.restLen = b;
      this.type = c;
    }
  }
  PointLink.i = true;
  Object.assign(PointLink.prototype, {
    l: PointLink
  });
  class Particle {
    constructor() {
      this.pinned = false;
      this.setWeight(1);
      this.reset();
    }
    setWeight(a) {
      this.weight = a;
      this.invMass = 1 / a;
      this.gravity = new Vec2(0, PhysicsConfig.GRAVITY * a);
    }
    reset() {
      this.velocity = Vec2.zero();
      this.accel = Vec2.zero();
      this.g = Vec2.zero();
      this.delta = Vec2.zero();
      this.forceVec = Vec2.zero();
    }
    applyImpulse(a, b) {
      if (!a.isZero()) {
        this.g.add(Vec2.scaled(a, b / 1));
      }
    }
  }
  Particle.i = true;
  Object.assign(Particle.prototype, {
    l: Particle
  });
  class VerletPoint extends Particle {
    constructor() {
      super();
      this.prev = new Vec2(INT32_MAX, INT32_MAX);
      this.pinPos = new Vec2(-1, -1);
      this.links = [];
      this.forceVec = Vec2.zero();
      this.reset();
    }
    reset() {
      super.reset();
      this.prev = new Vec2(INT32_MAX, INT32_MAX);
      this.prev.x = INT32_MAX;
      this.prev.y = INT32_MAX;
      this.clearLinks();
    }
    clearLinks() {
      this.links = [];
    }
    addLink(a, b, c) {
      this.links.push(new PointLink(a, b, c));
    }
    removeLinkAt(a) {
      this.links.splice(a, 1);
    }
    hasLink(a) {
      let b = this.links;
      let c = b.length;
      let d = 0;
      while (d < c) {
        if (b[d++].other == a) {
          return true;
        }
      }
      return false;
    }
    setLinkDistance(a, b) {
      let c = this.links;
      let d = c.length;
      let e = 0;
      while (e < d) {
        let f = c[e++];
        if (f.other == a) {
          f.restLen = b;
          break;
        }
      }
    }
    replaceLinkTarget(a, b, c) {
      let d = this.links;
      let e = d.length;
      let f = 0;
      while (f < e) {
        let g = d[f++];
        if (g.other == a) {
          g.other = b;
          g.restLen = c;
          break;
        }
      }
    }
    restLenTo(a) {
      let b = this.links;
      let c = b.length;
      let d = 0;
      while (d < c) {
        let e = b[d++];
        if (e.other == a) {
          return e.restLen;
        }
      }
      return -1;
    }
    update(a) {
      if (a != 0) {
        var b = this.forceVec;
        var c = PhysicsConfig.current;
        if (this.pinned) {
          b.x = 0;
          b.y = 0;
        } else if (c.y != 0 || c.x != 0) {
          b.x = c.x;
          b.y = c.y;
        } else {
          b.x = this.gravity.x * this.invMass;
          b.y = this.gravity.y * this.invMass;
        }
        b = a / 1 * a;
        this.accel.x = this.forceVec.x * b;
        this.accel.y = this.forceVec.y * b;
        if (this.prev.x == INT32_MAX) {
          this.prev.x = this.g.x;
          this.prev.y = this.g.y;
        }
        this.delta.x = this.g.x - this.prev.x + this.accel.x;
        this.delta.y = this.g.y - this.prev.y + this.accel.y;
        if (a > 0) {
          a = 1 / a;
          this.velocity.x = this.delta.x * a;
          this.velocity.y = this.delta.y * a;
        }
        this.prev.x = this.g.x;
        this.prev.y = this.g.y;
        this.g.x += this.delta.x;
        this.g.y += this.delta.y;
      }
    }
    applyConstraints() {
      var a = this.pinPos;
      let b = this.g;
      let c = this.invMass;
      let d;
      let e = 0;
      let f = 0;
      if (a.x != -1) {
        b.x = a.x;
        b.y = a.y;
      } else {
        a = this.links;
        for (var g = a.length, h = 0; h < g;) {
          var m = a[h++];
          var n = m.other;
          let u = n.g;
          var q = u.x - b.x;
          d = u.y - b.y;
          if (q == 0 && d == 0) {
            d = q = 1;
          }
          var p = Math.sqrt(q * q + d * d);
          var v = m.restLen;
          m = m.type;
          if (m == 1) {
            if (p <= v) {
              continue;
            }
          } else if (m == 2 && p >= v) {
            continue;
          }
          m = n.pinPos.x == -1;
          n = n.invMass;
          p = (p - v) / ((p > 1 ? p : 1) * (c + n));
          if (m) {
            e = q;
            f = d;
          }
          v = c * p;
          q *= v;
          d *= v;
          b.x += q;
          b.y += d;
          if (m) {
            q = n * p;
            u.x -= e * q;
            u.y -= f * q;
          }
        }
      }
    }
  }
  VerletPoint.i = true;
  VerletPoint.s = Particle;
  Object.assign(VerletPoint.prototype, {
    l: VerletPoint
  });
  class PhysicsConfig {
    static toggle() {
      PhysicsConfig.current.y = -PhysicsConfig.current.y;
    }
    static isNormal() {
      if (PhysicsConfig.current.y == PhysicsConfig.GRAVITY) {
        return PhysicsConfig.current.x == 0;
      } else {
        return false;
      }
    }
    static reset() {
      PhysicsConfig.current.x = 0;
      PhysicsConfig.current.y = PhysicsConfig.GRAVITY;
    }
  }
  PhysicsConfig.i = true;

  class SmokeEmitter extends ParticleEmitter {
    constructor(a, b) {
      super(b);
      this.controller = a;
      this.sprites = [];
      this.angle = 0;
      this.angleVar = 50;
      this.life = 0.5;
      this.lifeVar = 0.3;
      this.duration = 1.5;
      this.speed = 80;
      this.speedVar = 10;
    }
    free() {
      let a = 0;
      let b = this.sprites;
      while (a < b.length) {
        b[a++].free();
      }
    }
    initParticle(a) {
      super.initParticle(a);
      a = new Sprite(null, Resources.Kd, Keys.hI);
      a.center();
      a.setUniformScale(0.2 + Math.random() * 0.1);
      this.controller.layer(5).appendChild(a.node);
      a.setBlendMode(3);
      this.sprites.push(a);
    }
    writeOutput(a, b, c) {
      a.g.add(Vec2.scaled(a.dir, c));
      super.writeOutput(a, b, c);
    }
    removeAt(a) {
      super.removeAt(a);
      let b = this.sprites[a];
      this.sprites.splice(a, 1);
      b.free();
    }
    draw() {
      super.draw();
      let a = 0;
      let b = this.particles.length;
      while (a < b) {
        var c = a++;
        let d = this.particles[c];
        c = this.sprites[c];
        c.setX(d.g.x);
        c.setY(d.g.y);
        c.setRotation(d.angle);
        c.setAlpha(d.life / d.lifeStart);
      }
    }
    update(a) {
      super.update(a);
      a = 0;
      let b = this.particles.length;
      while (a < b) {
        let c = this.particles[a++];
        c.angle = 52 + Math.atan2(c.dir.y, c.dir.x) * RAD2DEG;
      }
    }
  }
  SmokeEmitter.i = true;
  SmokeEmitter.s = ParticleEmitter;
  Object.assign(SmokeEmitter.prototype, {
    l: SmokeEmitter
  });

  class PollenEmitter extends ParticleEmitter {
    constructor(a, b) {
      super(b);
      this.controller = a;
      this.sprites = [];
      this.size = 0.6;
      this.sizeVar = 0.2;
      this.angle = X.next() * 360;
      this.angleVar = 15;
      this.angularVelVar = 30;
      this.life = 0.8;
      this.lifeVar = 0.3;
      this.duration = 1.5;
      this.speed = 140;
      this.speedVar = 35;
    }
    start(a) {
      super.start(a);
    }
    initParticle(a) {
      super.initParticle(a);
      this.angle += 360 / this.capacity;
      let b = this.size + X.randCentered() * this.sizeVar;
      let c = Keys.indexed(Keys.Wp, X.randInt(0, 2));
      let d = Resources.de.frames.findByName(c).sourceSize;
      a.width = d.x * b;
      a.height = d.y * b;
      a.angSpeed = this.angularVel + this.angularVelVar * X.randCentered();
      a = new Sprite(null, Resources.de, c);
      a.center();
      this.controller.layer(5).appendChild(a.node);
      this.sprites.push(a);
    }
    writeOutput(a, b, c) {
      a.angle += a.angSpeed * c;
      super.writeOutput(a, b, c);
    }
    removeAt(a) {
      super.removeAt(a);
      let b = this.sprites[a];
      this.sprites.splice(a, 1);
      b.free();
    }
    draw() {
      super.draw();
      let a = 0;
      let b = this.particles.length;
      while (a < b) {
        var c = a++;
        let d = this.particles[c];
        c = this.sprites[c];
        c.setRotation(d.angle);
        c.setUniformScale(d.width / c.size.x * 0.4);
        c.setX(d.g.x);
        c.setY(d.g.y);
        c.setAlpha(d.alpha);
      }
    }
    update(a) {
      super.update(a);
      a = 0;
      let b = this.particles.length;
      while (a < b) {
        let c = this.particles[a++];
        if (c.life > 0) {
          if (c.life < c.lifeStart * 0.7) {
            c.alpha = c.life / (c.lifeStart * 0.7);
          }
          c.dir.x *= 0.9;
          c.dir.y *= 0.9;
          c.width *= 1.015;
          c.height *= 1.015;
        }
      }
    }
  }
  PollenEmitter.i = true;
  PollenEmitter.s = ParticleEmitter;
  Object.assign(PollenEmitter.prototype, {
    l: PollenEmitter
  });
  class DirectionalSpray extends ParticleEmitter {
    constructor(a, b) {
      super(5);
      this.controller = a;
      this.angle = b;
      this.angleVar = 10;
      this.speed = 500;
      this.speedVar = 100;
      this.life = 0.6;
      this.size = 12;
      this.emitRate = 100;
      this.colorStart.r = 1;
      this.colorStart.g = 1;
      this.colorStart.b = 1;
      this.colorStart.a = 0.6;
      this.colorEnd.r = 1;
      this.colorEnd.g = 1;
      this.colorEnd.b = 1;
      this.colorEnd.a = 0;
      this.sprites = [];
    }
    initParticle(a) {
      super.initParticle(a);
      a = new Sprite(null, Resources.wm, Keys.padNum(6 + X.randInt(0, 2)));
      a.setUniformScale(0.4);
      a.center();
      a.setBlendMode(3);
      this.controller.layer(5).appendChild(a.node);
      this.sprites.push(a);
    }
    writeOutput(a, b, c) {
      super.writeOutput(a, b, c);
      a.dir.multiply(0.9);
      b = Vec2.scaled(a.dir, c);
      b.add(this.gravity);
      a.g.add(b);
    }
    removeAt(a) {
      super.removeAt(a);
      let b = this.sprites[a];
      this.sprites.splice(a, 1);
      b.free();
    }
    draw() {
      super.draw();
      let a = 0;
      let b = this.particles.length;
      while (a < b) {
        var c = a++;
        let d = this.particles[c];
        c = this.sprites[c];
        c.setX(d.g.x);
        c.setY(d.g.y);
        c.setAlpha(d.color.a);
      }
    }
  }
  DirectionalSpray.i = true;
  DirectionalSpray.s = ParticleEmitter;
  Object.assign(DirectionalSpray.prototype, {
    l: DirectionalSpray
  });

  class SwarmManager extends GameObject {
    constructor(a) {
      super();
      this.particles = [];
      this.container = new Container();
      a.layer(0).appendChild(this.container.node);
    }
    addParticle(a, b) {
      var c = [0.3, 0.3, 0.5, 0.5, 0.6];
      var d = c = c[MathUtil.randInt(0, c.length - 1)];
      if (MathUtil.randBool()) {
        c *= 1 + MathUtil.randInt(0, 1) / 10;
      } else {
        d *= 1 + MathUtil.randInt(0, 1) / 10;
      }
      let e = Math.min(1 - c, 1 - d);
      let f = Math.random();
      let g = new SwarmParticle();
      this.container.appendChild(g.sprite);
      g.pathIdx = b;
      g.x = a.x;
      g.y = a.y;
      g.scaleXA = e + c;
      g.scaleYA = e + d;
      g.scaleX = g.scaleXA * f;
      g.scaleY = g.scaleYA * f;
      g.scaleXB = c;
      g.scaleYB = d;
      g.alphaB = 0.3;
      g.alphaA = 1;
      g.alpha = f * 0.7 + 0.3;
      this.particles.push(g);
    }
    addAlongLine(a, b, c) {
      let d = c.motion.path[a];
      b = Vec2.diff(c.motion.path[b], d);
      c = b.length();
      if (!(c < EPSILON)) {
        c = Math.floor(c / 17.6);
        b.normalize();
        for (var e = 0; e <= c;) {
          var f = Vec2.sum(d, Vec2.scaled(b, e * 17.6));
          f.x += MathUtil.randInt(-1.6, 1.6);
          f.y += MathUtil.randInt(-1.6, 1.6);
          this.addParticle(f, a);
          ++e;
        }
      }
    }
    update(a) {
      super.update(a);
      let b = 0;
      let c = this.particles;
      while (b < c.length) {
        let e = c[b];
        ++b;
        var d = PathResolver.rampTowardStep(e.scaleX, e.scaleXB, 1, a);
        e.scaleX = d.value;
        if (d.reached) {
          d = e.scaleXA;
          e.scaleXA = e.scaleXB;
          e.scaleXB = d;
        }
        d = PathResolver.rampTowardStep(e.scaleY, e.scaleYB, 1, a);
        e.scaleY = d.value;
        if (d.reached) {
          d = e.scaleYA;
          e.scaleYA = e.scaleYB;
          e.scaleYB = d;
        }
        d = PathResolver.rampTowardStep(e.alpha, e.alphaB, 1, a);
        e.alpha = d.value;
        if (d.reached) {
          d = e.alphaA;
          e.alphaA = e.alphaB;
          e.alphaB = d;
        }
      }
    }
    draw() {
      let a = 0;
      let b = this.particles;
      while (a < b.length) {
        let c = b[a];
        ++a;
        c.sprite.setTransform(c.x, c.y, c.scaleX * 0.4, c.scaleY * 0.4);
        c.sprite.setAlpha(c.alpha);
      }
    }
  }
  SwarmManager.i = true;
  SwarmManager.s = GameObject;
  Object.assign(SwarmManager.prototype, {
    l: SwarmManager
  });
  class SwarmParticle {
    constructor() {
      this.scaleX = this.scaleXA = this.scaleXB = this.scaleY = this.scaleYA = this.scaleYB = this.alpha = this.alphaA = this.alphaB = 1;
      this.pathIdx = this.x = this.y = 0;
      this.sprite = new Sprite(null, Resources.Ld, Keys.JG);
      this.sprite.center();
    }
  }
  SwarmParticle.i = true;
  Object.assign(SwarmParticle.prototype, {
    l: SwarmParticle
  });

  // ParticleData - one live particle. `g` is the current position,
  // `prev` last frame position (verlet style), `dir` velocity vector.
  // `life` ticks down to 0 (recycled then), `lifeStart` is the
  // initial value used to drive `colorRate` (per-second color delta).
  // radial/tangential accel act along/perpendicular to position
  // vector. angSpeed is degrees-per-second rotation; alpha/scale/
  // width/height are subclass driven render hints.
  class ParticleData {
    constructor() {
      this.prev = new Vec2(0, 0);
      this.g = new Vec2(0, 0);
      this.dir = new Vec2(0, 0);
      this.tangentialAccel = this.radialAccel = 0;
      this.color = new RGBA(0, 0, 0, 0);
      this.colorRate = new RGBA(0, 0, 0, 0);
      this.angle = this.angSpeed = this.lifeStart = this.life = this.size = 0;
      this.scale = this.alpha = 1;
      this.height = this.width = 0;
    }
  }
  ParticleData.i = true;
  Object.assign(ParticleData.prototype, {
    l: ParticleData
  });
  class PointWithSize {
    constructor(a, b, c) {
      this.x = a;
      this.y = b;
      this.size = c;
    }
  }
  PointWithSize.i = true;
  Object.assign(PointWithSize.prototype, {
    l: PointWithSize
  });
