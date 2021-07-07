"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuControls = void 0;
const MenuControl_1 = require("./MenuControl");
class MenuControls {
    constructor() {
        this.back = new MenuControl_1.MenuControl();
        this.select = new MenuControl_1.MenuControl();
        this.left = new MenuControl_1.MenuControl();
        this.right = new MenuControl_1.MenuControl();
        this.up = new MenuControl_1.MenuControl();
        this.down = new MenuControl_1.MenuControl();
    }
}
exports.MenuControls = MenuControls;
