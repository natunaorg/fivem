import { CameraShake } from './enums';
import { Entity, PedBone } from './models';
import { Vector3 } from './utils';
export declare class Camera {
    private readonly shakeNames;
    private handle;
    constructor(handle: number);
    get IsActive(): boolean;
    set IsActive(active: boolean);
    get Position(): Vector3;
    set Position(position: Vector3);
    get Rotation(): Vector3;
    set Rotation(rotation: Vector3);
    /**
     * Gets the direction the camera is facing. Same as ForwardVector
     */
    get Direction(): Vector3;
    set Direction(direction: Vector3);
    get ForwardVector(): Vector3;
    get FieldOfView(): number;
    set FieldOfView(fieldOfView: number);
    get NearClip(): number;
    set NearClip(nearClip: number);
    get FarClip(): number;
    set FarClip(farClip: number);
    set NearDepthOfField(nearDepthOfField: number);
    get FarDepthOfField(): number;
    set FarDepthOfField(farDepthOfField: number);
    set DepthOfFieldStrength(strength: number);
    set MotionBlurStrength(strength: number);
    shake(shakeType: CameraShake, amplitude: number): void;
    stopShaking(): void;
    get IsShaking(): boolean;
    set ShakeAmplitude(amplitude: number);
    pointAt(target: Entity | PedBone | Vector3, offset?: Vector3): void;
    stopPointing(): void;
    interpTo(to: Camera, duration: number, easePosition: boolean, easeRotation: boolean): void;
    get IsInterpolating(): boolean;
    attachTo(object: Entity | PedBone, offset: Vector3): void;
    detach(): void;
    delete(): void;
    exists(): boolean;
}
