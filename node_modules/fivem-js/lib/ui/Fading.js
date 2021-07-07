"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fading = void 0;
/**
 * Static class for screen fading
 */
class Fading {
    /**
     * Gets whether the screen is faded in
     *
     * @returns True or false
     */
    static get IsFadedIn() {
        return !!IsScreenFadedIn();
    }
    /**
     * Gets whether the screen is faded out
     *
     * @returns True or false
     */
    static get IsFadedOut() {
        return !!IsScreenFadedOut();
    }
    /**
     * Gets whether the screen is currently fading in
     *
     * @returns True or false
     */
    static get IsFadingIn() {
        return !!IsScreenFadingIn();
    }
    /**
     * Gets whether the screen is currently fading out
     *
     * @returns True or false
     */
    static get IsFadingOut() {
        return !!IsScreenFadingOut();
    }
    /**
     * Fade in the screen for a certain duration.
     *
     * @param duration Time to fade in
     */
    static fadeIn(duration) {
        return new Promise(resolve => {
            DoScreenFadeIn(duration);
            const interval = setInterval(() => {
                if (this.IsFadedIn) {
                    clearInterval(interval);
                    resolve();
                }
            }, 0);
        });
    }
    /**
     * Fade out the screen for a certain duration.
     *
     * @param duration Time to fade out
     */
    static fadeOut(duration) {
        return new Promise(resolve => {
            DoScreenFadeOut(duration);
            const interval = setInterval(() => {
                if (this.IsFadedOut) {
                    clearInterval(interval);
                    resolve();
                }
            }, 0);
        });
    }
}
exports.Fading = Fading;
