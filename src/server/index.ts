"use strict";
import "@citizenfx/server";

import config from "@/natuna.config.js";
import pkg from "@/package.json";

import fetch from "node-fetch";
import figlet from "figlet";

import Players from "@server/players";
import Events from "@server/events";
import Utils from "@server/utils";
import Manager from "@server/manager";

import Prisma from "@server/lib/prisma";
import DeferralsChecker from "@server/lib/deferralCheck";

export default class Server extends Events {
    /** @hidden */
    constructor() {
        super();

        on("onServerResourceStart", this.#onServerResourceStart);
        on("playerConnecting", (...args: any) => {
            return new DeferralsChecker(globalThis.source, this.db, this.config, this.players, args[0], args[2]);
        });

        this.events.shared.listen("natuna:server:requestClientSettings", this.#requestClientSettings);
    }

    private config = config;

    db = Prisma;
    events = new Events();
    utils = new Utils(this.config);
    players = new Players(this.db, this.events);
    manager = new Manager(this.events, this.players, this.utils);

    /** @hidden */
    #logger = (...text: any) => {
        return console.log("\x1b[33m%s\x1b[0m", "[🏝️ Natuna Framework]", "[SERVER]", ...text);
    };

    /** @hidden */
    #checkPackageVersion = () => {
        return new Promise((resolve) => {
            this.#logger(`Welcome! Checking your version...`);
            this.#logger(`You are currently using version ${pkg.version}.`);

            // Can't use async await, idk why :(
            fetch("https://raw.githack.com/natuna-framework/fivem/master/package.json")
                .then((res) => res.text())
                .then((data) => {
                    const rpkg: typeof pkg = JSON.parse(data);

                    const currentVersion = parseInt(pkg.version.replace(/\./g, ""));
                    const remoteVersion = parseInt(rpkg.version.replace(/\./g, ""));

                    if (currentVersion < remoteVersion) {
                        this.#logger(`\x1b[31mYou are not using the latest version of Natuna Framework (${rpkg.version}), please update it!`);
                    } else if (currentVersion > remoteVersion) {
                        this.#logger(`\x1b[31mYou are not using a valid version version of Natuna Framework!`);
                    } else if (currentVersion === remoteVersion) {
                        this.#logger("\x1b[32mYou are using a latest version of Natuna Framework!");
                    }

                    return resolve(true);
                });
        });
    };

    /** @hidden */
    #onServerResourceStart = async (resourceName: string) => {
        if (GetCurrentResourceName() == resourceName) {
            // Starting
            await new Promise((resolve) => {
                figlet.text("Natuna Framework", {}, (err: Error, result: string) => {
                    console.log(result);
                    resolve(true);
                });
            });

            await this.#checkPackageVersion();

            // Initializing
            this.#logger("Starting Server...");

            // Ready
            this.#logger("Server Ready!");
        }
    };

    /** @hidden */
    #requestClientSettings = async () => {
        let figletText: string;

        await new Promise((resolve) => {
            figlet.text("Natuna Framework", {}, (err: Error, result: string) => {
                figletText = result;
                resolve(true);
            });
        });

        return JSON.stringify({
            figletText,
            config: {
                players: this.config.core.players,
                discordRPC: this.config.core.discordRPC,
                nui: this.config.core.nui,
                game: this.config.core.game,
            },
        });
    };
}

new Server();
