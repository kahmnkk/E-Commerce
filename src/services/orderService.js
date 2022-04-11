// Common
const dbMgr = require('@src/database/dbMgr');
const querys = require('@src/querys');
const errors = require('@src/errors');

// Model
const OrderModel = require('@src/models/orderModel');
const ProductModel = require('@src/models/productModel');

// Utils
const Type = require('@src/utils/type');
const utils = require('@src/utils/utils');

/**
 *
 * @param {String} customerId Customer ID
 * @returns {Promise<Array<OrderModel>>}
 */
exports.getOrderByCustomer = async function (customerId) {
    const orders = await querySelectByCustomer(customerId);
    return orders;
};

/**
 *
 * @param {String} storeId Store ID
 * @param {String} customerId Customer ID
 * @param {Array<ProductModel>} products Product Array
 * @param {Object} custom Product custom field
 */
exports.purchase = async function (storeId, customerId, products, custom) {
    const order = new OrderModel();
    order.id = await genID();
    order.store = storeId;
    order.status = Type.OrderStatus.COMPLETED;
    order.customer = customerId;
    order.products = products.map((x) => x.id);
    order.custom = custom;

    await dbMgr.set(dbMgr.mysqlConn.commerce, [queryInsert(order)]);
};

/**
 *
 * @param {String} orderId Order ID
 * @param {String} customerId Customer ID
 */
exports.refund = async function (orderId, customerId) {
    let order = await querySelect(orderId);
    if (order == null || order.customer != customerId) {
        throw utils.errorHandling(errors.invalidOrderId);
    }
    if (order.status == Type.OrderStatus.REFUNDED) {
        throw utils.errorHandling(errors.orderAlreadyRefunded);
    }

    order.status = Type.OrderStatus.REFUNDED;

    await dbMgr.set(dbMgr.mysqlConn.commerce, [queryUpdateStatus(order)]);
};

/**
 *
 * @returns {Promise<String>} Order ID
 */
async function genID() {
    return (await dbMgr.redis.gen.client.incrby('gen:order', 1)) + '';
}

/**
 *
 * @param {String} id Order Id
 * @returns {Promise<OrderModel>}
 */
async function querySelect(id) {
    const result = await dbMgr.mysql.commerce.selectOne(querys.commerce.selectOrder, id);
    return result;
}

/**
 *
 * @param {String} customerId Customer Id
 * @returns {Promise<Array<OrderModel>>}
 */
async function querySelectByCustomer(customerId) {
    const result = await dbMgr.mysql.commerce.selectOne(querys.commerce.selectOrderByCustomer, customerId);
    return result;
}

/**
 *
 * @param {OrderModel} order Order data
 * @returns {String} Query String
 */
function queryInsert(order) {
    // INSERT INTO tb_commerce_order (id, store, status, customer, products, price, custom) VALUES (?, ?, ?, ?, ?, ?, ?)
    const query = dbMgr.mysql.commerce.makeQuery(
        querys.commerce.insertProduct,
        order.id,
        order.store,
        order.status,
        order.customer,
        JSON.stringify(order.products),
        order.price,
        JSON.stringify(order.custom),
    );
    return query;
}

/**
 *
 * @param {OrderModel} order Order data
 * @returns {String} Query String
 */
function queryUpdateStatus(order) {
    // UPDATE tb_commerce_order SET status = ? WHERE id = ?
    const query = dbMgr.mysql.commerce.makeQuery(querys.commerce.updateOrderStatus, order.status, order.id);
    return query;
}
