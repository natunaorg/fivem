import { Entity, EntityBone } from './';
export declare class EntityBoneCollection {
    protected readonly owner: Entity;
    private readonly _collection;
    private _currentIndex;
    constructor(owner: Entity);
    hasBone(name: string): boolean;
    get Core(): EntityBone;
}
