import Client from "@client/index";

class Module {
    client: Client;

    constructor(client: Client) {
        this.client = client;

        this.client.utils.map.blip.add({
            title: "Test",
            colour: 32,
            iconId: 108,
            location: {
                x: -1789.56982421875,
                y: -812.4180908203125,
                z: 7.168194770812988,
            },
        });

        FreezeEntityPosition(PlayerPedId(), false);

        this.client.registerCommand("clear", () => this.client.triggerClientEvent("chat:clear"));

        this.client.registerCommand("myid", (src) => this.client.utils.notify(GetPlayerServerId(src), GetPlayerFromServerId(GetPlayerServerId(src)), GetActivePlayers()));
        this.client.registerCommand("mycoords", (src) => this.client.utils.notify("Your Coordinates is:", this.client.game.player.getCoords(src)));

        this.client.registerCommand("revive", (src, args) => this.client.game.player.revive(args[0] || src), {
            description: "Revive a player",
            cooldown: 5000,
            requirements: {
                userIDs: ["76561198290395137"],
            },
        });

        this.client.registerCommand("kill", (src, args) => this.client.game.player.kill(args[0] || src), {
            description: "Kill a player",
        });

        this.client.registerCommand("track", (src, args) => this.client.game.player.track(args[0] || src), {
            description: "Put a map blip on player",
        });

        this.client.registerCommand("invisible", (src, args) => this.client.game.player.invisible(args[0] || src), {
            description: "Make yourself invisible",
        });

        this.client.registerCommand("car", (src, args) => this.client.game.vehicle.spawn(src, args[0]), {
            description: "Spawn a car",
        });

        this.client.registerCommand("dv", this.client.game.vehicle.delete, {
            description: "Remove a car",
        });

        this.client.registerCommand("tpm", (src) => this.client.game.player.teleport.marker(src), {
            description: "Teleport to map marker destination",
        });

        this.client.registerCommand("tp", (src, args) => this.client.game.player.teleport.coordinates(src, args[0], args[1], args[2]), {
            description: "Teleport to location",
            argsRequired: 3,
            argsDescription: [
                { name: "x", help: "(x) axis coordinates" },
                { name: "y", help: "(y) axis coordinates" },
                { name: "z", help: "(z) axis coordinates" },
            ],
        });
    }
}

const _handler = (client) => new Module(client);
export { _handler };
