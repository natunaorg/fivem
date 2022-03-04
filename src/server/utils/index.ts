"use strict";
import "@citizenfx/server";

import UtilsBase from "@shared/utils/base";
import Crypter from "@server/utils/crypter";

export default class Utils extends UtilsBase {
    constructor() {
        super();
    }

    /**
     * @description
     * Crypter to Encrypt or Decrypt your secret data
     */
    crypter = new Crypter();
}
