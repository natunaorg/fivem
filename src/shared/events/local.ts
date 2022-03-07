"use strict";
import "@citizenfx/client";
import "@citizenfx/server";

import type { NoFunction } from "@shared/utils/base";
import type { EmitData } from "@shared/events/base";

import EventBase from "@shared/events/base";

enum EventType {
    EVENT_HANDLER = "natuna:local:eventHandler",
}

export default class LocalEvent extends EventBase {
    constructor() {
        super();

        on(EventType.EVENT_HANDLER, (props: EmitData) => {
            const listeners = this._listeners.filter((listener) => listener.name === props.name);

            for (const listener of listeners) {
                const value = listener.handler(props.args);

                this._callbackValues.push({
                    uniqueId: props.uniqueId,
                    values: value ?? null,
                });
            }
        });
    }

    /**
     * @description
     * Emit an event locally (Client to Client or Server to Server)
     */
    emit = async <T>(name: string | string[], args?: NoFunction<T>[]) => {
        name = this._validateEventName(name);
        const uniqueId = Math.random().toString(36).substring(2);

        for (const alias of name) {
            const emitData: EmitData = {
                name: alias,
                uniqueId,
                args,
            };

            emit(EventType.EVENT_HANDLER, emitData);
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
     * Listen from a local event
     */
    listen = (name: string | string[], handler: (...args: any) => any) => {
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
