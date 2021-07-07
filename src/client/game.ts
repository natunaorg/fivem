class Game {
    client: KoiClientInterface;

    constructor(client: any) {
        this.client = client;
    }

    optimizeFPS = (playerId: number) => {
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

    onTickRateOptions = {
        noDispatchService: () => {
            for (let i = 0; i < 15; i++) {
                EnableDispatchService(i, false);
            }
        },

        noWantedLevel: () => {
            if (GetPlayerWantedLevel(PlayerId()) != 0) {
                SetPlayerWantedLevel(PlayerId(), 0, false);
                SetPlayerWantedLevelNow(PlayerId(), false);
            }
        },

        noClip: (playerId: number) => {
            let ped = GetPlayerPed(playerId);
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
    };

    player = {
        isInvisible: false,
        isGodMode: false,
        revive: async (playerId: number) => {
            let ped = GetPlayerPed(playerId);
            let playerPos = GetEntityCoords(ped, true);

            NetworkResurrectLocalPlayer(playerPos[0], playerPos[1], playerPos[2], 0, true, false);
            SetPlayerInvincible(ped, false);
            ClearPedBloodDamage(ped);

            return true;
        },
        kill: (playerId: number) => {
            SetEntityHealth(GetPlayerPed(playerId), 0);

            return true;
        },
        track: (playerId: number) => {
            let coords = GetEntityCoords(GetPlayerPed(playerId), true);
            SetNewWaypoint(coords[0], coords[1]);

            return true;
        },
        invisible: (playerId: number) => {
            this.player.isInvisible = !this.player.isInvisible;
            SetEntityVisible(GetPlayerPed(playerId), this.player.isInvisible, false);

            return true;
        },
        godMode: (playerId: number) => {
            this.player.isGodMode = !this.player.isGodMode;

            SetPlayerInvincible(playerId, this.player.isGodMode);
            SetEntityInvincible(GetPlayerPed(playerId), this.player.isGodMode);

            return true;
        },
        giveFullArmour: (playerId: number) => {
            SetPedArmour(GetPlayerPed(playerId), 100);

            return true;
        },
        getCoords: (playerId: number) => {
            return GetEntityCoords(GetPlayerPed(playerId), true);
        },
        teleport: {
            marker: async (playerId: number) => {
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
            coordinates: async (playerId: number, x: number, y: number, z: number) => {
                SetPedCoordsKeepVehicle(GetPlayerPed(playerId), x, y, z);

                return true;
            },
        },
    };

    vehicle = {
        spawn: async (playerId: number, model: string = "adder") => {
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
        delete: async (playerId: number) => {
            let ped = GetPlayerPed(playerId);

            const DeleteGivenVehicle = async (veh, timeoutMax) => {
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
                let vehicle;
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
        seatbelt: async (playerId: number, toggle: 0 | 1 | boolean) => {
            toggle = !toggle ? 0 : 1;
            SetPedCanBeKnockedOffVehicle(GetPlayerPed(playerId), toggle);

            return true;
        },
        clean: (playerId: number) => {
            SetVehicleDirtLevel(GetVehiclePedIsUsing(GetPlayerPed(playerId)), 1.0);

            return true;
        },
        dirty: (playerId: number) => {
            SetVehicleDirtLevel(GetVehiclePedIsUsing(GetPlayerPed(playerId)), 15.0);

            return true;
        },
        repairEngine: (playerId: number) => {
            let ped = GetPlayerPed(playerId);
            let vehicle = GetVehiclePedIsUsing(ped);

            SetVehicleEngineHealth(vehicle, 1000);
            SetVehicleEngineOn(vehicle, true, true, true);

            return true;
        },
        repairVehicle: (playerId: number) => {
            let ped = GetPlayerPed(playerId);
            let vehicle = GetVehiclePedIsUsing(ped);

            SetVehicleFixed(vehicle);
            SetVehicleDirtLevel(vehicle, 0.0);
            SetVehicleLights(vehicle, 0);
            SetVehicleBurnout(vehicle, false);
            SetVehicleUndriveable(vehicle, false);

            return true;
        },
        getClosestOne: (playerId: number) => {
            let pos = GetEntityCoords(GetPlayerPed(playerId), true);
            let flags = [0, 2, 4, 6, 7, 23, 127, 260, 2146, 2175, 12294, 16384, 16386, 20503, 32768, 67590, 67711, 98309, 100359];

            for (const flag of flags) {
                let vehicle = GetClosestVehicle(pos[0], pos[1], pos[2], 5.001, 0, flag);
                if (vehicle) return vehicle;
            }

            return false;
        },
    };
}

export default Game;
