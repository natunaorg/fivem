"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntersectOptions = void 0;
/**
 * List of possible entity intersections. Used for raycasting.
 */
var IntersectOptions;
(function (IntersectOptions) {
    IntersectOptions[IntersectOptions["Everything"] = -1] = "Everything";
    IntersectOptions[IntersectOptions["Map"] = 1] = "Map";
    IntersectOptions[IntersectOptions["MissionEntities"] = 2] = "MissionEntities";
    IntersectOptions[IntersectOptions["Peds1"] = 12] = "Peds1";
    IntersectOptions[IntersectOptions["Objects"] = 16] = "Objects";
    IntersectOptions[IntersectOptions["Unk1"] = 32] = "Unk1";
    IntersectOptions[IntersectOptions["Unk2"] = 64] = "Unk2";
    IntersectOptions[IntersectOptions["Unk3"] = 128] = "Unk3";
    IntersectOptions[IntersectOptions["Vegetation"] = 256] = "Vegetation";
    IntersectOptions[IntersectOptions["Unk4"] = 512] = "Unk4";
})(IntersectOptions = exports.IntersectOptions || (exports.IntersectOptions = {}));
