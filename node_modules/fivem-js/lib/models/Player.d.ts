import { Ped } from './';
export declare class Player {
    get Handle(): number;
    get Character(): Ped;
    get Name(): string;
    get PvPEnabled(): boolean;
    set PvPEnabled(value: boolean);
    private handle;
    private ped;
    private pvp;
    constructor(handle: number);
}
