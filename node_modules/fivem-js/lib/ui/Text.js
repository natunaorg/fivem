"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = void 0;
const enums_1 = require("../enums");
const utils_1 = require("../utils");
const _1 = require("./");
class Text {
    /**
     *
     * @param caption Text to display
     * @param pos Position of text relative to alignment. In pixels.
     * @param scale Size of text. Default 1.0
     * @param color Color of text. Default black.
     * @param font Font of text. Default Chalet London.
     * @param alignment Alignment of text. Default Left.
     * @param dropShadow
     * @param outline
     * @param wordWrap
     */
    constructor(caption, pos, scale = 1, color = utils_1.Color.white, font = enums_1.Font.ChaletLondon, alignment = enums_1.Alignment.Left, dropShadow = false, outline = false, wordWrap) {
        this.caption = caption;
        this.pos = pos;
        this.scale = scale;
        this.color = color;
        this.font = font;
        this.alignment = alignment;
        this.dropShadow = dropShadow;
        this.outline = outline;
        this.wordWrap = wordWrap;
    }
    static draw(caption, pos, scale = 1, color = utils_1.Color.white, font = enums_1.Font.ChaletLondon, alignment = enums_1.Alignment.Left, dropShadow = false, outline = false, wordWrap, resolution) {
        resolution = resolution || new utils_1.Size(_1.Screen.ScaledWidth, _1.Screen.Height);
        const x = pos.X / resolution.width;
        const y = pos.Y / resolution.height;
        SetTextFont(Number(font));
        SetTextScale(1.0, scale);
        SetTextColour(color.r, color.g, color.b, color.a);
        if (dropShadow) {
            SetTextDropshadow(2, 0, 0, 0, 0);
        }
        if (outline) {
            SetTextOutline();
        }
        switch (alignment) {
            case enums_1.Alignment.Centered:
                SetTextCentre(true);
                break;
            case enums_1.Alignment.Right:
                SetTextRightJustify(true);
                if (!wordWrap) {
                    SetTextWrap(0.0, x);
                }
                break;
        }
        if (wordWrap) {
            SetTextWrap(x, (pos.X + wordWrap.width) / resolution.width);
        }
        SetTextEntry('STRING');
        Text.addLongString(caption);
        DrawText(x, y);
    }
    static addLongString(str) {
        const strLen = 99;
        for (let i = 0; i < str.length; i += strLen) {
            const substr = str.substr(i, Math.min(strLen, str.length - i));
            AddTextComponentSubstringPlayerName(substr);
        }
    }
    draw(arg1, arg2, scale, color, font, alignment, dropShadow, outline, wordWrap, resolution) {
        resolution = arg2 instanceof utils_1.Size ? arg2 : resolution;
        if (scale === undefined) {
            if (arg1 && arg1 instanceof utils_1.Size) {
                arg2 = new utils_1.Point(this.pos.X + arg1.width, this.pos.Y + arg1.height);
            }
            else {
                arg2 = this.pos;
            }
            arg1 = this.caption;
            scale = this.scale;
            color = this.color;
            font = this.font;
            alignment = this.alignment;
            dropShadow = this.dropShadow;
            outline = this.outline;
            wordWrap = this.wordWrap;
        }
        else {
            arg1 = arg1 || this.caption;
            if (!arg2) {
                arg2 = this.pos;
            }
            else {
                arg2 = arg2;
            }
            scale = scale !== undefined && scale !== null ? scale : this.scale;
            color = color || this.color;
            font = font !== undefined && font !== null ? font : this.font;
            alignment = alignment !== undefined && alignment !== null ? alignment : this.alignment;
            dropShadow = typeof dropShadow === 'boolean' ? dropShadow : dropShadow;
            outline = typeof outline === 'boolean' ? outline : outline;
            wordWrap = wordWrap || this.wordWrap;
        }
        Text.draw(arg1, arg2, scale, color, font, alignment, dropShadow, outline, wordWrap, resolution);
    }
}
exports.Text = Text;
