"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prop = void 0;
const _1 = require("./");
class Prop extends _1.Entity {
    static exists(prop) {
        return typeof prop !== 'undefined' && prop.exists();
    }
    constructor(handle) {
        super(handle);
    }
    exists() {
        return super.exists() && GetEntityType(this.handle) === 3;
    }
    placeOnGround() {
        PlaceObjectOnGroundProperly(this.handle);
    }
}
exports.Prop = Prop;
