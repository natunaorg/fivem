export interface Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

export class Vector implements Quaternion {
  constructor(
    public x: number,
    public y: number,
    public z: number = null,
    public w: number = null
  ) {}
  public toString = (): string => {
    return `Vector(${this.x.toFixed(2).toString()}, ${this.y
      .toFixed(2)
      .toString()}${this.z ? `, ${this.z.toFixed(2).toString()}` : ""}${
      this.w ? `, ${this.w.toFixed(2).toString()}` : ""
    })`;
  };

  public static create(v: number | Quaternion): Vector {
    if (typeof v === "number") {
      return new Vector(v, v);
    }
    return new Vector(v.x, v.y, v.z, v.w);
  }

  public static add(v1: Quaternion, v2: number | Quaternion): Vector {
    if (typeof v2 === "number") {
      return new Vector(
        v1.x + v2,
        v1.y + v2,
        v1.z ? v1.z + v2 : v2,
        v1.w ? v1.w + v2 : v2
      );
    }
    return new Vector(
      v1.x + v2.x,
      v1.y + v2.y,
      v1.z ? (v1.z + v2.z ? v2.z : 0) : v2.z ? v2.z : null,
      v1.z ? (v1.w + v2.w ? v2.w : 0) : v2.w ? v2.w : null
    );
  }

  public static subtract(v1: Quaternion, v2: number | Quaternion): Vector {
    if (typeof v2 === "number") {
      return new Vector(
        v1.x - v2,
        v1.y - v2,
        v1.z ? v1.z - v2 : v2,
        v1.w ? v1.w - v2 : v2
      );
    }
    return new Vector(
      v1.x - v2.x,
      v1.y - v2.y,
      v1.z ? (v1.z - v2.z ? v2.z : 0) : v2.z ? v2.z : null,
      v1.z ? (v1.w - v2.w ? v2.w : 0) : v2.w ? v2.w : null
    );
  }

  public static multiply(v1: Quaternion, v2: number | Quaternion): Vector {
    if (typeof v2 === "number") {
      return new Vector(
        v1.x * v2,
        v1.y * v2,
        v1.z ? v1.z * v2 : v2,
        v1.w ? v1.w * v2 : v2
      );
    }
    return new Vector(
      v1.x * v2.x,
      v1.y * v2.y,
      v1.z ? (v1.z * v2.z ? v2.z : 0) : v2.z ? v2.z : null,
      v1.z ? (v1.w * v2.w ? v2.w : 0) : v2.w ? v2.w : null
    );
  }

  public static divide(v1: Quaternion, v2: number | Quaternion): Vector {
    if (typeof v2 === "number") {
      return new Vector(
        v1.x / v2,
        v1.y / v2,
        v1.z ? v1.z / v2 : v2,
        v1.w ? v1.w / v2 : v2
      );
    }
    return new Vector(
      v1.x / v2.x,
      v1.y / v2.y,
      v1.z ? (v1.z / v2.z ? v2.z : 0) : v2.z ? v2.z : null,
      v1.z ? (v1.w / v2.w ? v2.w : 0) : v2.w ? v2.w : null
    );
  }

  public static dotProduct(v1: Quaternion, v2: Quaternion): number {
    return v1.x * v2.x + v1.y * v2.y + (v1.z || 0) * (v2.z || 0);
  }

  public static crossProduct(v1: Quaternion, v2: Quaternion): Vector {
    const x = v1.y * v2.z - v1.z * v2.y;
    const y = v1.z * v2.x - v1.z * v2.z;
    const z = v1.x * v2.y - v1.z * v2.x;
    return new Vector(x, y, z);
  }

  public get Length(): number {
    return Math.sqrt(
      this.x * this.x + this.y * this.y + (this.z || 0) * (this.z || 0)
    );
  }

  public static normalize(v: Vector): Vector {
    return Vector.divide(v, v.Length);
  }

  public crossProduct(v: Quaternion): Vector {
    return Vector.crossProduct(this, v);
  }

  public dotProduct(v: Quaternion): number {
    return Vector.dotProduct(this, v);
  }

  public add(v: number | Quaternion): Quaternion {
    return Vector.add(this, v);
  }

  public subtract(v: Quaternion): Vector {
    return Vector.subtract(this, v);
  }

  public multiply(v: number | Quaternion): Vector {
    return Vector.multiply(this, v);
  }

  public divide(v: number | Quaternion): Quaternion {
    return Vector.divide(this, v);
  }

  public replace(v: Quaternion): void {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    this.w = v.w;
  }

  /**
   * The product of the Euclidean magnitudes of this and another Vector
   *
   * @param v Vector to find Euclidean magnitude between
   * @returns Euclidean magnitude with another vector
   */
  public distanceSquared(v: Quaternion): number {
    const w: Vector = this.subtract(v);
    return Vector.dotProduct(w, w);
  }

  /**
   * The distance between two Vectors
   *
   * @param v Vector to find distance between
   * @returns Distance between this and another vector
   */
  public distance(v: Quaternion): number {
    return Math.sqrt(this.distanceSquared(v));
  }
}
