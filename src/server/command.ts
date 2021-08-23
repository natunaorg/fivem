/**
 * @module Server - Commands
 * @category Server
 */

"use strict";
import Server from "@server";

/**
 * @description
 * A Handler to execute function when called.
 *
 * @param src (Source) return the player id whose triggering it.
 * @param args (Arguments) return text after command in Array, example, if you're triggering the command like this "/hello all people", the arguments returns was ["all", "people"].
 * @param raw (Raw) return raw version of the command triggered.
 */
export type Handler = (src: number, args: any[], raw: String) => any;

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
    argsDescription?: Array<{ name: string; help: string }>;
    cooldown?: number;
    consoleOnly?: boolean;
    requirements?: {
        userIDs?: Array<number>;
        custom?: Function;
    };
    caseInsensitive?: boolean;
    cooldownExclusions?: {
        userIDs?: Array<number>;
    };
    restricted?: boolean;
};

/**
 * This class is included when registering a command on server with `registerCommand` function.
 *
 * Use it if you know what you're doing.
 */
export default class Command {
    /**
     * @hidden
     */
    client: Server;

    /**
     * @hidden
     */
    cooldownList: any;

    /**
     * @hidden
     */
    isClientCommand: boolean;

    name: string;
    handler: Handler;
    config: Config;

    /**
     * @hidden
     */
    constructor(client: Server, name: string, handler: Handler, config: Config, isClientCommand: boolean) {
        this.client = client;
        this.cooldownList = {};

        this.name = name;
        this.isClientCommand = isClientCommand;
        this.config = this.parseConfig(config);
        this.handler = (src, args, raw) => (this.isClientCommand ? this.client.triggerSharedEvent(`natuna:client:executeCommand`, src, this.name, args, raw) : handler);

        RegisterCommand(
            name,
            (src: number, args: Array<any>, raw: string) => {
                const validation = this.validateExecution(src, args, raw);
                if (validation == true) {
                    return this.handler(src, args, raw);
                } else if (validation !== false) {
                    // If validation returns was a string
                    return console.log(validation);
                }
            },
            this.config.restricted
        );
    }

    /**
     * @description
     * Parse the command configuration and validate it.
     *
     * @param config Command Configuration
     */
    parseConfig = (config: Config) => {
        config = this.validator.isObject(config) ? config : {};
        config.requirements = this.validator.isObject(config.requirements) ? config.requirements : {};
        config.cooldownExclusions = this.validator.isObject(config.cooldownExclusions) ? config.cooldownExclusions : {};
        config.argsDescription = this.validator.isArray(config.argsDescription) ? config.argsDescription : [];

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
    validateExecution = (src: number, args: Array<any>, raw: string) => {
        if (this.config.argsRequired && args.length < this.config.argsRequired) {
            return "Not enough arguments passed.";
        }

        if (this.config.consoleOnly && src !== 0) {
            return "This command can only be executed from console!";
        }

        const user = this.client.players.get({
            where: {
                server_id: src,
            },
        });

        if (user) {
            const cooldown = this.config.cooldown;
            const cooldownList = this.cooldownList;
            const cooldownExclusions = this.config.cooldownExclusions;

            if (cooldown && cooldownList[src] && Date.now() - cooldownList[src] <= cooldown) {
                if (
                    !cooldownExclusions || // Option A: If there are no cooldown exclusion
                    (cooldownExclusions.userIDs && !cooldownExclusions.userIDs.includes(user.user_id)) // Option B: If there are steamIDs configured, but player wasn't on the list
                ) {
                    return "Still under cooldown.";
                }
            }

            const requirements = this.config.requirements;

            if (requirements) {
                if (
                    (requirements.userIDs && !requirements.userIDs.includes(user.user_id)) || // Option A: Not included in User IDs
                    (requirements.custom && !requirements.custom()) // Option B: Custom requirement function return false
                ) {
                    return "You dont have enough permission!";
                }
            }

            if (this.config.caseInsensitive && this.name !== raw) {
                return false;
            }

            this.cooldownList[src] = Date.now();
            return true;
        }

        return false;
    };

    validator = {
        isObject: (obj: object) => {
            if (!obj || typeof obj == "undefined" || typeof obj !== "object" || Array.isArray(obj)) {
                return false;
            }
            return true;
        },
        isArray: (arr: Array<any>) => {
            if (!arr || typeof arr == "undefined" || !Array.isArray(arr)) {
                return false;
            }
            return true;
        },
    };
}
