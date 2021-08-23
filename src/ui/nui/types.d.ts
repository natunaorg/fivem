/**
 * @module NUI
 * @category NUI
 */

export const window: {
    /**
     * @description
     * Trigger an event to another NUI
     *
     * @example
     * ```js
     * window.emit('someNUIEvent', {
     *      text: "someText"
     * });
     * ```
     */
    emit: (name: string, data?: { [key: string]: any }) => void;

    /**
     * @description
     * Listen events from other NUI `window.emit` or from client `triggerNUIEvent`.
     *
     * It also return the event index at the initialization, used to specify this event on removeListener function.
     *
     * @example
     * ```js
     * window.on('someNUIEvent', (data)=> {
     *      copyText(data.text)
     * });
     * ```
     */
    on: (name: string, handler: (data: { [key: string]: any }) => any) => number;

    /**
     * @description
     * Remove an event listener. If eventIndex is not specified, then it would remove all event listener with the same name.
     *
     * @example
     * ```js
     * window.removeListener('someNUIEvent', 1);
     * ```
     */
    removeListener: (name: string, eventIndex?: number) => void;

    /**
     * @description
     * Emit an event to client. Listen the event on client with `addNUIEventHandler`
     *
     * @example
     * ```js
     * window.sendData('client:getMenuIndex', {
     *      menuIndex: 1
     * })
     * ```
     */
    sendData: (name: string, data?: { [key: string]: any }) => void;
};
