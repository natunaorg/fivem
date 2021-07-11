import Server from "@server/main";

global = global as any;

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

        this.client.addSharedEventHandler("character:save", this.saveCharacter);
        this.client.addSharedEventHandler("character:server:requestCharacterData", this.requestCharacterData);
        this.client.addSharedEventHandler("character:server:updateCharacterData", this.updateCharacterData);
        // this.client.addServerEventHandler("playerDropped", () => this.client.triggerSharedEvent("character:playerLeft", global.source));
    }

    getActiveCharacterId = async (playerId) => {
        const playerIds = this.client.getPlayerIds(playerId);
        const user = await this.client.db("users").findFirst({
            where: {
                id: playerIds.steam,
            },
        });

        return user.active_character_id;
    };

    getCharacter = async (id) => {
        const char = await this.client.db("characters").findFirst({
            where: {
                id,
            },
        });

        return char;
    };

    updateCharacterData = async (data) => {
        const playerId = global.source;

        const currCharId: any = await this.getActiveCharacterId(playerId);
        const char = await this.getCharacter(currCharId);

        return await this.client.db("characters").update({
            data: {
                last_position: data.location,
            },
            where: {
                id: char.id,
            },
        });
    };

    requestCharacterData = async () => {
        const playerId = global.source;
        const playerData = {
            skin: null,
            newPlayer: true,
        };

        const currCharId: any = await this.getActiveCharacterId(playerId);
        const char = await this.getCharacter(currCharId);

        if (char.last_position) {
            const coords = char.last_position.split(",");
            this.client.executeCommand("tp", parseInt(playerId), [+coords[0], +coords[1], +coords[2]], false);
        }

        if (char && char.skin) {
            playerData.skin = JSON.parse(char.skin);
            playerData.newPlayer = false;
        }

        this.client.triggerSharedEvent("character:recievePlayerData", +playerId, playerData);
        return true;
    };

    saveCharacter = async (data) => {
        const playerId = global.source;

        const currCharId: any = await this.getActiveCharacterId(playerId);
        const char = await this.getCharacter(currCharId);

        const skin = JSON.stringify(data);

        return await this.client.db("characters").update({
            data: {
                skin,
            },
            where: {
                id: char.id,
            },
        });
    };
}

const _handler = (client, config) => new Module(client, config);
export { _handler };
