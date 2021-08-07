"use strict";
import Server from "@server/index";

export declare namespace Config {
    interface Where {
        user_id?: number;
        server_id?: number;
        steam_id?: string;
    }

    interface Player {
        user_id?: number;
        server_id?: number;
        steam_id?: string;
        updated_at?: number;
        last_position?: {
            x: number;
            y: number;
            z: number;
            heading: number;
        };
        [key: string]: any;
    }

    interface Default {
        data: Player;
        where: Where;
    }
}

export class Wrapper {
    client: Server;
    config: any;
    playerList: {
        [key: string]: string;
    };

    constructor(client: Server, config: any) {
        this.client = client;
        this.playerList = {};
        this.config = config.core.players;

        this.client.addSharedCallbackEventHandler("natuna:server:getPlayerData", this.get);
        this.client.addSharedCallbackEventHandler("natuna:server:updatePlayerData", this.update);
        this.client.addSharedCallbackEventHandler("natuna:server:getPlayerList", () => this.playerList);

        this.client.addServerEventHandler("playerJoining", async () => {
            return await this._add({
                where: {
                    server_id: (global as any).source,
                },
            });
        });

        this.client.addServerEventHandler("playerDropped", () => {
            return this._delete({
                where: {
                    server_id: (global as any).source,
                },
            });
        });
    }

    /**
     * @description
     * List all players
     *
     * @param callbackHandler Handler for the data retrieved
     *
     * @example
     * list();
     */
    list = () => {
        let playerList: Array<Config.Player> = [];

        for (const player of Object.values(this.playerList)) {
            playerList.push(JSON.parse(player));
        }

        return playerList;
    };

    /**
     * @description
     * Received current data of a player
     *
     * @param obj Data object to input
     *
     * @example
     * get({
     *      where: {
     *          steam_id: "76561198290395137"
     *      }
     * });
     */
    get = (obj: { where: Config.Where }) => {
        const steamId = this.utils.parseId(obj);

        if (steamId) {
            // prettier-ignore
            return this.playerList[steamId] 
                ? JSON.parse(this.playerList[steamId])
                : false;
        }

        return false;
    };

    /**
     * @description
     * Update current data of a player
     *
     * @param obj Data object to input
     *
     * @example
     * update({
     *      data: {
     *          someNestedThings: true
     *      },
     *      where: {
     *          steam_id: "76561198290395137"
     *      }
     * });
     */
    update = async (obj: Config.Default) => {
        let currentData: Config.Player = this.get(obj);

        if (!currentData) {
            if (typeof obj.where.server_id === "number" || typeof obj.where.steam_id === "string") {
                const newData = await this._add(obj as any);

                if (newData) {
                    currentData = newData;
                } else {
                    throw new Error("No Data Available");
                }
            } else {
                throw new Error("No Data Available");
            }
        }

        const data: Config.Player = {
            ...currentData, // Copy From Origin
            ...obj.data, // Overwrites any differences
            updated_at: Date.now(),
        };

        this.playerList[data.steam_id] = JSON.stringify(data);
        return data;
    };

    /**
     * @readonly
     *
     * @description
     * Add a new player data when playerJoining event received.
     *
     * @param obj Data object to input
     */
    _add = async (obj: { where: { server_id?: number; steam_id?: string } }) => {
        if (this.get(obj)) return;

        let steamId;

        if (obj.where.steam_id) {
            steamId = obj.where.steam_id;
        } else if (obj.where.server_id) {
            const identifiers = this.client.getPlayerIds(obj.where.server_id);
            if (identifiers.steam) {
                steamId = identifiers.steam;
            }
        }

        if (steamId) {
            const user = await this.client.db("users").findFirst({ where: { steam_id: steamId } });

            const data: Config.Player = {
                user_id: user.id,
                steam_id: user.steam_id,
                server_id: obj.where.server_id,
                updated_at: Date.now(),
            };

            this.playerList[steamId] = JSON.stringify(data);

            return data;
        }

        return false;
    };

    /**
     * @readonly
     *
     * @description
     * Delete a data of player.
     *
     * @param obj Data object to input
     */
    _delete = (obj: { where: Config.Where }) => {
        const steamId = this.utils.parseId(obj);
        return steamId ? delete this.playerList[steamId] : false;
    };

    utils = {
        /**
         * @description
         * Parse a given id to return Steam ID
         *
         * @param id Id of the player
         *
         * @example
         * parseId('SteamID:1234567890'); // return "1234567890"
         */
        parseId: (obj: { where: Config.Where }) => {
            const keysLength = Object.keys(obj.where).length;

            if (keysLength === 0) {
                throw new Error("No 'where' option available");
            }

            if (keysLength > 1) {
                throw new Error("'where' option on the configuration can only contains 1 key");
            }

            switch (true) {
                case typeof obj.where.server_id !== "undefined":
                    const identifiers = this.client.getPlayerIds(obj.where.server_id);
                    return String(identifiers.steam);

                case typeof obj.where.steam_id !== "undefined":
                    return obj.where.steam_id;

                case typeof obj.where.user_id !== "undefined":
                    for (const rawData of Object.values(this.playerList)) {
                        const data: Config.Player = JSON.parse(rawData);

                        if (data.user_id === obj.where.user_id) {
                            return data.steam_id;
                        }
                    }
            }

            return false;
        },
    };
}

export default Wrapper;
