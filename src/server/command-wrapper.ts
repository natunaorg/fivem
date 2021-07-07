class Command {
    client: KoiServerInterface;
    name: string;
    handler: any;
    config: any;
    cooldown: any;

    constructor(client, name, handler, config, isClientCommand, registeredCommandLists) {
        this.client = client;
        this.name = name;
        this.handler = handler;
        this.config = this.parseConfig(config);
        this.cooldown = {};

        this.registerCommand(name, handler, isClientCommand, registeredCommandLists);

        if (this.config.aliases) {
            for (const alias of this.config.aliases) {
                this.registerCommand(alias, handler, isClientCommand, registeredCommandLists);
            }
        }
    }

    parseConfig = (config) => {
        config = this.validator.isObject(config) ? config : {};
        config.requirements = this.validator.isObject(config.requirements) ? config.requirements : {};
        config.cooldownExclusions = this.validator.isObject(config.cooldownExclusions) ? config.cooldownExclusions : {};
        config.aliases = this.validator.isArray(config.aliases) ? config.aliases : [];
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
                aliases: [],
                cooldownExclusions: {},
                restricted: false,
            },
            config
        );

        return config;
    };

    validateExecution = (src, args, raw) => {
        if (this.config.argsRequired && args.length < this.config.argsRequired) {
            return "Not enough arguments passed.";
        }

        if (this.config.consoleOnly && src !== 0) {
            return "This command can only be executed from console!";
        }

        const userID = this.client.getPlayerIds(src).steam;

        if (this.config.cooldown) {
            if (!this.config.cooldownExclusions.userIDs.includes(userID)) {
                if (this.cooldown[src] && Date.now() - this.cooldown[src] < this.config.cooldown) {
                    return "Still under cooldown.";
                }
            }
        }

        if (this.config.requirements.userIDs && !this.config.requirements.userIDs.includes(userID)) {
            return "You dont have enough permission!";
        }

        // WORK IN PROGRESS
        if (this.config.caseInsensitive && this.name !== raw) {
            return false;
        }

        return true;
    };

    registerCommand = (name, handler, isClientCommand = false, registeredCommandLists) => {
        if (registeredCommandLists.find(name) !== undefined) {
            throw new Error(`Command '${name}' has already registered!`);
        }

        if (isClientCommand) {
            handler = (src, args, raw) => {
                const validation = this.validateExecution(src, args, raw);
                if (validation == true) {
                    return this.client.triggerSharedEvent(`koi:client:requestCommand[${name}]`, src, args, raw);
                } else if (validation !== false) {
                    // If validation returns was a string
                    return console.log(validation);
                }
            };
        }

        RegisterCommand(
            name,
            (src, args, raw) => {
                const validation = this.validateExecution(src, args, raw);
                if (validation == true) {
                    return handler(src, args, raw);
                } else if (validation !== false) {
                    // If validation returns was a string
                    return console.log(validation);
                }
            },
            this.config.restricted
        );

        return handler;
    };

    validator = {
        isObject: (obj) => {
            if (!obj || typeof obj == "undefined" || typeof obj !== "object" || Array.isArray(obj)) {
                return false;
            }
            return true;
        },
        isArray: (arr) => {
            if (!arr || typeof arr == "undefined" || !Array.isArray(arr)) {
                return false;
            }
            return true;
        },
    };
}

export default Command;
