"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleDoorCollection = void 0;
const enums_1 = require("../enums");
const VehicleDoor_1 = require("./VehicleDoor");
class VehicleDoorCollection {
    constructor(owner) {
        this._vehicleDoors = new Map();
        this._owner = owner;
    }
    getDoors(index) {
        if (!this._vehicleDoors.has(index)) {
            this._vehicleDoors.set(index, new VehicleDoor_1.VehicleDoor(this._owner, index));
        }
        return this._vehicleDoors.get(index);
    }
    getAllDoors() {
        return Object.keys(enums_1.VehicleDoorIndex)
            .filter(key => !isNaN(Number(key)))
            .map(key => {
            const index = Number(key);
            if (this.hasDoor(index)) {
                return this.getDoors(index);
            }
            return null;
        })
            .filter(d => d);
    }
    openAllDoors(loose, instantly) {
        this.getAllDoors().forEach(door => {
            door.open(loose, instantly);
        });
    }
    closeAllDoors(instantly) {
        this.getAllDoors().forEach(door => {
            door.close(instantly);
        });
    }
    breakAllDoors(stayInTheWorld) {
        this.getAllDoors().forEach(door => {
            door.break(stayInTheWorld);
        });
    }
    hasDoor(index) {
        switch (index) {
            case enums_1.VehicleDoorIndex.FrontLeftDoor:
                return this._owner.Bones.hasBone('door_dside_f');
            case enums_1.VehicleDoorIndex.FrontRightDoor:
                return this._owner.Bones.hasBone('door_pside_f');
            case enums_1.VehicleDoorIndex.BackLeftDoor:
                return this._owner.Bones.hasBone('door_dside_r');
            case enums_1.VehicleDoorIndex.BackRightDoor:
                return this._owner.Bones.hasBone('door_pside_r');
            case enums_1.VehicleDoorIndex.Hood:
                return this._owner.Bones.hasBone('bonnet');
            case enums_1.VehicleDoorIndex.Trunk:
                return this._owner.Bones.hasBone('boot');
        }
        return false;
    }
}
exports.VehicleDoorCollection = VehicleDoorCollection;
