import Rectangle from "@/core/Rectangle";
import Vector from "@/core/Vector";
import type ConstrainedPoint from "@/physics/ConstrainedPoint";

export const applyStarImpulse = (
    star: ConstrainedPoint,
    rd: number,
    yImpulse: number,
    delta: number
) => {
    star.applyImpulse(new Vector(-star.v.x / rd, -star.v.y / rd + yImpulse), delta);
};

interface HazardWithBounds {
    t1: Vector;
    t2: Vector;
    b1: Vector;
    b2: Vector;
}

export const isCandyHit = (
    hazard: HazardWithBounds | null | undefined,
    star: ConstrainedPoint | null | undefined,
    radius: number
) => {
    if (!hazard || !star) {
        return false;
    }

    const { t1, t2, b1, b2 } = hazard;
    if (!t1 || !t2 || !b1 || !b2) {
        return false;
    }

    const diameter = radius * 2;
    return (
        Rectangle.lineInRect(
            t1.x,
            t1.y,
            t2.x,
            t2.y,
            star.pos.x - radius,
            star.pos.y - radius,
            diameter,
            diameter
        ) ||
        Rectangle.lineInRect(
            b1.x,
            b1.y,
            b2.x,
            b2.y,
            star.pos.x - radius,
            star.pos.y - radius,
            diameter,
            diameter
        )
    );
};
