class DatabaseWrapper {
    table: any;
    connection: any;

    constructor(connection, table) {
        this.table = table;
        this.connection = connection;
    }

    write = (obj) => {
        if (this.utils.validateQueryObject(obj, ["data"])) {
            const keys = Object.keys(obj.data)
                .map((x) => this.parser.key(x))
                .join(",");
            const values = Object.values(obj.data).join(",");

            const query = `INSERT INTO \`users\`(${keys}) VALUES (${values})`;

            return this.utils.executeQuery(query);
        }
    };

    find = (obj) => {
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

    findFirst = async (obj) => {
        if (this.utils.validateQueryObject(obj, ["where"])) {
            const result: any = await this.find(obj);
            return result && result.length > 0 ? result[0] : false;
        }
    };

    update = (obj) => {
        if (this.utils.validateQueryObject(obj, ["data", "where"])) {
            const updateOptions = this.parser.keyVal(obj.data);
            const whereOptions = this.parser.keyVal(obj.where);

            const query = `UPDATE \`${this.table}\` SET ${updateOptions} WHERE ${whereOptions}`;

            return this.utils.executeQuery(query);
        }
    };

    delete = (obj) => {
        if (this.utils.validateQueryObject(obj, ["where"])) {
            const whereOptions = this.parser.keyVal(obj.where);

            const query = `DELETE FROM \`${this.table}\` WHERE ${whereOptions}`;

            return this.utils.executeQuery(query);
        }
    };

    parser = {
        key: (key) => `\`${key}\``,
        keyVal: (dataObj) =>
            Object.keys(dataObj).map((x) => {
                const value = typeof dataObj[x] == "string" ? `"${dataObj[x].replace(/"/g, '\\"')}"` : dataObj[x];
                return `${this.parser.key(x)}=${value}`;
            }),
    };

    utils = {
        validateQueryObject: (obj, requiredKey = []) => {
            if (typeof obj !== "object" || Array.isArray(obj)) {
                throw new Error("Database Query Object MUST be in object (JSON) type!");
            }

            for (const key of requiredKey) {
                this.utils.validateQueryObjectData(key, obj[key]);
            }

            return true;
        },
        validateQueryObjectData: (key, data) => {
            if (typeof data !== "undefined" && (typeof data !== "object" || Array.isArray(data))) {
                throw new Error("Data of query object: `" + key + "` MUST be in object (JSON) type!");
            }

            return true;
        },
        executeQuery: async (query) => {
            return new Promise((resolve, reject) => {
                this.connection.execute(query, (err, result, fields) => {
                    if (err) reject(err);
                    return resolve(result);
                });
            });
        },
    };
}

export default DatabaseWrapper;
