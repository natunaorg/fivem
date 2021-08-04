"use strict";
import Client from "@client/index";

export interface MapBlip {
    title?: string;
    colour?: number;
    iconId?: number;
    location?: {
        x: number;
        y: number;
        z: number;
    };
    id?: any;
}

export class Wrapper {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * @description
     * Draw 3D floating text
     *
     * ![](https://forum.cfx.re/uploads/default/original/3X/8/a/8ad0a2e8b139cb11d240fdc4bd115c42c91b9a0b.jpeg)
     *
     * @variation
     * - Font list: https://gtaforums.com/topic/794014-fonts-list/
     * - Font Size: 0.0 - 1.0
     * - Colour: [r,g,b,a]
     *
     * @example
     * drawText3D("Press E to Pickup", {
     *      x: 0.8,
     *      y: 0.85,
     *      font: 4,
     *      size: 0.6,
     *      colour: [255,255,255,255]
     * })
     */
    drawText3D = (text: string, config: { x: number; y: number; z: number; font?: number; size?: number; colour: [number, number, number, number] }) => {
        SetDrawOrigin(config.x, config.y, config.z, 0);
        SetTextFont(config.font || 4);
        SetTextProportional(false);
        SetTextScale(0.0, config.size || 0.6);
        SetTextColour(...config.colour);
        SetTextDropshadow(0, 0, 0, 0, 255);
        SetTextEdge(2, 0, 0, 0, 150);
        SetTextDropShadow();
        SetTextOutline();
        BeginTextCommandDisplayText("STRING");
        SetTextCentre(true);
        AddTextComponentSubstringPlayerName(text);
        EndTextCommandDisplayText(0.0, 0.0);
        ClearDrawOrigin();
    };

    /**
     * @description
     * Draw text on screen
     *
     * ![](https://forum.cfx.re/uploads/default/original/3X/2/6/26dd0f34710d145af0f6b49d3bc4b12b80e6df8e.png)
     *
     * @variation
     * - Font list: https://gtaforums.com/topic/794014-fonts-list/
     * - Percentage of the axis: 0.0f < x, y < 1.0f
     *
     * @example
     * drawText("Your Server ID: 1", {
     *      x: 0.8,
     *      y: 0.85,
     *      font: 4,
     *      size: 0.6
     * });
     */
    drawText = (text: string, config: { x: number; y: number; font?: number; size?: number }) => {
        SetTextFont(config.font || 4);
        SetTextProportional(true);
        SetTextScale(0.0, config.size || 0.6);
        SetTextDropshadow(1, 0, 0, 0, 255);
        SetTextEdge(1, 0, 0, 0, 255);
        SetTextDropShadow();
        SetTextOutline();
        BeginTextCommandDisplayText("STRING");
        AddTextComponentSubstringPlayerName(text);
        EndTextCommandDisplayText(config.x, config.y);
    };

    /**
     * @description
     * Draw a list of instructional buttons.
     *
     * ![](https://forum.cfx.re/uploads/default/original/3X/7/6/76ed876c492fbe1b155b1131221c8911d7d3a50b.png)
     *
     * @variation
     * - Controls: https://docs.fivem.net/docs/game-references/controls/#controls
     * @param buttonList List of buttons
     *
     * @example
     * drawInstructionalButtons([
     *      { controlType: 0, controlId: 32, message: "Move Forward" },
     *      { controlType: 0, controlId: 33, message: "Move Backward" }
     * ])
     */
    drawInstructionalButtons = async (buttonList: Array<{ controlType: number; controlId: number; message: string }>) => {
        const SetButton = (padIndex: number, control: number) => {
            ScaleformMovieMethodAddParamPlayerNameString(GetControlInstructionalButton(padIndex, control, true));
        };

        const SetButtonMessage = (text: string) => {
            BeginTextCommandScaleformString("STRING");
            AddTextComponentScaleform(text);
            EndTextCommandScaleformString();
        };

        const scaleform = RequestScaleformMovie("instructional_buttons");
        while (!HasScaleformMovieLoaded(scaleform)) await this.client.wait(5);

        PushScaleformMovieFunction(scaleform, "CLEAR_ALL");
        PopScaleformMovieFunctionVoid();

        PushScaleformMovieFunction(scaleform, "SET_CLEAR_SPACE");
        PushScaleformMovieFunctionParameterInt(200);
        PopScaleformMovieFunctionVoid();

        for (const keyIndex in buttonList.reverse()) {
            const data = buttonList[keyIndex];

            PushScaleformMovieFunction(scaleform, "SET_DATA_SLOT");
            PushScaleformMovieFunctionParameterInt(+keyIndex);
            SetButton(data.controlType, data.controlId);
            SetButtonMessage(data.message);
            PopScaleformMovieFunctionVoid();
        }

        PushScaleformMovieFunction(scaleform, "DRAW_INSTRUCTIONAL_BUTTONS");
        PopScaleformMovieFunctionVoid();

        PushScaleformMovieFunction(scaleform, "SET_BACKGROUND_COLOUR");
        PushScaleformMovieFunctionParameterInt(0);
        PushScaleformMovieFunctionParameterInt(0);
        PushScaleformMovieFunctionParameterInt(0);
        PushScaleformMovieFunctionParameterInt(80);
        PopScaleformMovieFunctionVoid();

        DrawScaleformMovieFullscreen(scaleform, 255, 255, 255, 255, 0);
        return scaleform;
    };

    /**
     * @description
     * Show a GTA V feed notification
     *
     * ![](https://i.imgur.com/TJvqkYq.png)
     *
     * @variation
     * - Background Color List: https://gyazo.com/68bd384455fceb0a85a8729e48216e15
     *
     * @example
     * createFeedNotification("You Got a New Message!", {
     *      backgroundColor: 140
     * });
     */
    createFeedNotification = (text: string, config: { backgroundColor?: number } = {}) => {
        BeginTextCommandThefeedPost("STRING");
        ThefeedSetNextPostBackgroundColor(config.backgroundColor || 140);
        AddTextComponentSubstringPlayerName(text);
        EndTextCommandThefeedPostTicker(false, false);
    };

    /**
     * @description
     * Create help notification
     *
     * ![](https://forum.cfx.re/uploads/default/original/4X/b/a/9/ba9186c16bd7a6c43d4f778f00ce3ce9a76cfe2d.png)
     *
     * @example
     * createHelpNotification("Press ~INPUT_MOVE_UP_ONLY~ to Walk");
     */
    createHelpNotification = (text: string, config: { beep?: boolean } = {}) => {
        BeginTextCommandDisplayHelp("STRING");
        AddTextComponentSubstringPlayerName(text);
        EndTextCommandDisplayHelp(0, false, config.beep || false, -1);
    };

    /**
     * @description
     * Get hash value from the string
     *
     * @example
     * getHashString('Some Value');
     */
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

        if (hash < 0) hash = hash >>> 0;

        hash ^= hash >>> 11;
        hash += hash << 15;

        if (hash < 0) hash = hash >>> 0;

        return hash.toString(16).toUpperCase();
    };

    /**
     * @description
     * Get the coordinates of the reflected entity/object the camera is aiming at
     *
     * @example
     * getCamTargetedCoords(6.0);
     */
    getCamTargetedCoords = (distance: number) => {
        const [camRotX, , camRotZ] = GetGameplayCamRot(2);
        const [camX, camY, camZ] = GetGameplayCamCoord();

        const tZ = camRotZ * 0.0174532924;
        const tX = camRotX * 0.0174532924;
        const num = Math.abs(Math.cos(tX));

        const x = camX + -Math.sin(tZ) * (num + distance);
        const y = camY + Math.cos(tZ) * (num + distance);
        const z = camZ + Math.sin(tX) * 8.0;

        return { x, y, z };
    };

    /**
     * @description
     * Get the entity camera direction offset from axis X.
     *
     * @example
     * getCamDirection();
     */
    getCamDirection = () => {
        const heading = GetGameplayCamRelativeHeading() + GetEntityHeading(GetPlayerPed(-1));
        const pitch = GetGameplayCamRelativePitch();

        let x = -Math.sin((heading * Math.PI) / 180.0);
        let y = Math.cos((heading * Math.PI) / 180.0);
        let z = Math.sin((pitch * Math.PI) / 180.0);

        const len = Math.sqrt(x * x + y * y + z * z);
        if (len !== 0) {
            x = x / len;
            y = y / len;
            z = z / len;
        }

        return { x, y, z };
    };

    /**
     * @description
     * Get entity the ped aimed at
     *
     * @example
     * getTargetedEntity(6.0);
     */
    getTargetedEntity = (distance: number) => {
        const [camX, camY, camZ] = GetGameplayCamCoord();
        const targetCoords = this.getCamTargetedCoords(distance);
        const RayHandle = StartShapeTestRay(camX, camY, camZ, targetCoords.x, targetCoords.y, targetCoords.z, -1, PlayerPedId(), 0);
        const [, , , , entityHit] = GetRaycastResult(RayHandle);

        return { entityHit, ...targetCoords };
    };

    /**
     * @description
     * Uppercase first letter of each words
     *
     * @example
     * ucwords('hello world'); // Hello World
     */
    ucwords = (str: string) => {
        return str.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
    };

    /**
     * Map Blips
     */
    mapBlip = {
        lists: {},

        /**
         * @description
         * Add a map blip (Must include all configuration below)
         *
         * @variation
         * - Blip List: https://docs.fivem.net/docs/game-references/blips/
         * - Colour List: https://runtime.fivem.net/doc/natives/?_0x03D7FB09E75D6B7E
         *
         * @example
         * create({
         *      "title": "Example",
         *      "colour": 30,
         *      "id": 108,
         *      "location": {
         *          "x": 260.130,
         *          "y": 204.308,
         *          "z": 109.287
         *      }
         * });
         */
        create: (config: MapBlip) => {
            config.id = AddBlipForCoord(config.location.x, config.location.y, config.location.z);
            SetBlipSprite(config.id, config.iconId);
            SetBlipDisplay(config.id, 4);
            SetBlipScale(config.id, 1.0);
            SetBlipColour(config.id, config.colour);
            SetBlipAsShortRange(config.id, true);
            BeginTextCommandSetBlipName("STRING");
            AddTextComponentString(config.title);
            EndTextCommandSetBlipName(config.id);

            return ((this.mapBlip as any).lists[config.id] = config);
        },

        /**
         * @description
         * Edit a map blip
         *
         * @variation
         * - Blip List: https://docs.fivem.net/docs/game-references/blips/
         * - Colour List: https://runtime.fivem.net/doc/natives/?_0x03D7FB09E75D6B7E
         *
         * @example
         * edit({
         *      "title": "Clothing Store"
         * });
         */
        edit: (blipId: number, newConfig: MapBlip) => {
            const oldConfig: MapBlip = (this.mapBlip as any).lists[blipId];
            newConfig = {
                ...oldConfig,
                ...newConfig,
                location: {
                    ...oldConfig.location,
                    ...newConfig.location,
                },
            };

            this.mapBlip.remove(blipId);
            this.mapBlip.create(newConfig);

            return newConfig;
        },

        /**
         * @description
         * Remove a map blip
         *
         * @example
         * remove(1);
         */
        remove: (blipId: number) => {
            RemoveBlip(blipId);
        },
    };
}

export default Wrapper;
