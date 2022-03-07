"use strict";
import "@citizenfx/server";

import type { Config } from "@server";
import type Logger from "@ptkdev/logger";

import mysql from "mysql2";

import MySQLHandler, { executeQuery } from "@server/database/mysql/handler";

// In the future, we might expand this rather than just using MySQL
export type MySQLDatabase = {
    [key in keyof DatabaseSchema]?: MySQLHandler<key>;
};

export default function MySQL(config: Config, logger: Logger): MySQLDatabase {
    const tables: Record<string, MySQLHandler<any>> = {};

    const connection = mysql.createConnection({
        isServer: false,
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        database: process.env.DATABASE_NAME,
        port: Number(process.env.DATABASE_PORT),
    });

    connection.connect(function (err) {
        if (err) {
            logger.error(`Could not connect to database: ${err}`);
        } else {
            logger.info("Connected to database");

            executeQuery(connection, `CREATE DATABASE IF NOT EXISTS \`${process.env.DATABASE_NAME}\``).catch((err) => {
                logger.error(err);
                throw new Error(err);
            });

            for (const key in config["#database"].schema) {
                const tableName = key as keyof DatabaseSchema;
                tables[tableName] = new MySQLHandler(connection, tableName);
            }
        }
    });

    return tables;
}
