const Type = require('@root/src/utils/type');

const errors = {
    undefinedError: {
        code: 1,
        statusCode: Type.HttpStatus.InternalServerError,
        message: 'undefined error',
    },
    undefinedServer: {
        code: 2,
        statusCode: Type.HttpStatus.InternalServerError,
        message: 'undefined server',
    },
    undefinedConfig: {
        code: 3,
        statusCode: Type.HttpStatus.InternalServerError,
        message: 'undefined config',
    },
    undefinedModule: {
        code: 4,
        statusCode: Type.HttpStatus.InternalServerError,
        message: 'undefined module',
    },

    // DataBases
    failedQuery: {
        code: 1001,
        statusCode: Type.HttpStatus.InternalServerError,
        message: 'failed query',
    },
    failedCache: {
        code: 1002,
        statusCode: Type.HttpStatus.InternalServerError,
        message: 'failed cache',
    },

    // Common
    invalidSessionStore: {
        code: 10001,
        statusCode: Type.HttpStatus.InternalServerError,
        message: 'invalid session store',
    },
    invalidRequestRouter: {
        code: 10002,
        statusCode: Type.HttpStatus.InternalServerError,
        message: 'invalid request router',
    },
    invalidRequestData: {
        code: 10003,
        statusCode: Type.HttpStatus.BadRequest,
        message: 'invalid request data',
    },
    invalidResponseData: {
        code: 10004,
        statusCode: Type.HttpStatus.BadRequest,
        message: 'invalid response data',
    },

    // Customer
    invalidCustomerEmail: {
        code: 11001,
        statusCode: Type.HttpStatus.NotFound,
        message: 'invalid customer email',
    },
    customerPasswordMismatch: {
        code: 11002,
        statusCode: Type.HttpStatus.NotFound,
        message: 'customer password mismatch',
    },
    duplicatedEmail: {
        code: 11003,
        statusCode: Type.HttpStatus.Conflict,
        message: 'duplicated email',
    },
};

module.exports = errors;
