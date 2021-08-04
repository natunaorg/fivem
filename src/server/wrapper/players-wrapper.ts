"use strict";
import Server from "@server/index";

export interface Character {
    id?: number;
    first_name?: string;
    last_name?: string;
    last_position?: {
        x: number;
        y: number;
        z: number;
        heading: number;
    };
    skin?: {
        [key: string]: any;
    };
    health?: number;
    armour?: number;
    [key: string]: any;
}

export interface Player {
    id?: string;
    steam_id?: string;
    last_ip?: string;
    last_login?: string;
    updated_at?: number;
    character?: Character;
    [key: string]: any;
}

export class Wrapper {
    client: Server;
    config: any;
    userIdMapping: {
        [key: number]: string;
    };
    lists: {
        [key: string]: string;
    };

    constructor(client: Server, config: any) {
        this.client = client;
        this.lists = {};
        this.userIdMapping = {};
        this.config = config.core.players;

        this.client.addSharedCallbackEventHandler("natuna:server:getPlayerData", this.get);
        this.client.addSharedCallbackEventHandler("natuna:server:updatePlayerData", this.update);

        this.client.addServerEventHandler("playerJoining", async () => await this._add((global as any).source));
        this.client.addServerEventHandler("playerDropped", this._handlePlayerDropped);

        setInterval(this._handleAutoSaveData, this.config.saveDataToDatabaseInterval);
    }

    /**
     * @description
     * Received current data of a player
     *
     * @param id Id of the player, has 3 different types, check example.
     *
     * @example
     * get(1); // Server ID
     * get("SteamID:76561198290395137"); // Steam ID
     * get("UserID:1"); // Database User ID
     */
    get = (id: number | string) => {
        id = this.utils.parseId(id);
        return this.lists[id] ? JSON.parse(this.lists[id]) : false;
    };

    /**
     * @description
     * Update current data of a player
     *
     * @param id Id of the player, has 3 different types, check example.
     * @param newData New data to update
     *
     * @example
     * const newData = {
     *      character: {
     *          active: {
     *          last_position: {
     *              x: 1,
     *               y: 1,
     *              z: 1,
     *              heading: 1
     *          }
     *      }
     * }
     *
     * update(1, newData); // Using Server ID
     * update("SteamID:76561198290395137", newData); // Using Steam ID
     * update("UserID:1", newData); // Using Database User ID
     */
    update = async (id: number | string, newData: Player) => {
        let currentData: Player = this.get(id);

        if (!currentData) {
            if (typeof id === "number") {
                currentData = await this._add(id);
            } else if (typeof id === "string") {
                throw new Error("No Data Available"); // If it's not a server id
            }
        }

        const data: Player = {
            ...currentData, // Copy From Origin
            ...newData, // Overwrites any differences
            character: {
                ...currentData.character,
                ...newData.character,
            },
            updated_at: Date.now(),
        };

        this.lists[data.id] = JSON.stringify(data);
        return data;
    };

    saveCharacter = async (character: Character) => {
        await this.client.db("characters").update({
            data: {
                ...character,
                last_position: Object.values(character.last_position).join(","),
                skin: JSON.stringify(character.skin),
            },
            where: {
                id: character.id,
            },
        });
    };

    /**
     * @readonly
     *
     * @description
     * Add a new player data when playerJoining event received.
     */
    _add = async (playerServerId: number) => {
        if (this.get(playerServerId)) return;

        const identifiers = this.client.getPlayerIds(playerServerId);
        const user = await this.client.db("users").findFirst({ where: { steam_id: identifiers.steam } });
        const character: Character = await this.client.db("characters").findFirst({ where: { id: user.active_character_id } });

        const data: Player = {
            ...user,
            updated_at: Date.now(),
            character: this.utils.parseCharacter(character),
        };

        this.lists[data.id] = JSON.stringify(data);
        this.userIdMapping[user.id] = user.steam_id;

        return data;
    };

    /**
     * @readonly
     *
     * @description
     * Delete a data of player.
     */
    _delete = (id: number | string) => {
        id = this.utils.parseId(id);

        return delete this.lists[id];
    };

    /**
     * @readonly
     *
     * @description
     * Handle an interval to autosave all cached data.
     */
    _handleAutoSaveData = async () => {
        const playersLength = Object.keys(this.lists).length;
        const hasAnyPlayer = playersLength > 0 ? true : false; // Check if there's any player

        this.client._logger(hasAnyPlayer ? `Saving ${playersLength} Players Data` : "No Players Available to Save");

        for (const key in this.lists) {
            const data = this.get(key);
            const character = data.character;

            await this.saveCharacter(character);
        }
    };

    /**
     * @readonly
     *
     * @description
     * Handle data when player leaving the server.
     *
     * @param reason Reason of leaving the server
     */
    _handlePlayerDropped = async (reason: string) => {
        const playerId = (global as any).source;
        const data: Player = this.get(playerId);
        const keepDataAfterLeaving = this.config.keepDataAfterLeaving;

        this.client._logger(`Player ${GetPlayerName(playerId)} dropped (Reason: ${reason}).`);

        if (data) {
            await this.saveCharacter(data.character);
        }

        if (!keepDataAfterLeaving) {
            return this._delete(playerId);
        } else if (typeof keepDataAfterLeaving === "number") {
            return setTimeout(() => {
                const updateCheck = this.get(playerId); // In case if player was rejoining, it'd cancel the event

                if (updateCheck.updated_at === data.updated_at) {
                    return this._delete(playerId);
                }
            }, keepDataAfterLeaving);
        }
    };

    utils = {
        /**
         * @description
         * Parse character data from database
         *
         * @param character Character Data
         *
         * @example
         * parseCharacter({
         *      location: "120.998,-86.33221,403.3322,50.0"
         * })
         */
        parseCharacter: (character: any) => {
            const characterPos = character.last_position.split(",").map((x: string) => parseInt(x.trim()));

            character.skin = JSON.parse(character.skin);
            character.last_position = {
                x: characterPos[0],
                y: characterPos[1],
                z: characterPos[2],
                heading: characterPos[3] || 0,
            };

            return character;
        },

        /**
         * @description
         * Parse a given id to return Steam ID
         *
         * @param id Id of the player
         *
         * @example
         * parseId('SteamID:1234567890'); // return "1234567890"
         */
        parseId: (id: string | number) => {
            let playerSteamId: string;

            // Example: 1
            if (typeof id === "number") {
                const identifiers = this.client.getPlayerIds(id);
                playerSteamId = String(identifiers.steam);
            } else if (typeof id === "string") {
                // Example: "SteamID:76561198290395137"
                if (id.toLowerCase().startsWith("steamid:")) {
                    const steamId = id.replace("steamid:", "").trim();
                    playerSteamId = steamId;
                }

                // Example: "UserID:1"
                else if (id.toLowerCase().startsWith("userid:")) {
                    const userId = parseInt(id.replace("userid:", "").trim());
                    playerSteamId = this.userIdMapping[userId];
                }
            }

            return playerSteamId;
        },
    };
}

export default Wrapper;
