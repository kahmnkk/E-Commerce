// Service
const productService = require('@src/services/productService');
const storeService = require('@src/services/storeService');

// Common
const errors = require('@src/errors');

// Utils
const SessionMgr = require('@src/utils/sessionMgr');
const utils = require('@src/utils/utils');
const Type = require('@root/src/utils/type');

exports.add = async function (req, res) {
    const reqKeys = {
        store: 'store',
        name: 'name',
        price: 'price',
        categories: 'categories',
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
        const name = body[reqKeys.name];
        const price = body[reqKeys.price];
        const categories = body[reqKeys.categories];
        const custom = body[reqKeys.custom];

        const store = await storeService.getStore(storeId);
        if (storeService.checkCustom(store.custom, Type.Models.PRODUCT, custom) == false) {
            throw utils.errorHandling(errors.customFieldMismatch);
        }

        await productService.addProduct(storeId, name, price, categories, custom);

        response[resKeys.result] = true;
        session.send(response, Type.HttpStatus.OK);
    } catch (err) {
        session.error(err);
    }
};

exports.update = async function (req, res) {
    const reqKeys = {
        id: 'id',
        store: 'store',
        name: 'name',
        price: 'price',
        categories: 'categories',
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

        const id = body[reqKeys.id];
        const store = body[reqKeys.store];
        const name = body[reqKeys.name];
        const price = body[reqKeys.price];
        const categories = body[reqKeys.categories];
        const custom = body[reqKeys.custom];

        await productService.updateProduct(id, store, name, price, categories, custom);

        response[resKeys.result] = true;
        session.send(response, Type.HttpStatus.OK);
    } catch (err) {
        session.error(err);
    }
};
