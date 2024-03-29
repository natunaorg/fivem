"use strict";
import "@citizenfx/server";

import type Logger from "@ptkdev/logger";

import Database from "@server/database";
import Players from "@server/players";

export default class DeferralsManager {
    constructor(
        source: number, //
        private db: ReturnType<typeof Database>,
        private isWhitelisted: boolean,
        private players: Players,
        private name: string,
        private deferrals: Record<string, any>,
        private logger: Logger
    ) {
        this.#playerIds = this.players.utils.getIdentifiers(source);

        (async () => {
            this.deferrals.defer();
            deferrals.update(`[🏝 Natuna] Hello ${this.name}! Please wait until we verify your account.`);
            this.#checkLicense();
            await this.#checkWhitelist();

            this.logger.debug(`Player ${this.name} Joining the server. (License ID: ${this.#playerIds.license})`);
            deferrals.update(`[🏝 Natuna] Finding your account in our database.`);
            await this.#checkAccount();

            setImmediate(() => deferrals.done());
        })();
    }

    #playerIds: ReturnType<Players["utils"]["getIdentifiers"]>;

    #checkLicense = () => {
        if (!this.#playerIds.license || typeof this.#playerIds.license == "undefined") {
            return this.deferrals.done("[🏝 Natuna] Your game license is invalid!");
        }
    };

    #checkWhitelist = async () => {
        if (this.isWhitelisted) {
            const checkWhitelistStatus = await this.db("whitelist_lists").findFirst({
                where: {
                    license: this.#playerIds.license,
                },
            });

            if (!checkWhitelistStatus) {
                return this.deferrals.done("[🏝 Natuna] You are not whitelisted!");
            }
        }
    };

    #checkAccount = async () => {
        const user = await this.db("users").findFirst({
            where: {
                license: this.#playerIds.license,
            },
        });

        const newCheckpointData = {
            last_ip: this.#playerIds.ip.toString(),
            last_login: new Date().toLocaleString("en-US", { timeZone: process.env.TZ }).toString(),
        };

        switch (!user) {
            case true:
                await this.db("users").create({
                    data: {
                        license: this.#playerIds.license,
                        ...newCheckpointData,
                    },
                });

                break;

            case false:
                // Check if user was banned
                const checkBanStatus = await this.db("ban_lists").findFirst({
                    where: {
                        license: this.#playerIds.license,
                    },
                });

                if (checkBanStatus) {
                    return this.deferrals.done(checkBanStatus.reason);
                }

                // If not
                await this.db("users").update({
                    data: {
                        ...newCheckpointData,
                    },
                    where: {
                        license: this.#playerIds.license,
                    },
                });
        }
    };
}
