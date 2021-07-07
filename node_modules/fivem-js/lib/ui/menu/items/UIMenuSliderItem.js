"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIMenuSliderItem = void 0;
const __1 = require("../../");
const _1 = require("./");
const utils_1 = require("../../../utils");
const enums_1 = require("../../../enums");
class UIMenuSliderItem extends _1.UIMenuItem {
    constructor(text, items, startIndex = 0, description, showDivider = false, arrowOnlyOnSelected = false) {
        super(text, description);
        this.sliderChanged = new utils_1.LiteEvent();
        this.sliderSelected = new utils_1.LiteEvent();
        this.supportsRightBadge = false;
        this.supportsRightLabel = false;
        this._leftSliderBadge = enums_1.BadgeStyle.None;
        this._rightSliderBadge = enums_1.BadgeStyle.None;
        this._background = new __1.Rectangle(new utils_1.Point(), new utils_1.Size(150, 9), new utils_1.Color(255, 4, 32, 57));
        this._slider = new __1.Rectangle(new utils_1.Point(), new utils_1.Size(75, 9), new utils_1.Color(255, 57, 116, 200));
        this._divider = new __1.Rectangle(new utils_1.Point(), new utils_1.Size(2.5, 20), utils_1.Color.whiteSmoke);
        this._leftArrow = new __1.Sprite('commonmenutu', 'arrowleft', new utils_1.Point(), new utils_1.Size(15, 15));
        this._rightArrow = new __1.Sprite('commonmenutu', 'arrowright', new utils_1.Point(), new utils_1.Size(15, 15));
        this._leftSliderBadgeSprite = new __1.Sprite('', '');
        this._rightSliderBadgeSprite = new __1.Sprite('', '');
        this.ArrowOnlyOnSelected = arrowOnlyOnSelected;
        this.ShowDivider = showDivider;
        this.Items = items;
        this.Index = startIndex;
    }
    get Index() {
        return this._index % this._items.length;
    }
    set Index(value) {
        this._index = 100000000 - (100000000 % this._items.length) + value;
    }
    get Item() {
        return this._items[this.Index];
    }
    get Items() {
        return this._items;
    }
    set Items(value) {
        this._items = value || [];
    }
    get ShowDivider() {
        return this._showDivider;
    }
    set ShowDivider(value) {
        this._showDivider = value;
    }
    get ArrowOnlyOnSelected() {
        return this._arrowOnlyOnSelected;
    }
    set ArrowOnlyOnSelected(value) {
        this._arrowOnlyOnSelected = value;
    }
    get BackgroundColor() {
        return this._background.color;
    }
    set BackgroundColor(value) {
        this._background.color = value || new utils_1.Color(255, 4, 32, 57);
    }
    get SliderColor() {
        return this._slider.color;
    }
    set SliderColor(value) {
        this._slider.color = value || new utils_1.Color(255, 57, 116, 200);
    }
    get DividerColor() {
        return this._divider.color;
    }
    set DividerColor(value) {
        this._divider.color = value || utils_1.Color.whiteSmoke;
    }
    get LeftSliderBadge() {
        return this._leftSliderBadge;
    }
    set LeftSliderBadge(value) {
        value = Number(value);
        this._leftSliderBadge = value;
        this._leftSliderBadgeSprite.TextureDict = _1.UIMenuItem.badgeToTextureDict(value);
        this._leftSliderBadgeSprite.size = _1.UIMenuItem.getBadgeSize(value);
    }
    get RightSliderBadge() {
        return this._rightSliderBadge;
    }
    set RightSliderBadge(value) {
        value = Number(value);
        this._rightSliderBadge = value;
        this._rightSliderBadgeSprite.TextureDict = _1.UIMenuItem.badgeToTextureDict(value);
        this._rightSliderBadgeSprite.size = _1.UIMenuItem.getBadgeSize(value);
    }
    get IsMouseInBoundsOfLeftArrow() {
        return this.parent.isMouseInBounds(this._leftArrow.pos, this._leftArrow.size);
    }
    get IsMouseInBoundsOfRightArrow() {
        return this.parent.isMouseInBounds(this._rightArrow.pos, this._rightArrow.size);
    }
    indexToItem(index) {
        return this._items[index];
    }
    setVerticalPosition(y) {
        const yOffset = y + this.offset.Y;
        this._background.pos.Y = yOffset + 158.5;
        this._slider.pos.Y = yOffset + 158.5;
        this._divider.pos.Y = yOffset + 153;
        this._leftArrow.pos.Y = yOffset + 155.5;
        this._rightArrow.pos.Y = yOffset + 155.5;
        this._leftSliderBadgeSprite.pos.Y =
            yOffset + 142 + _1.UIMenuItem.getBadgeSpriteHeightOffset(this._leftSliderBadgeSprite);
        this._rightSliderBadgeSprite.pos.Y =
            yOffset + 142 + _1.UIMenuItem.getBadgeSpriteHeightOffset(this._rightSliderBadgeSprite);
        super.setVerticalPosition(y);
    }
    draw() {
        super.draw();
        const showArrows = !this._arrowOnlyOnSelected || this.selected;
        const x = this.offset.X + this.parent.WidthOffset;
        this._background.pos.X = 431 + x - this._background.size.width;
        if (showArrows) {
            this._background.pos.X -= this._rightArrow.size.width / 2;
            this._leftSliderBadgeSprite.pos.X = -this._leftArrow.size.width / 2;
        }
        else {
            this._leftSliderBadgeSprite.pos.X = 0;
        }
        if (this._rightSliderBadge !== enums_1.BadgeStyle.None) {
            const widthOffset = _1.UIMenuItem.getBadgeSpriteWidthOffset(this._rightSliderBadgeSprite);
            this._background.pos.X -= 40;
            this._rightSliderBadgeSprite.pos.X = 431 + x;
            this._rightSliderBadgeSprite.pos.X -= this._rightSliderBadgeSprite.size.width + widthOffset;
            this._rightSliderBadgeSprite.textureName = this.badgeToTextureName(this._rightSliderBadge);
            this._rightSliderBadgeSprite.color = this.badgeToColor(this._rightSliderBadge);
            this._rightSliderBadgeSprite.draw(__1.Menu.screenResolution);
        }
        else {
            this._background.pos.X -= this._rightArrow.size.width / 2;
        }
        if (this._leftSliderBadge !== enums_1.BadgeStyle.None) {
            const widthOffset = _1.UIMenuItem.getBadgeSpriteWidthOffset(this._leftSliderBadgeSprite);
            this._leftSliderBadgeSprite.pos.X -= this._leftSliderBadgeSprite.size.width + widthOffset;
            this._leftSliderBadgeSprite.pos.X += this._background.pos.X;
            this._leftSliderBadgeSprite.textureName = this.badgeToTextureName(this._leftSliderBadge);
            this._leftSliderBadgeSprite.color = this.badgeToColor(this._leftSliderBadge);
            this._leftSliderBadgeSprite.draw(__1.Menu.screenResolution);
        }
        const sliderXOffset = ((this._background.size.width - this._slider.size.width) / (this._items.length - 1)) *
            this.Index;
        this._slider.pos.X = this._background.pos.X + sliderXOffset;
        this._leftArrow.color = this.enabled
            ? this.selected
                ? utils_1.Color.black
                : utils_1.Color.whiteSmoke
            : new utils_1.Color(255, 163, 159, 148);
        this._rightArrow.color = this._leftArrow.color;
        this._background.draw(undefined, __1.Menu.screenResolution);
        this._slider.draw(undefined, __1.Menu.screenResolution);
        if (showArrows) {
            this._leftArrow.pos.X = this._background.pos.X - 15;
            this._rightArrow.pos.X = this._background.pos.X + this._background.size.width;
            this._leftArrow.draw(__1.Menu.screenResolution);
            this._rightArrow.draw(__1.Menu.screenResolution);
        }
        if (this._showDivider) {
            this._divider.pos.X = this._background.pos.X + this._background.size.width / 2;
            this._divider.draw(undefined, __1.Menu.screenResolution);
        }
    }
}
exports.UIMenuSliderItem = UIMenuSliderItem;
