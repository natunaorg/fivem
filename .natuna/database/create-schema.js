const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config({
    path: path.join(process.cwd(), ".env"),
});

const prettier = require("prettier");
const pkg = require("../../package.json");

const schemaPath = path.join(process.cwd(), "src", "server", "database", "schema.d.ts");
let types = "";

switch (process.env.DATABASE_DRIVER) {
    case "mysql":
    default:
        const typesMap = {};
        const migrationFilePath = path.join(__dirname, "mysql", "migration.sql");

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

        const x = {
            ...pkg,
            natuna: {
                ...pkg.natuna,
                ["__dbSchema__"]: typesMap,
            },
        };

        fs.writeFileSync(path.join(__dirname, "..", "..", "package.json"), prettier.format(JSON.stringify(x, null, 4), { ...pkg.prettier, parser: "json" }));

        for (const [tableName, rows] of Object.entries(typesMap)) {
            types += `${tableName}: {\n`;

            for (const [rowName, rowType] of Object.entries(rows)) {
                types += `${rowName}: ${rowType};`;
            }

            types += `};`;
        }
}

const result = `
// This file is autogenerated, you should not edit it.
// Run \`yarn db:schema:generate\` in the project root to regenerate this file.

declare type DatabaseDriver = "${process.env.DATABASE_DRIVER}";
declare type DatabaseSchema = {${types}};
`;

const formatted = prettier.format(result, {
    ...pkg.prettier,
    parser: "typescript",
});

fs.writeFileSync(schemaPath, formatted);
