"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuControl = void 0;
class MenuControl {
    constructor(enabled = true) {
        this._enabled = enabled;
    }
    get Enabled() {
        return this._enabled;
    }
    set Enabled(value) {
        this._enabled = value;
    }
}
exports.MenuControl = MenuControl;
