"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleWindow = void 0;
class VehicleWindow {
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
    get IsIntact() {
        return !!IsVehicleWindowIntact(this._owner.Handle, this.Index);
    }
    get Vehicle() {
        return this._owner;
    }
    repair() {
        FixVehicleWindow(this._owner.Handle, this.Index);
    }
    smash() {
        SmashVehicleWindow(this._owner.Handle, this.Index);
    }
    rollUp() {
        RollUpWindow(this._owner.Handle, this.Index);
    }
    rollDown() {
        RollDownWindow(this._owner.Handle, this.Index);
    }
    remove() {
        RemoveVehicleWindow(this._owner.Handle, this.Index);
    }
}
exports.VehicleWindow = VehicleWindow;
