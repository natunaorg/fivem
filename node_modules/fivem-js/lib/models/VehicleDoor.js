"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleDoor = void 0;
class VehicleDoor {
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
    get AngleRatio() {
        return GetVehicleDoorAngleRatio(this._owner.Handle, this.Index);
    }
    set AngleRatio(value) {
        SetVehicleDoorControl(this._owner.Handle, this.Index, 1, value);
    }
    set CanBeBroken(value) {
        SetVehicleDoorBreakable(this._owner.Handle, this.Index, value);
    }
    get IsOpen() {
        return this.AngleRatio > 0;
    }
    get IsFullyOpen() {
        return !!IsVehicleDoorFullyOpen(this._owner.Handle, this.Index);
    }
    get IsBroken() {
        return !!IsVehicleDoorDamaged(this._owner.Handle, this.Index);
    }
    get Vehicle() {
        return this._owner;
    }
    open(loose = false, instantly = false) {
        SetVehicleDoorOpen(this._owner.Handle, this.Index, loose, instantly);
    }
    close(instantly = false) {
        SetVehicleDoorShut(this._owner.Handle, this.Index, instantly);
    }
    break(stayInTheWorld = true) {
        SetVehicleDoorBroken(this._owner.Handle, this.Index, stayInTheWorld);
    }
}
exports.VehicleDoor = VehicleDoor;
