// Module
const crypto = require('crypto');
require('dotenv').config();

// ENV
const salt = process.env.PASSWORD_SALT;

// Common
const dbMgr = require('@src/database/dbMgr');
const querys = require('@src/querys');
const errors = require('@src/errors');

// Model
const CustomerModel = require('@src/models/customerModel');

// Utils
const utils = require('@src/utils/utils');

/**
 *
 * @param {String} store Store Id
 * @param {String} email Customer email
 * @param {String} password Customer password
 * @returns {Promise<CustomerModel>}
 */
exports.signIn = async function (store, email, password) {
    const customer = await querySelect(store, email);
    if (customer == null) {
        throw utils.errorHandling(errors.invalidCustomerEmail);
    }

    const cryptoPassword = await encrypt(password);
    if (cryptoPassword != customer.password) {
        throw utils.errorHandling(errors.customerPasswordMismatch);
    }

    return customer;
};

/**
 *
 * @param {String} storeId Store Id
 * @param {String} name Customer name
 * @param {String} email Customer email
 * @param {String} password Customer password
 * @param {String} custom Customer custom field
 * @returns {Promise<CustomerModel>}
 */
exports.signUp = async function (storeId, name, email, password, custom) {
    const checkEmail = await querySelect(storeId, email);
    if (checkEmail != null) {
        throw utils.errorHandling(errors.duplicatedEmail);
    }

    const customer = new CustomerModel();
    customer.id = await genID();
    customer.store = storeId;
    customer.name = name;
    customer.email = email;
    customer.password = await encrypt(password);
    customer.custom = custom;

    await dbMgr.set(dbMgr.mysqlConn.commerce, [queryInsert(customer)]);
};

/**
 *
 * @param {String} storeId Store Id
 * @param {String} email Customer email
 * @returns {Promise<CustomerModel>}
 */
exports.checkDuplicateEmail = async function (storeId, email) {
    const customer = await querySelect(storeId, email);
    if (customer == null) {
        return false;
    }
    return true;
};

/**
 *
 * @returns {Promise<String>} Customer ID
 */
async function genID() {
    return (await dbMgr.redis.gen.client.incrby('gen:customer', 1)) + '';
}

/**
 *
 * @param {String} storeId Store Id
 * @param {String} email Customer email
 * @returns {Promise<CustomerModel>}
 */
async function querySelect(storeId, email) {
    const result = await dbMgr.mysql.commerce.selectOne(querys.commerce.selectCustomer, storeId, email);
    return result;
}

/**
 *
 * @param {CustomerModel} customer Customer data
 * @returns {String} Query String
 */
function queryInsert(customer) {
    // INSERT INTO tb_commerce_customer (id, store, name, email, password, custom) VALUES (?, ?, ?, ?, ?, ?)
    const query = dbMgr.mysql.commerce.makeQuery(querys.commerce.insertCustomer, customer.id, customer.store, customer.name, customer.email, customer.password, JSON.stringify(customer.custom));
    return query;
}

async function encrypt(password) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
            if (err) reject(err);
            else resolve(derivedKey.toString('hex'));
        });
    });
}
