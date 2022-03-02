"use strict";
import "@citizenfx/server";

import SharedEvent from "@server/events/shared";
import LocalEvent from "@shared/events/local";

export default class Events {
    server = new LocalEvent();
    shared = new SharedEvent();
}
