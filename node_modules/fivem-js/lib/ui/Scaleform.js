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
exports.Scaleform = void 0;
/**
 * Scaleforms will automatically load when calling any of the render functions.
 *
 * Example:
 *
 * ```typescript
 * import { Scaleform } from 'fivem-js/ui';
 *
 * const scaleform = new Cfx.Scaleform("MIDSIZED_MESSAGE");
 *
 * scaleform.callFunction("SHOW_MIDSIZED_MESSAGE", ["Title", "Message"]);
 *
 * setTick(() => {
 *  await scaleform.render2D();
 * });
 * ```
 */
class Scaleform {
    constructor(name) {
        this.name = name;
        this.handle = RequestScaleformMovie(this.name);
    }
    static render2DMasked(scaleform1, scaleform2) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (scaleform1.IsLoaded && scaleform2.IsLoaded) {
                DrawScaleformMovieFullscreenMasked(scaleform1.Handle, scaleform2.Handle, 255, 255, 255, 255);
            }
            else {
                yield scaleform1.load();
                yield scaleform2.load();
            }
            resolve();
        }));
    }
    /**
     * Get the handle of the scaleform.
     */
    get Handle() {
        return this.handle;
    }
    /**
     * Get whether the handle is a valid handle.
     */
    get IsValid() {
        return this.handle !== 0;
    }
    /**
     * Get whether the scaleform is loaded.
     */
    get IsLoaded() {
        if (!this.loaded) {
            this.loaded = !!HasScaleformMovieLoaded(this.handle);
        }
        return this.loaded;
    }
    /**
     * Dispose the scaleform allowing the GTA engine to free memory when wanted.
     */
    dispose() {
        if (this.IsLoaded) {
            SetScaleformMovieAsNoLongerNeeded(this.handle);
            this.loaded = false;
        }
    }
    /**
     * Call a function on the scaleform.
     *
     * @param name Name of the function
     * @param args Additional arguments
     */
    callFunction(name, ...args) {
        BeginScaleformMovieMethod(this.handle, name);
        args.forEach(arg => {
            switch (typeof arg) {
                case 'number':
                    PushScaleformMovieFunctionParameterInt(arg);
                    break;
                case 'string':
                    PushScaleformMovieFunctionParameterString(arg);
                    break;
                case 'boolean':
                    PushScaleformMovieFunctionParameterBool(arg);
                    break;
                default:
                    throw new Error(`Unknown argument type [${typeof arg}] passed to scaleform with handle [${this.handle}]`);
            }
        });
        EndScaleformMovieMethod();
    }
    /**
     * Sets a duration the scaleform should be shown.
     * Useful for showing a scaleform for a known amount of time, such as messages.
     *
     * This only works for any scaleform using {@linkcode render2D};
     *
     * @param duration Duration in milliseconds
     */
    setDuration(duration) {
        if (duration <= 0) {
            return;
        }
        const start = GetGameTimer();
        const interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            if (GetGameTimer() - start < duration) {
                yield this.render2D();
            }
            else {
                clearInterval(interval);
            }
        }), 0);
    }
    render2D() {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (this.IsLoaded) {
                DrawScaleformMovieFullscreen(this.handle, 255, 255, 255, 255, 0);
            }
            else {
                yield this.load();
            }
            resolve();
        }));
    }
    render2DScreenSpace(location, size) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (this.IsLoaded) {
                const x = location.x; /* UI.Screen.Width*/
                const y = location.y; /* UI.Screen.Height*/
                const width = size.x; /* UI.Screen.Width*/
                const height = size.y; /* UI.Screen.Height*/
                DrawScaleformMovie(this.handle, x + width / 2, y + height / 2, width, height, 255, 255, 255, 255, 0);
            }
            else {
                yield this.load();
            }
            resolve();
        }));
    }
    render3D(position, rotation, scale) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (this.IsLoaded) {
                DrawScaleformMovie_3dNonAdditive(this.handle, position.x, position.y, position.z, rotation.x, rotation.y, rotation.z, 2, 2, 1, scale.x, scale.y, scale.z, 2);
            }
            else {
                yield this.load();
            }
            resolve();
        }));
    }
    render3DAdditive(position, rotation, scale) {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            if (this.IsLoaded) {
                DrawScaleformMovie_3d(this.handle, position.x, position.y, position.z, rotation.x, rotation.y, rotation.z, 2, 2, 1, scale.x, scale.y, scale.z, 2);
            }
            else {
                yield this.load();
            }
            resolve();
        }));
    }
    load() {
        return new Promise(resolve => {
            if (this.IsLoaded) {
                resolve(true);
            }
            else {
                const start = GetGameTimer();
                const interval = setInterval(() => {
                    if (this.IsLoaded) {
                        clearInterval(interval);
                        resolve(true);
                    }
                    else if (GetGameTimer() - start > 5000) {
                        clearInterval(interval);
                        console.log(`^1[fivem-js] Could not load scaleform ${this.name}!^7`);
                        resolve(false);
                    }
                }, 0);
            }
        });
    }
}
exports.Scaleform = Scaleform;
