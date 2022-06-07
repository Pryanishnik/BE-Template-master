import { Sequelize } from 'sequelize-typescript'
import { DB_TYPES } from './utils/db_types';
import * as models from "./models"
export class ConnectionFactory{
    private static connection;

    static getConnection(db_type: DB_TYPES){
        if(ConnectionFactory.connection){
            return ConnectionFactory.connection
        };
        switch(db_type){
            case DB_TYPES.SQLITE: {
                ConnectionFactory.connection = new Sequelize({
                    database: 'database',
                    dialect: 'sqlite',
                    username: 'root',
                    password: '',
                    storage: 'database.sqlite3',
                    models: Object.values(models)  // or [Player, Team],
                  })
                  return ConnectionFactory.connection;
            };
            default: throw new Error("Unknown DB type");
        }
    }
}