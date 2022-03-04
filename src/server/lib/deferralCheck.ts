"use strict";
import "@citizenfx/server";
import Server from "@server";
import Players from "@server/players";

export default class DeferralsChecker {
    constructor(
        private source: number, //
        private db: Server["db"],
        private isWhitelisted: boolean,
        private players: Players,
        private name: string,
        private deferrals: Record<string, any>
    ) {
        (async () => {
            this.deferrals.defer();
            deferrals.update(`[🏝 Natuna] Hello ${this.name}! Please wait until we verify your account.`);
            this.#checkLicense();
            await this.#checkWhitelist();

            console.log(`Player ${this.name} Joining the server. (License ID: ${this.#playerIds.license})`);
            deferrals.update(`[🏝 Natuna] Finding your account in our database.`);
            await this.#checkAccount();

            setImmediate(() => deferrals.done());
        })();
    }

    #playerIds = this.players.utils.getIdentifiers(this.source);

    #checkLicense = () => {
        if (!this.#playerIds.license || typeof this.#playerIds.license == "undefined") {
            return this.deferrals.done("[🏝 Natuna] Your game license is invalid!");
        }
    };

    #checkWhitelist = async () => {
        if (this.isWhitelisted) {
            const checkWhitelistStatus = await this.db.whitelist_lists.findFirst({
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
        const user = await this.db.users.findFirst({
            where: {
                license: this.#playerIds.license,
            },
        });

        const newCheckpointData = {
            last_ip: this.#playerIds.ip.toString(),
            last_login: new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }).toString(),
        };

        switch (!user) {
            case true:
                await this.db.users.create({
                    data: {
                        license: this.#playerIds.license,
                        ...newCheckpointData,
                    },
                });

                break;

            case false:
                // Check if user was banned
                const checkBanStatus = await this.db.ban_lists.findFirst({
                    where: {
                        license: this.#playerIds.license,
                    },
                });

                if (checkBanStatus) {
                    return this.deferrals.done(checkBanStatus.reason);
                }

                // If not
                await this.db.users.updateMany({
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
