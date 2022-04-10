// npm
const express = require('express');
const session = require('express-session');
const sessionStore = require('connect-redis')(session);
const uniqid = require('uniqid');
const cors = require('cors');

// Common
const config = require('@root/config');
const errors = require('@src/errors');

// Utils
const utils = require('@src/utils/utils');
const logger = require('@src/utils/logger');

// Database
const dbMgr = require('@src/database/dbMgr');

// Routes
const customerRoute = require('@src/routes/customerRoute');
const storeRoute = require('@src/routes/storeRoute');

class ExpressServer {
    constructor(options) {
        if (!options.sessionStore) {
            throw utils.errorHandling(errors.invalidSessionStore);
        }

        this.port = options.port;
        this.app = express();
        options.secret = '';

        // CORS 처리
        this.app.use(cors({ origin: true, credentials: true }));

        this.app.use(
            session({
                store: new sessionStore(options.sessionStore),
                secret: '123456789!@#$%^&*(',
                resave: false,
                saveUninitialized: true,
            }),
        );

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use((req, res, next) => {
            let reqs = {};
            const txid = uniqid();
            req['txid'] = txid;
            res['txid'] = txid;
            reqs['method'] = req.method;
            reqs['path'] = req.path;
            if (req.method == 'POST') {
                reqs['params'] = req.body;
            } else {
                reqs['params'] = req.query;
            }

            logger.info('[' + req['txid'] + '] req: ' + JSON.stringify(reqs));
            next();
        });

        this.app.use('/customer', customerRoute);
        this.app.use('/store', storeRoute);

        this.app.use((req, res, next) => {
            let err = new Error('404 Not Found');
            err['status'] = 404;
            next(err);
        });

        this.app.use((err, req, res, next) => {
            res.status(err['status'] || 500);
            const data = {
                message: err.message,
                error: err,
            };
            logger.error('[' + req['txid'] + '] res: ' + JSON.stringify(data));
            res.send(data);
        });

        this.app.set('port', this.port);
    }

    async init() {
        await dbMgr.init();
    }

    run() {
        this.app.listen(this.port, (err) => {
            if (err) throw err;
            logger.info('Express server running.');
        });
    }
}

module.exports = ExpressServer;
