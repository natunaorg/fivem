import Client from "@client/index";
import { Player } from "@server/wrapper/players-wrapper";

class Wrapper {
    client: Client;

    constructor(client: Client, config: any) {
        this.client = client;

        this.client.addClientEventHandler(["baseevents:onPlayerKilled", "baseevents:onPlayerDied"], this._events.baseEvents);

        setInterval(this._intervals.updatePlayerData, config.saveDataTemporaryInterval);
    }

    /**
     * Received current data of a player
     * @author Rafly Maulana
     *
     * @example
     * get(1) // Server ID
     * get("76561198290395137") // Steam ID
     */
    get = (id: number | bigint, callbackHandler: (data: any) => any) => {
        this.client.triggerSharedCallbackEvent("koi:server:getPlayerData", callbackHandler, id);
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
    update = (id: number | bigint, newData: Player, callbackHandler: (data: any) => any) => {
        this.client.triggerSharedCallbackEvent("koi:server:updatePlayerData", callbackHandler, id, newData);
    };

    _intervals = {
        updatePlayerData: () => {
            const playerId = GetPlayerServerId(PlayerId());
            const ped = PlayerPedId();

            this.update(
                playerId,
                {
                    character: {
                        armour: GetPedArmour(ped),
                        health: GetEntityHealth(ped),
                        last_position: this.client.game.player.getCoords(playerId),
                    },
                },
                () => false
            );
        },
    };

    _events = {
        baseEvents: () => {
            const playerId = GetPlayerServerId(PlayerId());
            this.client.players.update(playerId, {}, () => false);
        },
    };
}

export default Wrapper;
export { Wrapper };
