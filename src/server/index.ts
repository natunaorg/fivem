"use strict";
import "@citizenfx/server";

import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

import { IS_WHITELISTED } from "@/natuna.config.js";
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
    constructor() {
        super();

        on("onServerResourceStart", this.#onServerResourceStart);
        on("playerConnecting", (...args: any) => {
            return new DeferralsChecker(globalThis.source, this.db, IS_WHITELISTED, this.players, args[0], args[2]);
        });
    }

    db = Prisma;
    events = new Events();
    utils = new Utils();
    players = new Players(this.db, this.events);
    manager = new Manager(this.events, this.players, this.utils);

    #checkPackageVersion = () => {
        return new Promise((resolve) => {
            console.log(`Welcome! Checking your version...`);
            console.log(`You are currently using version ${pkg.version}.`);

            // Can't use async await, idk why :(
            fetch("https://raw.githack.com/natuna-framework/fivem/master/package.json")
                .then((res) => res.text())
                .then((data) => {
                    const rpkg: typeof pkg = JSON.parse(data);

                    const currentVersion = parseInt(pkg.version.replace(/\./g, ""));
                    const remoteVersion = parseInt(rpkg.version.replace(/\./g, ""));

                    if (currentVersion < remoteVersion) {
                        console.log(`\x1b[31mYou are not using the latest version of Natuna Framework (${rpkg.version}), please update it!`);
                    } else if (currentVersion > remoteVersion) {
                        console.log(`\x1b[31mYou are not using a valid version version of Natuna Framework!`);
                    } else if (currentVersion === remoteVersion) {
                        console.log("\x1b[32mYou are using a latest version of Natuna Framework!");
                    }

                    return resolve(true);
                });
        });
    };

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
            console.log("Starting Server...");

            // Ready
            console.log("Server Ready!");
        }
    };
}

new Server();
