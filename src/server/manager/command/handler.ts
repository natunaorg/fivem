"use strict";
import "@citizenfx/server";

import type Events from "@server/events";
import type Players from "@server/players";
import type Utils from "@server/utils";

/**
 * @description
 * A Handler to execute function when called.
 *
 * @param src (Source) return the player id whose triggering it.
 * @param args (Arguments) return text after command in Array, example, if you're triggering the command like this "/hello all people", the arguments returns was ["all", "people"].
 * @param raw (Raw) return raw version of the command triggered.
 */
export type Handler = (src: number, args: any[], raw: string) => any;

/**
 * @description
 * Set a configuration on a command
 *
 * @arg description Description of a command
 * @arg argsDescription Description of every arguments required
 * @arg restricted If you want to limit your command with an ace permission automatically
 * @arg cooldown Cooldown of the command usage
 * @arg consoleOnly Whether if the command can only be used on the console
 * @arg requirements User requirements before using the command
 * @arg caseInsensitive Whether the command is case sensitive or not
 * @arg cooldownExclusions Set the cooldown bypass for some users or groups
 *
 * @example
 * ```ts
 * {
 *      description: "Set Weather Status",
 *      argsDescription: [
 *          { name: "Weather Condition", help: "clear | rain | thunder" } // Argument 1
 *          // Argument 2, 3, ...
 *      ]
 * }
 * ```
 */
export type Config = {
    argsRequired?: boolean | number;
    description?: string;
    argsDescription?: {
        name: string;
        help: string;
    }[];
    cooldown?: number;
    consoleOnly?: boolean;
    requirements?: {
        userIDs?: number[];
        custom?: () => boolean;
    };
    caseInsensitive?: boolean;
    cooldownExclusions?: {
        userIDs?: number[];
    };
    restricted?: boolean;
};

export enum EventType {
    CLIENT_EXECUTE_COMMAND = "natuna:client:command:execute",
    SET_COMMAND_DESCRIPTION = "natuna:client:command:setDescription",
    REGISTER_COMMAND = "natuna:server:command:register",
}

/**
 * This class is included when registering a command on server with `registerCommand` function.
 *
 * Use it if you know what you're doing.
 */
export default class Command {
    constructor(
        private events: Events, //
        private players: Players,
        private utils: Utils,
        private name: string,
        private rawHandler: Handler,
        private rawConfig: Config,
        private isClientCommand: boolean
    ) {
        this.#config = this.#parseConfig(this.rawConfig);

        RegisterCommand(
            name,
            (src: number, args: string[], raw: string) => {
                const validation = this.#validateExecution(src, args, raw);

                if (validation) {
                    return this.#handler(src, args, raw);
                } else if (typeof validation === "string") {
                    return console.log(validation);
                }
            },
            this.#config.restricted
        );
    }

    #config: Config = {};
    #cooldownList: Record<number, number> = {};

    #handler = (src: number, args: string[], raw: string) => {
        if (this.isClientCommand) {
            return this.events.shared.emit(EventType.CLIENT_EXECUTE_COMMAND, src, [this.name, args, raw]);
        }

        return this.rawHandler;
    };

    /**
     * @description
     * Parse the command configuration and validate it.
     *
     * @param config Command Configuration
     */
    #parseConfig = (config: Config) => {
        config = this.utils.validator.isObject(config) ? config : {};
        config.requirements = this.utils.validator.isObject(config.requirements) ? config.requirements : {};
        config.cooldownExclusions = this.utils.validator.isObject(config.cooldownExclusions) ? config.cooldownExclusions : {};
        config.argsDescription = this.utils.validator.isArray(config.argsDescription) ? config.argsDescription : [];

        config = {
            argsRequired: false,
            description: "No Description Available",
            cooldown: 0,
            consoleOnly: false,
            caseInsensitive: false,
            restricted: false,
            ...config,
            argsDescription: [...config.argsDescription],
            requirements: {
                ...config.requirements,
            },
            cooldownExclusions: {
                ...config.cooldownExclusions,
            },
        };

        return config;
    };

    /**
     * @description
     * Validate an execution of the command.
     *
     * @param src Server ID of the player that executed the command
     * @param args Arguments given in the command
     * @param raw Raw command output
     */
    #validateExecution = (src: number, args: string[], raw: string) => {
        if (this.#config.argsRequired && args.length <= this.#config.argsRequired) {
            return "Not enough arguments passed.";
        }

        if (this.#config.consoleOnly && src !== 0) {
            return "This command can only be executed from console!";
        }

        const user = this.players.get({
            server_id: src,
        });

        if (user) {
            const cooldown = this.#config.cooldown;
            const cooldownList = this.#cooldownList;
            const cooldownExclusions = this.#config.cooldownExclusions;

            if (cooldown && cooldownList[src] && Date.now() - cooldownList[src] <= cooldown) {
                if (
                    !cooldownExclusions || // Option A: If there are no cooldown exclusion
                    (cooldownExclusions.userIDs && !cooldownExclusions.userIDs.includes(user.user_id)) // Option B: If there are steamIDs configured, but player wasn't on the list
                ) {
                    return "Still under cooldown.";
                }
            }

            const requirements = this.#config.requirements;

            if (requirements) {
                switch (true) {
                    case requirements.userIDs && !requirements.userIDs.includes(user.user_id):
                    case requirements.custom && !requirements.custom():
                        return "You don't have the required permissions to execute this command.";
                }
            }

            if (this.#config.caseInsensitive && this.name !== raw) {
                return false;
            }

            this.#cooldownList[src] = Date.now();
            return true;
        }

        return false;
    };
}
