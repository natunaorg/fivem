const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

const mysql = require("mysql2");

dotenv.config({
    path: path.join(process.cwd(), ".env"),
});

switch (process.env.DATABASE_DRIVER) {
    case "mysql":
    default:
        const connection = mysql.createPool({
            isServer: false,
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            database: process.env.DATABASE_NAME,
            port: Number(process.env.DATABASE_PORT),
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        const migrationFilePath = path.join(__dirname, "mysql", "migration.sql");
        const sql = fs
            .readFileSync(migrationFilePath, "utf8")
            .toString()
            .replace(/(\r\n|\n|\r)/gm, " ") // remove newlines
            .replace(/\s+/g, " ") // excess white space
            .split(";") // split into all statements
            .map(Function.prototype.call, String.prototype.trim)
            .filter(function (el) {
                return el.length != 0;
            }); // remove any empty ones

        (async () => {
            for (const command of sql) {
                console.log(`Executing: ${command}`);

                const result = await new Promise((res, rej) => {
                    connection.query(command, (err, results, fields) => {
                        if (err) {
                            rej(err);
                        }

                        res(results);
                    });
                });

                console.log(result);
            }

            console.log("Database migration completed.");
            process.exit(0);
        })();
}
