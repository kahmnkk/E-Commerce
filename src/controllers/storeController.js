// Service
const storeService = require('@src/services/storeService');
const productService = require('@src/services/productService');

// Common
const errors = require('@src/errors');

// Utils
const SessionMgr = require('@src/utils/sessionMgr');
const utils = require('@src/utils/utils');
const Type = require('@root/src/utils/type');

exports.get = async function (req, res) {
    const reqKeys = {
        id: 'id',
    };
    const resKeys = {
        id: 'id',
        name: 'name',
        products: 'products',
        custom: 'custom',
    };

    const session = new SessionMgr(req, res);
    const body = session.body;
    const response = {};

    try {
        if (utils.hasKeys(reqKeys, body) == false) {
            throw utils.errorHandling(errors.invalidRequestData);
        }

        const id = body[reqKeys.id];

        const store = await storeService.getStore(id);
        const products = await productService.getProductByStore(id);

        response[resKeys.id] = store.id;
        response[resKeys.name] = store.name;
        response[resKeys.products] = products;
        response[resKeys.custom] = store.custom;
        session.send(response, Type.HttpStatus.OK);
    } catch (err) {
        session.error(err);
    }
};

exports.add = async function (req, res) {
    const reqKeys = {
        name: 'name',
        custom: 'custom',
    };
    const resKeys = {
        id: 'id',
        name: 'name',
        custom: 'custom',
    };

    const session = new SessionMgr(req, res);
    const body = session.body;
    const response = {};

    try {
        if (utils.hasKeys(reqKeys, body) == false) {
            throw utils.errorHandling(errors.invalidRequestData);
        }

        const name = body[reqKeys.name];
        const custom = body[reqKeys.custom];

        const store = await storeService.addStore(name, custom);

        response[resKeys.id] = store.id;
        response[resKeys.name] = store.name;
        session.send(response, Type.HttpStatus.OK);
    } catch (err) {
        session.error(err);
    }
};

exports.update = async function (req, res) {
    const reqKeys = {
        id: 'id',
        name: 'name',
        custom: 'custom',
    };
    const resKeys = {
        id: 'id',
        name: 'name',
        custom: 'custom',
    };

    const session = new SessionMgr(req, res);
    const body = session.body;
    const response = {};

    try {
        if (utils.hasKeys(reqKeys, body) == false) {
            throw utils.errorHandling(errors.invalidRequestData);
        }

        const id = body[reqKeys.id];
        const name = body[reqKeys.name];
        const custom = body[reqKeys.custom];

        const store = await storeService.updateStore(id, name, custom);

        response[resKeys.id] = store.id;
        response[resKeys.name] = store.name;
        response[resKeys.custom] = store.custom;
        session.send(response, Type.HttpStatus.OK);
    } catch (err) {
        session.error(err);
    }
};
