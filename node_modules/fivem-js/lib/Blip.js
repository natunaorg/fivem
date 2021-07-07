"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blip = void 0;
const utils_1 = require("./utils");
const models_1 = require("./models");
class Blip {
    constructor(handle) {
        this.handle = handle;
    }
    get Handle() {
        return this.handle;
    }
    get Position() {
        const coords = GetBlipInfoIdCoord(this.handle);
        return new utils_1.Vector3(coords[0], coords[1], coords[2]);
    }
    set Position(location) {
        SetBlipCoords(this.handle, location.x, location.y, location.z);
    }
    set Rotation(rotation) {
        SetBlipRotation(this.handle, rotation);
    }
    set Scale(scale) {
        SetBlipScale(this.handle, scale);
    }
    get Type() {
        return GetBlipInfoIdType(this.handle);
    }
    get Alpha() {
        return GetBlipAlpha(this.handle);
    }
    set Alpha(alpha) {
        SetBlipAlpha(this.handle, alpha);
    }
    set Priority(priority) {
        SetBlipPriority(this.handle, priority);
    }
    set NumberLabel(number) {
        ShowNumberOnBlip(this.handle, number);
    }
    get Color() {
        return GetBlipColour(this.handle);
    }
    set Color(color) {
        SetBlipColour(this.handle, color);
    }
    get Sprite() {
        return GetBlipSprite(this.handle);
    }
    set Sprite(sprite) {
        SetBlipSprite(this.handle, sprite);
    }
    set Display(display) {
        SetBlipDisplay(this.handle, display);
    }
    set Name(name) {
        BeginTextCommandSetBlipName('STRING');
        AddTextComponentSubstringPlayerName(name);
        EndTextCommandSetBlipName(this.handle);
    }
    setNameToPlayerName(player) {
        SetBlipNameToPlayerName(this.handle, player.Handle);
    }
    get Entity() {
        return models_1.Entity.fromHandle(GetBlipInfoIdEntityIndex(this.handle));
    }
    set ShowHeadingIndicator(show) {
        ShowHeadingIndicatorOnBlip(this.handle, show);
    }
    set ShowRoute(show) {
        SetBlipRoute(this.handle, show);
    }
    set IsFriendly(friendly) {
        SetBlipAsFriendly(this.handle, friendly);
    }
    set IsFriend(friend) {
        SetBlipFriend(this.handle, friend);
    }
    set IsCrew(crew) {
        SetBlipCrew(this.handle, crew);
    }
    get IsFlashing() {
        return !!IsBlipFlashing(this.handle);
    }
    set IsFlashing(flashing) {
        SetBlipFlashes(this.handle, flashing);
    }
    get IsOnMinimap() {
        return !!IsBlipOnMinimap(this.handle);
    }
    get IsShortRange() {
        return !!IsBlipShortRange(this.handle);
    }
    set IsShortRange(shortRange) {
        SetBlipAsShortRange(this.handle, shortRange);
    }
    removeNumberLabel() {
        HideNumberOnBlip(this.handle);
    }
    delete() {
        if (this.exists()) {
            RemoveBlip(this.handle);
        }
    }
    exists() {
        return !!DoesBlipExist(this.handle);
    }
}
exports.Blip = Blip;
