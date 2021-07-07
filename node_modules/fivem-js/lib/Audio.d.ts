import { AudioFlag } from './enums';
import { Entity } from './models';
import { Vector3 } from './utils';
export declare abstract class Audio {
    static playSoundAt(position: Vector3, sound: string, set?: string): number;
    static playSoundFromEntity(entity: Entity, sound: string, set?: string): number;
    static playSoundFrontEnd(sound: string, set?: string): number;
    static stopSound(soundId: number): void;
    static releaseSound(soundId: number): void;
    static hasSoundFinished(soundId: number): boolean;
    static setAudioFlag(flag: string | AudioFlag, toggle: boolean): void;
    static playSound(soundFile: string, soundSet: string): void;
    static playMusic(musicFile: string): void;
    static stopMusic(musicFile?: string): void;
    protected static cachedMusicFile: string;
    private static readonly audioFlags;
}
