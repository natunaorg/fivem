import Client from "@client/main";

class Module {
    client: Client;

    constructor(client, config) {
        this.client = client;

        this.client.addClientEventHandler("playerSpawned", () => this.client.triggerSharedEvent("character:requestPlayerData"));
        this.client.addClientEventHandler(["baseevents:onPlayerKilled", "baseevents:onPlayerDied"], this.updateCharacterData);

        this.client.triggerSharedEvent("character:server:requestCharacterData");

        setInterval(() => {
            this.updateCharacterData();
        }, config.savePlayerDataTemporaryInterval);
    }

    updateCharacterData = () => {
        this.client.triggerSharedEvent("character:server:updateCharacterData", {
            location: String(this.client.game.player.getCoords(PlayerId())),
            health: GetEntityHealth(PlayerPedId()),
            armour: GetPedArmour(PlayerPedId()),
        });
    };
}

const _handler = (client, config) => new Module(client, config);
export { _handler };
