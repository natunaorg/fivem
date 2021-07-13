import Client from "@client/index";

class Module {
    client: Client;

    constructor(client: Client) {
        this.client = client;
        this.client.triggerSharedEvent("character:server:requestCharacterData");
        this.client.addSharedEventHandler("character:client:teleportPlayer", (x: number, y: number, z: number) => this.client.game.player.teleport.coordinates(GetPlayerServerId(PlayerId()), x, y, z));
    }
}

const _handler = (client: Client) => new Module(client);
export { _handler };
