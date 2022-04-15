// Common
const config = require('@root/config');
const errors = require('@src/errors');

// Utils
const utils = require('@src/utils/utils');
const logger = require('@src/utils/logger');

// DB
const MySQL = require('@src/database/mysql');
const Redis = require('@src/database/redis');

const mysqlConn = {
    commerce: 'commerce',
};

class dbMgr {
    constructor() {
        this.mysql = {
            commerce: /** @type {MySQL} */ (null),
        };

        this.redis = {
            sessionStore: /** @type {Redis} */ (null),
            commerce: /** @type {Redis} */ (null),
            gen: /** @type {Redis} */ (null),
        };
    }

    get mysqlConn() { return mysqlConn; } // prettier-ignore

    async init() {
        for (let dbName in this.mysql) {
            if (config.mysql[dbName] == null) {
                throw utils.errorHandling(errors.undefinedConfig);
            }

            let initMySql = new MySQL();
            await initMySql.createPool(config.mysql[dbName]);

            this.mysql[dbName] = initMySql;
        }

        for (let dbName in this.redis) {
            if (config.redis[dbName] == null) {
                throw utils.errorHandling(errors.undefinedConfig);
            }

            let initRedis = new Redis();
            await initRedis.createClient(config.redis[dbName]);

            this.redis[dbName] = initRedis;
            this.redis[dbName].client.on('error', (err) => {
                logger.error('redis ' + dbName + ' error: ' + err);
            });
        }
    }

    /**
     *
     * @param {typeof mysqlConn} dbConn
     * @param {Array<String>} querys
     */
    async set(dbConn, querys) {
        if (querys.length > 0) {
            const mysqlObj = /** @type {MySQL} */ (this.mysql[dbConn]);
            const mysqlQuerys = mysqlObj.makeMultipleQuery(querys);
            const mysqlConn = await mysqlObj.beginTransaction();

            try {
                await mysqlObj.query(mysqlConn, mysqlQuerys);
                await mysqlObj.commit(mysqlConn);
            } catch (err) {
                await mysqlObj.rollback(mysqlConn);
                throw err;
            }
        }
    }
}

module.exports = new dbMgr();
