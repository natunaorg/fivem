/**
 * @module Server
 * @category Server
 */

"use strict";
import "@citizenfx/server";

import config from "@/natuna.config.js";
import pkg from "@/package.json";

import { lstatSync } from "fs";
import { basename, join, normalize } from "path";

import fetch from "node-fetch";
import figlet from "figlet";
import glob from "tiny-glob";

import CrypterWrapper from "@server/crypter";
import PlayersWrapper from "@server/players";
import CommandWrapper, { Config, Handler } from "@server/command";

import Events from "@server/events";
import prisma from "@server/lib/prisma";

export type PluginManifest = {
    active: boolean;
    dirname?: string;
    client: {
        configs: {
            [key: string]: string;
        };
        modules: string[];
    };
    server: {
        configs: {
            [key: string]: string;
        };
        modules: string[];
    };
};

export default class Server extends Events {
    /**
     * @hidden
     */
    constructor() {
        super();

        prisma.$connect().catch((err) => {
            throw new Error(err);
        });

        this.addSharedEventHandler("natuna:server:registerCommand", this.registerCommand);

        this.addSharedEventHandler("natuna:server:requestClientSettings", async (source: number) => {
            while (Object.keys(this.plugins).length == 0) await this.wait(500);

            let figletText: string;
            let clientPlugins = { ...this.plugins };

            for (const plugins in clientPlugins) {
                delete clientPlugins[plugins].server;
            }

            await new Promise((resolve) => {
                figlet.text("Natuna Framework", {}, (err: Error, result: string) => {
                    figletText = result;
                    resolve(true);
                });
            });

            return JSON.stringify({
                figletText,
                plugins: clientPlugins,
                config: {
                    players: this.config.core.players,
                    discordRPC: this.config.core.discordRPC,
                    nui: this.config.core.nui,
                    game: this.config.core.game,
                },
            });
        });

        this.addServerEventHandler("playerConnecting", async (name: string, setKickReason: (reason: string) => any, deferrals: { [key: string]: any }) => {
            /**
             * @description
             * Getting player
             */
            deferrals.defer();
            const player = (global as any).source;

            deferrals.update(`[🏝 Natuna] Hello ${name}! Please wait until we verify your account.`);

            /**
             * @description
             * Checking License
             */
            const playerIds = this.players.utils.getIdentifiers(player);

            if (!playerIds.license || typeof playerIds.license == "undefined") {
                return deferrals.done("[🏝 Natuna] Your game license is invalid!");
            }

            this._logger(`Player ${name} Joining the server. (License ID: ${playerIds.license})`);

            /**
             * @description
             * Checking Whitelist Status
             */
            if (this.config.core.isWhitelisted) {
                const checkWhitelistStatus = await prisma.whitelist_lists.findFirst({
                    where: {
                        license: playerIds.license,
                    },
                });

                if (!checkWhitelistStatus) {
                    return deferrals.done("[🏝 Natuna] You are not whitelisted!");
                }
            }

            /**
             * @description
             * Checking Account
             */
            deferrals.update(`[🏝 Natuna] Finding your account in our database.`);

            const user = await prisma.users.findFirst({
                where: {
                    license: playerIds.license,
                },
            });

            const newCheckpointData = {
                last_ip: playerIds.ip.toString(),
                last_login: new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }).toString(),
            };

            /**
             * @description
             * Handling when account does not exist
             */
            // If account does not exist
            if (!user) {
                await prisma.users.create({
                    data: {
                        license: playerIds.license,
                        ...newCheckpointData,
                    },
                });
            }

            // If account exist
            else {
                // If user was banned
                const checkBanStatus = await prisma.ban_lists.findFirst({
                    where: {
                        license: playerIds.license,
                    },
                });

                if (checkBanStatus) {
                    return deferrals.done(checkBanStatus.reason);
                }

                // If not
                await prisma.users.updateMany({
                    data: {
                        ...newCheckpointData,
                    },
                    where: {
                        license: playerIds.license,
                    },
                });
            }

            setImmediate(() => deferrals.done());
        });

        this.addServerEventHandler("onServerResourceStart", async (resourceName: string) => {
            if (GetCurrentResourceName() == resourceName) {
                // Starting
                this.triggerServerEvent("natuna:server:starting");

                await new Promise((resolve) => {
                    figlet.text("Natuna Framework", {}, (err: Error, result: string) => {
                        console.log(result);
                        resolve(true);
                    });
                });

                await this._checkPackageVersion();

                // Initializing
                this.triggerServerEvent("natuna:server:initializing");

                this._logger("Starting Server...");
                await this._initServerPlugins();

                // Ready
                this.triggerServerEvent("natuna:server:ready");

                this._logger("Server Ready!");
            }
        });

        this.addServerEventHandler("onServerResourceStop", (resourceName: string) => {
            if (GetCurrentResourceName() == resourceName) {
                // Stopping
                this.triggerServerEvent("natuna:server:stopped");
            }
        });
    }

    /**
     * @hidden
     *
     * @description
     * List of All Plugins
     */
    private plugins: Record<string, PluginManifest> = {};

    /**
     * @hidden
     *
     * @description
     * Configurations
     */
    private config = config;

    /**
     * @hidden
     *
     * @description
     * List of Registered Commands
     */
    private commands: Record<string, CommandWrapper> = {};

    /**
     * @description
     * Players wrapper
     */
    players = new PlayersWrapper(this, this.config);

    /**
     * @description
     * Crypter to Encrypt or Decrypt your secret data
     */
    crypter = (algorithm: string = this.config.core.crypter.algorithm, secretKey: string = this.config.core.crypter.secretKey) => new CrypterWrapper(algorithm, secretKey);

    /**
     * @description
     * Use this function to hold next script below this from executing before it finish the timeout itself
     *
     * @param ms Milisecond to wait
     *
     * @example
     * ```ts
     * const one = () => true; // Always use ES6 for better practice
     * const two = () => true;
     *
     * setTimeout(async() => { // Always do it on async
     *      one();
     *      await wait(5000); // Wait 5s (5000ms) before executing next function, always await it
     *      two(); // Executed after 5 second after wait before
     * });
     * ```
     */
    wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

    /**
     * @description
     * Registrating a command. If isClientCommand was set true, the handler would just triggering a client registered command
     *
     * @param name Name of the command
     * @param handler Function to executed
     * @param config Configuration of the command
     * @param isClientCommand Whether if the command was sent from client or not
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
    registerCommand = (name: string | Array<string>, handler: Handler, config: Config = {}, isClientCommand = false) => {
        const addCommand = (name: string) => {
            // Throws an error when same server command was registered twice
            if (this.commands[name] && !isClientCommand) throw new Error(`Command "${name}" had already been registered before!`);

            emitNet("natuna:client:setCommandDescription", -1, name, config);

            // Return if client command was already registered before
            if (this.commands[name] && isClientCommand) return;
            this.commands[name] = new CommandWrapper(this, name, handler, config, isClientCommand);
        };

        if (Array.isArray(name)) {
            for (const alias of name) {
                addCommand(alias);
            }
        } else {
            addCommand(name);
        }
        return true;
    };

    /**
     * @hidden
     * @readonly
     *
     * @description
     * Logger to Console
     *
     * @param text Text to logs
     */
    private _logger = (...text: any) => {
        return console.log("\x1b[33m%s\x1b[0m", "[🏝️ Natuna Framework]", "[SERVER]", ...text);
    };

    /**
     * @hidden
     * @readonly
     *
     * @description
     * This function is to init a plugin, differs from the client ones, it's triggered whenever the script was ready
     */
    private _initServerPlugins = async () => {
        this._logger(`Intializing Server Plugins`);

        let count = 1;
        for (const pluginName in this.plugins) {
            const plugin = this.plugins[pluginName];
            this._logger(`> Starting Plugins: \x1b[47m\x1b[2m\x1b[30m ${count}. ${pluginName} \x1b[0m`);

            for (let pluginFile of plugin.server.modules) {
                const module = require(pluginFile);

                if (module && module.default && typeof module.default === "function") {
                    this._logger(`  - Mounting Module: \x1b[32m${pluginFile}\x1b[0m`);
                    module.default(this, plugin.server.configs);
                }
            }

            count += 1;
        }

        this._logger("Server Plugins Ready!");
    };

    /**
     * @hidden
     * @readonly
     *
     * @description
     * Check package version and compare it to remote repository.
     */
    private _checkPackageVersion = () => {
        return new Promise((resolve, reject) => {
            this._logger(`Welcome! Checking your version...`);
            this._logger(`You are currently using version ${pkg.version}.`);

            // Can't use async await, idk why :(
            fetch("https://raw.githack.com/natuna-framework/fivem/master/package.json")
                .then((res) => res.text())
                .then((data) => {
                    const rpkg: typeof pkg = JSON.parse(data);

                    const currentVersion = parseInt(pkg.version.replace(/\./g, ""));
                    const remoteVersion = parseInt(rpkg.version.replace(/\./g, ""));

                    if (currentVersion < remoteVersion) {
                        this._logger(`\x1b[31mYou are not using the latest version of Natuna Framework (${rpkg.version}), please update it!`);
                    } else if (currentVersion > remoteVersion) {
                        this._logger(`\x1b[31mYou are not using a valid version version of Natuna Framework!`);
                    } else if (currentVersion === remoteVersion) {
                        this._logger("\x1b[32mYou are using a latest version of Natuna Framework!");
                    }

                    return resolve(true);
                });
        });
    };
}

new Server();
