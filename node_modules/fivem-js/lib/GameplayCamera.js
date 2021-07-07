"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameplayCamera = void 0;
const utils_1 = require("./utils");
/**
 * The current rendering gameplay camera
 */
class GameplayCamera {
    /**
     * Get the world position of gameplay camera.
     */
    static get Position() {
        const coords = GetGameplayCamCoords();
        return new utils_1.Vector3(coords[0], coords[1], coords[2]);
    }
    /**
     * Get the rotation of gameplay camera.
     */
    static get Rotation() {
        const rot = GetGameplayCamRot(2);
        return new utils_1.Vector3(rot[0], rot[1], rot[2]);
    }
    /**
     * Get the forward vector of gameplay camera.
     */
    static get ForwardVector() {
        const rotation = utils_1.Vector3.multiply(this.Rotation, Math.PI / 180);
        const normalized = utils_1.Vector3.normalize(new utils_1.Vector3(-Math.sin(rotation.z) * Math.abs(Math.cos(rotation.x)), Math.cos(rotation.z) * Math.abs(Math.cos(rotation.x)), Math.sin(rotation.x)));
        return new utils_1.Vector3(normalized.x, normalized.y, normalized.z);
    }
    /**
     * Get the pitch of the gameplay camera relative to player.
     */
    static get RelativePitch() {
        return GetGameplayCamRelativePitch();
    }
    /**
     * Set gameplay camera pitch relative to player.
     */
    static set RelativePitch(pitch) {
        SetGameplayCamRelativePitch(pitch, 1);
    }
    /**
     * Get heading of gameplay camera.
     */
    static get RelativeHeading() {
        return GetGameplayCamRelativeHeading();
    }
    /**
     * Get heading of gameplay camera.
     */
    static set RelativeHeading(heading) {
        SetGameplayCamRelativeHeading(heading);
    }
}
exports.GameplayCamera = GameplayCamera;
