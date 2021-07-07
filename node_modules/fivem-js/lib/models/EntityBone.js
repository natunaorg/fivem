"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityBone = void 0;
const utils_1 = require("../utils");
class EntityBone {
    constructor(owner, boneIndex, boneName) {
        this.owner = owner;
        this.index = boneIndex ? boneIndex : GetEntityBoneIndexByName(this.owner.Handle, boneName);
    }
    get Index() {
        return this.index;
    }
    get Owner() {
        return this.owner;
    }
    get Position() {
        const coords = GetWorldPositionOfEntityBone(this.owner.Handle, this.index);
        return new utils_1.Vector3(coords[0], coords[1], coords[2]);
    }
    get IsValid() {
        return this.owner.exists() && this.index !== -1;
    }
}
exports.EntityBone = EntityBone;
