import mysql from "mysql2";
import fs from "fs";
import path from "path";
import util from "util";
import DatabaseWrapper from "./database-wrapper";
import CrypterWrapper from "./crypter-wrapper";
import CommandWrapper from "./command-wrapper";
import pkg from "../../package.json";
const cfg = require("../../koi.config");

class Server {
    db: any;
    crypter: any;
    plugins: any;
    commands: any;

    constructor() {
        this.plugins = {};
        this.commands = {};

        this.db = (table: string) => new DatabaseWrapper(mysql.createConnection(cfg.mysql), table);
        this.crypter = (algorithm: string = cfg.crypter.algorithm, secretKey: string = cfg.crypter.secretKey) => new CrypterWrapper(algorithm, secretKey);

        this.addSharedEventHandler("koi:server:requestClientSettings", this._events.requestClientSettings);
        this.addSharedEventHandler("koi:server:registerCommand", this.registerCommand);

        this.addServerEventHandler("playerConnecting", this._events.playerConnecting);
        this.addServerEventHandler("onServerResourceStart", this._events.onServerResourceStart);
        this.addServerEventHandler("onServerResourceStop", this._events.onServerResourceStop);
    }

    addServerEventHandler = (names, handler) => {
        if (typeof names == "object" && Array.isArray(names)) {
            for (const name of names) {
                on(name, handler);
            }
        } else if (typeof names == "string") {
            on(names, handler);
        } else {
            throw new Error(`Invalid Server Event Name Properties for ${names}`);
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

    triggerServerEvent = (names, ...args) => {
        if (typeof names == "object" && Array.isArray(names)) {
            for (const name of names) {
                emit(name, ...args);
            }
        } else if (typeof names == "string") {
            emit(names, ...args);
        } else {
            throw new Error(`Invalid Server Trigger Name Properties for ${names}`);
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

    registerCommand = (name: string, handler: Function, config: any = false, isClientCommand: boolean = false) => {
        this.commands[name] = new CommandWrapper(this, name, handler, config, isClientCommand, Object.keys[this.commands]);
        emitNet("koi:client:setCommandDescription", -1, name, config);

        return true;
    };

    getPlayerIds = (src: any) => {
        const playerIds: any = {};

        for (let i = 0; i < GetNumPlayerIdentifiers(src); i++) {
            const id = GetPlayerIdentifier(src, i).split(":");
            playerIds[id[0]] = id[1];
        }

        playerIds.steam = !playerIds.steam || typeof playerIds.steam == "undefined" ? false : BigInt(`0x${playerIds.steam}`);
        return playerIds;
    };

    __logger = (...text) => {
        console.log("[🎏 Koi Framework]", ...text);
    };

    _getPlugins = async (type: string) => {
        let resourceList = [];

        const readDirAsync = util.promisify(fs.readdir);
        const pluginsPath = path.join(GetResourcePath(GetCurrentResourceName()), "plugins");

        const resources = await readDirAsync(pluginsPath);

        for (const resourceName of resources) {
            try {
                const files = await readDirAsync(path.join(pluginsPath, resourceName, type));

                for (const file of files) {
                    resourceList.push({ resourceName, file });
                }
            } catch (error) {
                // empty ~~
            }
        }

        return resourceList;
    };

    _initPlugins = async () => {
        this.__logger(`Intializing Server Plugins`);
        const plugins = await this._getPlugins("server");

        let count = 1; // Start from 1
        for (const plugin of plugins) {
            this.__logger(`Ensuring Plugins: ${count}. ${plugin.resourceName}`);

            this.plugins[plugin.resourceName] = require(`../../plugins/${plugin.resourceName}/server/${plugin.file}`);
            this.plugins[plugin.resourceName]._handler(this);

            count += 1;
        }

        this.__logger("Server Plugins Ready!");
    };

    _events = {
        playerConnecting: async (name, setKickReason, deferrals) => {
            deferrals.defer();
            const player = (global as any).source;

            deferrals.update(`[🎏 Koi] Hello ${name}! Please wait until we verify your account.`);

            const playerIds = this.getPlayerIds(player);
            if (!playerIds.steam || typeof playerIds.steam == "undefined") {
                return deferrals.done("[🎏 Koi] You are not connected to Steam!");
            }

            deferrals.update(`[🎏 Koi] Finding your account in our database.`);

            const user = await this.db("users").findFirst({
                where: {
                    id: playerIds.steam,
                },
            });

            let userCheck: any = false;
            const newCheckpointData = {
                last_ip: playerIds.ip.toString(),
                last_login: new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }).toString(),
            };

            // Help saving two times query execution for a new player
            if (!user) {
                userCheck = await this.db("users").write({
                    data: {
                        id: playerIds.steam,
                        ...newCheckpointData,
                    },
                });
            } else {
                if (user.banned) {
                    return deferrals.done(`[🎏 Koi] ⛔ You are banned from the server, Reason: ${user.banned_reason}`);
                }

                userCheck = await this.db("users").update({
                    data: {
                        ...newCheckpointData,
                    },
                    where: {
                        id: playerIds.steam,
                    },
                });
            }

            if (userCheck) return deferrals.done();
        },
        requestClientSettings: async () => {
            const player = (global as any).source;
            const plugins = await this._getPlugins("client");
            this.triggerSharedEvent("koi:client:retrieveClientSettings", player, {
                plugins,
                config: cfg.client,
            });
        },
        onServerResourceStart: (resourceName) => {
            if (GetCurrentResourceName() == resourceName) {
                /**
                 * Event: Starting Process
                 */
                this.triggerServerEvent("koi:server:starting");
                this.triggerSharedEvent("koi:server:starting");

                /**
                 * Event: Initializing
                 */
                this.__logger("Initializing Server...");

                this.triggerServerEvent("koi:server:initializing");
                this.triggerSharedEvent("koi:server:initializing");

                this._initPlugins();

                /**
                 * Event: Ready
                 */
                this.triggerServerEvent("koi:server:ready");
                this.triggerSharedEvent("koi:server:ready");
            }
        },
        onServerResourceStop: () => {
            this.triggerServerEvent("koi:server:stopped");
            this.triggerSharedEvent("koi:server:stopped");
        },
    };
}

const server = new Server();
(global as any).exports("getServerProps", () => server);
