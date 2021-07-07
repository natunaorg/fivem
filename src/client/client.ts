import Utils from "./utils";
import Game from "./game";

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

        this.triggerSharedEvent("koi:server:requestClientSettings");

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

    registerCommand = (name: string, handler: Function, config: any = false) => {
        this.addSharedEventHandler(`koi:client:requestCommand[${name}]`, (args, raw) => {
            const src = PlayerId();
            return handler(src, args, raw);
        });

        this.triggerSharedEvent("koi:server:registerCommand", name, () => {}, config, true);

        return true;
    };

    setCommandDescription = (name: string, config: any) => {
        setImmediate(() => this.triggerClientEvent("chat:addSuggestion", `/${name}`, config.description || "No Description is Set", config.argsDescription || []));

        return true;
    };

    __logger = (...text) => {
        console.log("[🎏 Koi Framework]", ...text);
    };

    _initPlugins = async (plugins) => {
        this.__logger(`Intializing Client Plugins`);

        let count = 1; // Start from 1
        for (const plugin of plugins) {
            this.__logger(`Ensuring Plugins: ${count}. ${plugin.resourceName}`);

            this.plugins[plugin.resourceName] = await import(`../../plugins/${plugin.resourceName}/client/${plugin.file}`);
            this.plugins[plugin.resourceName]._handler(this);

            count += 1;
        }

        this.__logger("Client Plugins Ready!");
    };

    _initConfigs = () => {
        if (this.config) {
            if (this.config.autoRespawnEnabled) {
                /**
                 * Requires "spawnmanager" script
                 */
                exports.spawnmanager.setAutoSpawn(this.config.autoRespawnEnabled);
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
                this.triggerClientEvent("koi:client:starting");
                this.triggerSharedEvent("koi:client:starting");

                /**
                 * Event: Initializing
                 */
                this.__logger("Initializing Client...");

                this.triggerClientEvent("koi:client:initializing");
                this.triggerSharedEvent("koi:client:initializing");

                this._initConfigs();

                /**
                 * Event: Ready
                 */
                this.triggerClientEvent("koi:client:ready");
                this.triggerSharedEvent("koi:client:ready");
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
