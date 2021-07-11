import Client from "@client/main";

class Wrapper {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Basically optimizing texture and things in GTA, the function consists of:
     * 1. ClearAllBrokenGlass()
     * 2. ClearAllHelpMessages()
     * 3. LeaderboardsReadClearAll()
     * 4. ClearBrief();
     * 5. ClearGpsFlags();
     * 6. ClearPrints();
     * 7. ClearSmallPrints();
     * 8. ClearReplayStats();
     * 9. LeaderboardsClearCacheData();
     * 10. ClearFocus();
     * 11. ClearHdArea();
     * 12. ClearPedBloodDamage();
     * 13. ClearPedWetness();
     * 14. ClearPedEnvDirt();
     * 15. ResetPedVisibleDamage();
     * @author Rafly Maulana
     * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
     *
     * @example
     * game.optimizeFPS(1);
     */
    optimizeFPS = (playerServerId: number) => {
        const playerId = GetPlayerFromServerId(playerServerId);
        let ped = GetPlayerPed(playerId);

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
     * Disable dispatch radio after committing a crime (Example: Police Radio)
     * @author Rafly Maulana
     * @source https://forum.cfx.re/t/release-disable-all-emergency-service-and-military-dispatching/23823
     */
    setNoDispatchService = () => {
        for (let i = 0; i < 15; i++) {
            EnableDispatchService(i, false);
        }
    };

    /**
     * Disable wanted level, so you'd not be chasen by police even after you committing a crime
     * @author Rafly Maulana
     * @source https://forum.cfx.re/t/release-disable-wanted-level/2855
     */
    setNoWantedLevel = () => {
        if (GetPlayerWantedLevel(PlayerId()) != 0) {
            SetPlayerWantedLevel(PlayerId(), 0, false);
            SetPlayerWantedLevelNow(PlayerId(), false);
        }
    };

    /**
     * List of player related functions
     */
    player = {
        /**
         * Whether the player was still invisible or not
         */
        isInvisible: false,

        /**
         * Whether the player was still on god mode or not
         */
        isGodMode: false,

        /**
         * Revive a player
         * @author Rafly Maulana
         * @source Modified from https://github.com/TheStonedTurtle/FiveM-RPDeath
         *
         * @example
         * game.player.revive(1)
         */
        revive: async (playerServerId: number) => {
            let ped = GetPlayerPed(GetPlayerFromServerId(playerServerId));
            let playerPos = GetEntityCoords(ped, true);

            NetworkResurrectLocalPlayer(playerPos[0], playerPos[1], playerPos[2], 0, true, false);
            SetPlayerInvincible(ped, false);
            ClearPedBloodDamage(ped);

            return true;
        },

        /**
         * Kill a player
         * @author Rafly Maulana
         * @source https://runtime.fivem.net/doc/natives/?_0x6B76DC1F3AE6E6A3
         *
         * @example
         * game.player.kill(1)
         */
        kill: (playerServerId: number) => {
            SetEntityHealth(GetPlayerPed(GetPlayerFromServerId(playerServerId)), 0);

            return true;
        },

        /**
         * Put a map blips on player and updates on every tick
         * @author Rafly Maulana
         * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
         *
         * @example
         * game.player.track(1)
         */
        track: (playerServerId: number) => {
            let coords = GetEntityCoords(GetPlayerPed(GetPlayerFromServerId(playerServerId)), true);
            SetNewWaypoint(coords[0], coords[1]);

            return true;
        },

        /**
         * Set a player invisible to eyes for another players
         * @author Rafly Maulana
         * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
         *
         * @example
         * game.player.invisible(1)
         */
        invisible: (playerServerId: number) => {
            this.player.isInvisible = !this.player.isInvisible;
            SetEntityVisible(GetPlayerPed(GetPlayerFromServerId(playerServerId)), this.player.isInvisible, false);

            return true;
        },

        /**
         * Set a player to become superhero
         * @author Rafly Maulana
         * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
         *
         * @example
         * game.player.godMode(1, true)
         */
        noClip: (playerServerId: number) => {
            let ped = GetPlayerPed(GetPlayerFromServerId(playerServerId));
            let entity = (IsPedInAnyVehicle(ped, false) && GetVehiclePedIsUsing(ped)) || ped;
            let currentSpeed = 2;
            let noclipEntity = (IsPedInAnyVehicle(ped, false) && GetVehiclePedIsUsing(ped)) || ped;
            let newPos = GetEntityCoords(entity, true);

            this.client.utils.drawText("NOCLIP ~g~ON", 0.7, 0.9);

            DisableControlAction(0, 32, true);
            DisableControlAction(0, 268, true);

            DisableControlAction(0, 31, true);

            DisableControlAction(0, 269, true);
            DisableControlAction(0, 33, true);

            DisableControlAction(0, 266, true);
            DisableControlAction(0, 34, true);

            DisableControlAction(0, 30, true);

            DisableControlAction(0, 267, true);
            DisableControlAction(0, 35, true);

            DisableControlAction(0, 44, true);
            DisableControlAction(0, 20, true);

            var yoff = 0.0;
            var zoff = 0.0;

            if (IsDisabledControlPressed(0, 32)) yoff = 0.5;
            if (IsDisabledControlPressed(0, 33)) yoff = -0.5;
            if (IsDisabledControlPressed(0, 34)) SetEntityHeading(ped, GetEntityHeading(ped) + 3.0);
            if (IsDisabledControlPressed(0, 35)) SetEntityHeading(ped, GetEntityHeading(ped) - 3.0);
            if (IsDisabledControlPressed(0, 44)) zoff = 0.21;
            if (IsDisabledControlPressed(0, 20)) zoff = -0.21;

            newPos = GetOffsetFromEntityInWorldCoords(noclipEntity, 0.0, yoff * (currentSpeed + 0.3), zoff * (currentSpeed + 0.3));

            var heading = GetEntityHeading(noclipEntity);
            SetEntityVelocity(noclipEntity, 0.0, 0.0, 0.0);
            SetEntityRotation(noclipEntity, 0.0, 0.0, 0.0, 0, false);
            SetEntityHeading(noclipEntity, heading);

            SetEntityCollision(noclipEntity, false, false);
            SetEntityCoordsNoOffset(noclipEntity, newPos[0], newPos[1], newPos[2], true, true, true);

            SetEntityCollision(noclipEntity, true, true);

            return true;
        },

        /**
         * Set a player to become unbeatable
         * @author Rafly Maulana
         * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
         *
         * @example
         * game.player.godMode(1, true)
         */
        godMode: (playerServerId: number) => {
            const playerId = GetPlayerFromServerId(playerServerId);
            this.player.isGodMode = !this.player.isGodMode;

            SetPlayerInvincible(playerId, this.player.isGodMode);
            SetEntityInvincible(GetPlayerPed(playerId), this.player.isGodMode);

            return true;
        },

        /**
         * Give a full armour to a player
         * @author Rafly Maulana
         * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
         *
         * @example
         * game.player.giveFullArmour(1)
         */
        giveFullArmour: (playerServerId: number) => {
            const playerId = GetPlayerFromServerId(playerServerId);
            SetPedArmour(GetPlayerPed(playerId), 100);

            return true;
        },

        /**
         * Get coordinates of a player
         * @author Rafly Maulana
         * @source https://runtime.fivem.net/doc/natives/?_0x1647F1CB
         *
         * @example
         * game.player.getCoords(1)
         */
        getCoords: (playerServerId: number) => {
            const playerId = GetPlayerFromServerId(playerServerId);
            const [x, y, z] = GetEntityCoords(GetPlayerPed(playerId), true);
            return { x, y, z };
        },

        /**
         * List of player teleportation functions
         */
        teleport: {
            /**
             * Teleport to a marker set on the map
             * @author Rafly Maulana
             * @source Modified From https://github.com/qalle-git/esx_marker
             *
             * @example
             * game.player.teleport.marker(1)
             */
            marker: async (playerServerId: number) => {
                const playerId = GetPlayerFromServerId(playerServerId);
                let waypoint = GetFirstBlipInfoId(8);

                if (!DoesBlipExist(waypoint)) {
                    return "Blip Doesn't Exist";
                }

                let coords = GetBlipInfoIdCoord(waypoint);

                for (let height = 1; height <= 1000; height++) {
                    let [, groundZ] = GetGroundZFor_3dCoord(coords[0], coords[1], height, false);

                    SetPedCoordsKeepVehicle(GetPlayerPed(playerId), coords[0], coords[1], height);

                    await this.client.wait(5);
                    if (groundZ) return true;
                }

                return false;
            },

            /**
             * Teleport to a coordinates
             * @author Rafly Maulana
             * @source https://runtime.fivem.net/doc/natives/?_0x9AFEFF481A85AB2E
             *
             * @example
             * game.player.teleport.coordinates(1, 10, 20, 30)
             */
            coordinates: async (playerServerId: number, x: number, y: number, z: number) => {
                const playerId = GetPlayerFromServerId(playerServerId);
                SetPedCoordsKeepVehicle(GetPlayerPed(playerId), x, y, z);

                return true;
            },
        },
    };

    vehicle = {
        /**
         * Spawn a vehicle based on its model name
         * @author Rafly Maulana
         * @source https://docs.fivem.net/docs/scripting-manual/runtimes/javascript/
         *
         * @example
         * game.vehicle.spawn(1, 'zentorno');
         */
        spawn: async (playerServerId: number, model: string = "adder") => {
            const playerId = GetPlayerFromServerId(playerServerId);
            let hash = GetHashKey(model);

            if (!IsModelInCdimage(hash) || !IsModelAVehicle(hash)) {
                return this.client.utils.notify("Requested Model is Not Found!");
            }

            RequestModel(hash);
            while (!HasModelLoaded(hash)) {
                await this.client.wait(500);
            }

            let ped = GetPlayerPed(playerId);
            let coords = GetEntityCoords(ped, true);
            let vehicle = CreateVehicle(hash, coords[0], coords[1], coords[2], GetEntityHeading(ped), true, false);

            SetPedIntoVehicle(ped, vehicle, -1);
            SetEntityAsNoLongerNeeded(vehicle);
            SetModelAsNoLongerNeeded(model);

            return true;
        },

        /**
         * Delete nearest vehicle / vehicle being ridden from player
         * @author Rafly Maulana
         * @source Modified from https://forum.cfx.re/t/release-delete-vehicle-script-v1-1-0-updated-2020/7727/53
         *
         * @example
         * game.vehicle.delete(1)
         */
        delete: async (playerServerId: number) => {
            const playerId = GetPlayerFromServerId(playerServerId);
            let ped = GetPlayerPed(playerId);

            const DeleteGivenVehicle = async (veh: number, timeoutMax: number) => {
                let timeout = 0;

                SetEntityAsMissionEntity(veh, true, true);
                DeleteVehicle(veh);

                if (DoesEntityExist(veh)) {
                    while (DoesEntityExist(veh) && timeout < timeoutMax) {
                        DeleteVehicle(veh);

                        if (!DoesEntityExist(veh)) {
                            return "Vehicle deleted.";
                        }

                        timeout += 1;
                        await this.client.wait(500);

                        if (DoesEntityExist(veh) && timeout == timeoutMax - 1) {
                            return `Failed to delete vehicle after ${timeoutMax} retries.`;
                        }
                    }
                }
            };

            if (DoesEntityExist(ped) && !IsEntityDead(ped)) {
                let vehicle: number;
                if (IsPedSittingInAnyVehicle(ped)) {
                    vehicle = GetVehiclePedIsIn(ped, false);

                    if (GetPedInVehicleSeat(vehicle, -1) !== ped) {
                        return "You must be in the driver's seat!";
                    }
                } else {
                    vehicle = this.vehicle.getClosestOne(playerId);
                }

                DeleteGivenVehicle(vehicle, 0);
            }

            return true;
        },

        /**
         * Ensure the character in vehicle would not be throwed outside when crashing (Only works at car)
         * @author Rafly Maulana
         * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
         *
         * @example
         * game.vehicle.seatbelt(1, true)
         */
        seatbelt: async (playerServerId: number, toggle: 0 | 1 | boolean) => {
            const playerId = GetPlayerFromServerId(playerServerId);
            toggle = !toggle ? 0 : 1;
            SetPedCanBeKnockedOffVehicle(GetPlayerPed(playerId), toggle);

            return true;
        },

        /**
         * Clean a dirty vehicle
         * @author Rafly Maulana
         * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
         *
         * @example
         * game.vehicle.clean(1)
         */
        clean: (playerServerId: number) => {
            const playerId = GetPlayerFromServerId(playerServerId);
            SetVehicleDirtLevel(GetVehiclePedIsUsing(GetPlayerPed(playerId)), 1.0);

            return true;
        },

        /**
         * Set a vehicle to dirty
         * @author Rafly Maulana
         * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
         *
         * @example
         * game.vehicle.dirty(1)
         */
        dirty: (playerServerId: number) => {
            const playerId = GetPlayerFromServerId(playerServerId);
            SetVehicleDirtLevel(GetVehiclePedIsUsing(GetPlayerPed(playerId)), 15.0);

            return true;
        },

        /**
         * Repair only vehicle engine (Doesn't include body kit)
         * @author Rafly Maulana
         * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
         *
         * @example
         * game.vehicle.repairEngine(1)
         */
        repairEngine: (playerServerId: number) => {
            const playerId = GetPlayerFromServerId(playerServerId);
            let ped = GetPlayerPed(playerId);
            let vehicle = GetVehiclePedIsUsing(ped);

            SetVehicleEngineHealth(vehicle, 1000);
            SetVehicleEngineOn(vehicle, true, true, true);

            return true;
        },

        /**
         * Repair the body of the vehicle
         * @author Rafly Maulana
         * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
         *
         * @example
         * game.vehicle.repairBody(1)
         */
        repairBody: (playerServerId: number) => {
            const playerId = GetPlayerFromServerId(playerServerId);
            let ped = GetPlayerPed(playerId);
            let vehicle = GetVehiclePedIsUsing(ped);

            SetVehicleFixed(vehicle);
            SetVehicleDirtLevel(vehicle, 0.0);
            SetVehicleLights(vehicle, 0);
            SetVehicleBurnout(vehicle, false);
            SetVehicleUndriveable(vehicle, false);

            return true;
        },

        /**
         * Get a closest vehicle near a player
         * @author Rafly Maulana
         * @source https://runtime.fivem.net/doc/natives/?_0xF73EB622C4F1689B
         *
         * @example
         * game.vehicle.getClosestOne(1)
         */
        getClosestOne: (playerServerId: number) => {
            const playerId = GetPlayerFromServerId(playerServerId);
            let pos = GetEntityCoords(GetPlayerPed(playerId), true);
            let flags = [0, 2, 4, 6, 7, 23, 127, 260, 2146, 2175, 12294, 16384, 16386, 20503, 32768, 67590, 67711, 98309, 100359];

            for (const flag of flags) {
                let vehicle = GetClosestVehicle(pos[0], pos[1], pos[2], 5.001, 0, flag);
                if (vehicle) return vehicle;
            }

            return 0;
        },
    };
}

export default Wrapper;
export { Wrapper };
