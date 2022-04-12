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
 * @param {Object} custom Store custom field
 * @returns {Promise<StoreModel>}
 */
exports.addStore = async function (name, custom) {
    const store = new StoreModel();
    store.id = await genID();
    store.name = name;
    store.custom = custom;

    await dbMgr.set(dbMgr.mysqlConn.commerce, [queryInsert(store)]);
    await dbMgr.redis.commerce.multiCmd([cmdHset(store)]);

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
    let store = await querySelect(id);
    if (store == null) {
        throw utils.errorHandling(errors.invalidStoreId);
    }

    store.name = name;
    store.custom = custom;

    await dbMgr.set(dbMgr.mysqlConn.commerce, [queryUpdate(store)]);
    await dbMgr.redis.commerce.multiCmd([cmdHset(store)]);

    return store;
};

/**
 *
 * @param {Object} storeCustom Store Custom field { ${modelName}: Array<String>, ... }
 *                             ex) { CUSTOMER: ['전화번호', '성별'], PRODUCT: ['도서 발행일', '유통기한'], ... }
 * @param {typeof Type.Models} modelName Model name (Cutomer, Product, Order, ...)
 * @param {Array<Object>} modelCustom Model custom field (Cutomer, Product, Order, ...) [{ key, value }, ...]
 * @returns {boolean}
 */
exports.checkCustom = function (storeCustom, modelName, modelCustom) {
    if (storeCustom[modelName] == null && modelCustom.length == 0) {
        return true;
    } else if (storeCustom[modelName] != null) {
        let isValid = true;
        const modelCustomKeys = modelCustom.map((x) => x.key);
        for (let i in storeCustom[modelName]) {
            if (modelCustomKeys.includes(storeCustom[modelName][i]) == false) {
                return false;
            }
        }
        for (let i in modelCustom) {
            if (storeCustom[modelName].includes(modelCustom[i]) == false) {
                return false;
            }
        }
        if (isValid == true) {
            return true;
        }
    }

    return false;
};

/**
 *
 * @returns {Promise<String>} Store ID
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
    let result = await dbMgr.redis.commerce.client.hget(Type.StoreCacheKey, id);
    if (result != null) {
        result = JSON.parse(result);
    } else {
        result = await dbMgr.mysql.commerce.selectOne(querys.commerce.selectStore, id);
        await dbMgr.redis.commerce.multiCmd([cmdHset(result)]);
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

/**
 *
 * @param {StoreModel} store store data
 * @returns {String} Redis Command String
 */
function cmdHset(store) {
    return ['hset', Type.StoreCacheKey, store.id, JSON.stringify(store)];
}
