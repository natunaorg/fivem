import Client from "@client/index";

declare namespace Map {
    namespace Blip {
        interface Create {
            title: string;
            colour: number;
            iconId: number;
            location: {
                x: number;
                y: number;
                z: number;
            };
            entityId?: any;
            loaded?: boolean;
        }
        interface Edit {
            title?: string;
            colour?: number;
            iconId?: number;
            location?: {
                x: number;
                y: number;
                z: number;
            };
            entityId?: any;
        }
    }
    namespace Area {
        interface Create {
            colour: number;
            location: {
                x: number;
                y: number;
                z: number;
            };
            rotation?: number;
            width?: number;
            height?: number;
            radius?: number;
            entityId?: any;
        }
        interface Edit {
            colour?: number;
            location?: {
                x: number;
                y: number;
                z: number;
            };
            rotation?: number;
            width?: number;
            height?: number;
            radius?: number;
            entityId?: any;
        }
    }
}

class Wrapper {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Draw 3D floating text
     * @author Rafly Maulana
     * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
     *
     * @example
     * utils.drawText3D(10, 10, 10, "WOW", 255, 255, 255)
     */
    drawText3D = (text: string, x: number, y: number, z: number, r: number, g: number, b: number) => {
        SetDrawOrigin(x, y, z, 0);
        SetTextFont(0);
        SetTextProportional(false);
        SetTextScale(0.0, 0.2);
        SetTextColour(r, g, b, 255);
        SetTextDropshadow(0, 0, 0, 0, 255);
        SetTextEdge(2, 0, 0, 0, 150);
        SetTextDropShadow();
        SetTextOutline();
        SetTextEntry("STRING");
        SetTextCentre(true);
        AddTextComponentString(text);
        DrawText(0.0, 0.0);
        ClearDrawOrigin();
        return true;
    };

    /**
     * Draw text on screen
     * @author Rafly Maulana
     * @source https://github.com/machinetherapist/Revolution.js/blob/master/revolution.js
     *
     * @example
     * utils.drawText("WOW", 100, 200)
     */
    drawText = (text: string, x: number, y: number) => {
        SetTextFont(1);
        SetTextProportional(true);
        SetTextScale(0.0, 0.6);
        SetTextDropshadow(1, 0, 0, 0, 255);
        SetTextEdge(1, 0, 0, 0, 255);
        SetTextDropShadow();
        SetTextOutline();
        SetTextEntry("STRING");
        AddTextComponentString(text);
        DrawText(x, y);
        return true;
    };

    /**
     * Show a GTA V notification snackbar
     * @author Rafly Maulana
     *
     * @example
     * utils.notify("Hello World!")
     */
    notify = (...text: any) => {
        SetNotificationTextEntry("STRING");
        AddTextComponentString(text.join(" "));
        DrawNotification(false, false);
        return true;
    };

    getHashString = (val: string) => {
        let hash = 0;
        let string = val.toLowerCase();
        for (var i = 0; i < string.length; i++) {
            let letter = (string[i] as any).charCodeAt();
            hash = hash + letter;
            hash += (hash << 10) >>> 0;
            hash ^= hash >>> 6;
            hash = hash >>> 0;
        }

        hash += hash << 3;
        if (hash < 0) {
            hash = hash >>> 0;
        }
        hash ^= hash >>> 11;
        hash += hash << 15;
        if (hash < 0) {
            hash = hash >>> 0;
        }
        return hash.toString(16).toUpperCase();
    };

    getKeyControlId = (key: string) => {
        switch (key.toUpperCase()) {
            case "A":
                return 34;
            case "B":
                return 29;
            case "C":
                return 26;
            case "D":
                return 30;
            case "E":
                return 46;
            case "F":
                return 49;
            case "G":
                return 47;
            case "H":
                return 74;
            case "I":
                return false;
            case "J":
                return false;
            case "K":
                return 311;
            case "L":
                return 7;
            case "M":
                return 244;
            case "N":
                return 249;
            case "O":
                return false;
            case "P":
                return 199;
            case "Q":
                return 44;
            case "R":
                return 45;
            case "S":
                return 33;
            case "T":
                return 245;
            case "U":
                return 303;
            case "V":
                return 0;
            case "W":
                return 32;
            case "X":
                return 77;
            case "Y":
                return 246;
            case "Z":
                return 20;
            default:
                return false;
        }
    };

    color = {
        hexToRgb: (hex: string) => {
            return hex
                .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => "#" + r + r + g + g + b + b)
                .substring(1)
                .match(/.{2}/g)
                .map((x) => parseInt(x, 16));
        },
    };

    /**
     * Map utility
     */
    map = {
        /**
         * Map Blips
         */
        blip: {
            /**
             * List of map blips
             */
            lists: {},

            /**
             * Add a map blip
             * @author Rafly Maulana
             *
             * @example
             * utils.map.blip.add({
             *      title: "Example",
             *      colour: 30,
             *      id: 108,
             *      location: {
             *          x: 260.130,
             *          y: 204.308,
             *          z: 109.287
             *      }
             * })
             */
            add: (config: Map.Blip.Create) => {
                const blipId = Object.keys(this.map.blip.lists).length + 1;
                const blip = (this.map.blip.lists[blipId] = config);

                blip.entityId = AddBlipForCoord(blip.location.x, blip.location.y, blip.location.z);
                SetBlipSprite(blip.entityId, blip.iconId);
                SetBlipDisplay(blip.entityId, 4);
                SetBlipScale(blip.entityId, 1.0);
                SetBlipColour(blip.entityId, blip.colour);
                SetBlipAsShortRange(blip.entityId, true);
                BeginTextCommandSetBlipName("STRING");
                AddTextComponentString(blip.title);
                EndTextCommandSetBlipName(blip.entityId);

                return blipId;
            },

            /**
             * Edit a map blip
             * @author Rafly Maulana
             *
             * @example
             * utils.map.blip.edit(10, {
             *      location: {
             *          x: 260.130,
             *          y: 204.308,
             *          z: 109.287
             *      }
             * })
             */
            edit: (blipId: number, newConfig: Map.Blip.Edit) => {
                const blip = Object.assign(this.map.blip.lists[blipId], newConfig);

                this.map.blip.remove(blipId);
                this.map.blip.add(blip);

                return blipId;
            },

            /**
             * Remove a map blip
             * @author Rafly Maulana
             *
             * @example
             * utils.map.blip.remove(10)
             */
            remove: (blipId: number) => {
                RemoveBlip(this.map.blip.lists[blipId].entityId);
                delete this.map.blip.lists[blipId];

                return true;
            },
        },

        /**
         * Map Area
         */
        area: {
            /**
             * List of map area
             */
            lists: {},

            /**
             * Add a map area. If width and height property was given, the area created would be a rectangle.
             * If you're using a rectangle area and no radius is given, the radius written will be the smallest one between height or width.
             * @author Rafly Maulana
             *
             * @example
             * utils.map.area.add({
             *      colour: 10,
             *      radius: 50,
             *      location: {
             *           x: 1,
             *           y: 1,
             *           z: 1
             *      },
             * })
             */
            add: (config: Map.Area.Create) => {
                const areaId = Object.keys(this.map.area.lists).length + 1;
                let area = (this.map.area.lists[areaId] = config);

                if (config.width && config.height) {
                    area.radius = config.radius || config.width > config.height ? config.height : config.width;
                    area.entityId = AddBlipForArea(config.location.x, config.location.y, config.location.z, config.width, config.height);
                    SetBlipRotation(area.entityId, config.rotation || 0);
                } else {
                    area.entityId = AddBlipForRadius(config.location.x, config.location.y, config.location.z, config.radius || 50);
                }

                SetBlipColour(area.entityId, config.colour);
                return areaId;
            },

            /**
             * Edit a map area
             * @author Rafly Maulana
             *
             * @example
             * utils.map.area.edit(10, {
             *      location: {
             *          x: 260.130,
             *          y: 204.308,
             *          z: 109.287
             *      }
             * })
             */
            edit: (areaId: number, newConfig: Map.Area.Edit) => {
                const area = Object.assign(this.map.area.lists[areaId], newConfig);

                this.map.area.remove(areaId);
                this.map.area.add(area);

                return areaId;
            },

            /**
             * Remove a map area
             * @author Rafly Maulana
             *
             * @example
             * utils.map.area.remove(10)
             */
            remove: (areaId: number) => {
                RemoveBlip(this.map.area.lists[areaId].entityId);
                delete this.map.area.lists[areaId];

                return true;
            },

            /**
             * Get a list of players inside area radius
             * @author Rafly Maulana
             *
             * @param checkZAxis check the Z axis
             */
            getPlayerInside: (areaId: number, checkZAxis: boolean = true) => {
                const activePlayersId = GetActivePlayers();
                const area = this.map.area.lists[areaId];

                let playersInside: Array<number> = [];

                for (const playerId of activePlayersId) {
                    const player = this.client.game.player.getCoords(playerId);
                    if (GetDistanceBetweenCoords(player.x, player.y, player.z, area.location.x, area.location.y, area.location.z, checkZAxis) <= area.radius) {
                        playersInside.push(GetPlayerServerId(playerId));
                    }
                }

                return playersInside;
            },
        },
    };
}

export default Wrapper;
export { Map, Wrapper };
