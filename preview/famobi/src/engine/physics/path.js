  // PathResolver - waypoint follower. Each waypoint has a speed (qC[i]),
  // and Fm is the angular rotation rate (radians/sec) applied on top.
  // qm carries leftover travel from an overshoot frame so we don't
  // lose time when crossing a waypoint mid-step.
  class PathResolver {
    constructor(waypointCount, defaultSpeed, angularSpeed) {
      if (angularSpeed == null) angularSpeed = 0;
      if (defaultSpeed == null) defaultSpeed = 0;
      this.angularSpeed = angularSpeed;
      this.path = [];
      if (waypointCount > 0) {
        this.speeds = [];
        let i = 0;
        while (i < waypointCount) {
          this.speeds[i++] = defaultSpeed;
        }
      }
      this.g = new Vec2(0, 0);
      this.angle = 0;
      this.reverse = this.paused = false;
      this.cursor = this.leftover = 0;
    }
    addWaypoint(waypoint) {
      this.path.push(waypoint);
    }
    start() {
      if (this.path.length > 0) {
        this.g.copyFrom(this.path[0]);
        this.cursor = 1;
        this.computeStep();
      }
    }
    // eA - recompute the per-frame velocity vector for the segment
    // from the current position to waypoint Xf.
    computeStep() {
      this.offset = Vec2.diff(this.path[this.cursor], this.g);
      this.offset.normalize();
      this.offset.multiply(this.speeds[this.cursor]);
    }
    update(dt) {
      if (!this.paused) {
        if (this.path.length > 0) {
          let target = this.path[this.cursor];
          let reached = false;
          if (this.g.equals(target)) {
            reached = true;
          } else {
            let step = dt;
            if (this.leftover != 0) {
              step = dt + this.leftover;
              this.leftover = 0;
            }
            this.g.add(Vec2.scaled(this.offset, step));
            // overshoot detection: if the post-step direction to the
            // target flipped sign on either axis we've passed it.
            // Reclaim the surplus time as qm for the next segment.
            if (!MathUtil.sameSign(this.offset.x, target.x - this.g.x) || !MathUtil.sameSign(this.offset.y, target.y - this.g.y)) {
              this.leftover = Vec2.diff(this.g, target).length();
              this.leftover /= this.offset.length();
              this.g.copyFrom(target);
              reached = true;
            }
          }
          if (reached) {
            if (this.reverse) {
              this.cursor--;
              if (this.cursor < 0) this.cursor = this.path.length - 1;
            } else {
              this.cursor++;
              if (this.cursor >= this.path.length) this.cursor = 0;
            }
            this.computeStep();
          }
        }
        if (this.angularSpeed != 0) {
          this.angle += this.angularSpeed * dt;
        }
      }
    }
    // dk - linear ramp `current` toward `target` at `rate` over `dt`,
    // clamping at the target.
    static rampToward(current, target, rate, dt) {
      if (target != current) {
        if (target > current) {
          current += rate * dt;
          if (current > target) current = target;
        } else {
          current -= rate * dt;
          if (current < target) current = target;
        }
      }
      return current;
    }
    // ek - same as dk but returns a PathStep that also flags whether
    // the target was reached on this tick.
    static rampTowardStep(current, target, rate, dt) {
      let reached = false;
      if (target != current) {
        if (target > current) {
          current += rate * dt;
          if (current > target) current = target;
        } else {
          current -= rate * dt;
          if (current < target) current = target;
        }
        if (target == current) reached = true;
      }
      return new PathStep(current, reached);
    }
  }
  PathResolver.i = true;
  Object.assign(PathResolver.prototype, {
    l: PathResolver
  });

  // PathState - PathResolver that knows how to parse the level XML
  // path syntax. $D handles two forms anchored at (cx, cy):
  //   "RC<radius>" / "R<x><radius>"  - regular polygon ring of the
  //                                    given radius; "RC" = clockwise,
  //                                    anything else = ccw
  //   "<dx1>,<dy1>,<dx2>,<dy2>,..." - polyline of relative offsets
  //                                   (in level units; converted via
  //                                   LevelController.SCALE scale)
  class PathState extends PathResolver {
    constructor(waypointCount, defaultSpeed, angularSpeed) {
      super(waypointCount, defaultSpeed, angularSpeed);
    }
    fromSpec(spec, cx, cy) {
      if (spec.charAt(0) == "R") {
        let radius = Numeric.parseInt(Std.substr(spec, 2, null));
        let vertexCount = Math.round(radius * 3 / 2);
        let step = Math.PI * 2 / vertexCount;
        let angle = 0;
        radius *= LevelController.SCALE;
        if (spec.charAt(1) != "C") step = -step;
        for (let i = 0; i < vertexCount;) {
          ++i;
          this.addWaypoint(new Vec2(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)));
          angle += step;
        }
      } else {
        this.addWaypoint(new Vec2(cx, cy));
        if (spec.charAt(spec.length - 1) == ",") {
          spec = Std.substr(spec, 0, spec.length - 1);
        }
        let coords = spec.split(",");
        let n = coords.length;
        let i = 0;
        while (i < n) {
          this.addWaypoint(new Vec2(cx + parseFloat(coords[i]) * LevelController.SCALE,
                           cy + parseFloat(coords[i + 1]) * LevelController.SCALE));
          i += 2;
        }
      }
    }
  }
  PathState.i = true;
  PathState.s = PathResolver;
  Object.assign(PathState.prototype, {
    l: PathState
  });

  // SeekerPath - homing path. Tracks a moving target `target` from start
  // `(b.x, b.y)` at initial speed, accelerating by 50/s. Used by
  // projectiles / homing particles.
  class SeekerPath extends PathResolver {
    constructor(target, startPos, speed) {
      super(0);
      this.g.x = startPos.x;
      this.g.y = startPos.y;
      this.speed = speed;
      this.target = target;
    }
    addWaypoint() {}
    start() {}
    update(dt) {
      let dx = this.target.x - this.g.x;
      let dy = this.target.y - this.g.y;
      let distSq = dx * dx + dy * dy;
      if (distSq < 0.000001) {
        this.g.x = this.target.x;
        this.g.y = this.target.y;
      } else {
        let dist = Math.sqrt(distSq);
        this.g.x += dx / dist * this.speed * dt;
        this.g.y += dy / dist * this.speed * dt;
        this.speed += dt * 50;
      }
    }
    static create(target, startPos) {
      return new SeekerPath(target, startPos, 300);
    }
  }
  SeekerPath.i = true;
  SeekerPath.s = PathResolver;
  Object.assign(SeekerPath.prototype, {
    l: SeekerPath
  });

  // PathStep - return type of PathResolver.rampTowardStep: the new position and
  // whether the ramp finished this tick.
  class PathStep {
    constructor(value, reached) {
      this.value = value;
      this.reached = reached;
    }
  }
  PathStep.i = true;
  Object.assign(PathStep.prototype, {
    l: PathStep
  });
