"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticleEffectAsset = void 0;
const enums_1 = require("./enums");
const utils_1 = require("./utils");
/**
 * UNFINISHED! Class that represents a particle effect asset.
 */
class ParticleEffectAsset {
    constructor(assetName) {
        this.assetName = assetName;
    }
    /**
     * Returns the name of the asset. Same as AssetName.
     */
    get Asset() {
        return this.assetName;
    }
    /**
     * Get the name of the particle effect.
     */
    get AssetName() {
        return this.assetName;
    }
    /**
     * Get whether the particle effect has loaded into game memory.
     */
    get IsLoaded() {
        return !!HasNamedPtfxAssetLoaded(this.assetName);
    }
    /**
     * Start a particle effect at a world position.
     *
     * @param effectName Name of effect.
     * @param entity Entity to use effect on.
     * @param off Offset from entity position.
     * @param rot Rotation from entity position.
     * @param scale Size of the effect.
     * @param invertAxis Which axis to invert (default none).
     */
    startNonLoopedAtCoord(effectName, pos, rot = new utils_1.Vector3(0, 0, 0), scale = 1.0, invertAxis = { flags: enums_1.InvertAxisFlags.None }) {
        if (!this.setNextCall()) {
            return false;
        }
        const invertAxisFlags = invertAxis.flags;
        SetPtfxAssetNextCall(this.assetName);
        return (StartParticleFxLoopedAtCoord(effectName, pos.x, pos.y, pos.z, rot.x, rot.y, rot.z, scale, !!(invertAxisFlags & enums_1.InvertAxisFlags.X), !!(invertAxisFlags & enums_1.InvertAxisFlags.Y), !!(invertAxisFlags & enums_1.InvertAxisFlags.Z), false) > 0);
    }
    /**
     * Start a particle effect on an entity
     *
     * @param effectName Name of effect.
     * @param entity Entity to use effect on.
     * @param off Offset from entity position.
     * @param rot Rotation from entity position.
     * @param scale Size of the effect.
     * @param invertAxis Which axis to invert (default none).
     */
    startNonLoopedOnEntity(effectName, entity, off = new utils_1.Vector3(0, 0, 0), rot = new utils_1.Vector3(0, 0, 0), scale = 1.0, invertAxis = { flags: enums_1.InvertAxisFlags.None }) {
        if (!this.setNextCall()) {
            return false;
        }
        const invertAxisFlags = invertAxis.flags;
        SetPtfxAssetNextCall(this.assetName);
        return !!StartParticleFxLoopedOnEntity(effectName, entity.Handle, off.x, off.y, off.z, rot.x, rot.y, rot.z, scale, !!(invertAxisFlags & enums_1.InvertAxisFlags.X), !!(invertAxisFlags & enums_1.InvertAxisFlags.Y), !!(invertAxisFlags & enums_1.InvertAxisFlags.Z));
    }
    /**
     * Load a particle effect into the game memory.
     *
     * @param timeout Max time to load Particle Effect
     */
    request(timeout) {
        return new Promise(resolve => {
            if (!this.IsLoaded) {
                RequestNamedPtfxAsset(this.assetName);
                const start = GetGameTimer();
                const interval = setInterval(() => {
                    if (this.IsLoaded || GetGameTimer() - start >= timeout) {
                        clearInterval(interval);
                        resolve(this.IsLoaded);
                    }
                }, 0);
            }
            else {
                resolve(this.IsLoaded);
            }
        });
    }
    /**
     * Allow game engine to safely unload particle effect model from memory.
     */
    markAsNoLongerNeeded() {
        RemoveNamedPtfxAsset(this.assetName);
    }
    toString() {
        return this.assetName;
    }
    setNextCall() {
        if (!this.IsLoaded) {
            RequestNamedPtfxAsset(this.assetName);
        }
        else {
            SetPtfxAssetNextCall(this.assetName);
            return true;
        }
        return false;
    }
}
exports.ParticleEffectAsset = ParticleEffectAsset;
