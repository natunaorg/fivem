import Server from "@server/index";

let savednum: number = 2;

class Module {
    client: Server;

    constructor(client: Server) {
        this.client = client;

        console.log("multitools", savednum);
    }
}

const _handler = (client: Server) => new Module(client);
export { _handler };
