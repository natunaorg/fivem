"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuSettings = void 0;
const index_1 = require("../../index");
const enums_1 = require("../../enums");
class MenuSettings {
    constructor() {
        this.scaleWithSafezone = true;
        this.resetCursorOnOpen = true;
        this.mouseControlsEnabled = true;
        this.mouseEdgeEnabled = true;
        this.controlDisablingEnabled = true;
        this.audio = {
            library: 'HUD_FRONTEND_DEFAULT_SOUNDSET',
            upDown: 'NAV_UP_DOWN',
            leftRight: 'NAV_LEFT_RIGHT',
            select: 'SELECT',
            back: 'BACK',
            error: 'ERROR',
        };
        this.enabledControls = {
            [index_1.InputMode.GamePad]: [enums_1.Control.LookUpDown, enums_1.Control.LookLeftRight, enums_1.Control.Aim, enums_1.Control.Attack],
            [index_1.InputMode.MouseAndKeyboard]: [
                enums_1.Control.FrontendAccept,
                enums_1.Control.FrontendAxisX,
                enums_1.Control.FrontendAxisY,
                enums_1.Control.FrontendDown,
                enums_1.Control.FrontendUp,
                enums_1.Control.FrontendLeft,
                enums_1.Control.FrontendRight,
                enums_1.Control.FrontendCancel,
                enums_1.Control.FrontendSelect,
                enums_1.Control.CursorScrollDown,
                enums_1.Control.CursorScrollUp,
                enums_1.Control.CursorX,
                enums_1.Control.CursorY,
                enums_1.Control.MoveUpDown,
                enums_1.Control.MoveLeftRight,
                enums_1.Control.Sprint,
                enums_1.Control.Jump,
                enums_1.Control.Enter,
                enums_1.Control.VehicleExit,
                enums_1.Control.VehicleAccelerate,
                enums_1.Control.VehicleBrake,
                enums_1.Control.VehicleHandbrake,
                enums_1.Control.VehicleMoveLeftRight,
                enums_1.Control.VehicleFlyYawLeft,
                enums_1.Control.VehicleFlyYawRight,
                enums_1.Control.FlyLeftRight,
                enums_1.Control.FlyUpDown,
            ],
        };
    }
}
exports.MenuSettings = MenuSettings;
