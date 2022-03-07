"use strict";
import "@citizenfx/server";

import type Logger from "@ptkdev/logger";
import type { Config } from "@server";
import type { MySQLDatabase } from "@server/database/mysql";
import type { DatabaseDriver } from "@server/database/schema";

import MySQL from "@server/database/mysql";

// prettier-ignore
type DatabaseDriverUsed = 
    DatabaseDriver extends "mysql"
        ? MySQLDatabase
    : DatabaseDriver extends "sqlite"
        ? never
    : DatabaseDriver extends "mongodb"
        ? never
    : DatabaseDriver extends "postgresql"
        ? never
    : never;

export default function Database(config: Config, logger: Logger): DatabaseDriverUsed {
    switch (process.env.DATABASE_DRIVER) {
        case "mysql":
        default:
            return MySQL(config, logger) as any;
    }
}
