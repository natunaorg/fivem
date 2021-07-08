import Utils from "./utils";
import Game from "./game";

import figlet from "figlet";
import standard from "figlet/importable-fonts/Doom";

global = global as any;
exports = global.exports;

class Client {
    config: any;
    plugins: any;
    utils: Utils;
    game: Game;

    constructor() {
        this.config = false;
        this.plugins = {};

        this.utils = new Utils(this);
        this.game = new Game(this);

        this.addSharedEventHandler("koi:client:retrieveClientSettings", this._events.retrieveClientSettings);
        this.addSharedEventHandler("koi:client:setCommandDescription", this.setCommandDescription);

        this.addClientEventHandler("onClientResourceStart", this._events.onClientResourceStart);
        this.addClientEventHandler("onClientResourceStop", this._events.onClientResourceStop);
    }

    addClientEventHandler = (names, handler) => {
        if (typeof names == "object" && Array.isArray(names)) {
            for (const name of names) {
                on(name, handler);
            }
        } else if (typeof names == "string") {
            on(names, handler);
        } else {
            throw new Error(`Invalid Client Event Name Properties for ${names}`);
        }
    };

    addSharedEventHandler = (names, handler) => {
        if (typeof names == "object" && Array.isArray(names)) {
            for (const name of names) {
                onNet(name, handler);
            }
        } else if (typeof names == "string") {
            onNet(names, handler);
        } else {
            throw new Error(`Invalid Shared Event Name Properties for ${names}`);
        }
    };

    triggerClientEvent = (names, ...args) => {
        if (typeof names == "object" && Array.isArray(names)) {
            for (const name of names) {
                emit(name, ...args);
            }
        } else if (typeof names == "string") {
            emit(names, ...args);
        } else {
            throw new Error(`Invalid Client Trigger Name Properties for ${names}`);
        }
    };

    triggerSharedEvent = (names, ...args) => {
        if (typeof names == "object" && Array.isArray(names)) {
            for (const name of names) {
                emitNet(name, ...args);
            }
        } else if (typeof names == "string") {
            emitNet(names, ...args);
        } else {
            throw new Error(`Invalid Shared Trigger Name Properties for ${names}`);
        }
    };

    wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

    registerCommand = (name: string | Array<string>, handler: Function, config: any = false) => {
        const commandRegistration = (name) => {
            this.addSharedEventHandler(`koi:client:requestCommand[${name}]`, (args, raw) => {
                const src = PlayerId();
                return handler(src, args, raw);
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

        return true;
    };

    setCommandDescription = (name: string, config: any) => {
        setImmediate(() => this.triggerClientEvent("chat:addSuggestion", `/${name}`, config.description || "No Description is Set", config.argsDescription || []));

        return true;
    };

    _logger = (...text) => {
        console.log("[🎏 Koi Framework]", ...text);
    };

    _initPlugins = async (plugins) => {
        this._logger(`Intializing Client Plugins`);

        let count = 1; // Start from 1
        for (const plugin of plugins) {
            this._logger(`Ensuring Plugins: ${count}. ${plugin.resourceName}`);

            this.plugins[plugin.resourceName] = await import(`../../plugins/${plugin.resourceName}/client/${plugin.file}`);
            this.plugins[plugin.resourceName]._handler(this, this.config);

            count += 1;
        }

        this._logger("Client Plugins Ready!");
    };

    _initConfigs = () => {
        if (this.config) {
            if (this.config.autoRespawnDisabled) {
                /**
                 * Requires "spawnmanager" script
                 */
                exports.spawnmanager.setAutoSpawn(false);
            }

            setTick(() => {
                if (this.config.onTickRateOptions) {
                    for (const prop in this.game.onTickRateOptions) {
                        if (this.config.onTickRateOptions[prop]) this.game.onTickRateOptions[prop]();
                    }
                }
            });
        }
    };

    _events = {
        retrieveClientSettings: (settings) => {
            this._initPlugins(settings.plugins);
            this.config = settings.config;
        },
        onClientResourceStart: (resourceName) => {
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

                let checkConfig = setInterval(() => {
                    if (this.config) {
                        clearInterval(checkConfig);
                        this._initConfigs();

                        /**
                         * Event: Ready
                         */
                        this._logger("Client Ready!");

                        this.triggerClientEvent("koi:client:ready");
                        this.triggerSharedEvent("koi:client:ready");
                    }
                }, 500);
            }
        },
        onClientResourceStop: () => {
            this.triggerClientEvent("koi:client:stopped");
            this.triggerSharedEvent("koi:client:stopped");
        },
    };
}

const client = new Client();
global.exports("getClientProps", () => client);
