"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleWheel = void 0;
class VehicleWheel {
    constructor(owner, index) {
        this._owner = owner;
        this.Index = index;
    }
    get Index() {
        return this._index;
    }
    set Index(index) {
        this._index = index;
    }
    get Vehicle() {
        return this._owner;
    }
    burst() {
        SetVehicleTyreBurst(this._owner.Handle, this.Index, true, 1000);
    }
    fix() {
        SetVehicleTyreFixed(this._owner.Handle, this.Index);
    }
}
exports.VehicleWheel = VehicleWheel;
