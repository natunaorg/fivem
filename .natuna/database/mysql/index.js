const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");

module.exports.migrate = async (process) => {
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

    const migrationFilePath = path.join(__dirname, "..", "mysql", "migration.sql");
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
};

module.exports.createSchema = () => {
    let types = "";
    const typesMap = {};

    const migrationFilePath = path.join(__dirname, "..", "mysql", "migration.sql");

    const sqlArray = fs
        .readFileSync(migrationFilePath, "utf8")
        .toString()
        .replace(/(\r\n|\n|\r)/gm, " ") // remove newlines
        .replace(/\s+/g, " ") // excess white space
        .split(";") // split into all statements
        .map(Function.prototype.call, String.prototype.trim)
        .filter(function (el) {
            return el.length != 0;
        }); // remove any empty ones

    sqlArray.map((sql) => {
        const match = sql.match(/^CREATE TABLE .*? `(.*?)`/);

        if (match) {
            const tableName = match[1];
            typesMap[tableName] = {};

            const rows = sql.match(/`([a-zA-Z_]+)`\s([a-zA-Z_]+)/g);
            if (rows) {
                rows.map((row) => {
                    let [name, type] = row.split(" ");

                    switch (type) {
                        case "int":
                        case "tinyint":
                        case "smallint":
                        case "mediumint":
                        case "bigint":
                        case "float":
                        case "double":
                        case "decimal":
                        case "bit":
                        case "bool":
                        case "boolean":
                            type = "number";
                            break;

                        case "varchar":
                        case "text":
                        case "longtext":
                        case "char":
                        case "tinytext":
                        case "mediumtext":
                        case "enum":
                        case "set":
                            type = "string";
                            break;
                    }

                    typesMap[tableName][name.replace(/`/g, "")] = type;
                });
            }
        }
    });

    for (const [tableName, rows] of Object.entries(typesMap)) {
        types += `${tableName}: {\n`;

        for (const [rowName, rowType] of Object.entries(rows)) {
            types += `${rowName}: ${rowType};`;
        }

        types += `};`;
    }

    return types;
};
