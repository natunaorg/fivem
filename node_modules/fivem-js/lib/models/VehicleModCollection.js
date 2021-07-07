"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleModCollection = void 0;
const enums_1 = require("../enums");
const VehicleMod_1 = require("./VehicleMod");
const utils_1 = require("../utils");
const VehicleToggleMod_1 = require("./VehicleToggleMod");
class VehicleModCollection {
    constructor(owner) {
        this._vehicleMods = new Map();
        this._vehicleToggleMods = new Map();
        this._owner = owner;
    }
    hasVehicleMod(type) {
        return GetNumVehicleMods(this._owner.Handle, type) > 0;
    }
    getMod(modType) {
        if (!this._vehicleMods.has(modType)) {
            this._vehicleMods.set(modType, new VehicleMod_1.VehicleMod(this._owner, modType));
        }
        return this._vehicleMods.get(modType);
    }
    getToggleMod(modType) {
        if (!this._vehicleToggleMods.has(modType)) {
            this._vehicleToggleMods.set(modType, new VehicleToggleMod_1.VehicleToggleMod(this._owner, modType));
        }
        return this._vehicleToggleMods.get(modType);
    }
    getAllMods() {
        return Object.keys(enums_1.VehicleModType)
            .filter(key => !isNaN(Number(key)))
            .map(key => {
            const index = Number(key);
            if (this.hasVehicleMod(index)) {
                return this.getMod(index);
            }
            return null;
        })
            .filter(m => m);
    }
    get WheelType() {
        return GetVehicleWheelType(this._owner.Handle);
    }
    set WheelType(type) {
        SetVehicleWheelType(this._owner.Handle, type);
    }
    installModKit() {
        SetVehicleModKit(this._owner.Handle, 0);
    }
    get Livery() {
        const modCount = this.getMod(enums_1.VehicleModType.Livery).ModCount;
        if (modCount > 0) {
            return this.getMod(enums_1.VehicleModType.Livery).Index;
        }
        return GetVehicleLivery(this._owner.Handle);
    }
    set Livery(value) {
        if (this.getMod(enums_1.VehicleModType.Livery).ModCount > 0) {
            this.getMod(enums_1.VehicleModType.Livery).Index = value;
        }
        else {
            SetVehicleLivery(this._owner.Handle, value);
        }
    }
    get LiveryCount() {
        const modCount = this.getMod(enums_1.VehicleModType.Livery).ModCount;
        if (modCount > 0) {
            return modCount;
        }
        return GetVehicleLiveryCount(this._owner.Handle);
    }
    get WindowTint() {
        return GetVehicleWindowTint(this._owner.Handle);
    }
    set WindowTint(tint) {
        SetVehicleWindowTint(this._owner.Handle, tint);
    }
    get PrimaryColor() {
        return GetVehicleColours(this._owner.Handle)[0];
    }
    set PrimaryColor(color) {
        SetVehicleColours(this._owner.Handle, color, this.SecondaryColor);
    }
    get SecondaryColor() {
        return GetVehicleColours(this._owner.Handle)[1];
    }
    set SecondaryColor(color) {
        SetVehicleColours(this._owner.Handle, this.PrimaryColor, color);
    }
    get RimColor() {
        return GetVehicleExtraColours(this._owner.Handle)[1];
    }
    set RimColor(color) {
        SetVehicleExtraColours(this._owner.Handle, this.PearlescentColor, color);
    }
    get PearlescentColor() {
        return GetVehicleExtraColours(this._owner.Handle)[0];
    }
    set PearlescentColor(color) {
        SetVehicleExtraColours(this._owner.Handle, color, this.RimColor);
    }
    set TrimColor(color) {
        SetVehicleInteriorColour(this._owner.Handle, color);
    }
    set DashboardColor(color) {
        SetVehicleDashboardColour(this._owner.Handle, color);
    }
    setModColor1(paintType, color) {
        SetVehicleModColor_1(this._owner.Handle, paintType, color, 0);
    }
    setModColor2(paintType, color) {
        SetVehicleModColor_2(this._owner.Handle, paintType, color);
    }
    get ColorCombination() {
        return GetVehicleColourCombination(this._owner.Handle);
    }
    set ColorCombination(value) {
        SetVehicleColourCombination(this._owner.Handle, value);
    }
    get ColorCombinationCount() {
        return GetNumberOfVehicleColours(this._owner.Handle);
    }
    get TireSmokeColor() {
        const color = GetVehicleTyreSmokeColor(this._owner.Handle);
        return utils_1.Color.fromRgb(color[0], color[1], color[2]);
    }
    set TireSmokeColor(color) {
        SetVehicleTyreSmokeColor(this._owner.Handle, color.r, color.g, color.b);
    }
    get NeonLightsColor() {
        const color = GetVehicleNeonLightsColour(this._owner.Handle);
        return utils_1.Color.fromRgb(color[0], color[1], color[2]);
    }
    set NeonLightsColor(color) {
        SetVehicleNeonLightsColour(this._owner.Handle, color.r, color.g, color.b);
    }
    isNeonLightsOn(light) {
        return !!IsVehicleNeonLightEnabled(this._owner.Handle, light);
    }
    setNeonLightsOn(light, on) {
        SetVehicleNeonLightEnabled(this._owner.Handle, light, on);
    }
    areAllNeonLightsOn() {
        if (!this.HasAllNeonLights) {
            return false;
        }
        let on = true;
        Object.keys(enums_1.VehicleNeonLight)
            .filter(key => !isNaN(Number(key)))
            .forEach(key => {
            if (!on) {
                return;
            }
            on = this.isNeonLightsOn(Number(key));
        });
        return on;
    }
    setAllNeonLightsOn(on) {
        Object.keys(enums_1.VehicleNeonLight)
            .filter(key => !isNaN(Number(key)))
            .forEach(key => {
            this.setNeonLightsOn(Number(key), on);
        });
    }
    get HasAllNeonLights() {
        return (Object.keys(enums_1.VehicleNeonLight)
            .filter(key => !isNaN(Number(key)))
            .findIndex(light => !this.hasNeonLight(Number(light))) === -1);
    }
    hasNeonLight(light) {
        switch (light) {
            case enums_1.VehicleNeonLight.Left:
                return this._owner.Bones.hasBone('neon_l');
            case enums_1.VehicleNeonLight.Right:
                return this._owner.Bones.hasBone('neon_r');
            case enums_1.VehicleNeonLight.Front:
                return this._owner.Bones.hasBone('neon_f');
            case enums_1.VehicleNeonLight.Back:
                return this._owner.Bones.hasBone('neon_b');
            default:
                return false;
        }
    }
    get CustomPrimaryColor() {
        const color = GetVehicleCustomPrimaryColour(this._owner.Handle);
        return utils_1.Color.fromRgb(color[0], color[1], color[2]);
    }
    set CustomPrimaryColor(color) {
        SetVehicleCustomPrimaryColour(this._owner.Handle, color.r, color.g, color.b);
    }
    get CustomSecondaryColor() {
        const color = GetVehicleCustomSecondaryColour(this._owner.Handle);
        return utils_1.Color.fromRgb(color[0], color[1], color[2]);
    }
    set CustomSecondaryColor(color) {
        SetVehicleCustomSecondaryColour(this._owner.Handle, color.r, color.g, color.b);
    }
    get IsPrimaryColorCustom() {
        return !!GetIsVehiclePrimaryColourCustom(this._owner.Handle);
    }
    get IsSecondaryColorCustom() {
        return !!GetIsVehicleSecondaryColourCustom(this._owner.Handle);
    }
    clearCustomPrimaryColor() {
        ClearVehicleCustomPrimaryColour(this._owner.Handle);
    }
    clearCustomSecondaryColor() {
        ClearVehicleCustomSecondaryColour(this._owner.Handle);
    }
    get LicensePlateStyle() {
        return GetVehicleNumberPlateTextIndex(this._owner.Handle);
    }
    set LicensePlateStyle(style) {
        SetVehicleNumberPlateTextIndex(this._owner.Handle, style);
    }
    get LicensePlateType() {
        return GetVehiclePlateType(this._owner.Handle);
    }
    get LicensePlate() {
        return GetVehicleNumberPlateText(this._owner.Handle);
    }
    set LicensePlate(text) {
        SetVehicleNumberPlateText(this._owner.Handle, text);
    }
}
exports.VehicleModCollection = VehicleModCollection;
