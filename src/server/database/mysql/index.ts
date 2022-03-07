"use strict";
import "@citizenfx/server";

import type Logger from "@ptkdev/logger";
import type { DatabaseSchema } from "@server/database/schema";

import mysql from "mysql2";

import MySQLHandler, { executeQuery } from "@server/database/mysql/handler";
import { __mysqlTables } from "@server/database/schema";

// In the future, we might expand this rather than just using MySQL
export type MySQLDatabase = {
    [key in keyof DatabaseSchema]?: MySQLHandler<key>;
};

export default function MySQL(logger: Logger): MySQLDatabase {
    const tables: Record<string, MySQLHandler<any>> = {};
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

    executeQuery(connection, `CREATE DATABASE IF NOT EXISTS \`${process.env.DATABASE_NAME}\``)
        .then(() => {
            logger.info("Successfully established database connection");
        })
        .catch((err) => {
            logger.error("Failed to establish database connection");
            throw new Error(err);
        });

    if (!__mysqlTables) {
        throw new Error("No database schema found! Please run `yarn run db:setup`");
    }

    for (const key of __mysqlTables) {
        const tableName = key as keyof DatabaseSchema;
        tables[tableName] = new MySQLHandler(connection, tableName);
    }

    return tables;
}
