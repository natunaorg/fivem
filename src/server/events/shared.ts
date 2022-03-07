"use strict";
import "@citizenfx/server";

import type { NoFunction } from "@shared/utils/base";
import type { CallbackValueData, EmitData } from "@shared/events/base";

import EventBase from "@shared/events/base";
import { SharedEventType } from "@shared/events/type";

export default class SharedEvent extends EventBase {
    constructor() {
        super();

        onNet(SharedEventType.SHARED_SERVER_EVENT_HANDLER, (props: EmitData) => {
            const listeners = this._listeners.filter((listener) => listener.name === props.name);

            for (const listener of listeners) {
                const value = listener.handler(globalThis.source, props.args);

                emitNet(SharedEventType.SHARED_CLIENT_CALLBACK_RECEIVER, globalThis.source, {
                    uniqueId: props.uniqueId,
                    values: value ?? null,
                });
            }
        });

        onNet(SharedEventType.SHARED_SERVER_CALLBACK_RECEIVER, (data: CallbackValueData) => {
            this._callbackValues.push(data);
        });
    }

    /**
     * @description
     * Emit an event from Server to Client
     */
    emit = async <T>(name: string | string[], target: number | "global", args?: NoFunction<T>[]) => {
        name = this._validateEventName(name);
        const uniqueId = Math.random().toString(36).substring(2);

        if (target === "global") {
            target = -1;
        }

        for (const alias of name) {
            const emitData: EmitData = {
                name: alias,
                uniqueId,
                args,
            };

            emitNet(SharedEventType.SHARED_CLIENT_EVENT_HANDLER, target, emitData);
        }

        let callbackValues = this._callbackValues.findIndex((data) => data.uniqueId === uniqueId);

        while (callbackValues === -1) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            callbackValues = this._callbackValues.findIndex((data) => data.uniqueId === uniqueId);
        }

        const returnValue = this._callbackValues[callbackValues].values;

        // Remove the callback values from the array
        this._callbackValues.splice(callbackValues, 1);

        return returnValue;
    };

    /**
     * @description
     * Listen from a Client event
     */
    listen = (name: string | string[], handler: (source: number, ...args: any) => any) => {
        name = this._validateEventName(name);
        let ids: number[] = [];

        for (const alias of name) {
            this._listeners.push({
                id: this._listenerCounter,
                name: alias,
                handler,
            });

            ids.push(this._listenerCounter);

            this._listenerCounter++;
        }

        return ids;
    };
}
