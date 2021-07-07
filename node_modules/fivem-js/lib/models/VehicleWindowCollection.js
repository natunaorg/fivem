"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleWindowCollection = void 0;
const enums_1 = require("../enums");
const VehicleWindow_1 = require("./VehicleWindow");
class VehicleWindowCollection {
    constructor(owner) {
        this._vehicleWindows = new Map();
        this._owner = owner;
    }
    getWindow(index) {
        if (!this._vehicleWindows.has(index)) {
            this._vehicleWindows.set(index, new VehicleWindow_1.VehicleWindow(this._owner, index));
        }
        return this._vehicleWindows.get(index);
    }
    getAllWindows() {
        return Object.keys(enums_1.VehicleWindowIndex)
            .filter(key => !isNaN(Number(key)))
            .map(key => {
            const index = Number(key);
            if (this.hasWindow(index)) {
                return this.getWindow(index);
            }
            return null;
        })
            .filter(w => w);
    }
    get AreAllWindowsIntact() {
        return !!AreAllVehicleWindowsIntact(this._owner.Handle);
    }
    rollDownAllWindows() {
        this.getAllWindows().forEach(window => {
            window.rollDown();
        });
    }
    rollUpAllWindows() {
        this.getAllWindows().forEach(window => {
            window.rollUp();
        });
    }
    hasWindow(window) {
        switch (window) {
            case enums_1.VehicleWindowIndex.FrontLeftWindow:
                return this._owner.Bones.hasBone('window_lf');
            case enums_1.VehicleWindowIndex.FrontRightWindow:
                return this._owner.Bones.hasBone('window_rf');
            case enums_1.VehicleWindowIndex.BackLeftWindow:
                return this._owner.Bones.hasBone('window_lr');
            case enums_1.VehicleWindowIndex.BackRightWindow:
                return this._owner.Bones.hasBone('window_rr');
            default:
                return false;
        }
    }
}
exports.VehicleWindowCollection = VehicleWindowCollection;
