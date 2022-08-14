const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
    path: path.join(process.cwd(), ".env"),
});

const mysql = require("./mysql");

switch (process.env.DATABASE_DRIVER) {
    case "mysql":
        mysql.migrate(process);
        break;

    default:
        throw new Error(`Unknown database driver: ${process.env.DATABASE_DRIVER}`);
}
