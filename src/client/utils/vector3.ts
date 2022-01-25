/**
 * @module Client - Utility - Vector3
 * @category Client
 */
"use strict";
import "@citizenfx/client";

export interface Quaternion {
    x: number;
    y: number;
    z: number;
    w: number;
}

export default class Vector3 implements Quaternion {
    x: number;
    y: number;
    z: number;
    w: number;

    /**
     * @hidden
     */
    constructor(x: number, y: number, z: number = null, w: number = null) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    static create = (v: number | Quaternion): Vector3 => {
        if (typeof v === "number") {
            return new Vector3(v, v);
        }
        return new Vector3(v.x, v.y, v.z, v.w);
    };

    static add = (v1: Quaternion, v2: number | Quaternion): Vector3 => {
        if (typeof v2 === "number") {
            return new Vector3(v1.x + v2, v1.y + v2, v1.z ? v1.z + v2 : v2, v1.w ? v1.w + v2 : v2);
        }
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z ? (v1.z + v2.z ? v2.z : 0) : v2.z ? v2.z : null, v1.z ? (v1.w + v2.w ? v2.w : 0) : v2.w ? v2.w : null);
    };

    static subtract = (v1: Quaternion, v2: number | Quaternion): Vector3 => {
        if (typeof v2 === "number") {
            return new Vector3(v1.x - v2, v1.y - v2, v1.z ? v1.z - v2 : v2, v1.w ? v1.w - v2 : v2);
        }
        return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z ? (v1.z - v2.z ? v2.z : 0) : v2.z ? v2.z : null, v1.z ? (v1.w - v2.w ? v2.w : 0) : v2.w ? v2.w : null);
    };

    static multiply = (v1: Quaternion, v2: number | Quaternion): Vector3 => {
        if (typeof v2 === "number") {
            return new Vector3(v1.x * v2, v1.y * v2, v1.z ? v1.z * v2 : v2, v1.w ? v1.w * v2 : v2);
        }
        return new Vector3(v1.x * v2.x, v1.y * v2.y, v1.z ? (v1.z * v2.z ? v2.z : 0) : v2.z ? v2.z : null, v1.z ? (v1.w * v2.w ? v2.w : 0) : v2.w ? v2.w : null);
    };

    static divide = (v1: Quaternion, v2: number | Quaternion): Vector3 => {
        if (typeof v2 === "number") {
            return new Vector3(v1.x / v2, v1.y / v2, v1.z ? v1.z / v2 : v2, v1.w ? v1.w / v2 : v2);
        }
        return new Vector3(v1.x / v2.x, v1.y / v2.y, v1.z ? (v1.z / v2.z ? v2.z : 0) : v2.z ? v2.z : null, v1.z ? (v1.w / v2.w ? v2.w : 0) : v2.w ? v2.w : null);
    };

    static dotProduct = (v1: Quaternion, v2: Quaternion): number => {
        return v1.x * v2.x + v1.y * v2.y + (v1.z || 0) * (v2.z || 0);
    };

    static crossProduct = (v1: Quaternion, v2: Quaternion): Vector3 => {
        const x = v1.y * v2.z - v1.z * v2.y;
        const y = v1.z * v2.x - v1.z * v2.z;
        const z = v1.x * v2.y - v1.z * v2.x;
        return new Vector3(x, y, z);
    };

    static normalize = (v: Vector3): Vector3 => {
        return Vector3.divide(v, v.length);
    };

    crossProduct = (v: Quaternion): Vector3 => {
        return Vector3.crossProduct(this, v);
    };

    dotProduct = (v: Quaternion): number => {
        return Vector3.dotProduct(this, v);
    };

    add = (v: number | Quaternion): Quaternion => {
        return Vector3.add(this, v);
    };

    subtract = (v: Quaternion): Vector3 => {
        return Vector3.subtract(this, v);
    };

    multiply = (v: number | Quaternion): Vector3 => {
        return Vector3.multiply(this, v);
    };

    divide = (v: number | Quaternion): Quaternion => {
        return Vector3.divide(this, v);
    };

    replace = (v: Quaternion): void => {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
    };

    /**
     * The product of the Euclidean magnitudes of this and another Vector3
     *
     * @param v Vector3 to find Euclidean magnitude between
     * @returns Euclidean magnitude with another vector
     */
    distanceSquared = (v: Quaternion): number => {
        const w: Vector3 = this.subtract(v);
        return Vector3.dotProduct(w, w);
    };

    /**
     * The distance between two Vectors
     *
     * @param v Vector3 to find distance between
     * @returns Distance between this and another vector
     */
    distance = (v: Quaternion): number => {
        return Math.sqrt(this.distanceSquared(v));
    };

    toString = (): string => {
        return `Vector3(${this.x.toFixed(2).toString()}, ${this.y.toFixed(2).toString()}${this.z ? `, ${this.z.toFixed(2).toString()}` : ""}${this.w ? `, ${this.w.toFixed(2).toString()}` : ""})`;
    };

    get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + (this.z || 0) * (this.z || 0));
    }
}
