"use strict";
import "@citizenfx/client";

import Utils from "@client/utils";
import Game from "@client/game";
import Players from "@client/players";
import Events from "@client/events";
import Manager from "@client/manager";

export default class Client {
    /**
     * @hidden
     */
    constructor() {
        on("onClientResourceStart", this.#onClientResourceStart);
    }

    private config: any = {};
    utils = new Utils();
    events = new Events();
    game = new Game(this.utils);
    manager = new Manager(this.events, this.utils);
    players = new Players(this.events, this.game);

    /** @hidden */
    #logger = (...text: any) => {
        return console.log("[🏝️ Natuna Framework]", "[CLIENT]", ...text);
    };

    /** @hidden */
    #initClientSettings = async (settings: any) => {
        this.config = settings.config;
        // this.players = new PlayersWrapper(this, this.config);

        if (settings.figletText) {
            console.log(settings.figletText);
        }

        this.#logger("Starting Client...");

        this.manager.tick.set(() => {
            if (this.config.game.noDispatchService) {
                this.game.disableDispatchService();
            }

            if (this.config.game.noWantedLevel) {
                this.game.resetWantedLevel();
            }
        });

        if (this.config.game.pauseMenuTitle) {
            AddTextEntry("FE_THDR_GTAO", this.config.game.pauseMenuTitle);
        }

        if (this.config.discordRPC) {
            // const players = await this.players.list();
            const rpc = this.config.discordRPC;

            SetDiscordAppId(rpc.appId);

            const parseRPCString = (string: string) => {
                return string.replace(/{{PLAYER_NAME}}/g, GetPlayerName(PlayerId())); // Player Name
                // .replace(/{{TOTAL_ACTIVE_PLAYERS}}/g, () => String(players.length)); // Total Active Player
            };

            const setRPC = () => {
                SetRichPresence(parseRPCString(rpc.text));

                SetDiscordRichPresenceAsset(rpc.largeImage.assetName);
                SetDiscordRichPresenceAssetText(parseRPCString(rpc.largeImage.hoverText));

                SetDiscordRichPresenceAssetSmall(rpc.smallImage.assetName);
                SetDiscordRichPresenceAssetSmallText(parseRPCString(rpc.smallImage.hoverText));

                if (rpc.buttons[0]) {
                    SetDiscordRichPresenceAction(0, rpc.buttons[0].label, rpc.buttons[0].url);
                }

                if (rpc.buttons[1]) {
                    SetDiscordRichPresenceAction(1, rpc.buttons[1].label, rpc.buttons[1].url);
                }
            };

            setRPC();
            setInterval(setRPC, rpc.refreshInterval);
        }
    };

    /** @hidden */
    #onClientResourceStart = async (resourceName: string) => {
        if (resourceName == GetCurrentResourceName()) {
            this.events.shared.emit("natuna:server:addPlayerData");

            const settings = await this.events.shared.emit("natuna:server:requestClientSettings");
            await this.#initClientSettings(JSON.parse(settings));

            this.#logger("Client Ready!");
        }
    };
}

const client = new Client();
globalThis.exports("client", client);
