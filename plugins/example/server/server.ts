// Used only for typings reference. DO NOT DECLARE THIS CLASS.
import Server from "@server/index";

class Module {
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
}

// Always use "_handler" for the function name as it'd be the default handler the framework used.
export const _handler = (client: Server, config: any) => new Module(client, config);
