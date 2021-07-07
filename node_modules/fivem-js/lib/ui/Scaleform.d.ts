import { PointF, Vector3 } from '../utils';
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
export declare class Scaleform {
    static render2DMasked(scaleform1: Scaleform, scaleform2: Scaleform): Promise<void>;
    protected handle: number;
    protected name: string;
    protected loaded: boolean;
    constructor(name: string);
    /**
     * Get the handle of the scaleform.
     */
    get Handle(): number;
    /**
     * Get whether the handle is a valid handle.
     */
    get IsValid(): boolean;
    /**
     * Get whether the scaleform is loaded.
     */
    get IsLoaded(): boolean;
    /**
     * Dispose the scaleform allowing the GTA engine to free memory when wanted.
     */
    dispose(): void;
    /**
     * Call a function on the scaleform.
     *
     * @param name Name of the function
     * @param args Additional arguments
     */
    callFunction(name: string, ...args: unknown[]): void;
    /**
     * Sets a duration the scaleform should be shown.
     * Useful for showing a scaleform for a known amount of time, such as messages.
     *
     * This only works for any scaleform using {@linkcode render2D};
     *
     * @param duration Duration in milliseconds
     */
    setDuration(duration: number): void;
    render2D(): Promise<void>;
    render2DScreenSpace(location: PointF, size: PointF): Promise<void>;
    render3D(position: Vector3, rotation: Vector3, scale: Vector3): Promise<void>;
    render3DAdditive(position: Vector3, rotation: Vector3, scale: Vector3): Promise<void>;
    load(): Promise<boolean>;
}
