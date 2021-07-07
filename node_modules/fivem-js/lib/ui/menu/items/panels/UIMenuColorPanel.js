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
exports.UIMenuColorPanel = void 0;
const utils_1 = require("../../../../utils");
const _1 = require("./");
const __1 = require("../../../");
const enums_1 = require("../../../../enums");
const __2 = require("../../../../");
class UIMenuColorPanel extends _1.AbstractUIMenuPanel {
    constructor(title, colors) {
        super();
        this._colors = [];
        this._bar = [];
        // Pagination
        this._min = 0;
        this._max = 8;
        this._total = 9;
        this._index = 0;
        this.background = new __1.Sprite('commonmenu', 'gradient_bgd', new utils_1.Point(), new utils_1.Size(431, 112));
        this._leftArrow = new __1.Sprite('commonmenu', 'arrowleft', new utils_1.Point(), new utils_1.Size(30, 30));
        this._rightArrow = new __1.Sprite('commonmenu', 'arrowright', new utils_1.Point(), new utils_1.Size(30, 30));
        this._selectedRectangle = new __1.Rectangle(new utils_1.Point(), new utils_1.Size(44.5, 8), utils_1.Color.white);
        this._text = new __1.Text('', new utils_1.Point(), 0.35, utils_1.Color.white, enums_1.Font.ChaletLondon, enums_1.Alignment.Centered);
        this.Title = title;
        this.Colors = colors;
    }
    get Title() {
        return this._title;
    }
    set Title(value) {
        this._title = value ? value.trim() : '';
        this._updateText();
    }
    get Colors() {
        return this._colors;
    }
    set Colors(value) {
        if (!value) {
            value = [];
        }
        this._colors = value;
        this._bar = [];
        const colorRectangles = value.slice(0, this._total).map(color => {
            return new __1.Rectangle(new utils_1.Point(0, 0), new utils_1.Size(44.5, 44.5), color);
        });
        this._bar.push(...colorRectangles);
        this._refreshIndex();
        this._updateSelection(true);
    }
    get Color() {
        return this._colors[this.Index];
    }
    set Color(value) {
        const index = this._colors.findIndex(c => {
            return c.a === value.a && c.r === value.r && c.g === value.g && c.b === value.b;
        });
        if (index !== -1) {
            this.Index = index;
        }
    }
    get Index() {
        return this._index % this._colors.length;
    }
    set Index(value) {
        value = 1000000 - (1000000 % this._colors.length) + value;
        if (this.Index === value % this._colors.length) {
            return;
        }
        this._index = value;
        const currentSelection = this.Index;
        if (currentSelection > this._max) {
            this._min = currentSelection - this._total + 1;
            this._max = currentSelection;
        }
        else if (currentSelection < this._min) {
            this._min = currentSelection;
            this._max = currentSelection + this._total - 1;
        }
        this._updateSelection();
    }
    updateParentItem() {
        const last = this._lastColor;
        const current = this.Color;
        if (!last ||
            last.a !== current.a ||
            last.r !== current.r ||
            last.g !== current.g ||
            last.b !== current.b) {
            this._lastColor = current;
            this.ParentMenu.panelActivated.emit(this.parentItem, this, this.Index, current);
            this.parentItem.panelActivated.emit(this, this.Index, current);
        }
    }
    setVerticalPosition(y) {
        super.setVerticalPosition(y);
        this._selectedRectangle.pos.Y = y + 47;
        this._leftArrow.pos.Y = y + 15;
        this._rightArrow.pos.Y = y + 15;
        this._text.pos.Y = y + 15;
        this._bar.forEach((colorRect) => __awaiter(this, void 0, void 0, function* () {
            colorRect.pos.Y = y + 55;
        }));
    }
    draw() {
        if (this.enabled) {
            super.draw();
            const x = this.parentItem.offset.X + this.ParentMenu.WidthOffset / 2;
            this._selectedRectangle.pos.X = x + 15 + 44.5 * (this.Index - this._min);
            this._leftArrow.pos.X = x + 7.5;
            this._rightArrow.pos.X = x + 393.5;
            this._text.pos.X = x + 215.5;
            this._leftArrow.draw(__2.Menu.screenResolution);
            this._rightArrow.draw(__2.Menu.screenResolution);
            this._text.draw(undefined, __2.Menu.screenResolution);
            this._selectedRectangle.draw(undefined, __2.Menu.screenResolution);
            this._bar.forEach((colorRect, index) => __awaiter(this, void 0, void 0, function* () {
                colorRect.pos.X = x + 15 + 44.5 * index;
                colorRect.draw(undefined, __2.Menu.screenResolution);
            }));
            this._processControls();
        }
    }
    _refreshIndex() {
        if (!this._colors.length) {
            this._index = 1000;
        }
        else {
            this._index = 1000 - (1000 % this._colors.length);
        }
        this._max = this._total - 1;
        this._min = 0;
    }
    _updateSelection(preventUpdate = false) {
        if (!preventUpdate) {
            this.updateParentItem();
        }
        this._bar.forEach((colorRect, index) => __awaiter(this, void 0, void 0, function* () {
            colorRect.color = this._colors[this._min + index];
        }));
        this._updateText();
    }
    _updateText() {
        this._text.caption = `${this._title} [${this.Index + 1 || 0} / ${this._colors.length}]`;
    }
    _goLeft() {
        if (this._colors.length > this._total) {
            if (this.Index <= this._min) {
                if (this.Index === 0) {
                    this._min = this._colors.length - this._total;
                    this._max = this._colors.length - 1;
                    this._index = 1000 - (1000 % this._colors.length);
                    this._index += this._colors.length - 1;
                }
                else {
                    this._min--;
                    this._max--;
                    this._index--;
                }
            }
            else {
                this._index--;
            }
        }
        else {
            this._index--;
        }
        this._updateSelection();
    }
    _goRight() {
        if (this._colors.length > this._total) {
            if (this.Index >= this._max) {
                if (this.Index === this._colors.length - 1) {
                    this._min = 0;
                    this._max = this._total - 1;
                    this._index = 1000 - (1000 % this._colors.length);
                }
                else {
                    this._min++;
                    this._max++;
                    this._index++;
                }
            }
            else {
                this._index++;
            }
        }
        else {
            this._index++;
        }
        this._updateSelection();
    }
    _processControls() {
        if (__2.Game.isDisabledControlJustPressed(0, enums_1.Control.Attack)) {
            if (this.ParentMenu.isMouseInBounds(this._leftArrow.pos, this._leftArrow.size)) {
                this._goLeft();
            }
            else if (this.ParentMenu.isMouseInBounds(this._rightArrow.pos, this._rightArrow.size)) {
                this._goRight();
            }
            this._bar.forEach((colorRect, index) => __awaiter(this, void 0, void 0, function* () {
                if (this.ParentMenu.isMouseInBounds(colorRect.pos, colorRect.size)) {
                    this.Index = this._min + index;
                }
            }));
        }
    }
}
exports.UIMenuColorPanel = UIMenuColorPanel;
