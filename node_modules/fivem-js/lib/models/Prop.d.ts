import { Entity } from './';
export declare class Prop extends Entity {
    static exists(prop: Prop): boolean;
    constructor(handle: number);
    exists(): boolean;
    placeOnGround(): void;
}
