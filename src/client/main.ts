import * as Utils from "@client/wrapper/utils-wrapper";
import * as Game from "@client/wrapper/game-wrapper";
import * as Command from "@server/wrapper/command-wrapper";
import { Config } from "@server/main";

import figlet from "figlet";
import standard from "figlet/importable-fonts/Doom";

class Client {
    /**
     * Client Configurations
     */
    config: Config["core"]["client"];

    /**
     * List of Client Plugins
     */
    plugins: Config["plugins"];

    /**
     * List of utility functions
     */
    utils: Utils.Wrapper;

    /**
     * Collection of Game Functions
     */
    game: Game.Wrapper;

    constructor() {
        this.config;
        this.plugins = {};

        this.utils = new Utils.Wrapper(this);
        this.game = new Game.Wrapper(this);

        this.addSharedEventHandler("koi:client:retrieveClientSettings", this._events.retrieveClientSettings);
        this.addSharedEventHandler("koi:client:setCommandDescription", this.setCommandDescription);

        this.addClientEventHandler("onClientResourceStart", this._events.onClientResourceStart);
        this.addClientEventHandler("onClientResourceStop", this._events.onClientResourceStop);
    }

    /**
     * Add client only event and listen for it, only can be triggered from server
     * @author Rafly Maulana
     *
     * @param name Name of the event
     * @param args Arguments to send
     *
     * @example
     * addClientEventHandler("someEvent", (playerID) => console.log(playerID))
     */
    addClientEventHandler = (name: string | Array<string>, handler: Function) => {
        if (typeof name == "object" && Array.isArray(name)) {
            for (const alias of name) {
                on(alias, handler);
            }
        } else if (typeof name == "string") {
            on(name, handler);
        } else {
            throw new Error(`Invalid Server Event Name Properties for ${name}`);
        }
    };

    /**
     * Add shared event and listen from both server or client
     * @author Rafly Maulana
     *
     * @param name Name of the event
     * @param args Arguments to send
     *
     * @example
     * addSharedEventHandler("someEvent", (playerID) => console.log(playerID))
     */
    addSharedEventHandler = (name: string | Array<string>, handler: Function) => {
        if (typeof name == "object" && Array.isArray(name)) {
            for (const alias of name) {
                onNet(alias, handler);
            }
        } else if (typeof name == "string") {
            onNet(name, handler);
        } else {
            throw new Error(`Invalid Shared Event Name Properties for ${name}`);
        }
    };

    /**
     * Trigger a registered client event
     * @author Rafly Maulana
     *
     * @param name Name of the event
     * @param args Arguments to send
     *
     * @example
     * triggerClientEvent("someEvent", true)
     */
    triggerClientEvent = (name: string | Array<string>, ...args: any) => {
        if (typeof name == "object" && Array.isArray(name)) {
            for (const alias of name) {
                emit(alias, ...args);
            }
        } else if (typeof name == "string") {
            emit(name, ...args);
        } else {
            throw new Error(`Invalid Server Trigger Name Properties for ${name}`);
        }
    };

    /**
     * Trigger shared event between client and server, only event registered as shared event that can be triggered
     * @author Rafly Maulana
     *
     * @param name Name of the event
     * @param target Target of the player ID (Server ID)
     * @param args Arguments to send
     *
     * @example
     * triggerSharedEvent("someEvent", 1, true)
     */
    triggerSharedEvent = (name: string | Array<string>, ...args: any) => {
        if (typeof name == "object" && Array.isArray(name)) {
            for (const alias of name) {
                emitNet(alias, ...args);
            }
        } else if (typeof name == "string") {
            emitNet(name, ...args);
        } else {
            throw new Error(`Invalid Shared Trigger Name Properties for ${name}`);
        }
    };

    /**
     * Use this function to hold next script below this from executing before it finish the timeout itself
     * @author Rafly Maulana
     * @source https://docs.fivem.net/docs/scripting-manual/introduction/creating-your-first-script-javascript/
     *
     * @param ms Milisecond to wait
     *
     * @example
     * const one = () => true; // Always use ES6 for better practice
     * const two = () => true;
     *
     * setTimeout(async() => { // Always do it on async
     *      one();
     *      await wait(5000); // Wait 5s (5000ms) before executing next function, always await it
     *      two(); // Executed after 5 second after wait before
     * });
     */
    wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

    /**
     * Execute a registrated command on Koi Framework only
     * @author Rafly Maulana
     *
     * @param name The registered command name (Example: tp)
     * @param validate Validate the command using the command configuration or not
     *
     * @example
     * executeComamnd(1, 'tp', [100, 200, 300], true) // Validate the command execution
     */
    executeCommand = (name: string, src: number, args: Array<any>, validate = false) => {
        this.triggerSharedEvent("koi:server:executeCommand", name, src, args, validate);
    };

    /**
     * Registrating a command. The actual command handler is registered on server to unlock the feature like permission based command or something, so it'd write a event on client and registered a handler on server to trigger the command from registered command in client.
     * @author Rafly Maulana
     * @source https://runtime.fivem.net/doc/natives/?_0x5FA79B0F
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
        const commandRegistration = (name: string) => {
            this.addSharedEventHandler(`koi:client:requestCommand[${name}]`, (args: Array<any>, raw: string) => {
                const src = GetPlayerServerId(PlayerId());
                return handler(src, args, raw || name);
            });

            this.triggerSharedEvent("koi:server:registerCommand", name, () => {}, config, true);
        };

        if (Array.isArray(name)) {
            for (const alias of name) {
                commandRegistration(alias);
            }
        } else {
            commandRegistration(name);
        }
    };

    /**
     * Set a description on command, this function is executed automatically after you registering a command with configuration that contain description
     * @author Rafly Maulana
     * @source https://docs.fivem.net/docs/resources/chat/events/chat-addSuggestion/
     *
     * @example
     * setCommandDescription(
     *      'hello',
     *      {
     *          description: "Say Hello"
     *      }
     * )
     */
    setCommandDescription = (name: string, config: Command.Config) => {
        setImmediate(() => this.triggerClientEvent("chat:addSuggestion", `/${name}`, config.description || "No Description is Set", config.argsDescription || []));

        return true;
    };

    /**
     * Logger to Console
     * @author Rafly Maulana
     *
     * @param text Text to logs
     */
    _logger = (...text: any) => {
        console.log("[🎏 Koi Framework]", ...text);
    };

    /**
     * This function is to init a plugin, differs from the client ones, it's triggered whenever the script was ready
     * @author Rafly Maulana
     */
    _initPlugins = async (plugins: Array<{ resourceName: string; file: string; config: any }>) => {
        this._logger(`Intializing Client Plugins`);

        let count = 1; // Start from 1
        for (const plugin of plugins) {
            this._logger(`Ensuring Plugins: ${count}. ${plugin.resourceName}`);

            this.plugins[plugin.resourceName] = await import(`../../plugins/${plugin.resourceName}/client/${plugin.file}`);
            this.plugins[plugin.resourceName]._handler(this, plugin.config);

            count += 1;
        }

        this._logger("Client Plugins Ready!");
    };

    /**
     * This function is to init a config
     * @author Rafly Maulana
     */
    _initConfigs = () => {
        if (this.config) {
            if (this.config.autoRespawnDisabled) {
                /**
                 * Requires "spawnmanager" script
                 */
                (global as any).exports.spawnmanager.setAutoSpawn(false);
            }

            setTick(() => {
                if (this.config.noDispatchService) this.game.setNoDispatchService();
                if (this.config.noWantedLevel) this.game.setNoWantedLevel();
            });
        }
    };

    _events = {
        /**
         * Retrive the client configuration
         * @param settings Client Settings
         */
        retrieveClientSettings: (settings: { plugins: Array<{ resourceName: string; file: string; config: any }>; config: object }) => {
            this._initPlugins(settings.plugins);
            this.config = settings.config;
        },

        /**
         * Listen when Koi Framework is starting
         * @author Rafly Maulana
         *
         * @param resourceName Name of the resource that's starting
         */
        onClientResourceStart: async (resourceName: string) => {
            if (GetCurrentResourceName() == resourceName) {
                /**
                 * Event: Starting Process
                 */
                figlet.parseFont("Standard", standard);
                figlet.text(
                    "KOI Framework",
                    {
                        font: "Standard",
                    },
                    (err, data) => {
                        console.log(data);
                    }
                );
                this.triggerClientEvent("koi:client:starting");
                this.triggerSharedEvent("koi:client:starting");

                /**
                 * Event: Initializing
                 */
                this._logger("Starting Client...");

                this.triggerClientEvent("koi:client:initializing");
                this.triggerSharedEvent("koi:client:initializing");

                this.triggerSharedEvent("koi:server:requestClientSettings");

                while (!this.config) {
                    await this.wait(100);
                }
                this._initConfigs();

                /**
                 * Event: Ready
                 */
                this._logger("Client Ready!");

                this.triggerClientEvent("koi:client:ready");
                this.triggerSharedEvent("koi:client:ready");
            }
        },

        /**
         * Listen when Koi Framework is stopping
         * @author Rafly Maulana
         *
         * @param resourceName Name of the resource that's starting
         */
        onClientResourceStop: (resourceName: string) => {
            if (GetCurrentResourceName() == resourceName) {
                this.triggerClientEvent("koi:client:stopped");
                this.triggerSharedEvent("koi:client:stopped");
            }
        },
    };
}

const client = new Client();
(global as any).exports("getClientProps", () => client);

export default Client;
export { Client };
