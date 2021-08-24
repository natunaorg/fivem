/* global $, GetParentResourceName */

/**
 * @description
 * List of events registered
 */
window.events = [];

/**
 * @description
 * Trigger an event to another NUI
 */
window.emit = (name, data = {}) => {
    const event = new CustomEvent(name, { detail: data });
    window.dispatchEvent(event);
};

/**
 * @description
 * Listen for event
 */
window.on = (name, handler) => {
    const index = window.events.length;
    const wrapper = (event) => handler(event.detail);

    window.addEventListener(name, wrapper);
    window.events.push({ index, wrapper, name });

    return index;
};

/**
 * @description
 * Remove an event listener
 */
window.removeListener = (name, index) => {
    for (const listener of window.events) {
        if (listener.name === name && (!listener.index || listener.index === index)) {
            window.removeEventListener(name, listener.wrapper);
        }
    }
};

/**
 * @description
 * Send data back to client (use addNUIEventhandler on the client script)
 */
window.sendData = (name, data = {}) => {
    name = encodeURIComponent(name);
    $.post(`https://${GetParentResourceName()}/${name}`, JSON.stringify(data));
};
