"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rectangle = void 0;
const utils_1 = require("../utils");
const _1 = require("./");
class Rectangle {
    constructor(pos, size, color) {
        this.pos = pos;
        this.size = size;
        this.color = color;
    }
    draw(arg1, arg2, color, resolution) {
        resolution = color === undefined ? arg2 : resolution;
        resolution = resolution || new utils_1.Size(_1.Screen.ScaledWidth, _1.Screen.Height);
        if (color === undefined) {
            if (arg1 && arg1 instanceof utils_1.Size) {
                arg1 = new utils_1.Point(this.pos.X + arg1.width, this.pos.Y + arg1.height);
            }
            else {
                arg1 = this.pos;
            }
            arg2 = this.size;
        }
        else {
            if (!arg1) {
                arg1 = this.pos;
            }
            else {
                arg1 = arg1;
            }
            arg2 = arg2 || this.size;
        }
        color = color || this.color;
        const w = arg2.width / resolution.width;
        const h = arg2.height / resolution.height;
        const x = arg1.X / resolution.width + w * 0.5;
        const y = arg1.Y / resolution.height + h * 0.5;
        DrawRect(x, y, w, h, color.r, color.g, color.b, color.a);
    }
}
exports.Rectangle = Rectangle;
