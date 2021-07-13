import uniqid from "uniqid";

class Events {
    constructor() {}

    /*
     _____                            _____                _   
    /  ___|                          |  ___|              | |  
    \ `--.  ___ _ ____   _____ _ __  | |____   _____ _ __ | |_ 
     `--. \/ _ \ '__\ \ / / _ \ '__| |  __\ \ / / _ \ '_ \| __|
    /\__/ /  __/ |   \ V /  __/ |    | |___\ V /  __/ | | | |_ 
    \____/ \___|_|    \_/ \___|_|    \____/ \_/ \___|_| |_|\__|
                                                            
    */

    /**
     * Add server only event and listen for it, only can be triggered from server
     * @author Rafly Maulana
     *
     * @param name Name of the event
     * @param args Arguments to send
     *
     * @example
     * addServerEventHandler("someEvent", (playerID) => console.log(playerID))
     */
    addServerEventHandler = (name: string | Array<string>, handler: Function) => {
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
     * Trigger a registered server event
     * @author Rafly Maulana
     *
     * @param name Name of the event
     * @param args Arguments to send
     *
     * @example
     * triggerServerEvent("someEvent", true)
     */
    triggerServerEvent = (name: string | Array<string>, ...args: any) => {
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

    /*
     _____                            _____       _ _ _                _      _____                _   
    /  ___|                          /  __ \     | | | |              | |    |  ___|              | |  
    \ `--.  ___ _ ____   _____ _ __  | /  \/ __ _| | | |__   __ _  ___| | __ | |____   _____ _ __ | |_ 
     `--. \/ _ \ '__\ \ / / _ \ '__| | |    / _` | | | '_ \ / _` |/ __| |/ / |  __\ \ / / _ \ '_ \| __|
    /\__/ /  __/ |   \ V /  __/ |    | \__/\ (_| | | | |_) | (_| | (__|   <  | |___\ V /  __/ | | | |_ 
    \____/ \___|_|    \_/ \___|_|     \____/\__,_|_|_|_.__/ \__,_|\___|_|\_\ \____/ \_/ \___|_| |_|\__|
                                                                                                    
    */

    /**
     * Listen for triggerSharedCallbackEvent
     * @author Rafly Maulana
     *
     * @param name Name of the event
     * @param handler Handler of the received arguments
     *
     * @example
     * addServerCallbackEventHandler('getPlayerName', (id) => getName(id));
     */
    addServerCallbackEventHandler = (name: string, handler: Function) => {
        this.addServerEventHandler(`cb-${name}`, async (temporalEventName: string, ...args: any) => {
            this.triggerServerEvent(temporalEventName, await handler(...args));
        });
    };

    /**
     * Trigger shared event between client and server
     * [IMPORTANT] Only can be triggered an event that has been registered with addSharedCallbackEventHandler;
     * @author Rafly Maulana
     *
     * @param name Name of the event
     * @param callbackHandler Function to Handle Callback Data
     * @param args Arguments to send
     *
     * @example
     * triggerSharedCallbackEvent('getPlayerName', (name) => console.log(name), 1);
     */
    triggerServerCallbackEvent = (name: string, callbackHandler: Function, ...args: any) => {
        const temporalEventName = uniqid("cbtemp-");

        this.addServerEventHandler(temporalEventName, (...args: any) => {
            callbackHandler(...args);
            removeEventListener(temporalEventName, () => false);
        });

        // Prevent triggering normal shared event
        this.triggerServerEvent(`cb-${name}`, temporalEventName, ...args);
    };

    /*
     _____ _                        _   _____                _   
    /  ___| |                      | | |  ___|              | |  
    \ `--.| |__   __ _ _ __ ___  __| | | |____   _____ _ __ | |_ 
     `--. \ '_ \ / _` | '__/ _ \/ _` | |  __\ \ / / _ \ '_ \| __|
    /\__/ / | | | (_| | | |  __/ (_| | | |___\ V /  __/ | | | |_ 
    \____/|_| |_|\__,_|_|  \___|\__,_| \____/ \_/ \___|_| |_|\__|
                                                                
    */

    /**
     * Add shared event and listen from both server or client
     * @author Rafly Maulana
     *
     * @param name Name of the event
     * @param args Arguments to send
     *
     * @example
     * addSharedEventHandler("someEvent", (playerID) => console.log(playerID))
     */
    addSharedEventHandler = (name: string | Array<string>, handler: Function) => {
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
     * Trigger shared event between client and server, only event registered as shared event that can be triggered
     * @author Rafly Maulana
     *
     * @param name Name of the event
     * @param target Target of the player ID (Server ID)
     * @param args Arguments to send
     *
     * @example
     * triggerSharedEvent("someEvent", 1, true)
     */
    triggerSharedEvent = (name: string | Array<string>, target: number, ...args: any) => {
        if (typeof name == "object" && Array.isArray(name)) {
            for (const alias of name) {
                emitNet(alias, target, ...args);
            }
        } else if (typeof name == "string") {
            emitNet(name, target, ...args);
        } else {
            throw new Error(`Invalid Shared Trigger Name Properties for ${name}`);
        }
    };

    /*
     _____ _                        _   _____       _ _ _                _      _____                _   
    /  ___| |                      | | /  __ \     | | | |              | |    |  ___|              | |  
    \ `--.| |__   __ _ _ __ ___  __| | | /  \/ __ _| | | |__   __ _  ___| | __ | |____   _____ _ __ | |_ 
     `--. \ '_ \ / _` | '__/ _ \/ _` | | |    / _` | | | '_ \ / _` |/ __| |/ / |  __\ \ / / _ \ '_ \| __|
    /\__/ / | | | (_| | | |  __/ (_| | | \__/\ (_| | | | |_) | (_| | (__|   <  | |___\ V /  __/ | | | |_ 
    \____/|_| |_|\__,_|_|  \___|\__,_|  \____/\__,_|_|_|_.__/ \__,_|\___|_|\_\ \____/ \_/ \___|_| |_|\__|
                                                                                                        
    */

    /**
     * Listen for triggerSharedCallbackEvent
     * @author Rafly Maulana
     *
     * @param name Name of the event
     * @param handler Handler of the received arguments
     *
     * @example
     * addSharedCallbackEventHandler('getPlayerName', (id) => getName(id));
     */
    addSharedCallbackEventHandler = (name: string, handler: Function) => {
        this.addSharedEventHandler(`cb-${name}`, async (temporalEventName: string, ...args: any) => {
            this.triggerSharedEvent(temporalEventName, (global as any).source, await handler(...args));
        });
    };

    /**
     * Trigger shared event between client and server
     * [IMPORTANT] Only can be triggered an event that has been registered with addSharedCallbackEventHandler;
     * @author Rafly Maulana
     *
     * @param name Name of the event
     * @param callbackHandler Function to Handle Callback Data
     * @param args Arguments to send
     *
     * @example
     * triggerSharedCallbackEvent('getPlayerName', (name) => console.log(name), 1);
     */
    triggerSharedCallbackEvent = (name: string, target: number, callbackHandler: Function, ...args: any) => {
        const temporalEventName = uniqid("cbtemp-");

        this.addSharedEventHandler(temporalEventName, (...args: any) => {
            callbackHandler(...args);
            removeEventListener(temporalEventName, () => false);
        });

        // Prevent triggering normal shared event
        this.triggerSharedEvent(`cb-${name}`, target, temporalEventName, ...args);
    };
}

export default Events;
