"use strict";
import "@citizenfx/server";

import type Logger from "@ptkdev/logger";
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

export default function Database(logger: Logger): DatabaseDriverUsed {
    if (process.env.DATABASE_DRIVER === "mysql") {
        return MySQL(logger);
    }

    return null;
}
