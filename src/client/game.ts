"use strict";
import "@citizenfx/client";

import type Utils from "@client/utils";

export default class Game {
    /**
     * @hidden
     */
    constructor(private utils: Utils) {}

    /**
     * @description
     * Basically optimizing texture and things in GTA, such as clearing blood, wetness, dirt, etc. in ped
     *
     * @param ped Ped
     *
     * @example
     * ```ts
     * optimizeFPS(PlayerPedId());
     * ```
     */
    optimizeFPS = (ped: number = PlayerPedId()) => {
        ClearAllBrokenGlass();
        ClearAllHelpMessages();
        LeaderboardsReadClearAll();
        ClearBrief();
        ClearGpsFlags();
        ClearPrints();
        ClearSmallPrints();
        ClearReplayStats();
        LeaderboardsClearCacheData();
        ClearFocus();
        ClearHdArea();
        ClearPedBloodDamage(ped);
        ClearPedWetness(ped);
        ClearPedEnvDirt(ped);
        ResetPedVisibleDamage(ped);
    };

    /**
     * @description
     * Disable default game dispatch radio
     *
     * @example
     * ```ts
     * disableDispatchService();
     * ```
     */
    disableDispatchService = () => {
        for (let i = 0; i <= 20; i++) {
            EnableDispatchService(i, false);
            Citizen.invokeNative("0xDC0F817884CDD856", i, false); // EnableDispatchService in Native
        }
    };

    /**
     * @description
     * Reset wanted level for a player
     *
     * @param playerId Player Ped
     *
     * @example
     * ```ts
     * resetWantedLevel(PlayerId());
     * ```
     */
    resetWantedLevel = (playerId: number = PlayerId()) => {
        if (GetPlayerWantedLevel(playerId) !== 0) {
            SetPlayerWantedLevel(playerId, 0, false);
            SetPlayerWantedLevelNow(playerId, false);
        }

        return true;
    };

    /**
     * @description
     * Only work on an entity (Ped, Player, Vehicle, Object, etc)
     */
    entity = {
        /**
         * @description
         * Get coordinates of an entity
         *
         * @param entity Entity
         *
         * @example
         * ```ts
         * getCoords(PlayerPedId());
         * ```
         */
        getCoords: (entity: number = PlayerPedId()) => {
            const [x, y, z] = GetEntityCoords(entity, true);
            const heading = GetEntityHeading(entity);

            return { x, y, z, heading };
        },
    };

    /**
     * @description
     * Only work for a ped (Pedestrian, Player)
     */
    ped = {
        /**
         * @description
         * Teleport to a waypoint marker set on the map
         *
         * @param ped Ped
         *
         * @example
         * ```ts
         * teleportToMarker(PlayerPedId());
         * ```
         */
        teleportToMarker: async (ped: number = PlayerPedId()) => {
            if (!DoesEntityExist(ped) || !IsEntityAPed(ped)) {
                throw new Error("Entity given was not a ped!");
            }

            const waypoint = GetFirstBlipInfoId(8);

            if (!DoesBlipExist(waypoint)) {
                throw new Error("Blip Doesn't Exist");
            }

            const coords = GetBlipInfoIdCoord(waypoint);

            for (let height = 1; height <= 1000; height++) {
                const [, groundZ] = GetGroundZFor_3dCoord(coords[0], coords[1], height, false);

                this.ped.teleportToCoordinates(ped, { x: coords[0], y: coords[1], z: height });

                await this.utils.sleep(5);
                if (groundZ) return true;
            }

            return false;
        },

        /**
         * @description
         * Teleport to a coordinates
         *
         * @param ped Ped
         * @param coords Coordinate of the location
         *
         * @example
         * ```ts
         * teleportToCoordinates(PlayerPedId(), { 1000, 2000, 500 });
         * ```
         */
        teleportToCoordinates: (ped: number = PlayerPedId(), coords: { x: string | number; y: string | number; z: string | number }) => {
            if (!DoesEntityExist(ped) || !IsEntityAPed(ped)) {
                throw new Error("Entity given was not a ped!");
            }

            const parseCoords = (axis: string | number) => {
                if (typeof axis === "string") {
                    const parsedString = axis.replace(/,/g, "");
                    axis = parseInt(parsedString);
                }

                return axis;
            };

            SetPedCoordsKeepVehicle(ped, parseCoords(coords.x), parseCoords(coords.y), parseCoords(coords.z));

            return true;
        },

        /**
         * @description
         * Get current vehicle of a ped
         *
         * @param ped Ped
         * @param isDriver If set to true, it will return false if the player is in the vehicle not as a driver.
         *
         * @example
         * ```ts
         * getCurrentVehicle(PlayerPedId(), false);
         * ```
         */
        getCurrentVehicle: (ped: number = PlayerPedId(), isDriver = false) => {
            if (!DoesEntityExist(ped) || !IsEntityAPed(ped)) {
                throw new Error("Entity given was not a ped!");
            }

            if (IsPedSittingInAnyVehicle(ped)) {
                const vehicle = GetVehiclePedIsIn(ped, false);

                if (!isDriver || (isDriver && GetPedInVehicleSeat(vehicle, -1) == ped)) {
                    return vehicle;
                }
            }

            return false;
        },
    };

    /**
     * @description
     * Only work for an active player
     */
    player = {
        /**
         * @description
         * Set a local player to disable collision.
         *
         * @param playerPed Player Ped
         *
         * @example
         * ```ts
         * setNoClip(PlayerPedId());
         * ```
         */
        setNoClip: async (speed = 2) => {
            const ped = PlayerPedId();
            const entity = IsPedInAnyVehicle(ped, false) ? GetVehiclePedIsUsing(ped) : ped;

            let camHeading = this.utils.game.getCamDirection();
            let { x, y, z, heading } = this.entity.getCoords(entity);

            // INPUT_MOVE_UP_ONLY (W)
            DisableControlAction(0, 32, true);
            if (IsDisabledControlPressed(0, 32)) {
                x = x + speed * camHeading.x;
                y = y + speed * camHeading.y;
                z = z + speed * camHeading.z;
            }

            // INPUT_MOVE_DOWN_ONLY (S)
            DisableControlAction(0, 33, true);
            if (IsDisabledControlPressed(0, 33)) {
                x = x - speed * camHeading.x;
                y = y - speed * camHeading.y;
                z = z - speed * camHeading.z;
            }

            // INPUT_MOVE_LEFT_ONLY (A)
            DisableControlAction(0, 34, true);
            if (IsDisabledControlPressed(0, 34)) heading += 3.0;

            // INPUT_MOVE_RIGHT_ONLY (D)
            DisableControlAction(0, 35, true);
            if (IsDisabledControlPressed(0, 35)) heading -= 3.0;

            // INPUT_COVER (Q)
            DisableControlAction(0, 44, true);
            if (IsDisabledControlPressed(0, 44)) z += 0.21 * (speed + 0.3);

            // INPUT_MULTIPLAYER_INFO (Z)
            DisableControlAction(0, 20, true);
            if (IsDisabledControlPressed(0, 20)) z -= 0.21 * (speed + 0.3);

            DisableControlAction(0, 268, true);
            DisableControlAction(0, 31, true);
            DisableControlAction(0, 269, true);
            DisableControlAction(0, 266, true);
            DisableControlAction(0, 30, true);
            DisableControlAction(0, 267, true);

            SetEntityVelocity(entity, 0.0, 0.0, 0.0);
            SetEntityRotation(entity, 0.0, 0.0, 0.0, 0, false);
            SetEntityCollision(entity, false, false);

            SetEntityHeading(entity, heading);
            SetEntityCoordsNoOffset(entity, x, y, z, true, true, true);

            await this.utils.game.drawInstructionalButtons([
                { controlType: 0, controlId: 32, message: "Move Forward" },
                { controlType: 0, controlId: 33, message: "Move Backward" },
                { controlType: 0, controlId: 34, message: "Rotate Left" },
                { controlType: 0, controlId: 35, message: "Rotate Right" },
                { controlType: 0, controlId: 44, message: "Fly Up" },
                { controlType: 0, controlId: 20, message: "Fly Down" },
            ]);

            return true;
        },

        /**
         * @description
         * Get Nearest player from a coords. Returning list of player ids if found.
         *
         * @param _coords Coordinates of the location to find the player
         *
         * @example
         * ```ts
         * getNearestOneIn({ 100, 300, 400, 5.0 });
         * ```
         */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getNearestOneIn: async (coords: { x: number; y: number; z: number; radius?: number }) => {
            // const players = await this.client.players.list();
            let playerList: any[] = [];

            // for (const player of players) {
            //     const playerId = GetPlayerFromServerId(player.server_id);
            //     const ped = GetPlayerPed(playerId);
            //     const playerCoords = this.entity.getCoords(ped);
            //     const distance = GetDistanceBetweenCoords(coords.x, coords.y, coords.z, playerCoords.x, playerCoords.y, playerCoords.z, true);

            //     if (distance <= (coords.radius || 5.0)) {
            //         playerList.push(player.server_id);
            //     }
            // }

            return playerList;
        },

        /**
         * @description
         * Get a closest player near an entity (Ped, Object, etc).
         *
         * @param entity Entity (Ped, Object, etc).
         *
         * @example
         * ```ts
         * getNearestOneFrom(PlayerPedId());
         * ```
         */
        getNearestOneFrom: (entity: number, radius: number) => {
            if (!DoesEntityExist(entity)) {
                throw new Error("Entity does not exist");
            }

            const { x, y, z } = this.entity.getCoords(entity);
            return this.player.getNearestOneIn({ x, y, z, radius });
        },
    };

    /**
     * @description
     * Only work with vehicles
     */
    vehicle = {
        /**
         * @description
         * Spawn a vehicle based on its model name
         *
         * @param model Vehicle Model Name
         * @param coords Coordinate of the location to spawn
         *
         * @example
         * ```ts
         * spawn('zentorno', { 1000, 5000, 500, 50 })
         * ```
         */
        spawn: async (model: string, coords: { x: number; y: number; z: number; heading?: number } = this.entity.getCoords()) => {
            const hash = GetHashKey(model);

            if (!IsModelInCdimage(hash) || !IsModelAVehicle(hash)) {
                throw new Error("Requested Model is Not Found!");
            }

            RequestModel(hash);
            while (!HasModelLoaded(hash)) {
                await this.utils.sleep(500);
            }

            const vehicle = CreateVehicle(hash, coords.x, coords.y, coords.z, coords.heading || 0, true, false);

            SetEntityAsNoLongerNeeded(vehicle);
            SetModelAsNoLongerNeeded(model);

            return true;
        },

        /**
         * @description
         * Delete vehicle
         *
         * @param vehicleEntityOrCoords Entity of the vehicle or the coordinate
         *
         * @example
         * ```ts
         * delete(1024);
         * ```
         */
        delete: (vehicle: number) => {
            if (!DoesEntityExist(vehicle) || !IsEntityAVehicle(vehicle)) {
                throw new Error("Vehicle does not exist!");
            }

            SetEntityAsMissionEntity(vehicle, true, true);
            DeleteVehicle(vehicle);

            return true;
        },

        /**
         * @description
         * Get a closest vehicle near a coordinate
         *
         * @param coords Coordinate of the location to find vehicle
         *
         * @example
         * ```ts
         * getNearestOneIn({ 1000, 5000, 300, 5.0 });
         * ```
         */
        getNearestOneIn: (coords: { x: number; y: number; z: number; radius?: number }) => {
            const vehicleFlags = [0, 2, 4, 6, 7, 23, 127, 260, 2146, 2175, 12294, 16384, 16386, 20503, 32768, 67590, 67711, 98309, 100359];

            for (const flag of vehicleFlags) {
                const vehicle = GetClosestVehicle(coords.x, coords.y, coords.z, coords.radius || 5.0, 0, flag);

                if (vehicle) return vehicle;
            }

            return false;
        },

        /**
         * @description
         * Get a closest vehicle near an entity (Ped, Object, etc).
         *
         * @param entity Entity (Ped, Object, etc).
         *
         * @example
         * ```ts
         * getNearestOneFrom(PlayerPedId());
         * ```
         */
        getNearestOneFrom: (entity: number, radius?: number) => {
            if (!DoesEntityExist(entity)) {
                throw new Error("Entity does not exist");
            }

            const { x, y, z } = this.entity.getCoords(entity);
            return this.vehicle.getNearestOneIn({ x, y, z, radius });
        },
    };
}
