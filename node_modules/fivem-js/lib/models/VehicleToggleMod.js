"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleToggleMod = void 0;
class VehicleToggleMod {
    constructor(owner, modType) {
        this._owner = owner;
        this.ModType = modType;
    }
    get ModType() {
        return this._modType;
    }
    set ModType(modType) {
        this._modType = modType;
    }
    get IsInstalled() {
        return !!IsToggleModOn(this._owner.Handle, this.ModType);
    }
    set IsInstalled(value) {
        ToggleVehicleMod(this._owner.Handle, this.ModType, value);
    }
    get LocalizedModTypeName() {
        return GetModSlotName(this._owner.Handle, this.ModType);
    }
    get Vehicle() {
        return this._owner;
    }
    remove() {
        RemoveVehicleMod(this._owner.Handle, this.ModType);
    }
}
exports.VehicleToggleMod = VehicleToggleMod;
