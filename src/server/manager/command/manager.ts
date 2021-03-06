"use strict";
import "@citizenfx/server";

import type { Config, Handler } from "@server/manager/command/handler";
import type Events from "@server/events";
import type Players from "@server/players";
import type Utils from "@server/utils";

import Command from "@server/manager/command/handler";
import { SharedEventType } from "@shared/events/type";

export default class CommandManager {
    constructor(
        private events: Events, //
        private players: Players,
        private utils: Utils
    ) {
        this.events.shared.listen(SharedEventType.REGISTER_COMMAND, this.register);
    }

    #commands: Record<string, Command> = {};

    #addCommand = (source: number, name: string, handler: Handler, config: Config = {}, isClientCommand = false) => {
        if (this.#commands[name]) {
            if (!isClientCommand) {
                throw new Error(`Command "${name}" had already been registered before!`);
            } else {
                this.events.shared.emit(SharedEventType.SET_COMMAND_DESCRIPTION, source, [name, config]);
                return true;
            }
        }

        this.#commands[name] = new Command(this.events, this.players, this.utils, name, handler, config, isClientCommand);
        this.events.shared.emit(SharedEventType.SET_COMMAND_DESCRIPTION, source, [name, config]);
        return true;
    };

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
    register = (source: number, name: string | string[], handler: Handler, config: Config = {}, isClientCommand = false) => {
        if (typeof name === "string") {
            name = [name];
        }

        for (const alias of name) {
            this.#addCommand(source, alias, handler, config, isClientCommand);
        }

        return true;
    };
}
