"use strict";
import "@citizenfx/server";

import type Logger from "@ptkdev/logger";
import type { DatabaseDriver, DatabaseSchema } from "@server/database/schema";

import mysql from "mysql2";
import MySQL, { executeQuery as MySQLExecuteQuery } from "@server/database/mysql";

// prettier-ignore
export type DatabaseDriverUsed<T extends keyof DatabaseSchema> = 
    DatabaseDriver extends "mysql"
        ? MySQL<T>
    : DatabaseDriver extends "sqlite"
        ? never
    : DatabaseDriver extends "mongodb"
        ? never
    : DatabaseDriver extends "postgresql"
        ? never
    : never;

export default function Database(logger: Logger) {
    switch (process.env.DATABASE_DRIVER) {
        case "mysql":
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

            MySQLExecuteQuery(connection, `CREATE DATABASE IF NOT EXISTS \`${process.env.DATABASE_NAME}\``)
                .then(() => {
                    logger.info("Successfully established database connection");
                })
                .catch((err) => {
                    logger.error("Failed to establish database connection");
                    throw new Error(err);
                });

            return (tableName: keyof DatabaseSchema) => new MySQL(connection, tableName);

        default:
            return null;
    }
}
