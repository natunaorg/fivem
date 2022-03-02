"use strict";
import "@citizenfx/server";

import type { NoFunction } from "@shared/utils/base";
import type { CallbackValueData, EmitData } from "@shared/events/base";

import EventBase from "@shared/events/base";

export enum EventType {
    EVENT_HANDLER = "natuna:shared:eventHandler",
    CALLBACK_RECEIVER = "natuna:shared:sendCallbackValues",
}

export default class SharedEvent extends EventBase {
    constructor() {
        super();

        onNet(EventType.EVENT_HANDLER, (props: EmitData) => {
            const listeners = this.listeners.filter((listener) => listener.name === props.name);

            for (const listener of listeners) {
                const value = listener.handler(globalThis.source, props.args);

                emitNet(EventType.CALLBACK_RECEIVER, globalThis.source, {
                    uniqueId: props.uniqueId,
                    values: value ?? null,
                });
            }
        });

        onNet(EventType.CALLBACK_RECEIVER, (data: CallbackValueData) => {
            this.callbackValues.push(data);
        });
    }

    /**
     * @description
     * Emit an event from Server to Client
     */
    emit = <T>(name: string | string[], target: number | "global", args?: NoFunction<T>[]) => {
        return new Promise((resolve) => {
            name = this.__validateEventName(name);
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

                emitNet(EventType.EVENT_HANDLER, target, emitData);
            }

            const callbackValues = this.callbackValues.findIndex((data) => data.uniqueId === uniqueId);
            const returnValue = this.callbackValues[callbackValues].values;

            // Remove the callback values from the array
            this.callbackValues.splice(callbackValues, 1);

            return resolve(returnValue);
        });
    };

    /**
     * @description
     * Listen from a Client event
     */
    listen = (name: string | string[], handler: (source: number, ...args: any) => any) => {
        name = this.__validateEventName(name);
        let ids: number[] = [];

        for (const alias of name) {
            this.listeners.push({
                id: this.listenerCounter,
                name: alias,
                handler,
            });

            ids.push(this.listenerCounter);

            this.listenerCounter++;
        }

        return ids;
    };
}
