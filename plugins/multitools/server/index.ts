import Server from "@server/index";

class Module {
    client: Server;

    constructor(client: Server) {
        this.client = client;

        const identifier = this.client.players.utils.getPlayerIds(5);
        console.log(identifier.license, identifier.ip);
    }
}

const _handler = (client: Server) => new Module(client);
export { _handler };
