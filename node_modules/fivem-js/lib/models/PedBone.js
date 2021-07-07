"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedBone = void 0;
const _1 = require("./");
class PedBone extends _1.EntityBone {
    constructor(owner, boneId) {
        super(owner, GetPedBoneIndex(owner.Handle, Number(boneId)));
    }
    get IsValid() {
        return _1.Ped.exists(this.Owner) && this.Index !== -1;
    }
}
exports.PedBone = PedBone;
