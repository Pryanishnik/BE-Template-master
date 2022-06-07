"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionFactory = void 0;
const tslib_1 = require("tslib");
const sequelize_typescript_1 = require("sequelize-typescript");
const db_types_1 = require("./utils/db_types");
const models = tslib_1.__importStar(require("./models"));
class ConnectionFactory {
    static getConnection(db_type) {
        if (ConnectionFactory.connection) {
            return ConnectionFactory.connection;
        }
        ;
        switch (db_type) {
            case db_types_1.DB_TYPES.SQLITE:
                {
                    ConnectionFactory.connection = new sequelize_typescript_1.Sequelize({
                        database: 'database',
                        dialect: 'sqlite',
                        username: 'root',
                        password: '',
                        storage: 'database.sqlite3',
                        models: Object.values(models) // or [Player, Team],
                    });
                    return ConnectionFactory.connection;
                }
                ;
            default: throw new Error("Unknown DB type");
        }
    }
}
exports.ConnectionFactory = ConnectionFactory;
//# sourceMappingURL=connection.js.map