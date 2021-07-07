"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointF = void 0;
class PointF {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static empty() {
        return new PointF(0, 0, 0);
    }
}
exports.PointF = PointF;
