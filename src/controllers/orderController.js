// Service
const orderService = require('@src/services/orderService');
const customerService = require('@src/services/customerService');
const productService = require('@src/services/productService');
const storeService = require('@src/services/storeService');

// Common
const errors = require('@src/errors');

// Utils
const SessionMgr = require('@src/utils/sessionMgr');
const utils = require('@src/utils/utils');
const Type = require('@root/src/utils/type');

exports.history = async function (req, res) {
    const reqKeys = {};
    const resKeys = {
        list: 'list',
    };

    const session = new SessionMgr(req, res);
    const body = session.body;
    const response = {};

    try {
        if (utils.hasKeys(reqKeys, body) == false) {
            throw utils.errorHandling(errors.invalidRequestData);
        }

        const customerId = session.getCid();
        if (customerId == null) {
            throw utils.errorHandling(errors.unauthorized);
        }

        const list = await orderService.getOrderByCustomer(customerId);

        response[resKeys.list] = list;
        session.send(response, Type.HttpStatus.OK);
    } catch (err) {
        session.error(err);
    }
};

exports.purchase = async function (req, res) {
    const reqKeys = {
        store: 'store',
        products: 'products',
        custom: 'custom',
    };
    const resKeys = {
        result: 'result',
    };

    const session = new SessionMgr(req, res);
    const body = session.body;
    const response = {};

    try {
        if (utils.hasKeys(reqKeys, body) == false) {
            throw utils.errorHandling(errors.invalidRequestData);
        }

        const storeId = body[reqKeys.store];
        const productIds = body[reqKeys.products];
        const custom = body[reqKeys.custom];

        const customerId = session.getCid();
        if (customerId == null) {
            throw utils.errorHandling(errors.unauthorized);
        }

        const customer = await customerService.getCustomer(customerId);
        if (customer.store != storeId) {
            throw utils.errorHandling(errors.invalidCustomerId);
        }

        const store = await storeService.getStore(storeId);
        if (storeService.checkCustom(store.custom, Type.Models.ORDER, custom) == false) {
            throw utils.errorHandling(errors.customFieldMismatch);
        }

        const products = await productService.getProducts(productIds, storeId);
        if (orderService.isValidProducts(products, storeId) == false) {
            throw utils.errorHandling(errors.invalidProductIncluded);
        }

        await orderService.purchase(storeId, customerId, products, custom);

        response[resKeys.result] = true;
        session.send(response, Type.HttpStatus.OK);
    } catch (err) {
        session.error(err);
    }
};

exports.refund = async function (req, res) {
    const reqKeys = {
        id: 'id',
    };
    const resKeys = {
        result: 'result',
    };

    const session = new SessionMgr(req, res);
    const body = session.body;
    const response = {};

    try {
        if (utils.hasKeys(reqKeys, body) == false) {
            throw utils.errorHandling(errors.invalidRequestData);
        }

        const orderId = body[reqKeys.id];

        const customerId = session.getCid();
        if (customerId == null) {
            throw utils.errorHandling(errors.unauthorized);
        }

        await orderService.refund(orderId, customerId);

        response[resKeys.result] = true;
        session.send(response, Type.HttpStatus.OK);
    } catch (err) {
        session.error(err);
    }
};
