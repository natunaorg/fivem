/**
 * @module Client - Events
 * @category Client
 */

"use strict";
import "@citizenfx/client";

export default class Events {
    //  _   _ _   _ _____   _____                _
    // | \ | | | | |_   _| |  ___|              | |
    // |  \| | | | | | |   | |____   _____ _ __ | |_
    // | . ` | | | | | |   |  __\ \ / / _ \ '_ \| __|
    // | |\  | |_| |_| |_  | |___\ V /  __/ | | | |_
    // \_| \_/\___/ \___/  \____/ \_/ \___|_| |_|\__|

    /**
     * @description
     * Add a listener for NUI callback events.
     *
     * @param name Name of the event
     * @param handler Handler of the data
     *
     * @example
     * ```ts
     * addNUIEventHandler('menu:clicked', (data) => console.log(data.title))
     * ```
     */
    addNUIEventHandler = (name: string, handler: (data: any, callback: (data: { [key: string]: any }) => void) => any) => {
        name = encodeURIComponent(name);

        RegisterNuiCallbackType(name);
        on(`__cfx_nui:${name}`, handler);
    };

    /**
     * @description
     * Trigger NUI event
     *
     * @param name Name of the event
     * @param data Data to send to NUI
     *
     * @example
     * ```ts
     * triggerNUIEvent('menu:open', {
     *      menuId: 1
     * })
     * ```
     */
    triggerNUIEvent = (name: string, data: { [key: string]: any } = {}) => {
        SendNuiMessage(
            JSON.stringify({
                name,
                data,
            })
        );
    };

    //  _____ _ _            _     _____                _
    // /  __ \ (_)          | |   |  ___|              | |
    // | /  \/ |_  ___ _ __ | |_  | |____   _____ _ __ | |_
    // | |   | | |/ _ \ '_ \| __| |  __\ \ / / _ \ '_ \| __|
    // | \__/\ | |  __/ | | | |_  | |___\ V /  __/ | | | |_
    //  \____/_|_|\___|_| |_|\__| \____/ \_/ \___|_| |_|\__|

    /**
     * @description
     * Add client only event and listen for it, only can be triggered from server
     *
     * @param name Name of the event
     * @param args Arguments to send
     *
     * @example
     * ```ts
     * addClientEventHandler("someEvent", (playerID) => console.log(playerID))
     * ```
     */
    addClientEventHandler = (name: string | Array<string>, handler: (...args: any) => any) => {
        if (typeof name == "object" && Array.isArray(name)) {
            for (const alias of name) {
                on(alias, handler);
            }
        } else if (typeof name == "string") {
            on(name, handler);
        } else {
            throw new Error(`Invalid Server Event Name Properties for ${name}`);
        }
    };

    /**
     * @description
     * Trigger a registered client event
     *
     * @param name Name of the event
     * @param args Arguments to send
     *
     * @example
     * ```ts
     * triggerClientEvent("someEvent", true)
     * ```
     */
    triggerClientEvent = (name: string | Array<string>, ...args: any) => {
        if (typeof name == "object" && Array.isArray(name)) {
            for (const alias of name) {
                emit(alias, ...args);
            }
        } else if (typeof name == "string") {
            emit(name, ...args);
        } else {
            throw new Error(`Invalid Server Trigger Name Properties for ${name}`);
        }
    };

    //  _____ _                        _   _____                _
    // /  ___| |                      | | |  ___|              | |
    // \ `--.| |__   __ _ _ __ ___  __| | | |____   _____ _ __ | |_
    //  `--. \ '_ \ / _` | '__/ _ \/ _` | |  __\ \ / / _ \ '_ \| __|
    // /\__/ / | | | (_| | | |  __/ (_| | | |___\ V /  __/ | | | |_
    // \____/|_| |_|\__,_|_|  \___|\__,_| \____/ \_/ \___|_| |_|\__|

    /**
     * @description
     * Add shared event and listen from both server or client
     *
     * @param name Name of the event
     * @param args Arguments to send
     *
     * @example
     * ```ts
     * addSharedEventHandler("someEvent", (playerID) => console.log(playerID))
     * ```
     */
    addSharedEventHandler = (name: string | Array<string>, handler: (...args: any) => any) => {
        if (typeof name == "object" && Array.isArray(name)) {
            for (const alias of name) {
                onNet(alias, handler);
            }
        } else if (typeof name == "string") {
            onNet(name, handler);
        } else {
            throw new Error(`Invalid Shared Event Name Properties for ${name}`);
        }
    };

    /**
     * @description
     * Trigger shared event between client and server, only event registered as shared event that can be triggered
     *
     * @param name Name of the event
     * @param target Target of the player ID (Server ID)
     * @param args Arguments to send
     *
     * @example
     * ```ts
     * triggerSharedEvent("someEvent", 1, true)
     * ```
     */
    triggerSharedEvent = (name: string | Array<string>, ...args: any) => {
        if (typeof name == "object" && Array.isArray(name)) {
            for (const alias of name) {
                emitNet(alias, ...args);
            }
        } else if (typeof name == "string") {
            emitNet(name, ...args);
        } else {
            throw new Error(`Invalid Shared Trigger Name Properties for ${name}`);
        }
    };
}
