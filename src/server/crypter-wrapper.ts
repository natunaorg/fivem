import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

class CrypterWrapper implements Crypter {
    algorithm: string;
    secretKey: string;
    iv: any;

    constructor(algorithm: string, secretKey: string) {
        this.algorithm = algorithm || "aes-256-ctr";
        this.secretKey = secretKey || "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
        this.iv = randomBytes(16);
    }

    encrypt = (text: string) => {
        const cipher = createCipheriv(this.algorithm, this.secretKey, this.iv);
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

        return encrypted.toString("hex");
    };

    decrypt = (hash: any) => {
        const decipher = createDecipheriv(this.algorithm, this.secretKey, Buffer.from(hash.iv, "hex"));
        const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, "hex")), decipher.final()]);

        return decrpyted.toString();
    };
}

export default CrypterWrapper;
