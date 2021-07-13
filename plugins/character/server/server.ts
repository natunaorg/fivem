import Server from "@server/index";

class Module {
    client: Server;
    charactersData: any;

    constructor(client, config) {
        this.client = client;
        this.charactersData = {};

        // TriggerClientEvent('character:open', source, {'features', 'style', 'apparel'})
        // TriggerClientEvent('character:open', source, {'features'})
        // TriggerClientEvent('character:open', source, {'style'})
        // TriggerClientEvent('character:open', source, {'apparel'})

        this.client.addSharedEventHandler("character:server:requestCharacterData", this.requestCharacterData);
    }

    requestCharacterData = async () => {
        const playerId = (global as any).source;
        const playerData = {
            skin: null,
            newPlayer: true,
        };

        const user = this.client.players.get(playerId);
        if (!user) return;

        const char = user.character;

        if (char.last_position && char.last_position) {
            const coords = char.last_position;
            this.client.triggerSharedEvent("character:client:teleportPlayer", playerId, coords.x, coords.y, coords.z);
        }

        if (char && char.skin) {
            playerData.skin = JSON.parse(char.skin);
            playerData.newPlayer = false;
        }

        this.client.triggerSharedEvent("character:recievePlayerData", +playerId, playerData);
        return true;
    };
}

const _handler = (client, config) => new Module(client, config);
export { _handler };
