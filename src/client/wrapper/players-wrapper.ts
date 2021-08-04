"use strict";
import Client from "@client/index";
import { Player } from "@server/wrapper/players-wrapper";

export class Wrapper {
    client: Client;

    constructor(client: Client, config: any) {
        this.client = client;

        this.client.addClientEventHandler(["baseevents:onPlayerKilled", "baseevents:onPlayerDied"], this._baseEventHandler);
        setInterval(this._updatePlayerData, config.saveDataTemporaryInterval);
    }

    /**
     * @description
     * Received current data of a player
     *
     * @param id Server ID / Steam ID of the player
     * @param callbackHandler Handler for the data retrieved
     *
     * @example
     * players.get(1) // Server ID
     * players.get("76561198290395137") // Steam ID
     */
    get = (id: number | string, callbackHandler: (data: any) => any) => {
        this.client.triggerSharedCallbackEvent("natuna:server:getPlayerData", callbackHandler, id);
    };

    /**
     * @description
     * Update current data of a player
     *
     * @param id Server ID / Steam ID of the player
     * @param callbackHandler Handler for the data retrieved
     *
     * @example
     * players.update(1, {
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
    update = (id: number | string, newData: Player, callbackHandler: (data: any) => any) => {
        this.client.triggerSharedCallbackEvent("natuna:server:updatePlayerData", callbackHandler, id, newData);
    };

    /**
     * @readonly
     *
     * @description
     * Handling Player Killed and Player Death
     */
    _baseEventHandler = () => {
        const playerId = GetPlayerServerId(PlayerId());
        this.client.players.update(playerId, {}, () => false);
    };

    /**
     * @readonly
     *
     * @description
     * Handling player update on current location, armour, and health
     */
    _updatePlayerData = () => {
        const playerId = GetPlayerServerId(PlayerId());
        const ped = PlayerPedId();

        this.update(
            playerId,
            {
                character: {
                    armour: GetPedArmour(ped),
                    health: GetEntityHealth(ped),
                    last_position: this.client.game.entity.getCoords(playerId),
                },
            },
            () => false
        );
    };
}

export default Wrapper;
