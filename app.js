// https://github.com/ilearnio/module-alias
require('module-alias/register');

const config = require('@root/config');

const ExpressServer = require('@root/src/core/expressServer');

const expressServer = new ExpressServer({
    sessionStore: config.redis.sessionStore,
    port: config.port.express,
});

expressServer.init();
expressServer.run();
