"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingPrompt = void 0;
const enums_1 = require("../enums");
/**
 * Show and hide loading prompt on the bottom right of the screen.
 *
 * Example:
 *
 * ```typescript
 * import { LoadingPrompt } from 'fivem-js/ui';
 *
 * LoadingPrompt.show("Hello World");
 *
 * setTimeout(() => {
 *  LoadingPrompt.hide();
 * }, 10000)'
 * ```
 */
class LoadingPrompt {
    /**
     * Shows a loading prompt.
     *
     * @param loadingText Text to be displayed inside loading prompt.
     * @param spinnerType Type of spinner.
     */
    static show(loadingText = null, spinnerType = enums_1.LoadingSpinnerType.RegularClockwise) {
        if (this.IsActive) {
            this.hide();
        }
        if (loadingText === null) {
            BeginTextCommandBusyString(null);
        }
        else {
            BeginTextCommandBusyString('STRING');
            AddTextComponentSubstringPlayerName(loadingText);
        }
        EndTextCommandBusyString(Number(spinnerType));
    }
    static hide() {
        if (this.IsActive) {
            RemoveLoadingPrompt();
        }
    }
    static get IsActive() {
        return !!IsLoadingPromptBeingDisplayed();
    }
}
exports.LoadingPrompt = LoadingPrompt;
