global = global as any;

class Module {
    client: Koi["Server"];

    constructor(client) {
        this.client = client;

        // TriggerClientEvent('character:open', source, {'features', 'style', 'apparel'})
        // TriggerClientEvent('character:open', source, {'features'})
        // TriggerClientEvent('character:open', source, {'style'})
        // TriggerClientEvent('character:open', source, {'apparel'})

        this.client.addSharedEventHandler("character:save", this.saveCharacter);
        this.client.addSharedEventHandler("character:requestPlayerData", this.requestCharacterData);
        this.client.addSharedEventHandler("character:updateCharacterLocation", this.updateCharacterLocation);
        this.client.addServerEventHandler("playerDropped", () => this.client.triggerSharedEvent("character:playerLeft", global.source));

        this.client.registerCommand("fakedrop", (src) => this.client.triggerServerEvent("playerDropped", src, "testing"));
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

    updateCharacterLocation = async (coords) => {
        const playerId = global.source;

        const currCharId: any = await this.getActiveCharacterId(playerId);
        const char = await this.getCharacter(currCharId);

        return await this.client.db("characters").update({
            data: {
                last_position: coords,
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
            const charCoords = char.last_position.split(",");
            this.client.triggerSharedEvent("KOI::CLIENT::TeleportPlayer", playerId, charCoords[0], charCoords[1], charCoords[2]);
        }

        if (char && char.skin) {
            playerData.skin = JSON.parse(char.skin);
            playerData.newPlayer = false;
        }

        this.client.triggerSharedEvent("character:recievePlayerData", playerId, playerData);
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

const _handler = (client) => new Module(client);
export { _handler };
