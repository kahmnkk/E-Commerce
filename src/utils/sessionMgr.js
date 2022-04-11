// Module
const uniqid = require('uniqid');

// common
const errors = require('@src/errors');
const config = require('@root/config');

// utils
const utils = require('@src/utils/utils');
const logger = require('@src/utils/logger');
const Type = require('@root/src/utils/type');

class SessionMgr {
    constructor(req, res) {
        if (req.method == 'POST') this.body = req.body;
        else this.body = req.query;

        this.url = req.originalUrl;
        this.res = res;

        this.sessionKeys = {
            uid: 'uid',
            cid: 'cid', // customer id
        };
        this.session = req.session;
    }

    send(res, statusCode = Type.HttpStatus.OK) {
        logger.info('[' + this.res.txid + '] res: ' + JSON.stringify(res));
        this.res.status(statusCode).send({ data: res });
    }

    sendOrigin(res) {
        this.res.send(res);
    }

    error(err) {
        if (config.dev == true) {
            logger.error(err);
        }
        if (err.statusCode == null) {
            err.statusCode = Type.HttpStatus.InternalServerError;
        }
        logger.error('[' + this.res.txid + '] resError: ' + JSON.stringify(err));
        this.res.status(err.statusCode).send({ error: err });
    }

    isEmpty() {
        for (let key in this.sessionKeys) {
            if (this.session[key] != null) return false;
        }
        return true;
    }

    remove(req) {
        for (let key in this.sessionKeys) {
            if (req.session[key] != null) delete req.session[key];
        }
        this.session = req.session;
    }

    create(req) {
        if (this.isEmpty() == false) this.remove(req);

        const uid = uniqid('ss-');
        req.session[this.sessionKeys.uid] = uid;
        this.session = req.session;
        return uid;
    }

    addValue(req, key, val) {
        if (this.session[key] == null) return false;
        req.session[this.sessionKeys[key]] = val;
        return true;
    }

    getUid() {
        return this.session[this.sessionKeys.uid];
    }

    getCid() {
        return this.session[this.sessionKeys.cid];
    }
}

module.exports = SessionMgr;
