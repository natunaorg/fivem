/**
 * @module Client - Players
 * @category Client
 */

"use strict";
import Client from "@client/index";
import { Data, Requirements } from "@server/wrapper/players-wrapper";

export default class Wrapper {
    /**
     * @hidden
     */
    client: Client;

    /**
     * @hidden
     */
    constructor(client: Client, config: any) {
        this.client = client;

        setInterval(async () => {
            const playerId = GetPlayerServerId(PlayerId());
            await this.update({
                data: {
                    last_position: this.client.game.entity.getCoords(playerId),
                },
                where: {
                    server_id: playerId,
                },
            });
        }, config.locationUpdateInterval);
    }

    /**
     * @description
     * List all players
     *
     * **[IMPORTANT]** Don't use this function on Tick/Interval!
     *
     * @example
     * ```ts
     * await list();
     * ```
     */
    list = async () => {
        const data = () => {
            return new Promise((resolve, reject) => {
                this.client.triggerSharedCallbackEvent("natuna:server:getPlayerList", (data: { [key: string]: string }) => {
                    let playerList: Array<Data> = [];

                    for (const player of Object.values(data)) {
                        playerList.push(JSON.parse(player));
                    }

                    return resolve(playerList);
                });
            });
        };

        return (await data()) as Array<Data>;
    };

    /**
     * @description
     * Received current data of a player
     *
     * **[IMPORTANT]** Don't use this function on Tick/Interval!
     *
     * @param obj Data object to input
     *
     * @example
     * ```ts
     * await get({
     *      where: {
     *          steam_id: "76561198290395137"
     *      }
     * });
     * ```
     */
    get = async (obj: { where: Requirements }) => {
        const data = () => {
            return new Promise((resolve, reject) => {
                this.client.triggerSharedCallbackEvent("natuna:server:getPlayerData", (data) => resolve(data), obj);
            });
        };

        return (await data()) as Data;
    };

    /**
     * @description
     * Update current data of a player
     *
     * **[IMPORTANT]** Don't use this function on Tick/Interval!
     *
     * @param obj Data object to input
     *
     * @example
     * ```ts
     * await update({
     *      data: {
     *          someNestedThings: true
     *      },
     *      where: {
     *          steam_id: "76561198290395137"
     *      }
     * });
     * ```
     */
    update = async (obj: { data: Data; where: Requirements }) => {
        const data = () => {
            return new Promise((resolve, reject) => {
                this.client.triggerSharedCallbackEvent("natuna:server:updatePlayerData", (data) => resolve(data), obj);
            });
        };

        return (await data()) as Data;
    };
}
