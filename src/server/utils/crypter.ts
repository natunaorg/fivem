"use strict";
import "@citizenfx/server";
import Server from "@server";

import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

export default class Crypter {
    /** @hidden */
    constructor(private clientConfig: Server["config"]) {}

    #iv: Buffer = randomBytes(16);
    #algorithm = this.clientConfig.core.crypter.algorithm;
    #secretKey = this.clientConfig.core.crypter.secretKey;

    /**
     * @description
     * Encrypt a data
     *
     * @example
     * ```ts
     * encrypt('bacon'); // Result: "e7b75a472b65bc4a42e7b3f788..."
     * ```
     */
    encrypt = (text: string) => {
        const cipher = createCipheriv(this.#algorithm, this.#secretKey, this.#iv);
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

        return encrypted.toString("hex");
    };

    /**
     * @description
     * Decrypt a hash/encrypted data
     *
     * @example
     * ```ts
     * decrypt('e7b75a472b65bc4a42e7b3f788...') // Result: "bacon"
     * ```
     */
    decrypt = (hash: { iv: any; content: any }) => {
        const decipher = createDecipheriv(this.#algorithm, this.#secretKey, Buffer.from(hash.iv, "hex"));
        const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, "hex")), decipher.final()]);

        return decrpyted.toString();
    };
}
