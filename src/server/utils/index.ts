"use strict";
import "@citizenfx/server";

import type Server from "@server";

import UtilsBase from "@shared/utils/base";
import Crypter from "@server/utils/crypter";

export default class Utils extends UtilsBase {
    constructor(private clientConfig: Server["config"]) {
        super();
    }

    /**
     * @description
     * Crypter to Encrypt or Decrypt your secret data
     */
    crypter = new Crypter(this.clientConfig);
}
