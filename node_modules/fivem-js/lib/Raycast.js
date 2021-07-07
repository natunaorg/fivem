"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaycastResult = void 0;
const Game_1 = require("./Game");
const utils_1 = require("./utils");
/**
 * Class that represents the result of a raycast.
 */
class RaycastResult {
    /**
     * Create a RaycastResult object that gets the results from a StartShapeTestRay()
     *
     * @param handle The handle returned from StartShapeTestRay()
     */
    constructor(handle) {
        this.handle = handle;
        this.hitPositionArg = new utils_1.Vector3(0, 0, 0);
        this.hitSomethingArg = false;
        this.entityHandleArg = null;
        this.surfaceNormalArg = new utils_1.Vector3(0, 0, 0);
        this.materialArg = 0;
        const results = GetShapeTestResultEx(this.handle);
        this.hitSomethingArg = !!results[1];
        this.hitPositionArg = new utils_1.Vector3(results[2][0], results[2][1], results[2][2]);
        this.surfaceNormalArg = new utils_1.Vector3(results[3][0], results[3][1], results[3][2]);
        this.materialArg = results[4];
        this.entityHandleArg = Game_1.Game.entityFromHandle(results[5]);
        this.result = results[0];
    }
    /**
     * Return the entity that was hit.
     */
    get HitEntity() {
        return this.entityHandleArg;
    }
    /**
     * Get the position of the entity that was hit.
     */
    get HitPosition() {
        return this.hitPositionArg;
    }
    /**
     * Return the vector perpendicular to the tangent plane.
     */
    get SurfaceNormal() {
        return this.surfaceNormalArg;
    }
    /**
     * Whether we hit anything.
     */
    get DidHit() {
        return this.hitSomethingArg;
    }
    /**
     * Whether the entity hit exists.
     */
    get DidHitEntity() {
        return this.entityHandleArg.Handle !== 0;
    }
    /**
     * Material type that was hit.
     */
    get Material() {
        return this.materialArg;
    }
    /**
     * Raycast result's handle.
     */
    get Result() {
        return this.result;
    }
}
exports.RaycastResult = RaycastResult;
