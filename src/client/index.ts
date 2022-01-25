/**
 * @module Client
 * @category Client
 */

"use strict";
import "@citizenfx/client";

import UtilsWrapper from "@client/utils";
import GameWrapper from "@client/game";
import PlayersWrapper from "@client/players";
import * as Command from "@server/command";

import Events from "@client/events";

export default class Client extends Events {
    /**
     * @hidden
     *
     * @description
     * Client Configurations
     */
    private config: any;

    /**
     * @hidden
     *
     * @description
     * List of Client Plugins
     */
    private plugins: {
        [key: string]: {
            path: string;
            client?: {
                modules: Array<string>;
                config: {
                    [key: string]: any;
                };
            };
            nui?: boolean;
        };
    };

    /**
     * @hidden
     *
     * @description
     * List of client commands
     */
    private commands: {
        [key: string]: Command.Handler;
    };

    /**
     * @description
     * List of utility functions
     */
    utils: UtilsWrapper;

    /**
     * @description
     * Collection of Game Functions
     */
    game: GameWrapper;

    /**
     * @description
     * Client Player Wrapper
     */
    players: PlayersWrapper;

    /**
     * @hidden
     */
    constructor() {
        super();
        this.config;
        this.plugins;
        this.commands = {};

        this.utils = new UtilsWrapper(this);
        this.game = new GameWrapper(this);
        this.players;

        this.addSharedEventHandler("natuna:client:setCommandDescription", this.setCommandDescription);
        this.addSharedEventHandler(`natuna:client:executeCommand`, (name: string, args: Array<any>, raw: string) => {
            const src = GetPlayerServerId(PlayerId());
            return this.commands[name](src, args, raw || name);
        });

        this.addClientEventHandler("onClientResourceStart", this._events.onClientResourceStart);
        this.addClientEventHandler("onClientResourceStop", this._events.onClientResourceStop);
    }

    /**
     * @description
     * Use this function to hold next script below this from executing before it finish the timeout itself
     *
     * @example
     * ```ts
     * const isActive = false;
     * const logger = (status) => console.log(status);
     *
     * setTimeout(() => isActive = true, 3000)
     *
     * (async() => { // Always do it on async
     *      logger(isActive); // false
     *      while(!isActive) await wait(5000);
     *      logger(isActive); // true
     * })();
     * ```
     */
    wait = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));

    /**
     * @description
     * Registrating a command. The actual command handler is registered on server to unlock the feature like permission based command or something, so it'd write a event on client and registered a handler on server to trigger the command from registered command in client.
     *
     * @example
     * ```ts
     * registerCommand(
     *      'hello',
     *      (src, args) => console.log('Hello!'),
     *      {
     *          description: "Say Hello"
     *      }
     * });
     * ```
     */
    registerCommand = (name: string | Array<string>, handler: Command.Handler, config: Command.Config = {}): void => {
        const addCommand = (name: string) => {
            this.commands[name] = handler;
            this.triggerSharedEvent("natuna:server:registerCommand", name, () => true, config, true);
        };

        if (Array.isArray(name)) {
            for (const alias of name) addCommand(alias);
        } else {
            addCommand(name);
        }
    };

    /**
     * @description
     * Set a keyboard key mapper to a function. This function also allows user to change their keybind on pause menu settings.
     *
     * ![](https://i.cfx.re/rage/fwuiComplexObjectDirectImpl/Contains/1836.png)
     */
    registerKeyControl = (key: string, description: string, onClick: () => any, onReleased: () => any = () => false): string => {
        const controlID = this.utils.getHashString(onClick.toString());
        const controlIDHash = "~INPUT_" + this.utils.getHashString(`+${controlID}`) + "~";

        RegisterCommand(`+${controlID}`, onClick, false);
        RegisterCommand(`-${controlID}`, onReleased, false);
        RegisterKeyMapping(`+${controlID}`, description, "keyboard", key);

        return controlIDHash;
    };

    /**
     * @description
     * Set a description on command, this function is executed automatically after you registering a command with configuration that contain description.
     *
     * https://docs.fivem.net/docs/resources/chat/events/chat-addSuggestion/
     */
    setCommandDescription = (
        name: string,
        config: {
            description: string;
            argsDescription?: Array<{ name: string; help: string }>;
        }
    ): boolean => {
        setImmediate(() => this.triggerClientEvent("chat:addSuggestion", `/${name}`, config.description || "No Description is Set", config.argsDescription || []));

        return true;
    };

    /**
     * @hidden
     * @description
     * Logger to Console
     *
     * @param text Text to logs
     */
    private _logger = (...text: any) => {
        return console.log("[🏝️ Natuna Framework]", "[CLIENT]", ...text);
    };

    /**
     * @hidden
     * @description
     * Handle client initializer
     *
     * @param settings Client settings
     */
    private _initClientSettings = async (settings: any) => {
        this.plugins = settings.plugins;
        this.config = settings.config;
        this.players = new PlayersWrapper(this, this.config);

        if (settings.figletText) {
            console.log(settings.figletText);
        }

        this._logger("Starting Client...");

        setTick(() => {
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

    /**
     * @hidden
     * @description
     * Handle client plugins
     */
    private _initClientPlugins = async () => {
        this._logger(`Intializing Client Plugins`);

        let count = 1;
        for (const pluginName in this.plugins) {
            const plugin = this.plugins[pluginName];
            this._logger(`> Starting Plugins: ${count}. ${pluginName}`);

            if (plugin.nui) {
                this.triggerNUIEvent("natuna:nui:retrievePluginList", {
                    name: pluginName,
                });
            }

            for (let pluginFile of plugin.client.modules) {
                const module = await import(`../../plugins/${pluginName}/client/${pluginFile}`);

                if (module && module.default && typeof module.default === "function") {
                    this._logger(`  - Mounting Module: ${pluginFile}`);
                    module.default(this, plugin.client.config);
                }
            }

            count += 1;
        }

        this._logger("Client Plugins Ready!");
    };

    /**
     * @hidden
     * @description
     * Listen when Natuna Framework is stopping
     */
    private _events = {
        /**
         * @description
         * Listen when Natuna Framework is starting
         */
        onClientResourceStart: async (resourceName: string) => {
            if (GetCurrentResourceName() == resourceName) {
                // Starting Process
                this.triggerClientEvent("natuna:client:starting");
                this.triggerSharedEvent("natuna:client:starting");

                // Initializing
                this.triggerClientEvent("natuna:client:initializing");
                this.triggerSharedEvent("natuna:client:initializing");

                this.triggerSharedEvent("natuna:server:addPlayerData");
                // await new Promise((resolve, reject) => {
                //     this.triggerSharedCallbackEvent("natuna:server:requestClientSettings", async (settings) => {
                //         await this._initClientSettings(JSON.parse(settings));
                //         await this._initClientPlugins();
                //         return resolve(true);
                //     });
                // });

                // Ready
                this.triggerClientEvent("natuna:client:ready");
                this.triggerSharedEvent("natuna:client:ready");

                this._logger("Client Ready!");
            }
        },

        /**
         * @description
         * Listen when Natuna Framework is stopping
         */
        onClientResourceStop: (resourceName: string) => {
            if (GetCurrentResourceName() == resourceName) {
                // Stopping
                this.triggerClientEvent("natuna:client:stopped");
                this.triggerSharedEvent("natuna:client:stopped");
            }
        },
    };
}

new Client();
