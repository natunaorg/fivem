"use strict";
import "@citizenfx/client";

import GameUtils from "@client/utils/game";
import UtilsBase from "@shared/utils/base";

export default class Utils extends UtilsBase {
    constructor() {
        super();
    }

    game = new GameUtils();
}
