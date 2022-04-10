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
exports.getCustomer = async function (store, email, password) {
    const customer = await selectCustomer(store, email);
    if (customer == null) {
        throw utils.errorHandling(errors.invalidCustomerEmail);
    }

    let cryptoPassword = '';
    crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
        if (err) throw err;
        cryptoPassword = derivedKey.toString('hex');
    });

    if (cryptoPassword != customer.password) {
        throw utils.errorHandling(errors.customerPasswordMismatch);
    }

    return customer;
};

/**
 *
 * @param {String} store Store Id
 * @param {String} name Customer name
 * @param {String} email Customer email
 * @param {String} password Customer password
 * @returns {Promise<CustomerModel>}
 */
exports.signUp = async function (store, name, email, password) {
    let querys = [];

    const checkEmail = await selectCustomer(store, email);
    if (checkEmail != null) {
        throw utils.errorHandling(errors.duplicatedEmail);
    }

    let cryptoPassword = '';
    crypto.pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
        if (err) throw err;
        cryptoPassword = derivedKey.toString('hex');
    });

    const customer = new CustomerModel();
    customer.id = await genID();
    customer.store = store;
    customer.name = name;
    customer.email = email;
    customer.password = cryptoPassword;

    querys.push(insertCustomer(customer));

    await dbMgr.set(dbMgr.mysqlConn.commerce, querys);
};

/**
 *
 * @param {String} store Store Id
 * @param {String} email Customer email
 * @returns {Promise<CustomerModel>}
 */
exports.checkDuplicateEmail = async function (store, email) {
    const customer = await selectCustomer(store, email);
    if (customer == null) {
        return false;
    }
    return true;
};

/**
 *
 * @returns {Promise<Number>} Customer ID
 */
async function genID() {
    return (await dbMgr.redis.gen.client.incrby('gen:customer', 1)) + '';
}

/**
 *
 * @param {String} store Store Id
 * @param {String} email Customer email
 * @returns {Promise<CustomerModel>}
 */
async function selectCustomer(store, email) {
    const [result] = await dbMgr.mysql.commerce.makeAndQuery(querys.commerce.selectCustomer, store, email);
    return result;
}

/**
 *
 * @param {CustomerModel} customer Customer data
 * @returns {String} Query String
 */
function insertCustomer(customer) {
    // INSERT INTO tb_commerce_customer (id, store, name, email, password) VALUES (?, ?, ?, ?, ?)
    const query = dbMgr.mysql.commerce.makeQuery(querys.commerce.insertCustomer, customer.id, customer.store, customer.name, customer.email, customer.password);
    return query;
}
