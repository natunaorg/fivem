"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
class Notification {
    constructor(handle) {
        this.handle = handle;
    }
    hide() {
        RemoveNotification(this.handle);
    }
}
exports.Notification = Notification;
