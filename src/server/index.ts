"use strict";
import "@citizenfx/server";

import path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

import pkg from "@/package.json";
import fetch from "node-fetch";
import Logger from "@ptkdev/logger";
import { PrismaClient } from "@prisma/client";

import Players from "@server/players";
import Events from "@server/events";
import Utils from "@server/utils";
import Manager from "@server/manager";

import DeferralsChecker from "@server/lib/deferralCheck";

export type Config = Partial<typeof pkg["natuna"]>;

export enum EventType {
    GET_CLIENT_CONFIG = "natuna:client:config",
}

export default class Server {
    constructor() {
        this.events.shared.listen(EventType.GET_CLIENT_CONFIG, () => this.config);

        on("onServerResourceStart", this.#onServerResourceStart);
        on("playerConnecting", (...args: any) => {
            return new DeferralsChecker(globalThis.source, this.db, this.config.whitelisted, this.players, args[0], args[2], this.logger);
        });
    }

    config: Config = pkg.natuna;
    db = new PrismaClient();
    events = new Events();
    utils = new Utils();
    players = new Players(this.db, this.events);
    manager = new Manager(this.events, this.players, this.utils);
    logger = new Logger({
        language: "en",
        colors: true,
        debug: true,
        info: true,
        warning: true,
        error: true,
        sponsor: true,
        write: true,
        type: "json",
        rotate: {
            size: "10M",
            encoding: "utf8",
        },
        path: {
            debug_log: path.posix.join("..", "..", ".natuna", "logs", "debug.log"),
            error_log: path.posix.join("..", "..", ".natuna", "logs", "errors.log"),
        },
    });

    #checkPackageVersion = () => {
        return new Promise((resolve) => {
            this.logger.debug(`Welcome! Checking your version...`);
            this.logger.debug(`You are currently using version ${pkg.version}.`);

            // Can't use async await, idk why :(
            fetch("https://raw.githack.com/natuna-framework/fivem/master/package.json")
                .then((res) => res.text())
                .then((data) => {
                    const rpkg: typeof pkg = JSON.parse(data);

                    const currentVersion = parseInt(pkg.version.replace(/\./g, ""));
                    const remoteVersion = parseInt(rpkg.version.replace(/\./g, ""));

                    switch (true) {
                        case currentVersion < remoteVersion:
                            this.logger.warning(`You are not using the latest version of Natuna Framework (${rpkg.version}), please update it!`);
                            break;
                        case currentVersion > remoteVersion:
                            this.logger.error(`You are not using a valid version version of Natuna Framework!`);
                            break;
                        default:
                            this.logger.info("You are using a latest version of Natuna Framework!");
                    }

                    return resolve(true);
                });
        });
    };

    #onServerResourceStart = async (resourceName: string) => {
        if (GetCurrentResourceName() == resourceName) {
            console.log(this.utils.asciiArt);
            this.logger.debug("Starting Server...");

            await this.#checkPackageVersion();

            this.logger.info("Server Ready!");
        }
    };
}

const server = new Server();
globalThis.exports("server", server);
