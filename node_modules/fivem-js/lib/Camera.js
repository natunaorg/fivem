"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = void 0;
const models_1 = require("./models");
const utils_1 = require("./utils");
class Camera {
    constructor(handle) {
        this.shakeNames = [
            'HAND_SHAKE',
            'SMALL_EXPLOSION_SHAKE',
            'MEDIUM_EXPLOSION_SHAKE',
            'LARGE_EXPLOSION_SHAKE',
            'JOLT_SHAKE',
            'VIBRATE_SHAKE',
            'ROAD_VIBRATION_SHAKE',
            'DRUNK_SHAKE',
            'SKY_DIVING_SHAKE',
            'FAMILY5_DRUG_TRIP_SHAKE',
            'DEATH_FAIL_IN_EFFECT_SHAKE',
        ];
        this.handle = handle;
    }
    get IsActive() {
        return !!IsCamActive(this.handle);
    }
    set IsActive(active) {
        SetCamActive(this.handle, active);
    }
    get Position() {
        const pos = GetCamCoord(this.handle);
        return new utils_1.Vector3(pos[0], pos[1], pos[2]);
    }
    set Position(position) {
        SetCamCoord(this.handle, position.x, position.y, position.z);
    }
    get Rotation() {
        const rot = GetCamRot(this.handle, 2);
        return new utils_1.Vector3(rot[0], rot[1], rot[2]);
    }
    set Rotation(rotation) {
        SetCamRot(this.handle, rotation.x, rotation.y, rotation.z, 2);
    }
    // public get Matrix() : Matrix {}
    /**
     * Gets the direction the camera is facing. Same as ForwardVector
     */
    get Direction() {
        return this.ForwardVector;
    }
    set Direction(direction) {
        const dir = direction.normalize;
        const vec1 = new utils_1.Vector3(dir.x, dir.y, 0);
        const vec2 = new utils_1.Vector3(dir.z, vec1.distanceSquared(vec1), 0);
        const vec3 = vec2.normalize;
        this.Rotation = new utils_1.Vector3(Math.atan2(vec3.x, vec3.y) * 57.295779513082323, this.Rotation.y, Math.atan2(dir.x, dir.y) * -57.295779513082323);
    }
    //   public get UpVector() : Vector3 {
    //       return Matrix.Up;
    //   }
    get ForwardVector() {
        const rotation = utils_1.Vector3.multiply(this.Rotation, Math.PI / 180);
        const normalized = utils_1.Vector3.normalize(new utils_1.Vector3(-Math.sin(rotation.z) * Math.abs(Math.cos(rotation.x)), Math.cos(rotation.z) * Math.abs(Math.cos(rotation.x)), Math.sin(rotation.x)));
        return new utils_1.Vector3(normalized.x, normalized.y, normalized.z);
    }
    //   public get RightVector() : Vector3 {
    //       return Matrix.Right;
    //   }
    // public Vector3 GetOffsetPosition(Vector3 offset) {
    //     return Vector3.TransformCoordinate(offset, Matrix);
    // }
    // public Vector3 GetPositionOffset(Vector3 worldCoords) {
    //     return Vector3.TransformCoordinate(worldCoords, Matrix.Invert(Matrix));
    // }
    get FieldOfView() {
        return GetCamFov(this.handle);
    }
    set FieldOfView(fieldOfView) {
        SetCamFov(this.handle, fieldOfView);
    }
    get NearClip() {
        return GetCamNearClip(this.handle);
    }
    set NearClip(nearClip) {
        SetCamNearClip(this.handle, nearClip);
    }
    get FarClip() {
        return GetCamFarClip(this.handle);
    }
    set FarClip(farClip) {
        SetCamFarClip(this.handle, farClip);
    }
    set NearDepthOfField(nearDepthOfField) {
        SetCamNearDof(this.handle, nearDepthOfField);
    }
    get FarDepthOfField() {
        return GetCamFarDof(this.handle);
    }
    set FarDepthOfField(farDepthOfField) {
        SetCamFarDof(this.handle, farDepthOfField);
    }
    set DepthOfFieldStrength(strength) {
        SetCamDofStrength(this.handle, strength);
    }
    set MotionBlurStrength(strength) {
        SetCamMotionBlurStrength(this.handle, strength);
    }
    shake(shakeType, amplitude) {
        ShakeCam(this.handle, this.shakeNames[Number(shakeType)], amplitude);
    }
    stopShaking() {
        StopCamShaking(this.handle, true);
    }
    get IsShaking() {
        return !!IsCamShaking(this.handle);
    }
    set ShakeAmplitude(amplitude) {
        SetCamShakeAmplitude(this.handle, amplitude);
    }
    pointAt(target, offset = new utils_1.Vector3(0, 0, 0)) {
        if (target instanceof models_1.Entity) {
            PointCamAtEntity(this.handle, target.Handle, offset.x, offset.y, offset.z, true);
        }
        else if (target instanceof models_1.PedBone) {
            PointCamAtPedBone(this.handle, target.Owner.Handle, target.Index, offset.x, offset.y, offset.z, true);
        }
        else {
            PointCamAtCoord(this.handle, target.x, target.y, target.z);
        }
    }
    stopPointing() {
        StopCamPointing(this.handle);
    }
    interpTo(to, duration, easePosition, easeRotation) {
        SetCamActiveWithInterp(to.handle, this.handle, duration, Number(easePosition), Number(easeRotation));
    }
    get IsInterpolating() {
        return !!IsCamInterpolating(this.handle);
    }
    attachTo(object, offset) {
        if (object instanceof models_1.Entity) {
            AttachCamToEntity(this.handle, object.Handle, offset.x, offset.y, offset.z, true);
        }
        else if (object instanceof models_1.PedBone) {
            AttachCamToPedBone(this.handle, object.Owner.Handle, object.Index, offset.x, offset.y, offset.z, true);
        }
    }
    detach() {
        DetachCam(this.handle);
    }
    delete() {
        DestroyCam(this.handle, false);
    }
    exists() {
        return !!DoesCamExist(this.handle);
    }
}
exports.Camera = Camera;
