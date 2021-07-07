class Module {
    client: Koi["Client"];

    constructor(client) {
        this.client = client;

        this.client.addSharedEventHandler("KOI::CLIENT::TeleportPlayer", (x, y, z) => {
            this.client.game.player.teleport.coordinates(PlayerId(), parseInt(x), parseInt(y), parseInt(z));
        });

        this.client.registerCommand("myid", (src) => this.client.utils.notify(src));
        this.client.registerCommand("mycoords", (src) => this.client.utils.notify("Your Coordinates is:", this.client.game.player.getCoords(src)));

        this.client.registerCommand("revive", (src, args) => this.client.game.player.revive(args[0] || src));
        this.client.registerCommand("kill", (src, args) => this.client.game.player.kill(args[0] || src));
        this.client.registerCommand("track", (src, args) => this.client.game.player.track(args[0] || src));
        this.client.registerCommand("invisible", (src, args) => this.client.game.player.invisible(args[0] || src));

        this.client.registerCommand("car", (src, args) => this.client.game.vehicle.spawn(src, args[0]));
        this.client.registerCommand("dv", this.client.game.vehicle.delete);

        this.client.registerCommand("tpm", (src) => this.client.game.player.teleport.marker(src));
        this.client.registerCommand("tp", (src, args) => this.client.game.player.teleport.coordinates(src, args[0], args[1], args[2]));
    }
}

const _handler = (client) => new Module(client);
export { _handler };
