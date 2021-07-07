"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Container = void 0;
const utils_1 = require("../utils");
const _1 = require("./");
class Container {
    constructor(pos, size, color) {
        this.items = [];
        this.pos = pos;
        this.size = size;
        this.color = color;
    }
    addItem(items) {
        if (!Array.isArray(items)) {
            items = [items];
        }
        this.items.push(...items);
    }
    draw(offset, resolution) {
        resolution = resolution || new utils_1.Size(_1.Screen.ScaledWidth, _1.Screen.Height);
        offset = offset || new utils_1.Size();
        const w = this.size.width / resolution.width;
        const h = this.size.height / resolution.height;
        const x = (this.pos.X + offset.width) / resolution.width + w * 0.5;
        const y = (this.pos.Y + offset.height) / resolution.height + h * 0.5;
        DrawRect(x, y, w, h, this.color.r, this.color.g, this.color.b, this.color.a);
        for (const item of this.items) {
            item.draw(new utils_1.Size(this.pos.X + offset.width, this.pos.Y + offset.height), resolution);
        }
    }
}
exports.Container = Container;
