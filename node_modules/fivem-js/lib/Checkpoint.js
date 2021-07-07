"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checkpoint = void 0;
class Checkpoint {
    constructor(handle) {
        this.handle = handle;
    }
    get Position() {
        return this.position;
    }
    set Position(position) {
        this.position = position;
    }
    get TargetPosition() {
        return this.targetPosition;
    }
    set TargetPosition(targetPosition) {
        this.targetPosition = targetPosition;
    }
    get Icon() {
        return this.icon;
    }
    set Icon(icon) {
        this.icon = icon;
    }
    // TODO
    //   public get CustomIcon(): CheckpointIcon {
    //     return this.icon;
    //   }
    //     public set CustomIcon(icon: CheckpointIcon) {
    //     this.icon = icon;
    //   }
    get Radius() {
        return this.radius;
    }
    set Radius(radius) {
        this.radius = radius;
    }
}
exports.Checkpoint = Checkpoint;
