import Client from "@client/index";

class Module {
    client: Client;

    constructor(client: Client) {
        this.client = client;

        this.client.utils.mapBlip.create({
            title: "Restaurant - Pizzeria Pizza",
            colour: 17,
            iconId: 439,
            location: {
                x: -570.8175048828125,
                y: -406.73101806640625,
                z: 34.91706085205078,
            },
        });

        this.client.utils.mapBlip.create({
            title: "Restaurant - In-N-Out Burger",
            colour: 17,
            iconId: 439,
            location: {
                x: 83.6671142578125,
                y: 283.697998046875,
                z: 110.20936584472656,
            },
        });

        this.client.utils.mapBlip.create({
            title: "Car Dealer - Benefactor Dealership",
            colour: 38,
            iconId: 524,
            location: {
                x: -62.107479095458984,
                y: 69.74378967285156,
                z: 71.83417510986328,
            },
        });

        this.client.utils.mapBlip.create({
            title: "Medical - Pillbox Hospital",
            colour: 11,
            iconId: 61,
            location: {
                x: 310.5168151855469,
                y: -591.2456665039062,
                z: 43.29185485839844,
            },
        });

        this.client.utils.mapBlip.create({
            title: "Police Department - Mission Row Police HQ",
            colour: 5,
            iconId: 60,
            location: {
                x: 441.4054870605469,
                y: -983.2197875976562,
                z: 30.689332962036133,
            },
        });

        this.client.utils.mapBlip.create({
            title: "Mechanic - Bennys Original Motorworks",
            colour: 1,
            iconId: 402,
            location: {
                x: -203.0621795654297,
                y: -1322.5848388671875,
                z: 30.50128746032715,
            },
        });

        this.client.registerCommand("cc", () => {
            var cam = CreateCam("DEFAULT_SCRIPTED_CAMERA", true);

            let [cx, cy, cz] = GetOffsetFromEntityInWorldCoords(PlayerPedId(), 0.0, 0.5, 0);
            const { x, y, z } = this.client.game.entity.getCoords(PlayerPedId());

            SetCamCoord(cam, cx, cy, cz + 0.65);
            PointCamAtCoord(cam, x, y, z + 0.65);

            SetCamActive(cam, true);
            RenderScriptCams(true, true, 500, true, true);
        });

        this.client.registerCommand("optimize", (src) => {
            this.client.game.optimizeFPS(PlayerPedId());
        });

        this.client.registerCommand("clear", () => {
            this.client.triggerClientEvent("chat:clear");
        });

        this.client.registerCommand("myid", (src) => {
            this.client.utils.createFeedNotification(String(src));
        });

        this.client.registerCommand("spawn", (src, args) => {
            (global as any).exports.spawnmanager.spawnPlayer(
                {
                    x: 686.245,
                    y: 577.95,
                    z: 130.461,
                    model: "a_m_m_skater_01",
                },
                () => {
                    emit("chat:addMessage", {
                        args: ["Hi, there!"],
                    });
                }
            );
        });

        let isOnNoclip: number | boolean = false;
        this.client.registerCommand(
            "noclip",
            (src, args) => {
                const speed = args[0] ? parseInt(args[0]) : 1;

                if (isOnNoclip === false) {
                    return (isOnNoclip = setTick(async () => {
                        await this.client.game.player.setNoClip(speed);
                    }));
                } else if (typeof isOnNoclip === "number") {
                    clearTick(isOnNoclip);
                    SetEntityCollision(PlayerPedId(), true, true);

                    return (isOnNoclip = false);
                }
            },
            {
                description: "Disable collision on any object",
                argsDescription: [{ name: "speed", help: "Speed of the noclip" }],
            }
        );

        this.client.registerCommand(
            "mycoords",
            (src, args) => {
                const coords = Object.values(this.client.game.entity.getCoords(PlayerPedId())).toString();

                this.client.utils.createFeedNotification(`Your Coordinates is: ${coords}`);

                if (args[0] && args[0] === "--copy") {
                    this.client.triggerNUIEvent("copytext", {
                        text: coords,
                    });
                }
            },
            {
                description: "Get current coordinate",
            }
        );

        this.client.registerCommand(
            "revive",
            (src, args) => {
                const ped = PlayerPedId();
                const { x, y, z, heading } = this.client.game.entity.getCoords(ped);

                SetEntityCoordsNoOffset(ped, x, y, z, false, false, false);
                NetworkResurrectLocalPlayer(x, y, z, heading, true, false);
                SetPlayerInvincible(ped, false);
                ClearPedBloodDamage(ped);
            },
            {
                description: "Revive a player",
                cooldown: 5000,
                requirements: {},
            }
        );

        this.client.registerCommand(
            "kill",
            (src, args) => {
                SetEntityHealth(PlayerPedId(), 0);
            },
            {
                description: "Kill a player",
                requirements: {},
            }
        );

        this.client.registerCommand(
            "car",
            (src, args) => {
                this.client.game.vehicle.spawn(args[0], this.client.game.entity.getCoords(PlayerPedId()));
            },
            {
                description: "Spawn a car",
                argsRequired: 1,
                requirements: {},
            }
        );

        this.client.registerCommand(
            "dv",
            async (src, args) => {
                const ped = PlayerPedId();
                const radius = +args[0];
                const loop = +args[1] || 1;

                try {
                    for (let i = 0; i <= loop; i++) {
                        const vehicle = this.client.game.ped.getCurrentVehicle(ped, true) || this.client.game.vehicle.getNearestOneFrom(ped, radius || 5.0);

                        if (vehicle) {
                            this.client.game.vehicle.delete(vehicle);
                        }

                        await this.client.wait(500);
                    }
                } catch (error) {
                    return this.client.utils.createFeedNotification(error);
                }
            },
            {
                description: "Remove a car",
                argsDescription: [
                    { name: "radius", help: "Radius to delete the vehicle" },
                    { name: "size", help: "Number to delete the vehicle" },
                ],
            }
        );

        this.client.registerCommand(
            "tpm",
            (src, args) => {
                this.client.game.ped.teleportToMarker(GetPlayerPed(args[0]) || PlayerPedId());
            },
            {
                description: "Teleport to map marker destination",
            }
        );

        this.client.registerCommand(
            "tp",
            (src, args) => {
                this.client.game.ped.teleportToCoordinates(PlayerPedId(), {
                    x: args[0],
                    y: args[1],
                    z: args[2],
                });
            },
            {
                description: "Teleport to location",
                argsRequired: 3,
                argsDescription: [
                    { name: "x", help: "(x) axis coordinates" },
                    { name: "y", help: "(y) axis coordinates" },
                    { name: "z", help: "(z) axis coordinates" },
                ],
            }
        );
    }
}

const _handler = (client: Client) => new Module(client);
export { _handler };
