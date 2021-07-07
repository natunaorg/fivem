"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector3 = void 0;
class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static create(v1) {
        if (typeof v1 === 'number') {
            return new Vector3(v1, v1, v1);
        }
        return new Vector3(v1.x, v1.y, v1.z);
    }
    static clone(v1) {
        return Vector3.create(v1);
    }
    static add(v1, v2) {
        if (typeof v2 === 'number') {
            return new Vector3(v1.x + v2, v1.y + v2, v1.z + v2);
        }
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
    static subtract(v1, v2) {
        return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }
    static multiply(v1, v2) {
        if (typeof v2 === 'number') {
            return new Vector3(v1.x * v2, v1.y * v2, v1.z * v2);
        }
        return new Vector3(v1.x * v2.x, v1.y * v2.y, v1.z * v2.z);
    }
    static divide(v1, v2) {
        if (typeof v2 === 'number') {
            return new Vector3(v1.x / v2, v1.y / v2, v1.z / v2);
        }
        return new Vector3(v1.x / v2.x, v1.y / v2.y, v1.z / v2.z);
    }
    static dotProduct(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }
    static crossProduct(v1, v2) {
        const x = v1.y * v2.z - v1.z * v2.y;
        const y = v1.z * v2.x - v1.z * v2.z;
        const z = v1.x * v2.y - v1.z * v2.x;
        return new Vector3(x, y, z);
    }
    static normalize(v) {
        return Vector3.divide(v, v.Length);
    }
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
    /**
     * The product of the Euclidean magnitudes of this and another Vector3.
     *
     * @param v Vector3 to find Euclidean magnitude between.
     * @returns Euclidean magnitude with another vector.
     */
    distanceSquared(v) {
        const w = this.subtract(v);
        return Vector3.dotProduct(w, w);
    }
    /**
     * The distance between two Vectors.
     *
     * @param v Vector3 to find distance between.
     * @returns Distance between this and another vector.
     */
    distance(v) {
        return Math.sqrt(this.distanceSquared(v));
    }
    get normalize() {
        return Vector3.normalize(this);
    }
    crossProduct(v) {
        return Vector3.crossProduct(this, v);
    }
    dotProduct(v) {
        return Vector3.dotProduct(this, v);
    }
    add(v) {
        return Vector3.add(this, v);
    }
    subtract(v) {
        return Vector3.subtract(this, v);
    }
    multiply(v) {
        return Vector3.multiply(this, v);
    }
    divide(v) {
        return Vector3.divide(this, v);
    }
    replace(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
    }
    get Length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
}
exports.Vector3 = Vector3;
