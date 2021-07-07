"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIMenuStatisticsPanel = void 0;
const utils_1 = require("../../../../utils");
const _1 = require("./");
const __1 = require("../../../");
class UIMenuStatisticsPanel extends _1.AbstractUIMenuPanel {
    constructor(item, divider = true) {
        super();
        this._divider = true;
        this._items = [];
        this.background = new __1.Rectangle(new utils_1.Point(), new utils_1.Size(431, 47), new utils_1.Color(170, 0, 0, 0));
        if (item) {
            this.addItem(item);
        }
        this.Divider = divider;
    }
    get Divider() {
        return this._divider;
    }
    set Divider(value) {
        this._divider = value || false;
    }
    get Items() {
        return this._items;
    }
    set Items(value) {
        this._items = value;
    }
    addItem(item) {
        const items = Array.isArray(item) ? item : [item];
        this._items.push(...items);
    }
    removeItem(itemOrIndex) {
        if (typeof itemOrIndex === 'number') {
            this._items = this._items.filter((i, index) => index !== itemOrIndex);
        }
        else {
            this._items = this._items.filter(i => i.id !== itemOrIndex.id);
        }
    }
    setVerticalPosition(y) {
        super.setVerticalPosition(y);
        this._items.forEach((item, index) => __awaiter(this, void 0, void 0, function* () {
            const itemCountOffset = 40 * (index + 1);
            const yOffset = y + itemCountOffset - 22;
            item.backgroundBar.pos.Y = yOffset;
            item.activeBar.pos.Y = yOffset;
            item.text.pos.Y = yOffset - 12;
            if (this._divider) {
                item.divider.forEach((divider) => __awaiter(this, void 0, void 0, function* () {
                    divider.pos.Y = yOffset;
                }));
            }
        }));
    }
    draw() {
        if (this.enabled) {
            super.draw();
            const x = this.parentItem.offset.X + this.ParentMenu.WidthOffset / 2;
            this._items.forEach((item, index) => __awaiter(this, void 0, void 0, function* () {
                const itemCountOffset = 40 * (index + 1);
                item.backgroundBar.pos.X = x + 200;
                item.activeBar.pos.X = x + 200;
                item.text.pos.X = x + 13;
                item.backgroundBar.draw(undefined, __1.Menu.screenResolution);
                item.activeBar.draw(undefined, __1.Menu.screenResolution);
                item.text.draw(undefined, __1.Menu.screenResolution);
                if (this._divider) {
                    item.divider.forEach((divider, index) => __awaiter(this, void 0, void 0, function* () {
                        const dividerWidthOffset = (index + 1) * 40;
                        divider.pos.X = x + dividerWidthOffset + 200;
                        this.background.size.height = itemCountOffset + 47 - 39;
                        divider.draw(undefined, __1.Menu.screenResolution);
                    }));
                }
            }));
        }
    }
}
exports.UIMenuStatisticsPanel = UIMenuStatisticsPanel;
