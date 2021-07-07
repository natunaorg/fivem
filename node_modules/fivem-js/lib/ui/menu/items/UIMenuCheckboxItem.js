"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIMenuCheckboxItem = void 0;
const __1 = require("../../");
const utils_1 = require("../../../utils");
const _1 = require("./");
const enums_1 = require("../../../enums");
class UIMenuCheckboxItem extends _1.UIMenuItem {
    constructor(text, checked = false, description, style = null) {
        super(text, description);
        this.checkboxChanged = new utils_1.LiteEvent();
        this.supportsRightBadge = false;
        this.supportsRightLabel = false;
        this._checked = false;
        this._style = enums_1.CheckboxStyle.Tick;
        this._checkboxSprite = new __1.Sprite('commonmenu', '', new utils_1.Point(410, 95), new utils_1.Size(50, 50));
        this.Checked = checked;
        this.Style = style;
    }
    get Checked() {
        return this._checked;
    }
    set Checked(value) {
        this._checked = value || false;
    }
    get Style() {
        return this._style;
    }
    set Style(value) {
        this._style = Number(value);
    }
    setVerticalPosition(y) {
        super.setVerticalPosition(y);
        this._checkboxSprite.pos.Y = y + 138 + this.offset.Y;
    }
    draw() {
        super.draw();
        this._checkboxSprite.pos.X = 380 + this.offset.X + this.parent.WidthOffset;
        this._checkboxSprite.textureName = this._getSpriteName();
        this._checkboxSprite.color = this._getSpriteColor();
        this._checkboxSprite.draw(__1.Menu.screenResolution);
    }
    _getSpriteName() {
        let name = 'blank';
        if (this._checked) {
            switch (this._style) {
                case enums_1.CheckboxStyle.Tick:
                    name = 'tick';
                    break;
                case enums_1.CheckboxStyle.Cross:
                    name = 'cross';
                    break;
            }
        }
        return `shop_box_${name}${this.selected ? 'b' : ''}`;
    }
    _getSpriteColor() {
        return this.enabled ? utils_1.Color.white : utils_1.Color.fromRgb(109, 109, 109);
    }
}
exports.UIMenuCheckboxItem = UIMenuCheckboxItem;
