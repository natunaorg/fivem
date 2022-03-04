"use strict";
import "@citizenfx/client";

import type Utils from "@client/utils";

export default class KeyBindManager {
    constructor(
        private utils: Utils //
    ) {}

    #keyControlCount = 1;

    /**
     * @description
     * Set a keyboard key mapper to a function. This function also allows user to change their keybind on pause menu settings.
     *
     * ![](https://i.cfx.re/rage/fwuiComplexObjectDirectImpl/Contains/1836.png)
     */
    registerKeyControl = (key: string, description: string, onClick: () => any, onReleased: () => any = () => true) => {
        const controlID = `control-${this.#keyControlCount}-${this.utils.generateUniqueId()}`;
        const controlIDHash = "~INPUT_" + this.utils.getHashString(`+${controlID}`) + "~";

        RegisterCommand(`+${controlID}`, () => onClick(), false);
        RegisterCommand(`-${controlID}`, () => onReleased(), false);
        RegisterKeyMapping(`+${controlID}`, description, "keyboard", key);

        this.#keyControlCount++;
        return controlIDHash;
    };
}
