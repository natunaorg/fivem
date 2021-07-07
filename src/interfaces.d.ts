/*
 __  __           _       _           
|  \/  |         | |     | |          
| \  / | ___   __| |_   _| | ___  ___ 
| |\/| |/ _ \ / _` | | | | |/ _ \/ __|
| |  | | (_) | (_| | |_| | |  __/\__ \
|_|  |_|\___/ \__,_|\__,_|_|\___||___/

External and Internal Modules (Ex: Database)
*********************************************
*/
declare interface Database {
    /**
     * Write a data into database table
     * @author Rafly Maulana
     *
     * @example
     * db('users').write({
     *      data: {
     *          name: "Don Chad"
     *      }
     * })
     */
    write: (obj: { data: object }) => Promise<Array<any>>;

    /**
     * Find a data from database table
     * @author Rafly Maulana
     *
     * @example
     * db('users').find({
     *      where: {
     *          name: "Don Chad"
     *      }
     * })
     */
    find: (obj: { where: object }) => Promise<Array<any>>;

    /**
     * Find first data from database table
     * @author Rafly Maulana
     *
     * @example
     * db('users').findFirst({
     *      where: {
     *          name: "Don Chad"
     *      }
     * })
     */
    findFirst: (obj: { where: object }) => Promise<any>;

    /**
     * Update a data from database table
     * @author Rafly Maulana
     *
     * @example
     * db('users').update({
     *      where: {
     *          name: "Don Chad"
     *      },
     *      data: {
     *          name: "John Doe"
     *      }
     * })
     */
    update: (obj: { data: object; where: object }) => Promise<Array<any>>;

    /**
     * Delete a data from database table
     * @author Rafly Maulana
     *
     * @example
     * db('users').delete({
     *      where: {
     *          name: "Don Chad"
     *      }
     * })
     */
    delete: (obj: { where: object }) => Promise<Array<any>>;

    parser: {
        /**
         * Put a templated string around the key for SQL to identified it as a structure name, not a value
         * @author Rafly Maulana
         */
        key: (key: string) => string;

        /**
         * Parsing object keys and it values to SQL key and value format and mapping it into a string format
         * @author Rafly Maulana
         */
        keyVal: (dataObj: any) => string[];
    };
    utils: {
        /**
         * Validating query object before starting to execute it
         * @author Rafly Maulana
         */
        validateQueryObject: (
            obj: {
                data?: object;
                where?: object;
            },
            requiredKey?: Array<any>
        ) => boolean;

        /**
         * Validating object data whether if it's object or not
         * @author Rafly Maulana
         */
        validateQueryObjectData: (key: string, data: any) => boolean;

        /**
         * Executing database query in promise
         * @author Rafly Maulana
         *
         * @example
         * executeQuery("SELECT * FROM `users`")
         */
        executeQuery: (query: string) => Promise<Array<any>>;
    };
}

declare interface Crypter {
    /**
     * Algorithm used for encrypting data
     * @author Rafly Maulana
     *
     * @example
     * "aes-256-ctr"
     */
    algorithm: string;

    /**
     * Secret key used to encrypt and decrypt data
     * @author Rafly Maulana
     *
     * @example
     * "myTotalySecretKey"
     */
    secretKey: string;

    /**
     * Random Bytes
     * @author Rafly Maulana
     */
    iv: any;

    /**
     * Encrypt a data
     * @author Rafly Maulana
     *
     * @example
     * encrypt('bacon'); // Result: "e7b75a472b65bc4a42e7b3f788..."
     */
    encrypt: (text: string) => string;

    /**
     * Decrypt a hash/encrypted data
     * @author Rafly Maulana
     *
     * @example
     * decrypt('e7b75a472b65bc4a42e7b3f788...') // Result: "bacon"
     */
    decrypt: (hash: any) => string;
}

/*
  _____                                          
 / ____|                                         
| |     ___  _ __ ___  _ __ ___   ___  _ __  ___ 
| |    / _ \| '_ ` _ \| '_ ` _ \ / _ \| '_ \/ __|
| |___| (_) | | | | | | | | | | | (_) | | | \__ \
 \_____\___/|_| |_| |_|_| |_| |_|\___/|_| |_|___/

Common Functions or Scripts
*********************************************
*/
declare class Command {
    constructor(client: KoiClientInterface, name: string, handler: any, config: any, isClientCommand: boolean);
    name: string;

    /**
     * A Handler to execute function when called.
     * @author Rafly Maulana
     *
     * @param src (Source) return the player id whose triggering it.
     * @param args (Arguments) return text after command in Array, example, if you're triggering the command like this "/hello all people", the arguments returns was ["all", "people"].
     * @param raw (Raw) return raw version of the command triggered.
     */
    handler: (src: number, args: Array<any>, raw: String) => Promise<any> | any;

    /**
     * Set a configuration on a command
     * @author Rafly Maulana
     *
     * @arg description Description of a command
     * @arg argsDescription Description of every arguments required
     * @arg restricted If you want to limit your command with an ace permission automatically
     *
     * @example
     * {
     *      description: "Set Weather Status",
     *      argsDescription: [
     *          { name: "Weather Condition", help: "clear | rain | thunder" } // Argument 1
     *          // Argument 2, 3, ...
     *      ]
     * }
     */
    config?: {
        argsRequired?: false | number; // V
        caseInsensitive?: boolean;
        consoleOnly?: boolean; // V
        restricted?: boolean; // V
        description?: "No Description Available"; // V
        argsDescription?: Array<{ name: string; help: string }>; // V
        aliases?: Array<string>;
        requirements?: {
            userIDs?: Array<number>; // V
            jobIDs?: Array<number>;
            permissions?: Array<string>;
        };
        cooldown?: false | number; // V
        cooldownExclusions?: {
            userIDs?: Array<number>; // V
            jobIDs?: Array<number>;
            permissions?: Array<string>;
        };
    };
}

/*
 _____       _             __                    
|_   _|     | |           / _|                   
  | |  _ __ | |_ ___ _ __| |_ __ _  ___ ___  ___ 
  | | | '_ \| __/ _ \ '__|  _/ _` |/ __/ _ \/ __|
 _| |_| | | | ||  __/ |  | || (_| | (_|  __/\__ \
|_____|_| |_|\__\___|_|  |_| \__,_|\___\___||___/

Client and Server Interfaces
*********************************************
*/
interface KoiClientInterface {
    /**
     * Add client only event and listen for it, only can be triggered from client
     */
    addClientEventHandler: (eventName: string | Array<string>, callback: Function) => void;

    /**
     * Add shared event and listem from both server or client
     */
    addSharedEventHandler: (eventName: string | Array<string>, callback: Function) => void;

    /**
     * Trigger a registered client event
     */
    triggerClientEvent: (eventName: string | Array<string>, ...args: any[]) => void;

    /**
     * Trigger shared event between client and server, only event registered as shared event that can be triggered
     */
    triggerSharedEvent: (eventName: string | Array<string>, ...args: any[]) => void;

    /**
     * List of client configurations
     * @author Rafly Maulana
     *
     * @example
     * config.noDispatchService // Boolean
     */
    config: any;

    /**
     * List of all client plugins
     * @author Rafly Maulana
     *
     * @example
     * const plugin = this.plugins['character']
     * // To execute a function from the plugin, init the handler first
     * return plugin._handler(Koi) // Koi means Koi Client Class
     */
    plugins: any;

    /**
     * Use this function to hold next script below this from executing before it finish the timeout itself
     * @author Rafly Maulana
     * @source https://docs.fivem.net/docs/scripting-manual/introduction/creating-your-first-script-javascript/
     *
     * @async
     *
     * @example
     * const one = () => true; // Always use ES6 for better practice
     * const two = () => true;
     *
     * setTimeout(async() => { // Always do it on async
     *      one();
     *      await wait(5000); // Wait 5s (5000ms) before executing next function, always await it
     *      two(); // Executed after 5 second after wait before
     * });
     */
    wait: (ms: number) => Promise<unknown>;

    /**
     * Registrating a command. The actual command handler is registered on server to unlock the feature like permission based command or something, so it'd write a event on client and registered a handler on server to trigger the command from registered command in client.
     * @author Rafly Maulana
     * @source https://runtime.fivem.net/doc/natives/?_0x5FA79B0F
     *
     * @example
     * registerCommand(
     *      'hello',
     *      (src, args) => console.log('Hello!'),
     *      {
     *          description: "Say Hello"
     *      }
     * });
     */
    registerCommand: (name: string, handler: Command["handler"], config?: Command["config"]) => boolean;

    /**
     * Set a description on command, this function is executed automatically after you registering a command with configuration that contain description
     * @author Rafly Maulana
     * @source https://docs.fivem.net/docs/resources/chat/events/chat-addSuggestion/
     *
     * @example
     * setCommandDescription(
     *      'hello',
     *      {
     *          description: "Say Hello"
     *      }
     * )
     */
    setCommandDescription: (name: string, config: any) => boolean;

    /**
     * Collection of Game Functions
     */
    game: {
        /**
         * Basically optimizing texture and things in GTA, the function consists of:
         * 1. ClearAllBrokenGlass()
         * 2. ClearAllHelpMessages()
         * 3. LeaderboardsReadClearAll()
         * 4. ClearBrief();
         * 5. ClearGpsFlags();
         * 6. ClearPrints();
         * 7. ClearSmallPrints();
         * 8. ClearReplayStats();
         * 9. LeaderboardsClearCacheData();
         * 10. ClearFocus();
         * 11. ClearHdArea();
         * 12. ClearPedBloodDamage();
         * 13. ClearPedWetness();
         * 14. ClearPedEnvDirt();
         * 15. ResetPedVisibleDamage();
         * @author Rafly Maulana
         * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
         *
         * @example
         * game.optimizeFPS(1);
         */
        optimizeFPS: (playerId: number) => void;

        /**
         * List of functions running on every ticks
         */
        onTickRate: {
            /**
             * Disable dispatch radio after committing a crime (Example: Police Radio)
             * @author Rafly Maulana
             * @source https://forum.cfx.re/t/release-disable-all-emergency-service-and-military-dispatching/23823
             */
            noDispatchService: () => void;

            /**
             * Disable wanted level, so you'd not be chasen by police even after you committing a crime
             * @author Rafly Maulana
             * @source https://forum.cfx.re/t/release-disable-wanted-level/2855
             */
            noWantedLevel: () => void;

            /**
             * Become a superhero
             * @author Rafly Maulana
             * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
             */
            noClip: (playerId: number) => boolean;
        };

        /**
         * List of vehicle related functions
         */
        vehicle: {
            /**
             * Spawn a vehicle based on its model name
             * @author Rafly Maulana
             * @source https://docs.fivem.net/docs/scripting-manual/runtimes/javascript/
             *
             * @example
             * game.vehicle.spawn(1, 'zentorno');
             */
            spawn: (playerId: number, model?: string) => Promise<boolean>;

            /**
             * Delete nearest vehicle / vehicle being ridden from player
             * @author Rafly Maulana
             * @source Modified from https://forum.cfx.re/t/release-delete-vehicle-script-v1-1-0-updated-2020/7727/53
             *
             * @example
             * game.vehicle.delete(1)
             */
            delete: (playerId: number) => Promise<true | "You must be in the driver's seat!">;

            /**
             * Ensure the character in vehicle would not be throwed outside when crashing (Only works at car)
             * @author Rafly Maulana
             * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
             *
             * @example
             * game.vehicle.seatbelt(1, true)
             */
            seatbelt: (playerId: number, toggle: 0 | 1 | boolean) => Promise<boolean>;

            /**
             * Clean a dirty vehicle
             * @author Rafly Maulana
             * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
             *
             * @example
             * game.vehicle.clean(1)
             */
            clean: (playerId: number) => boolean;

            /**
             * Set a vehicle to dirty
             * @author Rafly Maulana
             * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
             *
             * @example
             * game.vehicle.dirty(1)
             */
            dirty: (playerId: number) => boolean;

            /**
             * Repair only vehicle engine (Doesn't include body kit)
             * @author Rafly Maulana
             * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
             *
             * @example
             * game.vehicle.repairEngine(1)
             */
            repairEngine: (playerId: number) => boolean;

            /**
             * Repair the body of the vehicle
             * @author Rafly Maulana
             * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
             *
             * @example
             * game.vehicle.repairVehicle(1)
             */
            repairVehicle: (playerId: number) => boolean;

            /**
             * Get a closest vehicle near a player
             * @author Rafly Maulana
             * @source https://runtime.fivem.net/doc/natives/?_0xF73EB622C4F1689B
             *
             * @example
             * game.vehicle.getClosestOne(1)
             */
            getClosestOne: (playerId: number) => number | false;
        };

        /**
         * List of player related functions
         */
        player: {
            /**
             * Revive a player
             * @author Rafly Maulana
             * @source Modified from https://github.com/TheStonedTurtle/FiveM-RPDeath
             *
             * @example
             * game.player.revive(1)
             */
            revive: (playerId: number) => Promise<boolean>;

            /**
             * Kill a player
             * @author Rafly Maulana
             * @source https://runtime.fivem.net/doc/natives/?_0x6B76DC1F3AE6E6A3
             *
             * @example
             * game.player.kill(1)
             */
            kill: (playerId: number) => boolean;

            /**
             * Put a map blips on player and updates on every tick
             * @author Rafly Maulana
             * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
             *
             * @example
             * game.player.track(1)
             */
            track: (playerId: number) => boolean;

            /**
             * Set a player invisible to eyes for another players
             * @author Rafly Maulana
             * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
             *
             * @example
             * game.player.invisible(1)
             */
            invisible: (playerId: number) => boolean;

            /**
             * Set a player to become unbeatable
             * @author Rafly Maulana
             * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
             *
             * @example
             * game.player.godMode(1, true)
             */
            godMode: (playerId: number) => boolean;

            /**
             * Give a full armour to a player
             * @author Rafly Maulana
             * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
             *
             * @example
             * game.player.giveFullArmour(1)
             */
            giveFullArmour: (playerId: number) => boolean;

            /**
             * Get coordinates of a player
             * @author Rafly Maulana
             * @source https://runtime.fivem.net/doc/natives/?_0x1647F1CB
             *
             * @example
             * game.player.getCoords(1)
             */
            getCoords: (playerId: number) => number[];

            /**
             * List of player teleportation functions
             */
            teleport: {
                /**
                 * Teleport to a marker set on the map
                 * @author Rafly Maulana
                 * @source Modified From https://github.com/qalle-git/esx_marker
                 *
                 * @example
                 * game.player.teleport.marker(1)
                 */
                marker: (playerId: number) => Promise<boolean | "Blip Doesn't Exist">;

                /**
                 * Teleport to a coordinates
                 * @author Rafly Maulana
                 * @source https://runtime.fivem.net/doc/natives/?_0x9AFEFF481A85AB2E
                 *
                 * @example
                 * game.player.teleport.coordinates(1, 10, 20, 30)
                 */
                coordinates: (playerId: number, x: number, y: number, z: number) => Promise<boolean>;
            };
        };
    };

    /**
     * List of utility functions
     */
    utils: {
        /**
         * Draw 3D floating text
         * @author Rafly Maulana
         * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
         *
         * @example
         * utils.drawText3D(10, 10, 10, "WOW", 255, 255, 255)
         */
        drawText3D: (text: any, x: any, y: any, z: any, r: any, g: any, b: any) => boolean;

        /**
         * Draw text on screen
         * @author Rafly Maulana
         * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
         *
         * @example
         * utils.drawText("WOW", 100, 200)
         */
        drawText: (text: any, x: any, y: any) => boolean;

        /**
         * Show a GTA V notification snackbar
         * @author Rafly Maulana
         *
         * @example
         * utils.notify("Hello World!")
         */
        notify: (...text: any) => boolean;
    };

    /**
     * This functions is called whenever a player is joining to init a plugins for themself
     */
    _initPlugins: (plugins: any) => Promise<void>;

    /**
     * List of events on Client
     */
    _events: any;
}

interface KoiServerInterface {
    /**
     * Add server only event and listen for it, only can be triggered from server
     */
    addServerEventHandler: (eventName: string | Array<string>, callback: Function) => void;

    /**
     * Add shared event and listem from both server or client
     */
    addSharedEventHandler: (eventName: string | Array<string>, callback: Function) => void;

    /**
     * Trigger a registered server event
     */
    triggerServerEvent: (eventName: string | Array<string>, ...args: any[]) => void;

    /**
     * Trigger shared event between client and server, only event registered as shared event that can be triggered
     */
    triggerSharedEvent: (eventName: string | Array<string>, ...args: any[]) => void;

    /**
     * MySQL database wrapper
     * @author Rafly Maulana
     */
    db: (table: string) => Database;

    /**
     * Crypter to Encrypt or Decrypt your secret data
     * @author Rafly Maulana
     */
    crypter: (algorithm: string, secretKey: string) => Crypter;

    /**
     * List of all client plugins
     * @author Rafly Maulana
     *
     * @example
     * const plugin = this.plugins['character']
     * // To execute a function from the plugin, init the handler first
     * return plugin._handler(Koi) // Koi means Koi Server Class
     */
    plugins: any;

    /**
     * Use this function to hold next script below this from executing before it finish the timeout itself
     * @author Rafly Maulana
     * @source https://docs.fivem.net/docs/scripting-manual/introduction/creating-your-first-script-javascript/
     *
     * @async
     *
     * @example
     * const one = () => true; // Always use ES6 for better practice
     * const two = () => true;
     *
     * setTimeout(async() => { // Always do it on async
     *      one();
     *      await wait(5000); // Wait 5s (5000ms) before executing next function, always await it
     *      two(); // Executed after 5 second after wait before
     * });
     */
    wait: (ms: number) => Promise<unknown>;

    /**
     * Registrating a command. If isClientCommand was set true, the handler would just triggering a client registered command
     * @author Rafly Maulana
     *
     * @example
     * registerCommand(
     *      'hello',
     *      (src, args) => console.log('Hello!'),
     *      {
     *          description: "Say Hello"
     *      }
     * });
     */
    registerCommand: (name: string, handler: Command["handler"], config?: Command["config"], isClientCommand?: boolean) => boolean;

    /**
     * Get all set of player ID and return it on JSON format
     * @author Rafly Maulana
     *
     * @example
     * const steamID: getPlayerIds(1).steam;
     * console.log(steamID)
     */
    getPlayerIds: (src: number) => any;

    /**
     * Loops through folder and retrieve every plugins file
     * @author Rafly Maulana
     */
    _getPlugins: (type: string) => Promise<any[]>;

    /**
     * This function is to init a plugin, differs from the client ones, it's triggered whenever the script was ready
     * @author Rafly Maulana
     */
    _initPlugins: (plugins: any) => Promise<void>;

    /**
     * List of events on server
     */
    _events: {
        /**
         * Listen on whenever a player joining a session also validating that player before joining the session
         * @author Rafly Maulana
         */
        playerConnecting: (name: any, setKickReason: any, deferrals: any) => Promise<any>;

        /**
         * Listen on whenever a player requested plugins to be setup on their client
         * @author Rafly Maulana
         */
        requestClientSettings: () => Promise<void>;
    };
}

declare interface Koi {
    Server: KoiServerInterface;
    Client: KoiClientInterface;
}
