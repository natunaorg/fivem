"use strict";
import "@citizenfx/server";

import type Events from "@server/events";
import type Players from "@server/players";

import CommandManager from "@server/manager/command";
import TickManager from "@shared/manager/tick";
import Utils from "@server/utils";

export default class Manager {
    constructor(
        private events: Events, //
        private players: Players,
        private utils: Utils
    ) {}

    tick = new TickManager();
    command = new CommandManager(this.events, this.players, this.utils);
}
