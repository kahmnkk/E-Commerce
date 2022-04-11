// Common
const dbMgr = require('@src/database/dbMgr');
const querys = require('@src/querys');
const errors = require('@src/errors');

// Model
const ProductModel = require('@src/models/productModel');

// Utils
const Type = require('@src/utils/type');
const utils = require('@src/utils/utils');

/**
 *
 * @param {String} storeId Store ID
 * @returns {Promise<Array<ProductModel>>}
 */
exports.getProductByStore = async function (storeId) {
    const products = await querySelectByStore(storeId);
    return products;
};

/**
 *
 * @param {String} store Store ID
 * @param {String} name Product name
 * @param {Number} price Product price
 * @param {Array<String>} categories Product categories
 * @param {Object} custom Product custom field
 */
exports.addProduct = async function (store, name, price, categories, custom) {
    let querys = [];
    let cmds = [];

    const product = new ProductModel();
    product.id = await genID();
    product.store = store;
    product.name = name;
    product.price = price;
    product.categories = categories;
    product.custom = custom;

    querys.push(queryInsert(product));
    cmds.push(cmdHset(product));

    await dbMgr.set(dbMgr.mysqlConn.commerce, querys);
    await dbMgr.redis.commerce.multiCmd(cmds);
};

/**
 *
 * @param {String} id Product ID
 * @param {String} store Store ID
 * @param {String} name Product name
 * @param {Number} price Product price
 * @param {Array<String>} categories Product categories
 * @param {Object} custom Product custom field
 */
exports.updateProduct = async function (id, store, name, price, categories, custom) {
    let querys = [];
    let cmds = [];

    let product = await querySelect(id, store);
    if (product == null) {
        throw utils.errorHandling(errors.invalidProductId);
    }
    product.name = name;
    product.price = price;
    product.categories = categories;
    product.custom = custom;

    querys.push(queryUpdate(product));
    cmds.push(cmdHset(product));

    await dbMgr.set(dbMgr.mysqlConn.commerce, querys);
    await dbMgr.redis.commerce.multiCmd(cmds);
};

/**
 *
 * @returns {Promise<String>} Product ID
 */
async function genID() {
    return (await dbMgr.redis.gen.client.incrby('gen:product', 1)) + '';
}

/**
 *
 * @param {String} storeId Store Id
 * @returns {String} KEY_PRODUCT:${storeID}
 */
function cacheKey(storeId) {
    return Type.ProductCacheKey + ':' + storeId;
}

/**
 *
 * @param {String} id Product Id
 * @param {String} storeId Store Id
 * @returns {Promise<ProductModel>}
 */
async function querySelect(id, storeId = null) {
    let result = null;
    if (storeId != null) {
        result = await dbMgr.redis.commerce.client.hget(cacheKey(storeId), id);
    }
    if (result != null) {
        result = JSON.parse(result);
    } else {
        result = await dbMgr.mysql.commerce.selectOne(querys.commerce.selectProduct, id);
    }
    return result;
}

/**
 *
 * @param {String} storeId Store Id
 * @returns {Promise<Array<ProductModel>>}
 */
async function querySelectByStore(storeId) {
    let result = await dbMgr.redis.commerce.client.hgetall(cacheKey(storeId));
    if (result != null) {
        let arr = [];
        for (let i in result) {
            arr.push(JSON.parse(result[i]));
        }
        result = arr;
    } else {
        result = await dbMgr.mysql.commerce.makeAndQuery(querys.commerce.selectProductByStore, storeId);
        let cmds = [];
        for (let i in result) {
            cmds.push(cmdHset(result[i]));
        }
        await dbMgr.redis.commerce.multiCmd(cmds);
    }
    return result;
}

/**
 *
 * @param {ProductModel} product Product data
 * @returns {String} Query String
 */
function queryInsert(product) {
    // INSERT INTO tb_commerce_product (id, store, name, price, categories, custom) VALUES (?, ?, ?, ?, ?, ?)
    const query = dbMgr.mysql.commerce.makeQuery(
        querys.commerce.insertProduct,
        product.id,
        product.store,
        product.name,
        product.price,
        JSON.stringify(product.categories),
        JSON.stringify(product.custom),
    );
    return query;
}

/**
 *
 * @param {ProductModel} product Product data
 * @returns {String} Query String
 */
function queryUpdate(product) {
    // UPDATE tb_commerce_product SET name = ?, price = ?, categories = ?, custom = ? WHERE id = ?
    const query = dbMgr.mysql.commerce.makeQuery(querys.commerce.updateProduct, product.name, product.price, JSON.stringify(product.categories), JSON.stringify(product.custom), product.id);
    return query;
}

/**
 *
 * @param {ProductModel} product Product data
 * @returns {String} Redis Command String
 */
function cmdHset(product) {
    return ['hset', cacheKey(product.store), product.id, JSON.stringify(product)];
}
