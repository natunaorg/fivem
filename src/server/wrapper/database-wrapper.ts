import mysql from "mysql2";

class Wrapper {
    table: string;
    connection: mysql.Connection;

    constructor(connection: mysql.Connection, table: string) {
        this.table = table;
        this.connection = connection;
    }

    /**
     * Write a data into database table
     * @author Rafly Maulana
     *
     * @example
     * db('users').write({
     *      data: {
     *          name: "Don Chad"
     *      }
     * })
     */
    write = (obj: { data: { [key: string]: any } }) => {
        if (this.utils.validateQueryObject(obj, ["data"])) {
            const keys = Object.keys(obj.data)
                .map((x) => this.parser.key(x))
                .join(",");
            const values = Object.values(obj.data).join(",");

            const query = `INSERT INTO \`${this.table}\`(${keys}) VALUES (${values})`;

            return this.utils.executeQuery(query);
        }
    };

    /**
     * Find a data from database table
     * @author Rafly Maulana
     *
     * @example
     * db('users').find({
     *      where: {
     *          name: "Don Chad"
     *      }
     * })
     */
    find = (obj: { where: { [key: string]: any } }) => {
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
     * Find first data from database table
     * @author Rafly Maulana
     *
     * @example
     * db('users').findFirst({
     *      where: {
     *          name: "Don Chad"
     *      }
     * })
     */
    findFirst = async (obj: { where: { [key: string]: any } }) => {
        if (this.utils.validateQueryObject(obj, ["where"])) {
            const result: any = await this.find(obj);
            return result && result.length > 0 ? result[0] : false;
        }
    };

    /**
     * Update a data from database table
     * @author Rafly Maulana
     *
     * @example
     * //* Normal Object Version. *\\
     * db('users').update({
     *      where: {
     *          name: "Don Chad"
     *      },
     *      data: {
     *          // This could be a function too! See other example below.
     *          name: "John Doe"
     *      }
     * })
     *
     * @example
     * //* Function Delivered Version. *\\
     * db('users').update({
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
     */
    update = (obj: { data: { [key: string]: any }; where: { [key: string]: any } }) => {
        if (this.utils.validateQueryObject(obj, ["data", "where"])) {
            const whereOptions = this.parser.keyVal(obj.where);
            let updateOptions;

            if (typeof obj.data == "function") {
                const data: any = this.find({ where: obj.where });
                const newInputData = obj.data(data);

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
     * Delete a data from database table
     * @author Rafly Maulana
     *
     * @example
     * db('users').delete({
     *      where: {
     *          name: "Don Chad"
     *      }
     * })
     */
    delete = (obj: { where: { [key: string]: any } }) => {
        if (this.utils.validateQueryObject(obj, ["where"])) {
            const whereOptions = this.parser.keyVal(obj.where);

            const query = `DELETE FROM \`${this.table}\` WHERE ${whereOptions}`;

            return this.utils.executeQuery(query);
        }
    };

    parser = {
        /**
         * Put a templated string around the key for SQL to identified it as a structure name, not a value
         * @author Rafly Maulana
         */
        key: (key: string) => `\`${key}\``,

        /**
         * Parsing object keys and it values to SQL key and value format and mapping it into a string format
         * @author Rafly Maulana
         */
        keyVal: (dataObj: { [key: string]: any }) =>
            Object.keys(dataObj).map((x) => {
                const value = typeof dataObj[x] == "string" ? `"${dataObj[x].replace(/"/g, '\\"')}"` : dataObj[x];
                return `${this.parser.key(x)}=${value}`;
            }),
    };

    utils = {
        /**
         * Validating query object before starting to execute it
         * @author Rafly Maulana
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
         * Validating object data whether if it's object or not
         * @author Rafly Maulana
         */
        validateQueryObjectData: (key: string, data: any) => {
            if (typeof data !== "undefined" && (typeof data !== "object" || Array.isArray(data))) {
                throw new Error("Data of query object: `" + key + "` MUST be in object (JSON) type!");
            }

            return true;
        },

        /**
         * Executing database query in promise
         * @author Rafly Maulana
         *
         * @example
         * executeQuery("SELECT * FROM `users`")
         */
        executeQuery: async (query: string) => {
            return new Promise((resolve, reject) => {
                this.connection.execute(query, (err: string, result: any) => {
                    if (err) reject(err);
                    resolve(result);
                    this.connection.end();
                });
            });
        },
    };
}

export default Wrapper;
export { Wrapper };
