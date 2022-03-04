"use strict";
import "@citizenfx/client";

import type Events from "@client/events";
import type { Handler, Config } from "@server/lib/commandHandler";

import { EventType } from "@server/lib/commandHandler";

export default class CommandManager {
    constructor(
        private events: Events //
    ) {
        this.events.shared.listen(EventType.SET_COMMAND_DESCRIPTION, this.setDescription);
        this.events.shared.listen(EventType.CLIENT_EXECUTE_COMMAND, (name: string, args: Array<any>, raw: string) => {
            const src = GetPlayerServerId(PlayerId());
            return this.#list[name](src, args, raw || name);
        });
    }

    /** @hidden */
    #list: Record<string, Handler> = {};

    /**
     * @description
     * Registrating a command. The actual command handler is registered on server to unlock the feature like permission based command or something, so it'd write a event on client and registered a handler on server to trigger the command from registered command in client.
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
    register = (name: string | Array<string>, handler: Handler, config: Config = {}): void => {
        const addCommand = (name: string) => {
            this.#list[name] = handler;
            this.events.shared.emit(EventType.REGISTER_COMMAND, [name, {}, config, true]);
        };

        if (Array.isArray(name)) {
            for (const alias of name) addCommand(alias);
        } else {
            addCommand(name);
        }
    };

    /**
     * @description
     * Set a description on command, this function is executed automatically after you registering a command with configuration that contain description.
     *
     * https://docs.fivem.net/docs/resources/chat/events/chat-addSuggestion/
     */
    setDescription = (name: string, config: Pick<Config, "description" | "argsDescription">): boolean => {
        setImmediate(() => {
            emit("chat:addSuggestion", [
                `/${name}`, //
                config.description || "No Description is Set",
                config.argsDescription || [],
            ]);
        });

        return true;
    };
}
