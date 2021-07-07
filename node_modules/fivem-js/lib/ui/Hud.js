"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hud = void 0;
const enums_1 = require("../enums");
class Hud {
    static isComponentActive(component) {
        return !!IsHudComponentActive(Number(component));
    }
    static showComponentThisFrame(component) {
        ShowHudComponentThisFrame(Number(component));
    }
    static hideComponentThisFrame(component) {
        HideHudComponentThisFrame(Number(component));
    }
    static showCursorThisFrame() {
        ShowCursorThisFrame();
    }
    static set CursorPosition(position) {
        SetCursorLocation(position.X, position.Y);
    }
    static get CursorSprite() {
        return enums_1.CursorSprite.DownArrow;
    }
    static set CursorSprite(sprite) {
        SetCursorSprite(Number(sprite));
    }
    static get IsVisible() {
        return !(IsHudHidden() || !IsHudPreferenceSwitchedOn());
    }
    static set IsVisible(toggle) {
        DisplayHud(toggle);
    }
    static get IsRadarVisible() {
        return !(IsRadarHidden() || IsRadarPreferenceSwitchedOn());
    }
    static set IsRadarVisible(toggle) {
        DisplayRadar(toggle);
    }
    static set RadarZoom(zoomLevel) {
        SetRadarZoom(zoomLevel);
    }
}
exports.Hud = Hud;
