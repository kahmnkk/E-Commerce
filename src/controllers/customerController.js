// Service
const customerService = require('@src/services/customerService');
const storeService = require('@src/services/storeService');

// Common
const errors = require('@src/errors');

// Utils
const SessionMgr = require('@src/utils/sessionMgr');
const utils = require('@src/utils/utils');
const Type = require('@root/src/utils/type');

exports.signIn = async function (req, res) {
    const reqKeys = {
        store: 'store',
        email: 'email',
        password: 'password',
    };
    const resKeys = {
        id: 'id',
        store: 'store',
        name: 'name',
        email: 'email',
        custom: 'custom',
    };

    const session = new SessionMgr(req, res);
    const body = session.body;
    const response = {};

    try {
        if (utils.hasKeys(reqKeys, body) == false) {
            throw utils.errorHandling(errors.invalidRequestData);
        }

        const store = body[reqKeys.store];
        const email = body[reqKeys.email];
        const password = body[reqKeys.password];

        const customer = await customerService.signIn(store, email, password);

        session.addValue(req, 'cid', customer.id);

        response[resKeys.id] = customer.id;
        response[resKeys.store] = customer.store;
        response[resKeys.name] = customer.name;
        response[resKeys.email] = customer.email;
        response[resKeys.custom] = customer.custom;
        session.send(response, Type.HttpStatus.OK);
    } catch (err) {
        session.error(err);
    }
};

exports.signUp = async function (req, res) {
    const reqKeys = {
        store: 'store',
        name: 'name',
        email: 'email',
        password: 'password',
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
        const email = body[reqKeys.email];
        const password = body[reqKeys.password];
        const custom = body[reqKeys.custom];

        const store = await storeService.getStore(storeId);
        if (storeService.checkCustom(store.custom, Type.Models.CUSTOMER, custom) == false) {
            throw utils.errorHandling(errors.customFieldMismatch);
        }

        await customerService.signUp(storeId, name, email, password, custom);

        response[resKeys.result] = true;
        session.send(response, Type.HttpStatus.OK);
    } catch (err) {
        session.error(err);
    }
};

exports.checkDuplicateEmail = async function (req, res) {
    const reqKeys = {
        store: 'store',
        email: 'email',
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

        const store = body[reqKeys.store];
        const email = body[reqKeys.email];

        const result = await customerService.checkDuplicateEmail(store, email);

        response[resKeys.result] = result;
        session.send(response, Type.HttpStatus.OK);
    } catch (err) {
        session.error(err);
    }
};
