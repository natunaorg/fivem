/**
 * [IMPORTANT NOTES!]
 * This config SHOULDN'T BE imported through client script and not recommended to import it outside the core of Koi Framework.
 * Module based files allows you to import this script on Client or Server but there would be a HIGH SECURITY ISSUES if you pull this files outside the core of this framework.
 */

const config = {
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
        whitelistedSteamID: ["76561198290395137"],

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
         * List of players wrapper configuration
         */
        players: {
            /**
             * Saving data of every player to server variable, not to Database.
             * We cached the player data before putting it to database, so there'd no mysql connection floodings caused by data saving.
             * It also helpful to ensure players so that their not gonna lose their data in case if something bad like internet loss happens
             */
            saveDataTemporaryInterval: 1 * 1000, // 1 second (in Milisecond)

            /**
             * Saving data to database from registered cache
             * Keep in mind, when player is leaving the server, the last cached data would be saved to database instantly, this interval is to protect in case the temporary data is corrupted
             */
            saveDataToDatabaseInterval: 30 * 1000, // 30 second

            /**
             * Set how long the temporary data would be keep when player leave the server.
             * Set to [true] to keep the data forever (as long the server still running).
             * Set data to [number] in Milisecond to add the timeout before data is deleted (Example: 10 * 1000 [10 Second])
             * Set data to [false] to instantly delete the data;
             */
            keepDataAfterLeaving: 10 * 1000,
        },

        /**
         * Koi Framework Client Options Configuration
         * If you had a custom client plugins, you might wanna store your configuration here.
         */
        client: {
            /**
             * Disable Emergency Service like Police, Ambulance, Firefighters, etc.
             */
            noDispatchService: true,

            /**
             * Disable Wanted Level
             */
            noWantedLevel: true,

            /**
             * Set whether auto respawn is disabled if player dies
             * [IMPORTANT!] This option requires "spawnmanager" script to be activated!
             */
            autoRespawnDisabled: true,

            /**
             * Set pause menu title
             */
            pauseMenuTitle: "~y~Koi Indonesia Roleplay ~m~| ~b~Discord~m~: ~b~kGPHBvXzGM~m~",
        },
    },
    plugins: {
        // prettier-ignore
        "raflymln-vehcontrol": {
            client: {
                carWithManualTransmissions: [
                    'sultan',
                    'jb700',
                    'policeb'
                ]
            },
        },
    },
};

// module.exports = config; // Cannot use module in FiveM NodeJS
exports("config", () => config);
