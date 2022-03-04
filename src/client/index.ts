"use strict";
import "@citizenfx/client";

import { GAME_CONFIG, DISCORD_RPC_CONFIG } from "@/natuna.config";

import Utils from "@client/utils";
import Game from "@client/game";
import Players from "@client/players";
import Events from "@client/events";
import Manager from "@client/manager";

export default class Client {
    constructor() {
        on("onClientResourceStart", this.#onClientResourceStart);
    }

    utils = new Utils();
    events = new Events();
    game = new Game(this.utils);
    manager = new Manager(this.events, this.utils);
    players = new Players(this.events, this.game);

    #onClientResourceStart = async (resourceName: string) => {
        if (resourceName == GetCurrentResourceName()) {
            console.log("Starting Client...");
            this.events.shared.emit("natuna:server:addPlayerData");

            this.#setGameSettings();
            this.#setDiscordRPC();

            console.log("Client Ready!");
        }
    };

    #setGameSettings = async () => {
        this.manager.tick.set(() => {
            if (GAME_CONFIG.noDispatchService) {
                this.game.disableDispatchService();
            }

            if (GAME_CONFIG.noWantedLevel) {
                this.game.resetWantedLevel();
            }
        });

        if (GAME_CONFIG.pauseMenuTitle) {
            AddTextEntry("FE_THDR_GTAO", GAME_CONFIG.pauseMenuTitle);
        }
    };

    #setDiscordRPC = () => {
        const RPC = DISCORD_RPC_CONFIG;
        SetDiscordAppId(RPC.appId);

        const parseRPCString = (string: string) => {
            return string
                .replace(/{{PLAYER_NAME}}/g, GetPlayerName(PlayerId())) // Player Name
                .replace(/{{TOTAL_ACTIVE_PLAYERS}}/g, () => String(this.players.listAll().length)); // Total Active Player
        };

        const setRPC = () => {
            SetRichPresence(parseRPCString(RPC.text));

            SetDiscordRichPresenceAsset(RPC.largeImage.assetName);
            SetDiscordRichPresenceAssetText(parseRPCString(RPC.largeImage.hoverText));

            SetDiscordRichPresenceAssetSmall(RPC.smallImage.assetName);
            SetDiscordRichPresenceAssetSmallText(parseRPCString(RPC.smallImage.hoverText));

            if (RPC.buttons[0]) {
                SetDiscordRichPresenceAction(0, RPC.buttons[0].label, RPC.buttons[0].url);
            }

            if (RPC.buttons[1]) {
                SetDiscordRichPresenceAction(1, RPC.buttons[1].label, RPC.buttons[1].url);
            }
        };

        setRPC();
        setInterval(setRPC, RPC.refreshInterval);
    };
}

const client = new Client();
globalThis.exports("client", client);
