"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const Blip_1 = require("../Blip");
const enums_1 = require("../enums");
const Game_1 = require("../Game");
const Model_1 = require("../Model");
const utils_1 = require("../utils");
const _1 = require("./");
class Entity {
    constructor(handle) {
        this.handle = handle;
    }
    static fromHandle(handle) {
        switch (GetEntityType(handle)) {
            case 1:
                return new _1.Ped(handle);
            case 2:
                return new _1.Vehicle(handle);
            case 3:
                return new _1.Prop(handle);
        }
        return null;
    }
    static fromNetworkId(networkId) {
        return this.fromHandle(NetworkGetEntityFromNetworkId(networkId));
    }
    get Handle() {
        return this.handle;
    }
    get NetworkId() {
        return NetworkGetNetworkIdFromEntity(this.handle);
    }
    get Health() {
        return GetEntityHealth(this.handle);
    }
    set Health(amount) {
        SetEntityHealth(this.handle, amount);
    }
    get MaxHealth() {
        return GetEntityMaxHealth(this.handle);
    }
    set MaxHealth(amount) {
        SetEntityMaxHealth(this.handle, amount);
    }
    isDead() {
        return IsEntityDead(this.handle) ? true : false;
    }
    isAlive() {
        return !this.isDead();
    }
    get Model() {
        return new Model_1.Model(GetEntityModel(this.handle));
    }
    get Position() {
        const coords = GetEntityCoords(this.handle, false);
        return new utils_1.Vector3(coords[0], coords[1], coords[2]);
    }
    set Position(position) {
        SetEntityCoords(this.handle, position.x, position.y, position.z, false, false, false, true);
    }
    set PositionNoOffset(position) {
        SetEntityCoordsNoOffset(this.handle, position.x, position.y, position.z, true, true, true);
    }
    get Rotation() {
        const rotation = GetEntityRotation(this.handle, 2);
        return new utils_1.Vector3(rotation[0], rotation[1], rotation[2]);
    }
    set Rotation(rotation) {
        SetEntityRotation(this.handle, rotation.x, rotation.y, rotation.z, 2, true);
    }
    get Quaternion() {
        const quaternion = GetEntityQuaternion(this.handle);
        return new utils_1.Quaternion(quaternion[0], quaternion[1], quaternion[2], quaternion[3]);
    }
    set Quaternion(quaternion) {
        SetEntityQuaternion(this.handle, quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    }
    get Heading() {
        return GetEntityHeading(this.handle);
    }
    set Heading(heading) {
        SetEntityHeading(this.handle, heading);
    }
    set IsPositionFrozen(value) {
        FreezeEntityPosition(this.handle, value);
    }
    get Velocity() {
        const velocity = GetEntityVelocity(this.handle);
        return new utils_1.Vector3(velocity[0], velocity[1], velocity[2]);
    }
    set Velocity(velocity) {
        SetEntityVelocity(this.handle, velocity.x, velocity.y, velocity.z);
    }
    get RotationVelocity() {
        const velocity = GetEntityRotationVelocity(this.handle);
        return new utils_1.Vector3(velocity[0], velocity[1], velocity[2]);
    }
    set MaxSpeed(value) {
        SetEntityMaxSpeed(this.handle, value);
    }
    set HasGravity(value) {
        SetEntityHasGravity(this.handle, value);
    }
    get HeightAboveGround() {
        return GetEntityHeightAboveGround(this.handle);
    }
    get SubmersionLevel() {
        return GetEntitySubmergedLevel(this.handle);
    }
    get LodDistance() {
        return GetEntityLodDist(this.handle);
    }
    set LodDistance(value) {
        SetEntityLodDist(this.handle, value);
    }
    get IsVisible() {
        return !!IsEntityVisible(this.handle);
    }
    set IsVisible(value) {
        SetEntityVisible(this.handle, value, false);
    }
    get IsOccluded() {
        return !!IsEntityOccluded(this.handle);
    }
    get IsOnScreen() {
        return !!IsEntityOnScreen(this.handle);
    }
    get IsUpright() {
        return !!IsEntityUpright(this.handle, 0);
    }
    get IsUpsideDown() {
        return !!IsEntityUpsidedown(this.handle);
    }
    get IsInAir() {
        return !!IsEntityInAir(this.handle);
    }
    get IsInWater() {
        return !!IsEntityInWater(this.handle);
    }
    get IsPersistent() {
        return !!IsEntityAMissionEntity(this.handle);
    }
    set IsPersistent(value) {
        if (value) {
            SetEntityAsMissionEntity(this.handle, true, false);
        }
        else {
            this.markAsNoLongerNeeded();
        }
    }
    get IsOnFire() {
        return !!IsEntityOnFire(this.handle);
    }
    set IsInvincible(value) {
        SetEntityInvincible(this.handle, value);
    }
    set IsOnlyDamagedByPlayer(value) {
        SetEntityOnlyDamagedByPlayer(this.handle, value);
    }
    get Opacity() {
        return GetEntityAlpha(this.handle);
    }
    set Opacity(value) {
        SetEntityAlpha(this.handle, value, 0);
    }
    resetOpacity() {
        ResetEntityAlpha(this.handle);
    }
    get HasCollided() {
        return !!HasEntityCollidedWithAnything(this.handle);
    }
    get IsCollisionEnabled() {
        return !GetEntityCollisonDisabled(this.handle);
    }
    set IsCollisionEnabled(value) {
        SetEntityCollision(this.handle, value, false);
    }
    set IsRecordingCollisions(value) {
        SetEntityRecordsCollisions(this.handle, value);
    }
    get Bones() {
        if (!this.bones) {
            this.bones = new _1.EntityBoneCollection(this);
        }
        return this.bones;
    }
    get AttachedBlip() {
        const handle = GetBlipFromEntity(this.handle);
        if (DoesBlipExist(handle)) {
            return new Blip_1.Blip(handle);
        }
        return null;
    }
    attachBlip() {
        return new Blip_1.Blip(AddBlipForEntity(this.handle));
    }
    setNoCollision(entity, toggle) {
        SetEntityNoCollisionEntity(this.handle, entity.Handle, toggle);
    }
    hasClearLosToEntity(entity, traceType = 17) {
        return !!HasEntityClearLosToEntity(this.handle, entity.Handle, traceType);
    }
    hasClearLosToEntityInFront(entity) {
        return !!HasEntityClearLosToEntityInFront(this.handle, entity.Handle);
    }
    hasBeenDamagedBy(entity) {
        return !!HasEntityBeenDamagedByEntity(this.handle, entity.Handle, true);
    }
    hasBeenDamagedByWeapon(weapon) {
        return !!HasEntityBeenDamagedByWeapon(this.handle, Number(weapon), 0);
    }
    hasBeenDamagedByAnyWeapon() {
        return !!HasEntityBeenDamagedByWeapon(this.handle, 0, 2);
    }
    hasBeenDamagedByAnyMeleeWeapon() {
        return !!HasEntityBeenDamagedByWeapon(this.handle, 0, 1);
    }
    clearLastWeaponDamage() {
        ClearEntityLastWeaponDamage(this.handle);
    }
    isInArea(minBounds, maxBounds) {
        return !!IsEntityInArea(this.handle, minBounds.x, minBounds.y, minBounds.z, maxBounds.x, maxBounds.y, maxBounds.z, false, false, 0);
    }
    isInAngledArea(origin, edge, angle) {
        return !!IsEntityInAngledArea(this.handle, origin.x, origin.y, origin.z, edge.x, edge.y, edge.z, angle, false, true, 0);
    }
    isInRangeOf(position, range) {
        const v = utils_1.Vector3.subtract(this.Position, position);
        return v.dotProduct(v) < range * range;
    }
    isNearEntity(entity, bounds) {
        return !!IsEntityAtEntity(this.handle, entity.Handle, bounds.x, bounds.y, bounds.z, false, true, 0);
    }
    isTouching(entity) {
        return !!IsEntityTouchingEntity(this.handle, entity.Handle);
    }
    isTouchingModel(model) {
        return !!IsEntityTouchingModel(this.handle, model.Hash);
    }
    getOffsetPosition(offset) {
        const o = GetOffsetFromEntityInWorldCoords(this.handle, offset.x, offset.y, offset.z);
        return new utils_1.Vector3(o[0], o[1], o[2]);
    }
    getPositionOffset(worldCoords) {
        const o = GetOffsetFromEntityGivenWorldCoords(this.handle, worldCoords.x, worldCoords.y, worldCoords.z);
        return new utils_1.Vector3(o[0], o[1], o[2]);
    }
    attachTo(entity, position, rotation) {
        AttachEntityToEntity(this.handle, entity.Handle, -1, position.x, position.y, position.z, rotation.x, rotation.y, rotation.z, false, false, false, false, 2, true);
    }
    attachToBone(entityBone, position, rotation) {
        AttachEntityToEntity(this.handle, entityBone.Owner.Handle, -1, position.x, position.y, position.z, rotation.x, rotation.y, rotation.z, false, false, false, false, 2, true);
    }
    detach() {
        DetachEntity(this.handle, true, true);
    }
    isAttached() {
        return !!IsEntityAttached(this.handle);
    }
    isAttachedTo(entity) {
        return !!IsEntityAttachedToEntity(this.handle, entity.Handle);
    }
    getEntityAttachedTo() {
        return Entity.fromHandle(GetEntityAttachedTo(this.handle));
    }
    applyForce(direction, rotation, forceType = enums_1.ForceType.MaxForceRot2) {
        ApplyForceToEntity(this.handle, Number(forceType), direction.x, direction.y, direction.z, rotation.x, rotation.y, rotation.z, 0, false, true, true, false, true);
    }
    applyForceRelative(direction, rotation, forceType = enums_1.ForceType.MaxForceRot2) {
        ApplyForceToEntity(this.handle, Number(forceType), direction.x, direction.y, direction.z, rotation.x, rotation.y, rotation.z, 0, true, true, true, false, true);
    }
    removeAllParticleEffects() {
        RemoveParticleFxFromEntity(this.handle);
    }
    exists() {
        return DoesEntityExist(this.handle) ? true : false;
    }
    delete() {
        if (this.handle !== Game_1.Game.PlayerPed.Handle) {
            SetEntityAsMissionEntity(this.handle, false, true);
            DeleteEntity(this.handle);
        }
    }
    markAsNoLongerNeeded() {
        SetEntityAsMissionEntity(this.Handle, false, true);
        SetEntityAsNoLongerNeeded(this.Handle);
    }
}
exports.Entity = Entity;
