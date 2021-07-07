import { Vehicle } from './Vehicle';
import { VehicleWheel } from './VehicleWheel';
import { VehicleWheelIndex } from '../enums';
export declare class VehicleWheelCollection {
    private _owner;
    private readonly _vehicleWheels;
    constructor(owner: Vehicle);
    getWheel(index: VehicleWheelIndex): VehicleWheel;
    getAllWheels(): VehicleWheel[];
    burstAllWheels(): void;
    fixAllWheels(): void;
    hasWheel(wheel: VehicleWheelIndex): boolean;
}
