"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedBoneCollection = void 0;
const _1 = require("./");
class PedBoneCollection extends _1.EntityBoneCollection {
    constructor(owner) {
        super(owner);
    }
    get Core() {
        return new _1.PedBone(this.owner, -1);
    }
    get LastDamaged() {
        // const for now until native tested
        const outBone = 0;
        // This native may be returning an object instead (bool, outBone)
        if (GetPedLastDamageBone(this.owner.Handle, outBone)) {
            return this[outBone];
        }
    }
    clearLastDamaged() {
        ClearPedLastDamageBone(this.owner.Handle);
    }
}
exports.PedBoneCollection = PedBoneCollection;
