export interface Vec3 {
    x: number;
    y: number;
    z: number;
}
export declare class Vector3 implements Vec3 {
    x: number;
    y: number;
    z: number;
    static create(v1: number | Vec3): Vector3;
    static clone(v1: Vec3): Vector3;
    static add(v1: Vec3, v2: number | Vec3): Vector3;
    static subtract(v1: Vec3, v2: Vec3): Vector3;
    static multiply(v1: Vec3, v2: Vec3 | number): Vector3;
    static divide(v1: Vec3, v2: Vec3 | number): Vector3;
    static dotProduct(v1: Vec3, v2: Vec3): number;
    static crossProduct(v1: Vec3, v2: Vec3): Vector3;
    static normalize(v: Vector3): Vector3;
    constructor(x: number, y: number, z: number);
    clone(): Vector3;
    /**
     * The product of the Euclidean magnitudes of this and another Vector3.
     *
     * @param v Vector3 to find Euclidean magnitude between.
     * @returns Euclidean magnitude with another vector.
     */
    distanceSquared(v: Vec3): number;
    /**
     * The distance between two Vectors.
     *
     * @param v Vector3 to find distance between.
     * @returns Distance between this and another vector.
     */
    distance(v: Vec3): number;
    get normalize(): Vector3;
    crossProduct(v: Vec3): Vector3;
    dotProduct(v: Vec3): number;
    add(v: number | Vec3): Vec3;
    subtract(v: Vec3): Vector3;
    multiply(v: number | Vec3): Vector3;
    divide(v: number | Vec3): Vec3;
    replace(v: Vec3): void;
    get Length(): number;
}
