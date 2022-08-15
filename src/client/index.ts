"use strict";
import "@citizenfx/client";

import type { Config } from "@server";

import Utils from "@client/utils";
import Game from "@client/game";
import Players from "@client/players";
import Events from "@client/events";
import Manager from "@client/manager";

import { SharedEventType } from "@shared/events/type";

export default class Client {
    constructor() {
        on("onClientResourceStart", this.#onClientResourceStart);
    }

    config: Config = {};
    utils: Utils = new Utils();
    events: Events = new Events();
    game: Game = new Game(this.utils);
    manager: Manager = new Manager(this.events, this.utils);
    players: Players = new Players(this.events, this.game);

    #onClientResourceStart = async (resourceName: string) => {
        if (resourceName == GetCurrentResourceName()) {
            this.events.shared.emit(SharedEventType.GET_CLIENT_CONFIG).then((config) => {
                console.log("Starting Client...");
                console.log(this.utils.asciiArt);

                this.config = config;
                this.#setGameSettings();
                this.#setDiscordRPC();

                console.log("Client Ready!");
            });
        }
    };

    #setGameSettings = async () => {
        const GAME = this.config.game;

        this.manager.tick.set(() => {
            if (GAME.noDispatchService) {
                this.game.disableDispatchService();
            }

            if (GAME.noWantedLevel) {
                this.game.resetWantedLevel();
            }
        });

        if (GAME.pauseMenuTitle) {
            AddTextEntry("FE_THDR_GTAO", GAME.pauseMenuTitle);
        }

        if (!GAME.autoRespawnDisabled) {
            globalThis.exports.spawnmanager.setAutoSpawn(true);
            globalThis.exports.spawnmanager.spawnPlayer({
                x: 466.8401,
                y: 197.7201,
                z: 111.5291,
                heading: 291.71,
                model: "a_m_m_farmer_01",
                skipFade: false,
            });
        } else {
            globalThis.exports.spawnmanager.setAutoSpawn(false);
        }
    };

    #setDiscordRPC = () => {
        const RPC = this.config.discordRPC;
        SetDiscordAppId(RPC.appId);

        const parseRPCString = (string: string) => {
            return string
                .replace(/{{PLAYER_NAME}}/g, GetPlayerName(PlayerId())) // Player Name
                .replace(/{{TOTAL_ACTIVE_PLAYERS}}/g, String(this.players.listAll().length)); // Total Active Player
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
        setInterval(setRPC, RPC.refreshInterval * 1000);
    };
}

const client = new Client();
globalThis.exports("client", client);
