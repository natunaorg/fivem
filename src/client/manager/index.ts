"use strict";
import "@citizenfx/client";

import type Events from "@client/events";
import type Utils from "@client/utils";

import CommandManager from "@client/manager/command";
import KeyBindManager from "@client/manager/keybind";
import TickManager from "@shared/manager/tick";

export default class Manager {
    constructor(
        private events: Events, //
        private utils: Utils
    ) {}

    tick = new TickManager();
    command = new CommandManager(this.events);
    keybind = new KeyBindManager(this.utils);
}
