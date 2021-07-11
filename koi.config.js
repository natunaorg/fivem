/**
 * [IMPORTANT NOTES!]
 * This config SHOULDN'T BE imported through client script and not recommended to import it outside the core of Koi Framework.
 * Module based files allows you to import this script on Client or Server but there would be a HIGH SECURITY ISSUES if you pull this files outside the core of this framework.
 */

module.exports = {
    core: {
        /**
         * Koi Framework using persistent Steam ID instead of other dynamic ID, to whitelist a person just put the SteamID64 on the array below
         * [IMPORTANT] KEEP IT EMPTY TO SET IT OFF
         * @example
         * whitelistedSteamID: [
         *      76345198181789231,
         *      76561112381745631
         * ]
         */
        whitelistedSteamID: [],
        /**
         * We used MYSQL because it provides more persistant data type and had a nice control panel like PHPMYADMIN, also this Database gives more security rather than using MONGODB.
         * [IMPORTANT] If your server players was high, i'd recommend you to use a fast SQL Database like PostgreSQL, but you would need to configure some script first.
         */
        mysql: {
            /**
             * Hostname of the SQL Server
             * @example 127.0.0.1
             */
            host: "localhost",
            /**
             * Port of the SQL Server
             * @example 3306
             */
            port: 3306,
            /**
             * Username of the SQL Server
             * @example root
             */
            user: "root",
            /**
             * Password of the SQL Server
             * @example someStrongPassword
             */
            password: "",
            /**
             * Database Name (Make sure you have already installed the database)
             * @example koifw
             */
            database: "koifw",
        },
        /**
         * We provide you an encryption to encrypt some sensitive data before putting it on to the Database
         */
        crypter: {
            /**
             * Algorithm of the Encrypter (I suggest you not to change it, unless you know what you're doing)
             * @example aes-256-ctr
             */
            algorithm: "aes-256-ctr",
            /**
             * The password to encrypt and decrypt data
             * [IMPORTANT] KEEP IT SECRET, SAVE IT, you don't wanna leak or lose this key. Once it's gone missing, you're done.
             * @example someStrongPassword123
             */
            secretKey: "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3",
        },
        /**
         * Koi Framework Client Options Configuration
         * If you had a custom client plugins, you might wanna store your configuration here.
         */
        client: {
            /**
             * Disable Emergency Service like Police, Ambulance, Firefighters, etc.
             */
            noDispatchService: false,

            /**
             * Disable Wanted Level
             */
            noWantedLevel: true,
            /**
             * Set whether auto respawn is disabled if player dies
             * [IMPORTANT!] This option requires "spawnmanager" script to be activated!
             */
            autoRespawnDisabled: true,
        },
    },
    plugins: {
        // prettier-ignore
        "character": {
            client: {
                /**
                 * Set the interval of player location updates to SERVER. The last player location saved will be the player location saved to database if player is crashing/leaving.
                 * [IMPORTANT]
                 * It just saved a temporary data to server as long the player still on the game,
                 * to set the interval of saving all the temporary data to Database, check another
                 * configuration below
                 */
                savePlayerDataTemporaryInterval: 1 * 1000, // 1 second (in Milisecond)
            },
        },
    },
};
