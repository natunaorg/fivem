"use strict";
import * as Utils from "@client/wrapper/utils-wrapper";
import * as Game from "@client/wrapper/game-wrapper";
import * as Command from "@server/wrapper/command-wrapper";
import * as Players from "@client/wrapper/players-wrapper";

import Events from "@client/modules/events";

import figlet from "figlet";
import Doom from "figlet/importable-fonts/Doom";

class Client extends Events {
    /**
     * Client Configurations
     */
    config: any;

    /**
     * List of Client Plugins
     */
    clientPlugins: any;

    /**
     * List of utility functions
     */
    utils: Utils.Wrapper;

    /**
     * Collection of Game Functions
     */
    game: Game.Wrapper;

    /**
     * Client Player Wrapper
     */
    players: Players.Wrapper;

    /**
     * List of client commands
     */
    commands: {
        [key: string]: Command.Handler;
    };

    constructor() {
        super();
        this.config;
        this.clientPlugins = {};
        this.commands = {};

        this.utils = new Utils.Wrapper(this);
        this.game = new Game.Wrapper(this);
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
     */
    wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

    /**
     * @description
     * Registrating a command. The actual command handler is registered on server to unlock the feature like permission based command or something, so it'd write a event on client and registered a handler on server to trigger the command from registered command in client.
     *
     * @example
     * registerCommand(
     *      'hello',
     *      (src, args) => console.log('Hello!'),
     *      {
     *          description: "Say Hello"
     *      }
     * });
     */
    registerCommand = (name: string | Array<string>, handler: Command.Handler, config: Command.Config = {}) => {
        const addCommand = (name: string) => {
            this.commands[name] = handler;
            this.triggerSharedEvent("natuna:server:registerCommand", name, () => {}, config, true);
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
    registerKeyControl = (key: string, description: string, onClick: () => any, onReleased: () => any = () => false) => {
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
    setCommandDescription = (name: string, config: { description: string; argsDescription?: Array<{ name: string; help: string }> }) => {
        setImmediate(() => this.triggerClientEvent("chat:addSuggestion", `/${name}`, config.description || "No Description is Set", config.argsDescription || []));

        return true;
    };

    /**
     * @readonly
     *
     * @description
     * Logger to Console
     *
     * @param text Text to logs
     */
    _logger = (...text: any) => {
        return console.log("[🏝 Natuna Framework]", "[CLIENT]", ...text);
    };

    /**
     * @readonly
     *
     * @description
     * Handle client initializer
     *
     * @param settings Client settings
     */
    _initClientSettings = async (settings: any) => {
        if (settings.pluginLists) {
            this._initClientPlugins(settings.pluginLists);
        }

        if (settings.nuiLists) {
            for (const nui of settings.nuiLists) {
                this.triggerNUIEvent("natuna:nui:retrievePluginList", { name: nui.name });
            }
        }

        if (settings.config) {
            this.config = settings.config;
            this.players = new Players.Wrapper(this, this.config);
        }

        if (settings.game) {
            if (settings.game.autoRespawnDisabled) {
                // Requires "spawnmanager" script
                (global as any).exports.spawnmanager.setAutoSpawn(false);
            }

            setTick(() => {
                if (settings.game.noDispatchService) {
                    this.game.disableDispatchService();
                }

                if (settings.game.noWantedLevel) {
                    this.game.resetWantedLevel();
                }
            });

            if (settings.game.pauseMenuTitle) {
                AddTextEntry("FE_THDR_GTAO", settings.game.pauseMenuTitle);
            }
        }

        if (settings.discordRPC) {
            const players = await this.players.listAll();
            const rpc = settings.discordRPC;
            const RPCStringParser = (string: string) => {
                // prettier-ignore
                return string
                    .replace(/{{PLAYER_NAME}}/g, GetPlayerName(PlayerId()))
                    .replace(/{{TOTAL_ACTIVE_PLAYERS}}/g, () => String(players.length));
            };

            SetDiscordAppId(rpc.appId);
            SetRichPresence(RPCStringParser(rpc.text));

            SetDiscordRichPresenceAsset(rpc.largeImage.assetName);
            SetDiscordRichPresenceAssetText(RPCStringParser(rpc.largeImage.hoverText));

            SetDiscordRichPresenceAssetSmall(rpc.smallImage.assetName);
            SetDiscordRichPresenceAssetSmallText(RPCStringParser(rpc.smallImage.hoverText));

            if (rpc.buttons[0]) {
                SetDiscordRichPresenceAction(0, rpc.buttons[0].label, rpc.buttons[0].url);
            }

            if (rpc.buttons[1]) {
                SetDiscordRichPresenceAction(1, rpc.buttons[1].label, rpc.buttons[1].url);
            }
        }
    };

    /**
     * @readonly
     *
     * @description
     * This function is to init a plugin, differs from the server ones, it's triggered when the client was joined the server
     */
    _initClientPlugins = async (plugins: Array<{ name: string; file: string; config: any }>) => {
        this._logger(`Intializing Client Plugins`);

        let count = 1; // Start from 1
        for (const plugin of plugins) {
            this._logger(`Ensuring Plugins: ${count}. ${plugin.name}`);

            this.clientPlugins[plugin.name] = await import(`../../plugins/${plugin.name}/client/${plugin.file}`);
            this.clientPlugins[plugin.name]._handler(this, plugin.config);

            count += 1;
        }

        this._logger("Client Plugins Ready!");
    };

    _events = {
        /**
         * @description
         * Listen when Natuna Framework is starting
         */
        onClientResourceStart: async (resourceName: string) => {
            if (GetCurrentResourceName() == resourceName) {
                // Event: Starting Process
                figlet.parseFont("Standard", Doom);
                figlet.text("Natuna Framework", { font: "Standard" }, (err: Error, result: string) => console.log(result));

                this.triggerClientEvent("natuna:client:starting");
                this.triggerSharedEvent("natuna:client:starting");

                // Event: Initializing
                this._logger("Starting Client...");

                this.triggerClientEvent("natuna:client:initializing");
                this.triggerSharedEvent("natuna:client:initializing");
                this.triggerSharedEvent("natuna:server:addPlayerData");

                this.triggerSharedCallbackEvent("natuna:server:requestClientSettings", this._initClientSettings);

                while (!this.config) await this.wait(100); // Wait for config before executing next script

                // Event: Ready
                this._logger("Client Ready!");

                this.triggerClientEvent("natuna:client:ready");
                this.triggerSharedEvent("natuna:client:ready");
            }
        },

        /**
         * @description
         * Listen when Natuna Framework is stopping
         */
        onClientResourceStop: (resourceName: string) => {
            if (GetCurrentResourceName() == resourceName) {
                // Event: Stopping
                this.triggerClientEvent("natuna:client:stopped");
                this.triggerSharedEvent("natuna:client:stopped");
            }
        },
    };
}

export const ClientDeclared = new Client();
export default Client;
