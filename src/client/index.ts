import * as Utils from "@client/wrapper/utils-wrapper";
import * as Game from "@client/wrapper/game-wrapper";
import * as Command from "@server/wrapper/command-wrapper";
import * as Players from "@client/wrapper/players-wrapper";

import Events from "@client/modules/events";

import figlet from "figlet";
import standard from "figlet/importable-fonts/Doom";
import uniqid from "uniqid";

class Client extends Events {
    /**
     * Client Configurations
     */
    config: any;

    /**
     * List of Client Plugins
     */
    plugins: any;

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

    constructor() {
        super();
        this.config;
        this.plugins = {};

        this.utils = new Utils.Wrapper(this);
        this.game = new Game.Wrapper(this);
        this.players;

        this.addSharedEventHandler("koi:client:setCommandDescription", this.setCommandDescription);

        this.addSharedCallbackEventHandler("koi:client:getAllPlayers", () => GetActivePlayers().map((x: number) => (x = GetPlayerServerId(x))));

        this.addClientEventHandler("onClientResourceStart", this._events.onClientResourceStart);
        this.addClientEventHandler("onClientResourceStop", this._events.onClientResourceStop);
    }

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
        const addCommand = (name: string) => {
            this.addSharedEventHandler(`koi:client:requestCommand[${name}]`, (args: Array<any>, raw: string) => {
                const src = GetPlayerServerId(PlayerId());
                return handler(src, args, raw || name);
            });

            this.triggerSharedEvent("koi:server:registerCommand", name, () => {}, config, true);
        };

        if (Array.isArray(name)) {
            for (const alias of name) {
                addCommand(alias);
            }
        } else {
            addCommand(name);
        }
    };

    /**
     * Set a keyboard key mapper to a function. This function also allows user to change their keybind on pause menu settings.
     * @author Rafly Maulana
     *
     * @param key Keyboard key (Example: "x")
     * @param description Description of the binding (Example: "Hands Up")
     * @param onClick Handler that are executed after the key was clicked
     * @param onReleased Handler that are executed after the key was released
     *
     * @example
     * registerKeyControl(
     *      'x',
     *      'Hands up',
     *      () => { // Executed when key clicked
     *          handsup = true;
     *          console.log('You are raising up your hands');
     *      },
     *      () => { // Executed when key released
     *          handsup = false;
     *          console.log('You are putting down your hands');
     *      }
     * )
     */
    registerKeyControl = (key: string, description: string, onClick: Function, onReleased?: Function) => {
        const commandUniqueID = uniqid("keybind-");

        RegisterCommand(`+${commandUniqueID}`, onClick, false);
        RegisterCommand(`-${commandUniqueID}`, onReleased, false);
        RegisterKeyMapping(`+${commandUniqueID}`, description, "keyboard", key);

        return "~INPUT_" + this.utils.getHashString(`+${commandUniqueID}`) + "~";
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
            this.players = new Players.Wrapper(this, this.config);

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

            if (this.config.pauseMenuTitle) {
                AddTextEntry("FE_THDR_GTAO", this.config.pauseMenuTitle);
            }
        }
    };

    _events = {
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

                this.triggerSharedEvent("koi:server:addPlayerData");

                this.triggerSharedCallbackEvent("koi:server:requestClientSettings", (settings: any) => {
                    this._initPlugins(settings.plugins);
                    this.config = settings.config;

                    this._initConfigs();
                });

                while (!this.config) await this.wait(100); // Wait for config before executing next script

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
                for (const command of GetRegisteredCommands()) {
                    if (command.name.startsWith("+keybind-") || command.name.startsWith("-keybind-")) {
                        emit("chat:removeSuggestion", `/${command.name}`);
                    }
                }

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
