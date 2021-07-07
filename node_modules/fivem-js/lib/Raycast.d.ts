import { MaterialHash } from './hashes';
import { Entity } from './models';
import { Vector3 } from './utils';
/**
 * Class that represents the result of a raycast.
 */
export declare class RaycastResult {
    /**
     * Return the entity that was hit.
     */
    get HitEntity(): Entity;
    /**
     * Get the position of the entity that was hit.
     */
    get HitPosition(): Vector3;
    /**
     * Return the vector perpendicular to the tangent plane.
     */
    get SurfaceNormal(): Vector3;
    /**
     * Whether we hit anything.
     */
    get DidHit(): boolean;
    /**
     * Whether the entity hit exists.
     */
    get DidHitEntity(): boolean;
    /**
     * Material type that was hit.
     */
    get Material(): MaterialHash;
    /**
     * Raycast result's handle.
     */
    get Result(): number;
    private handle;
    private hitPositionArg;
    private hitSomethingArg;
    private entityHandleArg;
    private surfaceNormalArg;
    private materialArg;
    private result;
    /**
     * Create a RaycastResult object that gets the results from a StartShapeTestRay()
     *
     * @param handle The handle returned from StartShapeTestRay()
     */
    constructor(handle: number);
}
