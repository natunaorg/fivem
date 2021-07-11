import Server from "@server/main";

/**
 * A Handler to execute function when called.
 * @author Rafly Maulana
 *
 * @param src (Source) return the player id whose triggering it.
 * @param args (Arguments) return text after command in Array, example, if you're triggering the command like this "/hello all people", the arguments returns was ["all", "people"].
 * @param raw (Raw) return raw version of the command triggered.
 */
type Handler = (src: number, args: any[], raw: String) => any;

/**
 * Set a configuration on a command
 * @author Rafly Maulana
 *
 * @typedef {Object} ShowOptions
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
 * {
 *      description: "Set Weather Status",
 *      argsDescription: [
 *          { name: "Weather Condition", help: "clear | rain | thunder" } // Argument 1
 *          // Argument 2, 3, ...
 *      ]
 * }
 */
type Config = {
    argsRequired?: boolean | number;
    description?: string;
    argsDescription?: Array<{ name: string; help: string }>;
    cooldown?: number;
    consoleOnly?: boolean;
    requirements?: {
        userIDs: Array<string>;
    };
    caseInsensitive?: boolean;
    cooldownExclusions?: {
        userIDs: Array<string>;
    };
    restricted?: boolean;
};

class Wrapper {
    client: Server;
    name: string;
    handler: Handler;
    config: Config;
    cooldown: any;
    isClientCommand: boolean;

    constructor(client: Server, name: string, handler: Handler, config: Config, isClientCommand: boolean) {
        this.client = client;
        this.cooldown = {};

        this.name = name;
        this.isClientCommand = isClientCommand;
        this.config = this.parseConfig(config);
        this.handler = (src, args, raw) => {
            if (this.isClientCommand) {
                return this.client.triggerSharedEvent(`koi:client:requestCommand[${this.name}]`, src, args, raw);
            } else {
                return handler;
            }
        };

        RegisterCommand(
            name,
            (src: number, args: Array<any>, raw: string) => {
                const validation = this.validateExecution(src, args, raw);
                if (validation == true) {
                    this.handler(src, args, raw);
                } else if (validation !== false) {
                    // If validation returns was a string
                    return console.log(validation);
                }
            },
            this.config.restricted
        );
    }

    parseConfig = (config: any) => {
        config = this.validator.isObject(config) ? config : {};
        config.requirements = this.validator.isObject(config.requirements) ? config.requirements : {};
        config.cooldownExclusions = this.validator.isObject(config.cooldownExclusions) ? config.cooldownExclusions : {};
        config.argsDescription = this.validator.isArray(config.argsDescription) ? config.argsDescription : [];

        config = Object.assign(
            {
                argsRequired: false,
                description: "No Description Available",
                argsDescription: [],
                cooldown: false,
                consoleOnly: false,
                requirements: {},
                caseInsensitive: false,
                cooldownExclusions: {},
                restricted: false,
            },
            config
        );

        return config;
    };

    validateExecution = (src: number, args: Array<any>, raw: string) => {
        if (this.config.argsRequired && args.length < this.config.argsRequired) {
            return "Not enough arguments passed.";
        }

        if (this.config.consoleOnly && src !== 0) {
            return "This command can only be executed from console!";
        }

        const userID = this.client.getPlayerIds(src).steam;

        // if (this.config.cooldown) {
        //     if (this.cooldown[src] && Date.now() - this.cooldown[src] < this.config.cooldown) {
        //         if (!this.config.cooldownExclusions || (this.config.cooldownExclusions && !this.config.cooldownExclusions.userIDs.includes(userID.toString()))) {
        //             return "Still under cooldown.";
        //         }
        //     }
        // }

        if (this.config.requirements) {
            if (this.config.requirements.userIDs && !this.config.requirements.userIDs.includes(userID.toString())) {
                return "You dont have enough permission!";
            }
        }

        if (this.config.caseInsensitive && this.name !== raw) {
            return false;
        }

        return true;
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

export default Wrapper;
export { Handler, Config, Wrapper };
