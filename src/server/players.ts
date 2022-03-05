"use strict";
import "@citizenfx/server";

import Server from "@server";
import Events from "@server/events";

export type Query = {
    user_id?: number;
    server_id?: number;
    license?: string;
};

export type Data = Query & {
    $index?: number;
    updated_at?: number;
    last_position?: {
        x: number;
        y: number;
        z: number;
        heading: number;
    };
};

export enum EventType {
    CURRENT_PLAYER_UPDATE = "natuna:server:players:currentPlayerUpdate",
    UPDATED_DATA_BROADCAST = "natuna:client:players:updatedDataBroadcast",
}

export default class Players {
    constructor(
        private db: Server["db"], //
        private events: Events
    ) {
        on("playerJoining", async () => {
            return await this.#add({
                server_id: globalThis.source,
            });
        });

        on("playerDropped", () => {
            return this.#delete({
                server_id: globalThis.source,
            });
        });

        this.events.shared.listen(EventType.CURRENT_PLAYER_UPDATE, async (source, data: Data) => {
            return await this.update(data);
        });
    }

    #list: Data[] = [];

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
    listAll = () => {
        return this.#list;
    };

    /**
     * @description
     * Received current data of a player
     *
     * @param query Data object to input
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
    get = (query: Query) => {
        const license = this.#getLicenseId(query);
        const dataIndex = this.#list.findIndex((player) => player.license === license);

        if (dataIndex !== -1) {
            return {
                ...this.#list[dataIndex],
                $index: dataIndex,
            };
        }

        return undefined;
    };

    /**
     * @description
     * Update current data of a player
     *
     * @param data Data object to input
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
    update = async (data: Data) => {
        const currentData = this.get(data);

        if (!currentData) {
            if (typeof data.server_id === "number" || typeof data.license === "string") {
                const newData = await this.#add(data as any);

                if (!newData) {
                    throw new Error("No player data available, tried to add new player but failed.");
                }
            } else {
                throw new Error("No player data available, data not found and can't create a new one since no server_id or license was provided.");
            }
        }

        this.#list[currentData.$index] = {
            ...currentData,
            ...data,
            updated_at: Date.now(),
        };

        this.#updateToClient();

        return true;
    };

    #add = async (data: Data) => {
        if (!this.get(data)) {
            const license = this.#getLicenseId(data);

            if (license) {
                const user = await this.db.users.findFirst({
                    where: {
                        license,
                    },
                });

                this.#list.push({
                    license,
                    user_id: user.id,
                    server_id: data.server_id,
                    updated_at: Date.now(),
                });

                this.#updateToClient();

                return true;
            }

            return false;
        }

        return false;
    };

    #delete = (data: Data) => {
        const currentData = this.get(data);

        if (currentData) {
            this.#list.splice(currentData.$index, 1);
            return true;
        }

        return false;
    };

    #getLicenseId = (query: Query) => {
        const keysLength = Object.keys(query).length;

        if (keysLength === 0) {
            throw new Error("No 'where' option available");
        }

        if (keysLength > 1) {
            throw new Error("'where' option on the configuration can only contains 1 key");
        }

        switch (true) {
            case typeof query.server_id !== "undefined":
                const identifiers = this.utils.getIdentifiers(query.server_id);
                return String(identifiers.license);

            case typeof query.license !== "undefined":
                return query.license;

            case typeof query.user_id !== "undefined":
                const player = this.#list.find((player) => player.user_id === query.user_id);
                return player ? player.license : null;
        }

        return false;
    };

    #updateToClient = () => {
        this.events.shared.emit(EventType.UPDATED_DATA_BROADCAST, -1, [this.#list]);
    };

    utils = {
        /**
         * @description
         * Get all set of player ID and return it on JSON format
         *
         * @param src Server ID of the Player
         *
         * @example
         * ```ts
         * const license = getIdentifiers(1).license;
         * ```
         */
        getIdentifiers: (playerServerId: number) => {
            type Identifiers = {
                steam?: string;
                license?: string;
                fivem?: string;
                discord?: string;
                ip?: string;
                [key: string]: any;
            };

            const fxdkMode = GetConvarInt("sv_fxdkMode", 0);
            const identifiers: Identifiers = {
                license: fxdkMode ? "fxdk_license" : undefined,
            };

            for (let i = 0; i < GetNumPlayerIdentifiers(String(playerServerId)); i++) {
                const id = GetPlayerIdentifier(String(playerServerId), i).split(":");
                identifiers[id[0]] = id[1];
            }

            if (identifiers.steam && typeof identifiers.steam !== "undefined") {
                identifiers.steam = BigInt(`0x${identifiers.steam}`).toString();
            }

            return identifiers;
        },
    };
}
