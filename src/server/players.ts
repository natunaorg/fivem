/**
 * @module Server - Players
 * @category Server
 */

"use strict";
import Server from "@server";

export type Requirements = {
    user_id?: number;
    server_id?: number;
    license?: string;
};

export type Data = {
    user_id?: number;
    server_id?: number;
    license?: string;
    updated_at?: number;
    last_position?: {
        x: number;
        y: number;
        z: number;
        heading: number;
    };
    [key: string]: any;
};

export default class Players {
    /**
     * @hidden
     */
    client: Server;

    /**
     * @hidden
     */
    config: any;

    /**
     * @hidden
     */
    private playerList: {
        [key: string]: string;
    };

    /**
     * @hidden
     */
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
     * ```ts
     * list();
     * ```
     */
    list = () => {
        let playerList: Array<Data> = [];

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
     * ```ts
     * get({
     *      where: {
     *          license: "abc12345"
     *      }
     * });
     * ```
     */
    get = (obj: { where: Requirements }) => {
        const license = this.utils._parseId(obj);

        if (license) {
            // prettier-ignore
            return this.playerList[license] 
                ? JSON.parse(this.playerList[license]) as Data
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
     * ```ts
     * update({
     *      data: {
     *          someNestedThings: true
     *      },
     *      where: {
     *          license: "76asdasd56119829asdads0395137"
     *      }
     * });
     * ```
     */
    update = async (obj: { data: Data; where: Requirements }) => {
        let currentData = this.get(obj);

        if (!currentData) {
            if (typeof obj.where.server_id === "number" || typeof obj.where.license === "string") {
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

        const data: Data = {
            ...currentData, // Copy From Origin
            ...obj.data, // Overwrites any differences
            updated_at: Date.now(),
        };

        this.playerList[data.license] = JSON.stringify(data);
        return data;
    };

    /**
     * @readonly
     * @hidden
     *
     * @description
     * Add a new player data when playerJoining event received.
     *
     * @param obj Data object to input
     */
    private _add = async (obj: { where: { server_id?: number; license?: string } }) => {
        if (this.get(obj)) return;

        let license;

        if (obj.where.license) {
            license = obj.where.license;
        } else if (obj.where.server_id) {
            const identifiers = this.utils.getIdentifiers(obj.where.server_id);
            if (identifiers.license) {
                license = identifiers.license;
            }
        }

        if (license) {
            const user = await this.client.db("users").findFirst({ where: { license: license } });

            const data: Data = {
                user_id: user.id,
                license: user.license,
                server_id: obj.where.server_id,
                updated_at: Date.now(),
            };

            this.playerList[license] = JSON.stringify(data);

            return data;
        }

        return false;
    };

    /**
     * @readonly
     * @hidden
     *
     * @description
     * Delete a data of player.
     *
     * @param obj Data object to input
     */
    private _delete = (obj: { where: Requirements }) => {
        const license = this.utils._parseId(obj);
        return license ? delete this.playerList[license] : false;
    };

    utils = {
        /**
         * @readonly
         * @hidden
         *
         * @description
         * Parse a given id to return license ID
         *
         * @param id Id of the player
         */
        _parseId: (obj: { where: Requirements }) => {
            const keysLength = Object.keys(obj.where).length;

            if (keysLength === 0) {
                throw new Error("No 'where' option available");
            }

            if (keysLength > 1) {
                throw new Error("'where' option on the configuration can only contains 1 key");
            }

            switch (true) {
                case typeof obj.where.server_id !== "undefined":
                    const identifiers = this.utils.getIdentifiers(obj.where.server_id);
                    return String(identifiers.license);

                case typeof obj.where.license !== "undefined":
                    return obj.where.license;

                case typeof obj.where.user_id !== "undefined":
                    for (const rawData of Object.values(this.playerList)) {
                        const data: Data = JSON.parse(rawData);

                        if (data.user_id === obj.where.user_id) {
                            return data.license;
                        }
                    }
            }

            return false;
        },

        /**
         * @description
         * Get all set of player ID and return it on JSON format
         *
         * @param src Server ID of the Player
         *
         * @example
         * ```ts
         * const license = getIdentifiers(1).license;
         * console.log(license)
         * ```
         */
        getIdentifiers: (playerServerId: number) => {
            const fxdkMode = GetConvarInt('sv_fxdkMode', 0);
            
            const identifiers: {
                steam?: string;
                license?: string;
                fivem?: string;
                discord?: string;
                ip?: string;
                [key: string]: any;
            } = {
                license: fxdkMode ? 'fxdk_license' : undefined
            };

            for (let i = 0; i < GetNumPlayerIdentifiers(String(playerServerId)); i++) {
                const id = GetPlayerIdentifier(String(playerServerId), i).split(":");
                identifiers[id[0]] = id[1];
            }

            // prettier-ignore
            identifiers.steam = (!identifiers.steam || typeof identifiers.steam == "undefined") ? "" : BigInt(`0x${identifiers.steam}`).toString();

            return identifiers;
        },
    };
}
