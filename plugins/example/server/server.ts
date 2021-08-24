// Used only for typings reference. DO NOT DECLARE THIS CLASS.
import Server from "@server";

const Module = class {
    client: Server;
    config: any;

    constructor(client: Server, config: any) {
        this.client = client;
        this.config = config; // Config was imported from "natuna.config.js" file

        console.log(this.config.someExampleServerConfig); // true

        // Example of getting user ID on database
        this.client.registerCommand("mydbid", async (src) => {
            const identifiers = this.client.players.utils.getIdentifiers(src);
            const id = await this.client.db("users").findFirst({
                where: {
                    steam_id: identifiers.steam_id,
                },
            });

            console.log(`My user id is: ${id}`);
        });
    }
};

/**
 * Any Typescript files inside this folder with default export would be imported as active plugin
 * MAKE SURE IT'S A FUNCTION, OTHERWISE IT WOULDN'T BE IMPORTED!
 *
 * If you wanted to make a sub-module file (Example: function list, variable list, etc), please ensure you only export what you need and don't use default export
 *
 * This framework also support globbing
 */
export default (client: Server, config: any) => new Module(client, config);
