// Common
const dbMgr = require('@src/database/dbMgr');
const querys = require('@src/querys');
const errors = require('@src/errors');

// Model
const StoreModel = require('@src/models/storeModel');

// Utils
const Type = require('@src/utils/type');
const utils = require('@src/utils/utils');

/**
 *
 * @param {String} id Store ID
 * @returns {Promise<StoreModel>}
 */
exports.getStore = async function (id) {
    const store = await querySelect(id);
    if (store == null) {
        throw utils.errorHandling(errors.invalidStoreId);
    }
    return store;
};

/**
 *
 * @param {String} name Store name
 * @returns {Promise<StoreModel>}
 */
exports.addStore = async function (name) {
    let querys = [];
    let cmds = [];

    const store = new StoreModel();
    store.id = await genID();
    store.name = name;
    store.custom = {};

    querys.push(queryInsert(store));
    cmds.push(['hset', Type.StoreCacheKey, store.id, JSON.stringify(store)]);

    await dbMgr.set(dbMgr.mysqlConn.commerce, querys);
    await dbMgr.redis.commerce.multiCmd(cmds);

    return store;
};

/**
 *
 * @param {String} id Store ID
 * @param {String} name Store name
 * @param {Object} custom Store custom field
 * @returns {Promise<StoreModel>}
 */
exports.updateStore = async function (id, name, custom) {
    let querys = [];
    let cmds = [];

    let store = await querySelect(id);
    if (store == null) {
        throw utils.errorHandling(errors.invalidStoreId);
    }
    store.name = name;
    store.custom = custom;

    querys.push(queryUpdate(store));
    cmds.push(['hset', Type.StoreCacheKey, store.id, JSON.stringify(store)]);

    await dbMgr.set(dbMgr.mysqlConn.commerce, querys);
    await dbMgr.redis.commerce.multiCmd(cmds);

    return store;
};

/**
 *
 * @returns {Promise<Number>} Store ID
 */
async function genID() {
    return (await dbMgr.redis.gen.client.incrby('gen:store', 1)) + '';
}

/**
 *
 * @param {String} id Store Id
 * @returns {Promise<StoreModel>}
 */
async function querySelect(id) {
    let result = await dbMgr.redis.commerce.hget(Type.StoreCacheKey, id);
    if (result != null) {
        result = JSON.parse(result);
    } else {
        result = await dbMgr.mysql.commerce.makeAndQuery(querys.commerce.selectStore, id);
    }
    return result;
}

/**
 *
 * @param {StoreModel} store Store data
 * @returns {String} Query String
 */
function queryInsert(store) {
    // INSERT INTO tb_commerce_store (id, name, custom) VALUES (?, ?, ?)
    const query = dbMgr.mysql.commerce.makeQuery(querys.commerce.insertStore, store.id, store.name, JSON.stringify(store.custom));
    return query;
}

/**
 *
 * @param {StoreModel} store Store data
 * @returns {String} Query String
 */
function queryUpdate(store) {
    // UPDATE tb_commerce_store SET name = ?, custom = ? WHERE id = ?
    const query = dbMgr.mysql.commerce.makeQuery(querys.commerce.updateStore, store.name, JSON.stringify(store.custom), store.id);
    return query;
}
