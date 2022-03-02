"use strict";
import "@citizenfx/client";

import NUIEvent from "@client/events/nui";
import SharedEvent from "@client/events/shared";
import LocalEvent from "@shared/events/local";

export default class Events {
    nui = new NUIEvent();
    client = new LocalEvent();
    shared = new SharedEvent();
}
