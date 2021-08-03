import Client from "@client/index"; // Used only for typings reference. DO NOT DECLARE THIS.

class Module {
    client: Client;
    config: any;

    constructor(client: Client, config: any) {
        this.client = client;
        this.config = config; // Config was imported from "natuna.config.js" file

        console.log(this.config.someExampleClientConfig); // true
        console.log(this.config.someExampleSecondClientConfig); // [1, 2, 3, 4, 5, 6]
        console.log(this.config.someExampleThirdClientConfig); // { example: true }
    }
}

// Always use "_handler" for the function name as it'd be the default handler the framework used.
export const _handler = (client: Client, config: any) => new Module(client, config);
