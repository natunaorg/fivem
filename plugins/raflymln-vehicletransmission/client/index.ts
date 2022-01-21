import Client from "@client/index";

interface Vehicle {
    id?: number;
    model?: number;
    name?: string;

    maxSpeed?: number;
    maxGear?: number;

    currentGear?: number;
    currentEngineHealth?: number;
    currentHighGear?: number;
    currentCruiseSpeed?: number;
    currentMaxSpeed?: number;

    isCruising?: boolean;
    isUndriveable?: boolean;
    isUsingManualTransmission?: boolean;
    isMovingForward?: boolean;

    warning1?: string | boolean;
    warning2?: string | boolean;
    warning3?: string | boolean;
}

class Module {
    client: Client;

    lastLoggerTime: number;
    shiftLog: { [key: string]: any };

    vehicle: Vehicle;
    vehicleCache: { [key: string]: Vehicle };
    manualVehicleLists: { [key: string]: boolean };

    constructor(client: Client, config: any) {
        this.client = client;

        this.lastLoggerTime = Date.now();
        this.shiftLog = {};

        this.vehicle = {};
        this.vehicleCache = {};
        this.manualVehicleLists = {};

        for (const vehicleName of config.carWithManualTransmissions) {
            const hash = GetHashKey(vehicleName);
            this.manualVehicleLists[hash] = true;
        }

        //   _                 _
        //  | |               (_)
        //  | |     ___   __ _ _  ___ ___
        //  | |    / _ \ / _` | |/ __/ __|
        //  | |___| (_) | (_| | | (__\__ \
        //  \_____/\___/ \__, |_|\___|___/
        //                __/ |
        //               |___/
        //
        // Using Interval for better performance (At 100ms Tickrate)

        setInterval(() => {
            const ped = PlayerPedId();

            if (IsPedInAnyVehicle(ped, false)) {
                const currentVehicleId = GetVehiclePedIsIn(ped, false);
                const lastVehicleId = GetVehiclePedIsIn(ped, true);
                const isPedDriving = GetPedInVehicleSeat(currentVehicleId, -1) === ped;

                if (!this.vehicle.id || (this.vehicle.id !== lastVehicleId && isPedDriving)) {
                    this.vehicle.id = currentVehicleId;
                    this.vehicle.model = GetEntityModel(this.vehicle.id);
                    this.vehicle.name = GetDisplayNameFromVehicleModel(this.vehicle.model);

                    const id = this.vehicle.id;
                    const model = this.vehicle.model;
                    let cache = this.vehicleCache[this.vehicle.model];

                    if (!cache) cache = {};

                    this.vehicle.isCruising = true;
                    this.vehicle.isUndriveable = false;
                    this.vehicle.isUsingManualTransmission = this.manualVehicleLists[model] ? true : false;
                    this.vehicle.isMovingForward = false;

                    this.vehicle.maxSpeed = cache.maxSpeed || GetVehicleEstimatedMaxSpeed(id);
                    this.vehicle.maxGear = this.vehicle.isUsingManualTransmission ? cache.maxGear || GetVehicleHighGear(id) : 2; // Automatic only has 2 gear

                    this.vehicle.currentEngineHealth = GetVehicleEngineHealth(id);
                    this.vehicle.currentGear = 1;
                    this.vehicle.currentCruiseSpeed = 0;
                    this.vehicle.currentMaxSpeed = 0;

                    if (!cache.maxSpeed) cache.maxSpeed = this.vehicle.maxSpeed;
                    if (!cache.maxGear) cache.maxGear = this.vehicle.maxGear;
                    this.vehicleCache[model] = cache;
                }

                if (isPedDriving) {
                    const currentSpeed = GetEntitySpeed(this.vehicle.id);
                    const maxSpeed = (this.vehicle.maxSpeed / this.vehicle.maxGear) * this.vehicle.currentGear;
                    const minSpeed = (this.vehicle.maxSpeed / this.vehicle.maxGear) * (this.vehicle.currentGear - 1);

                    /**
                     * =====================
                     * Logic 1: If driver shift the car gear to another gear without reaching the minimum speed of the next gear
                     * =====================
                     */
                    if (this.vehicle.isUsingManualTransmission) {
                        switch (true) {
                            // Logic 1A: If driver decide to do it
                            case this.vehicle.currentGear > 2 && this.vehicle.currentGear < this.vehicle.maxGear && currentSpeed < minSpeed - 2:
                            case this.vehicle.currentGear == this.vehicle.maxGear && currentSpeed < minSpeed - 7:
                                switch (!this.vehicle.isCruising && this.vehicle.isMovingForward) {
                                    // Logic 1A-a: If driver forcing to gas the vehicle, it'd burn the car
                                    case true:
                                        this.vehicle.currentEngineHealth -= 5;
                                        SetVehicleEngineHealth(this.vehicle.id, this.vehicle.currentEngineHealth);
                                        this.utils.setVehicleUndriveable(true);

                                        this._logger(
                                            `Engine Burnout: ${this.vehicle.currentEngineHealth} (Caused by transferring gear to next gear without reaching the gear minimum speed and forcing the vehicle to be driven)`
                                        );
                                        break;

                                    // Logic 1A-b: If the driver only move the gear, it'd force the car machine to gas on max speed, resulting in engine burn too
                                    default:
                                        this.vehicle.currentEngineHealth -= 1;
                                        SetVehicleEngineHealth(this.vehicle.id, this.vehicle.currentEngineHealth);
                                        SetVehicleCurrentRpm(this.vehicle.id, 100);

                                        this._logger(`Engine Burnout: ${this.vehicle.currentEngineHealth} (Caused by transferring gear to next gear without reaching the gear minimum speed)`);
                                        break;
                                }

                                this.vehicle.warning1 = "~y~WARNING: ~r~MOVE THE GEAR DOWN";
                                break;

                            // Logic 1B: If driver decided NOT to do it
                            default:
                                this.vehicle.warning1 = false;
                                this.utils.setVehicleUndriveable(false);
                                break;
                        }
                    }

                    /**
                     * =====================
                     * Logic 2: If gear down but trespassing maximum speed of the current gear
                     * =====================
                     */
                    switch (currentSpeed > maxSpeed) {
                        case true:
                            if (!this.vehicle.isCruising && this.vehicle.isMovingForward) this.utils.setVehicleUndriveable(true);

                            SetVehicleCurrentRpm(this.vehicle.id, 100);
                            SetVehicleReduceGrip(this.vehicle.id, true);
                            SetVehicleReduceTraction(this.vehicle.id, 100);

                            this.vehicle.warning2 = "~y~WARNING: ~r~SLOW DOWN";
                            break;

                        default:
                            this.utils.setVehicleUndriveable(false);

                            SetVehicleReduceGrip(this.vehicle.id, false);
                            SetVehicleReduceTraction(this.vehicle.id, 0);
                            SetVehicleMaxSpeed(this.vehicle.id, maxSpeed - 1);

                            this.vehicle.warning2 = false;
                            break;
                    }

                    /**
                     * =====================
                     * Logic 3: Cruise Speed
                     * =====================
                     */
                    switch (this.vehicle.currentGear == 1) {
                        case true:
                            if (!this.vehicle.isCruising && this.vehicle.isMovingForward) {
                                this.vehicle.currentEngineHealth -= 1;
                                SetVehicleEngineHealth(this.vehicle.id, this.vehicle.currentEngineHealth);
                                SetVehicleCurrentRpm(this.vehicle.id, 100);

                                this._logger(`Engine Burnout: ${this.vehicle.currentEngineHealth} (Caused by forcing to drive the vehicle in parking gear)`);
                                this.vehicle.warning3 = "~y~WARNING: ~r~CHANGE THE GEAR FROM PARKING";
                            } else {
                                this.vehicle.warning3 = false;
                            }

                            SetVehicleBrake(this.vehicle.id, true);
                            SetVehicleBrakeLights(this.vehicle.id, false);
                            SetVehicleCurrentRpm(this.vehicle.id, 0);

                            break;

                        default:
                            if (this.vehicle.isCruising) this.setCruising(currentSpeed);

                            SetVehicleBrake(this.vehicle.id, false);
                            this.vehicle.warning3 = false;
                            break;
                    }
                }
            } else if (this.vehicle.id) {
                switch (this.vehicle.currentGear !== 1 && this.vehicle.currentEngineHealth >= 300) {
                    case true:
                        this.vehicle.currentEngineHealth -= 5;
                        SetVehicleEngineHealth(this.vehicle.id, this.vehicle.currentEngineHealth);
                        SetVehicleCurrentRpm(this.vehicle.id, 100);

                        this.setCruising(0);
                        this._logger(`Engine Burnout: ${this.vehicle.currentEngineHealth} (Caused by leaving the vehicle while not in parking gear)`);
                        break;

                    default:
                        delete this.vehicle.id;
                        break;
                }
            }
        }, 100);

        //   _   _ _____            _____             _             _
        //  | | | |_   _|   ___    /  __ \           | |           | |
        //  | | | | | |    ( _ )   | /  \/ ___  _ __ | |_ _ __ ___ | |___
        //  | | | | | |    / _ \/\ | |    / _ \| '_ \| __| '__/ _ \| / __|
        //  | |_| |_| |_  | (_>  < | \__/\ (_) | | | | |_| | | (_) | \__ \
        //   \___/ \___/   \___/\/  \____/\___/|_| |_|\__|_|  \___/|_|___/

        setTick(() => {
            if (this.vehicle.id && GetPedInVehicleSeat(this.vehicle.id, -1) === PlayerPedId()) {
                /**
                 * =====================
                 * UI DESIGN
                 * =====================
                 */
                const currentHandbrakeStatus = GetVehicleHandbrake(this.vehicle.id) ? "~r~[HANDBRAKE]" : "";
                const currentSpeed = Math.round(GetEntitySpeed(this.vehicle.id) * 3.6);
                const currentGear = `${this.vehicle.currentGear === this.vehicle.maxGear ? "~r~" : "~y~"}${this.vehicle.currentGear}`;
                const currentBodyHealth = Math.round(GetVehicleBodyHealth(this.vehicle.id));
                const gearShiftLogger = this.shiftLog && this.shiftLog.time && Date.now() - this.shiftLog.time <= 2500 ? this.shiftLog.message : "";

                this.client.utils.drawText(`Vehicle: ~y~${this.vehicle.name}`, {
                    x: 0.18,
                    y: 0.8,
                    font: 6,
                });

                this.client.utils.drawText(`> Gear: ~b~${currentGear} ~w~/ ${this.vehicle.maxGear}  ${gearShiftLogger}`, {
                    x: 0.18,
                    y: 0.835,
                    font: 6,
                    size: 0.45,
                });

                this.client.utils.drawText(`> Engine / Body Health: ~b~${this.vehicle.currentEngineHealth} ~w~/ ~b~${currentBodyHealth}`, {
                    x: 0.18,
                    y: 0.86,
                    font: 6,
                    size: 0.45,
                });

                this.client.utils.drawText(`> Current Speed: ~b~${currentSpeed} Km/H ${currentHandbrakeStatus}`, {
                    x: 0.18,
                    y: 0.885,
                    font: 6,
                    size: 0.45,
                });

                this.client.utils.drawText(`${this.vehicle.warning1 || ""} ${this.vehicle.warning2 || ""}`, {
                    x: 0.18,
                    y: 0.91,
                    font: 6,
                    size: 0.45,
                });

                this.client.utils.drawText(`${this.vehicle.warning3 || ""}`, {
                    x: 0.18,
                    y: 0.935,
                    font: 6,
                    size: 0.45,
                });

                /**
                 * =====================
                 * CONTROLS
                 * --------
                 * I'm using this native to get the origin keybind from GTA V
                 *  - 32 | INPUT_MOVE_UP_ONLY    (Drive Forward)
                 *  - 33 | INPUT_MOVE_DOWN_ONLY  (Drive Backward)
                 * =====================
                 */

                if (IsControlJustPressed(0, 32)) {
                    this.vehicle.isMovingForward = true;
                    this.vehicle.isCruising = false;
                }

                if (IsControlJustPressed(0, 33)) {
                    this.vehicle.isMovingForward = false;
                    this.vehicle.isCruising = false;
                }

                if (IsControlJustReleased(0, 32) || IsControlJustReleased(0, 33)) {
                    this.vehicle.isMovingForward = false;
                    this.vehicle.isCruising = true;
                    this.utils.setVehicleCruiseSpeed();
                }
            }
        });

        const key1 = this.client.registerKeyControl("UP", "Vehicle Gear Up", this.gearUp);
        const key2 = this.client.registerKeyControl("DOWN", "Vehicle Gear Down", this.gearDown);
        this.client.registerKeyControl("P", "Vehicle Handbrake", this.handbrake);

        console.log(key1, key2);
    }

    _logger = (...text: any) => {
        if (Date.now() - this.lastLoggerTime >= 5000) {
            console.log(new Date().toLocaleString(), `[Vehicle ${this.vehicle.id} (${this.vehicle.name})]`, ...text);
            this.lastLoggerTime = Date.now();
        }
    };

    gearUp = () => {
        if (this.vehicle.id && this.vehicle.currentGear >= 1 && !(this.vehicle.currentGear >= this.vehicle.maxGear)) {
            this.vehicle.currentGear += 1;

            if (this.vehicle.isUsingManualTransmission) SetVehicleHighGear(this.vehicle.id, this.vehicle.currentGear);

            this.shiftLog = {
                time: Date.now(),
                message: "~g~Gear Up!",
            };
        }
    };

    gearDown = () => {
        if (this.vehicle.id && this.vehicle.currentGear >= 1 && !(this.vehicle.currentGear <= 1)) {
            this.utils.setVehicleCruiseSpeed();
            this.vehicle.currentGear -= 1;

            if (this.vehicle.isUsingManualTransmission) SetVehicleHighGear(this.vehicle.id, this.vehicle.currentGear);

            this.shiftLog = {
                time: Date.now(),
                message: "~r~Gear Down!",
            };
        }
    };

    handbrake = () => {
        if (this.vehicle.id) {
            const currentHandbrakeStatus = GetVehicleHandbrake(this.vehicle.id);
            SetVehicleHandbrake(this.vehicle.id, !currentHandbrakeStatus);
            this.utils.setVehicleCruiseSpeed();
        }
    };

    setCruising = (currentSpeed: number) => {
        const currentHandbrakeStatus = GetVehicleHandbrake(this.vehicle.id);
        if (!currentHandbrakeStatus) {
            const cruiseSpeed = 2.7 * (this.vehicle.currentGear - 1);

            if (!this.vehicle.isMovingForward) this.vehicle.isMovingForward = true;
            if (this.vehicle.currentCruiseSpeed < cruiseSpeed) this.vehicle.currentCruiseSpeed += 0.1;

            if (currentSpeed <= cruiseSpeed && currentSpeed >= 0) {
                SetVehicleBoostActive(this.vehicle.id, false);
                SetVehicleForwardSpeed(this.vehicle.id, this.vehicle.currentCruiseSpeed);
                SetVehicleGravity(this.vehicle.id, true);
            }
        }
    };

    utils = {
        setVehicleUndriveable: (toggle: boolean) => {
            if (this.vehicle.id) {
                if (toggle && !this.vehicle.isUndriveable) {
                    SetVehicleUndriveable(this.vehicle.id, true);
                    this.vehicle.isUndriveable = true;
                } else if (!toggle && this.vehicle.isUndriveable) {
                    SetVehicleUndriveable(this.vehicle.id, false);
                    this.vehicle.isUndriveable = false;
                }
            }
        },
        setVehicleCruiseSpeed: () => {
            if (this.vehicle.id) {
                const currentSpeed = GetEntitySpeed(this.vehicle.id);
                this.vehicle.currentCruiseSpeed = currentSpeed < 0 ? currentSpeed : 0;
            }
        },
    };
}

const _handler = (client: Client, config: any) => new Module(client, config);
export { _handler };
