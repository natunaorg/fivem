"use strict";
import "@citizenfx/server";

import type mysql from "mysql2";
import type { DatabaseSchema } from "@server/database/schema";

type Query<K extends keyof DatabaseSchema> = Partial<DatabaseSchema[K]>;

/**
 * @description
 * Executing database query in promise
 *
 * @example
 * ```ts
 * executeQuery("SELECT * FROM `users`")
 * ```
 */
export const executeQuery = async (connection: mysql.Pool, query: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        connection.execute(query, (err: string, result: any) => {
            if (err) {
                reject(err);
            }

            resolve(result);
        });
    });
};

export default class MySQLHandler<K extends keyof DatabaseSchema> {
    constructor(
        private connection: mysql.Pool, //
        private table: K
    ) {}

    /**
     * @description
     * Write a data into database table
     *
     * @example
     * ```ts
     * db.users.write({
     *      data: {
     *          name: "Don Chad"
     *      }
     * })
     * ```
     */
    create = (obj: { data: Query<K> }) => {
        if (this.utils.validateQueryObject(obj, ["data"])) {
            const keys = Object.keys(obj.data)
                .map((x) => this.parser.key(x))
                .join(",");
            const values = Object.values(obj.data)
                .map((x) => (typeof x === "string" ? `'${x}'` : x))
                .join(",");

            const query = `INSERT INTO \`${this.table}\`(${keys}) VALUES (${values})`;

            return this.utils.executeQuery(query);
        }
    };

    /**
     * @description
     * Find a data from database table
     *
     * @example
     * ```ts
     * db.users.find({
     *      where: {
     *          name: "Don Chad"
     *      }
     * })
     * ```
     */
    find = (obj: { where: Query<K> }) => {
        if (this.utils.validateQueryObject(obj, ["where"])) {
            let query;

            if (obj.where) {
                const whereOptions = this.parser.keyVal(obj.where);
                query = `SELECT * FROM \`${this.table}\` WHERE ${whereOptions}`;
            } else {
                query = `SELECT * FROM \`${this.table}\``;
            }

            return this.utils.executeQuery(query);
        }
    };

    /**
     * @description
     * Find first data from database table
     *
     * @example
     * ```ts
     * db.users.findFirst({
     *      where: {
     *          name: "Don Chad"
     *      }
     * })
     * ```
     */
    findFirst = async (obj: { where: Query<K> }) => {
        if (this.utils.validateQueryObject(obj, ["where"])) {
            const result: any = await this.find(obj);
            return result && result.length > 0 ? result[0] : false;
        }
    };

    /**
     * @description
     * Update a data from database table
     *
     * @example
     * ```ts
     * // Normal Version.
     * db.users.update({
     *      where: {
     *          name: "Don Chad"
     *      },
     *      data: {
     *          name: "John Doe"
     *      }
     * })
     *
     * // Function Delivered Version.
     * db.users.update({
     *      where: {
     *          name: "Don Chad"
     *      },
     *      data: (data) => {
     *          // MUST RETURNS as an OBJECT
     *          return {
     *              count: data.count += 1
     *          }
     *      }
     * })
     * ```
     */
    update = (obj: { data: Query<K>; where: Query<K> }) => {
        if (this.utils.validateQueryObject(obj, ["data", "where"])) {
            const whereOptions = this.parser.keyVal(obj.where);
            let updateOptions;

            if (typeof obj.data == "function") {
                const data: any = this.find({ where: obj.where });
                const newInputData = obj.data[data];

                if (typeof newInputData !== "object" || Array.isArray(newInputData)) {
                    throw new Error("Returned Data Must be an Object!");
                }

                updateOptions = this.parser.keyVal(newInputData);
            } else {
                updateOptions = this.parser.keyVal(obj.data);
            }

            const query = `UPDATE \`${this.table}\` SET ${updateOptions} WHERE ${whereOptions}`;

            return this.utils.executeQuery(query);
        }
    };

    /**
     * @description
     * Delete a data from database table
     *
     * @example
     * ```ts
     * db.users.delete({
     *      where: {
     *          name: "Don Chad"
     *      }
     * })
     * ```
     */
    delete = (obj: { where: Query<K> }) => {
        if (this.utils.validateQueryObject(obj, ["where"])) {
            const whereOptions = this.parser.keyVal(obj.where);

            const query = `DELETE FROM \`${this.table}\` WHERE ${whereOptions}`;

            return this.utils.executeQuery(query);
        }
    };

    parser = {
        /**
         * @description
         * Put a templated string around the key for SQL to identified it as a structure name, not a value
         */
        key: (key: string) => `\`${key}\``,

        /**
         * @description
         * Parsing object keys and it values to SQL key and value format and mapping it into a string format
         */
        keyVal: (dataObj: Record<string, any>) =>
            Object.keys(dataObj).map((x) => {
                const value = typeof dataObj[x] == "string" ? `"${dataObj[x].replace(/"/g, '\\"')}"` : dataObj[x];
                return `${this.parser.key(x)}=${value}`;
            }),
    };

    utils = {
        /**
         * @description
         * Validating query object before starting to execute it
         */
        validateQueryObject: (obj: any, requiredKey: Array<string> = []) => {
            if (typeof obj !== "object" || Array.isArray(obj)) {
                throw new Error("Database Query Object MUST be in object (JSON) type!");
            }

            for (const key of requiredKey) {
                this.utils.validateQueryObjectData(key, obj[key]);
            }

            return true;
        },

        /**
         * @description
         * Validating object data whether if it's object or not
         */
        validateQueryObjectData: (key: string, data: any) => {
            if (typeof data !== "undefined" && (typeof data !== "object" || Array.isArray(data))) {
                throw new Error("Data of query object: `" + key + "` MUST be in object (JSON) type!");
            }

            return true;
        },

        /**
         * @description
         * Executing database query in promise
         *
         * @example
         * ```ts
         * executeQuery("SELECT * FROM `users`")
         * ```
         */
        executeQuery: async (query: string) => {
            return await executeQuery(this.connection, query);
        },
    };
}
