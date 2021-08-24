// Used only for typings reference. DO NOT DECLARE THIS CLASS.
import Client from "@client/index";

class Module {
    client: Client;
    config: any;

    constructor(client: Client, config: any) {
        this.client = client;
        this.config = config; // Config was imported from "natuna.config.js" file

        console.log(this.config.someExampleClientConfig); // true
        console.log(this.config.someExampleSecondClientConfig); // [1, 2, 3, 4, 5, 6]
        console.log(this.config.someExampleThirdClientConfig); // { example: true }

        // Show a notification showing your server id
        this.client.registerCommand("myid", (src) => {
            this.client.utils.createFeedNotification(String(src));
        });

        // Spawn a Player
        this.client.registerCommand("spawn", (src, args) => {
            (global as any).exports.spawnmanager.spawnPlayer(
                {
                    x: 686.245,
                    y: 577.95,
                    z: 130.461,
                    model: "a_m_m_skater_01",
                },
                () => {
                    emit("chat:addMessage", {
                        args: ["Hi, there!"],
                    });
                }
            );
        });

        // Example of creating a map blip
        this.client.utils.mapBlip.create({
            title: "Medical - Pillbox Hospital",
            colour: 11,
            iconId: 61,
            location: {
                x: 310.5168151855469,
                y: -591.2456665039062,
                z: 43.29185485839844,
            },
        });

        // Example of vectors
        const position = this.client.utils.vector3(1.0, 1.0, 1.0);
        const position2 = this.client.utils.vector3(4.0, 3.0, 1.0);
        const distance = position.distance(position2);
    }
}

/**
 * Any Typescript files inside this folder with default export would be imported as active plugin
 * MAKE SURE IT'S A FUNCTION, OTHERWISE IT WOULDN'T BE IMPORTED!
 *
 * If you wanted to make a sub-module file (Example: function list, variable list, etc), please ensure you only export what you need and don't use default export
 *
 * Note:
 * 1. Check server folder too for more example
 * 2. This framework also support globbing
 */
export default (client: Client, config: any) => new Module(client, config);
