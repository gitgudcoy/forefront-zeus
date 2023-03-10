
const { Sequelize } = require('sequelize');
const session = require('express-session');
const SessionStore = require('express-session-sequelize')(session.Store);
const {
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USERNAME,
    DB_PASSWORD,
    DBSSLConnectionConfiguration
} = require('./connection');

const InitDBSequelize = () => {
    const DBConnectionString = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
        host: DB_HOST,
        port: DB_PORT,
        dialect: 'mysql',
        logging: console.log,
        omitNull: false,
        ssl: DBSSLConnectionConfiguration(),
        pool: {
            max: 20,
            min: 0,
            acquire: 60000,
            idle: 10000
        },
        retry: {
            match: [/Deadlock/i],
            max: 3, // Maximum rety 3 times
            backoffBase: 1000, // Initial backoff duration in ms. Default: 100,
            backoffExponent: 1.5, // Exponent to increase backoff each try. Default: 1.1
        },
    });

    DBConnectionString.authenticate().then(() => {
        console.log('Connection has been established successfully.');
    }).catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

    return DBConnectionString;
}
async function SequelizeRollback(trx, error) {
    console.log(error);
    console.log("There has been some error when commiting the transaction, rolling back...");
    await trx.rollback();
} 

// Init the database
const DBSequelize = InitDBSequelize();
// Init the session store with the successfully established db
const sequelizeSessionStore = new SessionStore({
    db: DBSequelize,
});


module.exports = {
    DBSequelize,
    sequelizeSessionStore,
    SequelizeRollback
}