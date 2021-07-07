"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quaternion = void 0;
const Vector3_1 = require("./Vector3");
class Quaternion {
    constructor(valueXOrVector, yOrW, z, w) {
        if (valueXOrVector instanceof Vector3_1.Vector3) {
            this.x = valueXOrVector.x;
            this.y = valueXOrVector.y;
            this.z = valueXOrVector.z;
            this.w = yOrW;
        }
        else if (yOrW === undefined) {
            this.x = valueXOrVector;
            this.y = valueXOrVector;
            this.z = valueXOrVector;
            this.w = valueXOrVector;
        }
        else {
            this.x = valueXOrVector;
            this.y = yOrW;
            this.z = z;
            this.w = w;
        }
    }
}
exports.Quaternion = Quaternion;
