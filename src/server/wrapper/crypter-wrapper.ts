/**
 * @module Server - Crypter
 * @category Server
 */

"use strict";
import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

export default class Wrapper {
  /**
   * @hidden
   */
  algorithm: string;

  /**
   * @hidden
   */
  secretKey: string;

  /**
   * @hidden
   */
  iv: any;

  /**
   * @hidden
   */
  constructor(algorithm: string, secretKey: string) {
    /**
     * @description
     * Algorithm used for encrypting data
     *
     * @example
     * ```ts
     * "aes-256-ctr"
     * ```
     */
    this.algorithm = algorithm || "aes-256-ctr";

    /**
     * @description
     * Secret key used to encrypt and decrypt data
     *
     * @example
     * ```ts
     * "myTotalySecretKey"
     * ```
     */
    this.secretKey = secretKey || "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";

    /**
     * @description
     * Random Bytes
     */
    this.iv = randomBytes(16);
  }

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
    const cipher = createCipheriv(this.algorithm, this.secretKey, this.iv);
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
  decrypt = (hash: any) => {
    const decipher = createDecipheriv(
      this.algorithm,
      this.secretKey,
      Buffer.from(hash.iv, "hex")
    );
    const decrpyted = Buffer.concat([
      decipher.update(Buffer.from(hash.content, "hex")),
      decipher.final(),
    ]);

    return decrpyted.toString();
  };
}
