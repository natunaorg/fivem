const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const prettier = require("prettier");

dotenv.config({
    path: path.join(process.cwd(), ".env"),
});

const pkg = require("../../package.json");
const mysql = require("./mysql");

let types = "";

switch (process.env.DATABASE_DRIVER) {
    case "mysql":
        types = mysql.createSchema(process);
        break;

    default:
        throw new Error(`Unsupported database driver: ${process.env.DATABASE_DRIVER}`);
}

const result = `
    // This file is autogenerated, you should not edit it.
    // Run \`yarn db:create-schema\` in the project root to regenerate this file.

    export type DatabaseDriver = "${process.env.DATABASE_DRIVER}";
    export type DatabaseSchema = {${types}};
`;

const formatted = prettier.format(result, {
    ...pkg.prettier,
    parser: "typescript",
});

const schemaPath = path.join(process.cwd(), "src", "server", "database", "schema.ts");

fs.writeFileSync(schemaPath, formatted);
