"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timerbar = void 0;
const enums_1 = require("../enums");
const utils_1 = require("../utils");
const Hud_1 = require("./Hud");
const LoadingPrompt_1 = require("./LoadingPrompt");
const Screen_1 = require("./Screen");
const Sprite_1 = require("./Sprite");
/** @internal */
const activeTimerBars = [];
/** @internal */
const drawText = (text, position, options) => {
    options = Object.assign({
        align: 1,
        color: [255, 255, 255, 255],
        font: 4,
        outline: true,
        scale: 0.3,
        shadow: true,
    }, options);
    const font = options.font;
    const scale = options.scale;
    const outline = options.outline;
    const shadow = options.shadow;
    const color = options.color;
    const align = options.align;
    SetTextEntry('CELL_EMAIL_BCON');
    for (let i = 0; i < text.length; i += 99) {
        const subStringText = text.substr(i, Math.min(99, text.length - i));
        AddTextComponentSubstringPlayerName(subStringText);
    }
    SetTextFont(font);
    SetTextScale(scale, scale);
    SetTextColour(color[0], color[1], color[2], color[3]);
    if (shadow) {
        SetTextDropShadow();
    }
    if (outline) {
        SetTextOutline();
    }
    switch (align) {
        case 1: {
            SetTextCentre(true);
            break;
        }
        case 2: {
            SetTextRightJustify(true);
            SetTextWrap(0.0, position[0] || 0);
            break;
        }
    }
    DrawText(position[0] || 0, position[1] || 0);
};
/**
 * Create a Timerbar. It's automatically added to the internal Timerbar array and drawn in a FIFO (first in, first out) way.
 *
 * ```typescript
 * // Create simple Timerbar
 * const myTimerbar = new Cfx.Timerbar("Hello");
 * myTimerbar.Text = "World";
 *
 * // Disable Timerbar later on
 * myTimerbar.Visible = false;
 * ```
 */
class Timerbar {
    constructor(title, useProgressBar = false) {
        this.sprite = null;
        this.title = '';
        this.text = '';
        this.useProgressBar = false;
        this.usePlayerStyle = false;
        this.isVisible = false;
        this.pbarValue = 0.0;
        this.textColor = [240, 240, 240, 255];
        this.pbarBgColor = [155, 155, 155, 255];
        this.pbarFgColor = [255, 255, 255, 255];
        this.title = title;
        this.useProgressBar = useProgressBar;
        this.text = '';
        this.pbarValue = 0.0;
        this.textColor = [240, 240, 240, 255];
        this.pbarBgColor = [155, 155, 155, 255];
        this.pbarFgColor = [255, 255, 255, 255];
        this.usePlayerStyle = false;
        const safeZone = GetSafeZoneSize();
        const safeZoneX = (1.0 - safeZone) * 0.5;
        const safeZoneY = (1.0 - safeZone) * 0.5;
        this.sprite = new Sprite_1.Sprite('timerbars', 'all_black_bg', new utils_1.Point(Screen_1.Screen.ScaledWidth * 0.918 - safeZoneX, Screen_1.Screen.Height * 0.984 - safeZoneY), new utils_1.Size(Screen_1.Screen.ScaledWidth * 0.165, Screen_1.Screen.Height * 0.035), 0, new utils_1.Color(160, 255, 255, 255));
        if (!this.sprite.IsTextureDictionaryLoaded) {
            this.sprite.loadTextureDictionary();
        }
        this.isVisible = true;
        activeTimerBars.push(this);
    }
    get Title() {
        return this.title;
    }
    set Title(value) {
        this.title = value;
    }
    get Text() {
        return this.text;
    }
    set Text(value) {
        this.text = value;
    }
    get UseProgressBar() {
        return this.useProgressBar;
    }
    get Progress() {
        return this.pbarValue;
    }
    set Progress(value) {
        this.pbarValue = value <= 0.0 ? 0.0 : value >= 1.0 ? 1.0 : value;
    }
    get Visible() {
        return this.isVisible;
    }
    set Visible(value) {
        const idx = activeTimerBars.indexOf(this);
        if (value) {
            if (idx !== -1) {
                return;
            }
            activeTimerBars.push(this);
        }
        else {
            if (idx === -1) {
                return;
            }
            activeTimerBars.splice(idx, 1);
        }
        this.isVisible = value;
    }
    get TextColor() {
        return this.textColor;
    }
    set TextColor(value) {
        if (Array.isArray(value)) {
            this.textColor = value;
        }
        else {
            const result = GetHudColour(value);
            this.textColor = [result[0], result[1], result[2], result[3]];
        }
    }
    get ProgressbarBgColor() {
        return this.pbarBgColor;
    }
    set ProgressbarBgColor(value) {
        if (Array.isArray(value)) {
            this.pbarBgColor = value;
        }
        else {
            const result = GetHudColour(value);
            this.pbarBgColor = [result[0], result[1], result[2], result[3]];
        }
    }
    get ProgressbarFgColor() {
        return this.pbarFgColor;
    }
    set ProgressbarFgColor(value) {
        if (Array.isArray(value)) {
            this.pbarFgColor = value;
        }
        else {
            const result = GetHudColour(value);
            this.pbarFgColor = [result[0], result[1], result[2], result[3]];
        }
    }
    set PlayerStyle(value) {
        this.usePlayerStyle = value;
    }
    get PlayerStyle() {
        return this.usePlayerStyle;
    }
    get Sprite() {
        return this.sprite;
    }
}
exports.Timerbar = Timerbar;
setTick(() => {
    if (activeTimerBars.length <= 0) {
        return;
    }
    const safeZone = GetSafeZoneSize();
    const safeZoneX = (1.0 - safeZone) * 0.5;
    const safeZoneY = (1.0 - safeZone) * 0.5;
    Hud_1.Hud.hideComponentThisFrame(enums_1.HudComponent.AreaName);
    Hud_1.Hud.hideComponentThisFrame(enums_1.HudComponent.StreetName);
    let loadingPromptOffset = 0;
    if (LoadingPrompt_1.LoadingPrompt.IsActive) {
        loadingPromptOffset = 0.035 + 0.035 * 0.038 * 2;
    }
    activeTimerBars.forEach(timerbar => {
        const drawY = 0.984 - loadingPromptOffset - safeZoneY - activeTimerBars.indexOf(timerbar) * 0.038;
        DrawSprite('timerbars', 'all_black_bg', 0.918 - safeZoneX, drawY, 0.165, 0.035, 0.0, 255, 255, 255, 160);
        drawText(timerbar.Title, [0.918 - safeZoneX + 0.012, drawY - 0.009 - (timerbar.PlayerStyle ? 0.00625 : 0)], {
            align: 2,
            color: timerbar.TextColor,
            font: timerbar.PlayerStyle ? 4 : 0,
            outline: false,
            scale: timerbar.PlayerStyle ? 0.465 : 0.3,
            shadow: timerbar.PlayerStyle,
        });
        if (timerbar.UseProgressBar) {
            const pbarX = 0.918 - safeZoneX + 0.047;
            const pbarY = drawY + 0.0015;
            const width = 0.0616 * timerbar.Progress;
            DrawRect(pbarX, pbarY, 0.0616, 0.0105, timerbar.ProgressbarBgColor[0], timerbar.ProgressbarBgColor[1], timerbar.ProgressbarBgColor[2], timerbar.ProgressbarBgColor[3]);
            DrawRect(pbarX - 0.0616 / 2 + width / 2, pbarY, width, 0.0105, timerbar.ProgressbarFgColor[0], timerbar.ProgressbarFgColor[1], timerbar.ProgressbarFgColor[2], timerbar.ProgressbarFgColor[3]);
        }
        else {
            drawText(timerbar.Text, [0.918 - safeZoneX + 0.0785, drawY + -0.0165], {
                align: 2,
                color: timerbar.TextColor,
                font: 0,
                outline: false,
                scale: 0.425,
                shadow: false,
            });
        }
    });
});
