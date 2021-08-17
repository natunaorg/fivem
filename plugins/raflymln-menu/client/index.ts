import Client from "@client/index";

class Module {
    client: Client;

    constructor(client: Client) {
        this.client = client;

        this.client.registerCommand("menu", () => {
            this.client.triggerNUIEvent("raflymln-menu:nui:setMenu", {
                menuList: [
                    {
                        icon: "🌳",
                        title: "Plant Tree",
                    },
                ],
            });
        });
    }
}
const _handler = (client: Client) => new Module(client);
export { _handler };
