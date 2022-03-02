import "@citizenfx/client";
import "@citizenfx/server";

import EventBase, { EmitData } from "@shared/events/base";
import { NoFunction } from "@shared/utils/base";

enum EventType {
    EVENT_HANDLER = "natuna:local:eventHandler",
}

export default class LocalEvent extends EventBase {
    constructor() {
        super();

        on(EventType.EVENT_HANDLER, (props: EmitData) => {
            const listeners = this.listeners.filter((listener) => listener.name === props.name);

            for (const listener of listeners) {
                const value = listener.handler(props.args);

                this.callbackValues.push({
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
    emit = <T>(name: string | string[], args?: NoFunction<T>[]) => {
        return new Promise((resolve) => {
            name = this.__validateEventName(name);
            const uniqueId = Math.random().toString(36).substring(2);

            for (const alias of name) {
                const emitData: EmitData = {
                    name: alias,
                    uniqueId,
                    args,
                };

                emit(EventType.EVENT_HANDLER, emitData);
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
     * Listen from a local event
     */
    listen = (name: string | string[], handler: (...args: any) => any) => {
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
