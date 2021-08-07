"use strict";
import Client from "@client/index";
import { Config } from "@server/wrapper/players-wrapper";

export class Wrapper {
    client: Client;

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
     * @example
     * await listAll();
     */
    listAll = async () => {
        const data = () => {
            return new Promise((resolve, reject) => {
                this.client.triggerSharedCallbackEvent("natuna:server:getPlayerList", (data: { [key: string]: string }) => {
                    let playerList: Array<Config.Player> = [];

                    for (const player of Object.values(data)) {
                        playerList.push(JSON.parse(player));
                    }

                    return resolve(playerList);
                });
            });
        };

        return (await data()) as Array<Config.Player>;
    };

    /**
     * @description
     * Received current data of a player
     *
     * @param obj Data object to input
     *
     * @example
     * await get({
     *      where: {
     *          steam_id: "76561198290395137"
     *      }
     * });
     */
    get = async (obj: { where: Config.Where }) => {
        const data = () => {
            return new Promise((resolve, reject) => {
                this.client.triggerSharedCallbackEvent("natuna:server:getPlayerData", (data) => resolve(data), obj);
            });
        };

        return (await data()) as Config.Player;
    };

    /**
     * @description
     * Update current data of a player
     *
     * @param obj Data object to input
     *
     * @example
     * await update({
     *      data: {
     *          someNestedThings: true
     *      },
     *      where: {
     *          steam_id: "76561198290395137"
     *      }
     * });
     */
    update = async (obj: Config.Default) => {
        const data = () => {
            return new Promise((resolve, reject) => {
                this.client.triggerSharedCallbackEvent("natuna:server:updatePlayerData", (data) => resolve(data), obj);
            });
        };

        return (await data()) as Config.Player;
    };
}

export default Wrapper;
