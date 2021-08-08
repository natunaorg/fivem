import Client from "@client/index";

class Module {
    client: Client;

    constructor(client: Client) {}
}
const _handler = (client: Client) => new Module(client);
export { _handler };
