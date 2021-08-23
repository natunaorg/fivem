/**
 * @description
 * Manifest file for the current plugin. **You could also use JSON file for manifest, check the example below**
 *
 * @example
 * {
 *  "active": true,
 *  "plugins": {
 *      "client": [
 *          "client.ts"
 *      ],
 *      "server": [
 *          "server.ts"
 *      ]
 *  },
 * }
 */

export default function () {
    return {
        /**
         * @description
         * Set whether if the plugin was active or not. If it's false, then the plugin and the ui would not be used.
         */
        active: false,

        /**
         * @description
         * List of all script to be used.
         *
         * YOU ONLY NEED TO SPECIFY THE STARTING POINT, NOT ALL FILES.
         * See the example files too to understand about it
         */
        plugins: {
            // Only writes the file name inside "client" folder
            client: ["client.ts"],

            // Only writes the file name inside "server" folder
            server: ["server.ts"],
        },
    };
}
