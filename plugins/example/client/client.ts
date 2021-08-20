// Used only for typings reference. DO NOT DECLARE THIS CLASS.
import Client from "@client/index";
import { Vector } from "@server/modules/vec";

/**
 * This file below is not a starting point, which may contain like list of functions or variable, you SHOULD NOT add this file below to manifest.
 */
import { someFunction } from "./SomeOtherScript";

class Module {
  client: Client;
  config: any;

  constructor(client: Client, config: any) {
    this.client = client;
    this.config = config; // Config was imported from "natuna.config.js" file

    console.log(this.config.someExampleClientConfig); // true
    console.log(this.config.someExampleSecondClientConfig); // [1, 2, 3, 4, 5, 6]
    console.log(this.config.someExampleThirdClientConfig); // { example: true }

    someFunction(); // Hello World!

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
    const position = new Vector(1.0, 1.0, 1.0);
    const position2 = new Vector(4.0, 3.0, 1.0);
    const distance = position.distance(position2);
  }
}

// Always use "_handler" for the function name as it'd be the default handler the framework used.
export const _handler = (client: Client, config: any) =>
  new Module(client, config);
