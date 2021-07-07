"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIMenuSeparatorItem = void 0;
const _1 = require("./");
const enums_1 = require("../../../enums");
const __1 = require("../");
class UIMenuSeparatorItem extends _1.UIMenuItem {
    constructor(text) {
        super(text);
        this.supportsDescription = false;
        this.supportsPanels = false;
        this.supportsLeftBadge = false;
        this.supportsRightBadge = false;
        this.supportsRightLabel = false;
        this.text.alignment = enums_1.Alignment.Centered;
    }
    setVerticalPosition(y) {
        const yOffset = y + this.offset.Y;
        this.rectangle.pos.Y = yOffset + 144;
        this.text.pos.Y = yOffset + 147;
    }
    draw() {
        const width = 431 + this.parent.WidthOffset;
        this.rectangle.size.width = width;
        this.rectangle.pos.X = this.offset.X;
        this.rectangle.draw(undefined, __1.Menu.screenResolution);
        if (this.text.caption !== '') {
            this.text.pos.X = this.offset.X + width / 2;
            this.text.draw(undefined, __1.Menu.screenResolution);
        }
    }
}
exports.UIMenuSeparatorItem = UIMenuSeparatorItem;
