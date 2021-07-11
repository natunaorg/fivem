import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

class Wrapper {
    algorithm: string;
    secretKey: string;
    iv: any;

    constructor(algorithm: string, secretKey: string) {
        /**
         * Algorithm used for encrypting data
         * @author Rafly Maulana
         *
         * @example
         * "aes-256-ctr"
         */
        this.algorithm = algorithm || "aes-256-ctr";

        /**
         * Secret key used to encrypt and decrypt data
         * @author Rafly Maulana
         *
         * @example
         * "myTotalySecretKey"
         */
        this.secretKey = secretKey || "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";

        /**
         * Random Bytes
         * @author Rafly Maulana
         */
        this.iv = randomBytes(16);
    }

    /**
     * Encrypt a data
     * @author Rafly Maulana
     *
     * @example
     * encrypt('bacon'); // Result: "e7b75a472b65bc4a42e7b3f788..."
     */
    encrypt = (text: string) => {
        const cipher = createCipheriv(this.algorithm, this.secretKey, this.iv);
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

        return encrypted.toString("hex");
    };

    /**
     * Decrypt a hash/encrypted data
     * @author Rafly Maulana
     *
     * @example
     * decrypt('e7b75a472b65bc4a42e7b3f788...') // Result: "bacon"
     */
    decrypt = (hash: any) => {
        const decipher = createDecipheriv(this.algorithm, this.secretKey, Buffer.from(hash.iv, "hex"));
        const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, "hex")), decipher.final()]);

        return decrpyted.toString();
    };
}

export default Wrapper;
export { Wrapper };
