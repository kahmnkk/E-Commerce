// Service
const storeService = require('@src/services/storeService');

// Common
const errors = require('@src/errors');

// Utils
const SessionMgr = require('@src/utils/sessionMgr');
const utils = require('@src/utils/utils');
const Type = require('@root/src/utils/type');

exports.add = async function (req, res) {
    const reqKeys = {
        name: 'name',
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

        const store = await storeService.addStore(name);

        response[resKeys.id] = store.id.toString();
        response[resKeys.name] = store.name;
        response[resKeys.custom] = store.custom;
        session.send(response, Type.HttpStatus.OK);
    } catch (err) {
        session.error(err);
    }
};
