"use strict";
import "@citizenfx/client";

import type Events from "@client/events";
import type Game from "@client/game";
import type { Query, Data } from "@server/players";

import { EventType } from "@server/players";

export default class Players {
    /** @hidden */
    constructor(private events: Events, private game: Game) {
        this.events.shared.listen(EventType.UPDATED_DATA_BROADCAST, async (players: Data[]) => {
            this.#list = players;
        });
    }

    #list: Data[] = [];

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
    listAll = () => {
        // reduce is fast rather than for loop or map
        return this.#list.reduce((data, player) => {
            const ped = GetPlayerPed(GetPlayerFromServerId(player.server_id));

            player.last_position = this.game.entity.getCoords(ped);
            data.push(player);

            return data;
        }, []);
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
    get = (query: Query) => {
        const data = this.listAll().find((player: Data) => {
            if (query.license) {
                return player.license === query.license;
            } else if (query.server_id) {
                return player.server_id === query.server_id;
            } else if (query.user_id) {
                return player.user_id === query.user_id;
            }
        });

        return data;
    };

    /**
     * @description
     * Update current data of a player
     *
     * **[IMPORTANT]** Don't use this function on Tick/Interval!
     *
     * @param data Data object to input
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
    update = async (data: Data) => {
        return await this.events.shared.emit(EventType.CURRENT_PLAYER_UPDATE, [data]);
    };
}
