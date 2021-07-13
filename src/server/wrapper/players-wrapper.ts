import Server from "@server/index";

interface Character {
    id?: number;
    first_name?: string;
    last_name?: string;
    last_position?: {
        x: number;
        y: number;
        z: number;
        heading: number;
    };
    skin?: any;
    health?: number;
    armour?: number;
    is_dead?: boolean;
}

interface Player {
    id?: string;
    updated_at?: number;
    character: Character;
}

class Wrapper {
    lists: Array<string>;
    client: Server;
    config: any;

    constructor(client: Server, config: any) {
        this.client = client;
        this.lists = [];
        this.config = config.core.players;

        this.client.addSharedCallbackEventHandler("koi:server:getPlayerData", this.get);
        this.client.addSharedCallbackEventHandler("koi:server:updatePlayerData", this.update);

        this.client.addServerEventHandler("playerJoining", () => this._add((global as any).source));
        this.client.addServerEventHandler("playerDropped", this._events.playerDropped);

        setInterval(this._intervals.dataUpdateInterval, this.config.saveDataToDatabaseInterval);
    }

    /**
     * Received current data of a player
     * @author Rafly Maulana
     *
     * @example
     * get(1) // Server ID
     * get("76561198290395137") // Steam ID
     */
    get = (id: number | string) => {
        if (typeof id !== "string") id = this.utils.getIdentifiers(id).steam.toString();

        for (const rawData of this.lists) {
            const data = JSON.parse(rawData);
            if (data.id === id) return data;
        }

        return false;
    };

    /**
     * Update current data of a player
     * @author Rafly Maulana
     *
     * @example
     * update(1, {
     *      character: {
     *          last_position: {
     *              x: 1,
     *              y: 1,
     *              z: 1,
     *              heading: 1
     *          }
     *      }
     * })
     */
    update = async (id: number | string, newData: Player) => {
        let currentData = this.get(id);

        if (currentData) this._delete(id);
        if (!currentData) currentData = await this._add(currentData.id);

        const data = {
            ...currentData, // Copy From Origin
            ...newData, // Overwrites any differences
            is_dead: newData.character.health == 0 ? true : false,
            updated_at: Date.now(),
            character: {
                ...currentData.character,
                ...newData.character,
            },
        };

        this.lists.push(JSON.stringify(data));
        return data;
    };

    /**
     * Add a new player data when playerJoining event received.
     * [IMPORTANT] This function shouldn't be used since it was called automatically by this script
     * @author Rafly Maulana
     */
    _add = async (src: number) => {
        if (this.get(src)) return;

        const identifiers = this.utils.getIdentifiers(src);
        const user = await this.client.db("users").findFirst({ where: { id: identifiers.steam } });

        const character: Character = await this.client.db("characters").findFirst({ where: { id: user.active_character_id } });
        character.last_position = (character.last_position as any).split(",");

        const data = {
            id: identifiers.steam.toString(),
            updated_at: Date.now(),
            character: {
                id: character.id,
                first_name: character.first_name,
                last_name: character.last_name,
                health: character.health,
                armour: character.armour,
                is_dead: character.health == 0 ? true : false,
                skin: JSON.parse(character.skin),
                last_position: {
                    x: character.last_position[0],
                    y: character.last_position[1],
                    z: character.last_position[2],
                    heading: character.last_position[3] || 0,
                },
            },
        };

        this.lists.push(JSON.stringify(data));
        return data;
    };

    /**
     * Delete a data of player.
     * [IMPORTANT] This function shouldn't be used since it was called automatically by this script
     * @author Rafly Maulana
     */
    _delete = (id: number | string) => {
        if (typeof id !== "string") id = this.utils.getIdentifiers(id).steam.toString();

        this.lists = this.lists.filter((rawData) => {
            const data = JSON.parse(rawData);
            if (data.id === id) return true;
        });

        return true;
    };

    utils = {
        getIdentifiers: (src: any) => {
            const identifiers: { [key: string]: any } = {};

            for (let i = 0; i < GetNumPlayerIdentifiers(src); i++) {
                const id = GetPlayerIdentifier(src, i).split(":");
                identifiers[id[0]] = id[1];
            }

            identifiers.steam = !identifiers.steam || typeof identifiers.steam == "undefined" ? false : BigInt(`0x${identifiers.steam}`);
            return identifiers;
        },
    };

    _intervals = {
        dataUpdateInterval: () => {
            let isAnyPlayerPresented = false; // Check if there's any player

            for (const rawData of this.lists) {
                isAnyPlayerPresented = true;

                const data = JSON.parse(rawData);
                const char = data.character;

                delete char.is_dead;

                this.client.db("characters").update({
                    data: {
                        ...char,
                        last_position: Object.values(char.last_position).join(","),
                        skin: JSON.stringify(char.skin),
                    },
                    where: {
                        id: char.id,
                    },
                });
            }

            this.client._logger(isAnyPlayerPresented ? "Saving All Players Data" : "No Players Available to Save");
        },
    };

    _events = {
        playerDropped: () => {
            const playerId = (global as any).source;
            const data = this.get(playerId);

            if (data) this.update(playerId, data);

            const keepDataAfterLeaving = this.config.keepDataAfterLeaving;
            if (!keepDataAfterLeaving) {
                this._delete(playerId);
            } else if (typeof keepDataAfterLeaving == "number") {
                setTimeout(() => {
                    const updateCheck = this.get(playerId); // In case if player was rejoin, it'd cancel the event
                    if (updateCheck.updated_at == data.updated_at) {
                        this._delete(playerId);
                    }
                }, keepDataAfterLeaving);
            }
        },
    };
}

export default Wrapper;
export { Character, Player, Wrapper };
