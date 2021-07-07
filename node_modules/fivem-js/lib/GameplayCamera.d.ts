import { Vector3 } from './utils';
/**
 * The current rendering gameplay camera
 */
export declare abstract class GameplayCamera {
    /**
     * Get the world position of gameplay camera.
     */
    static get Position(): Vector3;
    /**
     * Get the rotation of gameplay camera.
     */
    static get Rotation(): Vector3;
    /**
     * Get the forward vector of gameplay camera.
     */
    static get ForwardVector(): Vector3;
    /**
     * Get the pitch of the gameplay camera relative to player.
     */
    static get RelativePitch(): number;
    /**
     * Set gameplay camera pitch relative to player.
     */
    static set RelativePitch(pitch: number);
    /**
     * Get heading of gameplay camera.
     */
    static get RelativeHeading(): number;
    /**
     * Get heading of gameplay camera.
     */
    static set RelativeHeading(heading: number);
}
