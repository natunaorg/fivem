"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleWheelCollection = void 0;
const VehicleWheel_1 = require("./VehicleWheel");
const enums_1 = require("../enums");
class VehicleWheelCollection {
    constructor(owner) {
        this._vehicleWheels = new Map();
        this._owner = owner;
    }
    getWheel(index) {
        if (!this._vehicleWheels.has(index)) {
            this._vehicleWheels.set(index, new VehicleWheel_1.VehicleWheel(this._owner, index));
        }
        return this._vehicleWheels.get(index);
    }
    getAllWheels() {
        return Object.keys(enums_1.VehicleWheelIndex)
            .filter(key => !isNaN(Number(key)))
            .map(key => {
            const index = Number(key);
            if (this.hasWheel(index)) {
                return this.getWheel(index);
            }
            return null;
        })
            .filter(w => w);
    }
    burstAllWheels() {
        this.getAllWheels().forEach(wheel => {
            wheel.burst();
        });
    }
    fixAllWheels() {
        this.getAllWheels().forEach(wheel => {
            wheel.fix();
        });
    }
    hasWheel(wheel) {
        switch (wheel) {
            case enums_1.VehicleWheelIndex.FrontLeftWheel:
                return this._owner.Bones.hasBone('wheel_lf');
            case enums_1.VehicleWheelIndex.FrontRightWheel:
                return this._owner.Bones.hasBone('wheel_rf');
            case enums_1.VehicleWheelIndex.MidLeftWheel:
                return this._owner.Bones.hasBone('wheel_lm');
            case enums_1.VehicleWheelIndex.MidRightWheel:
                return this._owner.Bones.hasBone('wheel_rm');
            case enums_1.VehicleWheelIndex.RearLeftWheel:
                return this._owner.Bones.hasBone('wheel_lr');
            case enums_1.VehicleWheelIndex.RearRightWheel:
                return this._owner.Bones.hasBone('wheel_rr');
            default:
                return false;
        }
    }
}
exports.VehicleWheelCollection = VehicleWheelCollection;
