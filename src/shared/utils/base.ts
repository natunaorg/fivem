export type NoFunction<T> = T extends (...args: any) => any ? never : T;

export default class UtilsBase {
    /**
     * @description
     * Cool Natuna Ascii Art
     */
    asciiArt = [
        "░░░    ░░  ░░░░░  ░░░░░░░░ ░░    ░░ ░░░    ░░  ░░░░░ ",
        "▒▒▒▒   ▒▒ ▒▒   ▒▒    ▒▒    ▒▒    ▒▒ ▒▒▒▒   ▒▒ ▒▒   ▒▒",
        "▒▒ ▒▒  ▒▒ ▒▒▒▒▒▒▒    ▒▒    ▒▒    ▒▒ ▒▒ ▒▒  ▒▒ ▒▒▒▒▒▒▒",
        "▓▓  ▓▓ ▓▓ ▓▓   ▓▓    ▓▓    ▓▓    ▓▓ ▓▓  ▓▓ ▓▓ ▓▓   ▓▓",
        "██   ████ ██   ██    ██     ██████  ██   ████ ██   ██",
    ].join("\n");

    /**
     * @description
     * Uppercase first letter of each words
     *
     * @example
     * ```ts
     * ucwords('hello world'); // Hello World
     * ```
     */
    ucwords = (str: string) => {
        return str.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
    };

    /**
     * @description
     * Use this function to hold next script below this from executing before it finish the timeout itself
     *
     * @example
     * ```ts
     * const isActive = false;
     * setTimeout(() => (isActive = true), 3000)
     *
     * console.log(isActive); // false
     *
     * while(!isActive) {
     *     await sleep(5000)
     * };
     *
     * console.log(isActive); // true
     * ```
     */
    sleep = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));

    generateUniqueId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    };

    getHashString = (val: string) => {
        let hash = 0;
        let string = val.toLowerCase();

        for (let i = 0; i < string.length; i++) {
            let letter = string[i].charCodeAt(0);
            hash = hash + letter;
            hash += (hash << 10) >>> 0;
            hash ^= hash >>> 6;
            hash = hash >>> 0;
        }

        hash += hash << 3;

        if (hash < 0) hash = hash >>> 0;

        hash ^= hash >>> 11;
        hash += hash << 15;

        if (hash < 0) hash = hash >>> 0;

        return hash.toString(16).toUpperCase();
    };

    validator = {
        isObject: (obj: Record<string, any>) => {
            if (!obj || typeof obj == "undefined" || typeof obj !== "object" || Array.isArray(obj)) {
                return false;
            }
            return true;
        },
        isArray: (arr: any[]) => {
            if (!arr || typeof arr == "undefined" || !Array.isArray(arr)) {
                return false;
            }
            return true;
        },
    };
}
