// Common
const errors = require('@src/errors');

exports.isEmptyObject = function (arg) {
    return this.getType(arg) == 'object' && Object.keys(arg).length === 0;
};

exports.isEmptyArray = function (arg) {
    return this.getType(arg) == 'array' && arg.length === 0;
};

exports.hasKeys = function (keys, values) {
    for (let k in keys) {
        if (values[k] == null) {
            return false;
        }
    }
    return true;
};

/**
 *
 * @param {Object} asis
 * @param {Object} tobe
 */
exports.mergeObj = function (asis, tobe) {
    for (let k in tobe) {
        if (asis.hasOwnProperty(k) == true) {
            asis[k] = tobe[k];
        }
    }
};

/**
 * min ~ max 사이의 임의의 정수 반환
 * @param {number} min  최소
 * @param {number} max  최대
 * @returns {number}    랜덤값
 */
exports.getRandomInt = function (min, max) {
    if (min == max) {
        return min;
    } else {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};

exports.getRandomIndex = function (...args) {
    let total = 0;
    for (let i = 0; i < args.length; i++) {
        total += Number(args[i]);
    }
    let pick = Math.floor(Math.random() * total);
    let sum = 0;
    for (let i = 0; i < args.length; i++) {
        sum += Number(args[i]);
        if (sum > pick) {
            return Number(i);
        }
    }
    return 0;
};

exports.getObjectByArray = function (objectArray, byKey) {
    let ret = {};
    objectArray.forEach((obj) => {
        ret[obj[byKey]] = obj;
    });
    return ret;
};

exports.sleep = function (milliSec) {
    return new Promise((resolve) => setTimeout(resolve, milliSec));
};

exports.errorHandling = function (errObj) {
    let err = new Error();

    if (errObj == null) {
        errObj = errors.undefinedError;
    }

    err.code = errObj.code;
    err.statusCode = errObj.statusCode;
    err.message = errObj.message;
    return err;
};

/**
 *
 * @param {any} arg
 * @returns {string} 'number'|'string'|'array'|'object'|'undefined'|'null'
 */
exports.getType = function (arg) {
    let rtn = null;

    if (arg !== null) {
        rtn = typeof arg;
    }

    if (rtn === 'object') {
        // rtn = arg.constructor.name.toLowerCase(); // named(customized) object returns It's name. ex) class User > 'user'
        const tp = String(arg.constructor);
        if (tp.indexOf('function Array') == 0) {
            rtn = 'array';
        }
    }

    return String(rtn);
};

/**
 * multiple query for DB (MySQL)
 *
 * @param {object} conn connection
 * @param {object} tran transaction
 * @param {Array} queries ["INSERT INTO ...", "UPDATE ...", ...]
 * @returns {null | boolean}
 * @description null: nothing, false: failure, true: success
 */
exports.multiQueryDB = async function (conn, tran, queries) {
    let rtn = null;

    if (queries.length == 0) {
        return rtn;
    }

    const stmt = conn.makeMultipleQuery(queries);
    //const tran = await conn.beginTransaction();
    try {
        await conn.query(tran, stmt);
        //await conn.commit(tran);
        rtn = true;
    } catch (err) {
        rtn = false;
        //await conn.rollback(tran);
        throw err;
    }

    return rtn;
};

/**
 * multiple query for Cache (Redis)
 *
 * @param {object} conn connection
 * @param {Array} queries [['hset', 'myhash', 'k1', 'v1'], ['hmset', 'myhash', 'k2', 'v2', 'k3', 'v3'], ...]
 * @returns {null | boolean | any}
 * @description null: nothing, false: failure, any: success
 */
exports.multiQueryCache = async function (conn, queries) {
    let rtn = null;

    if (queries.length == 0) {
        return rtn;
    }

    const that = this;

    const promise = new Promise(function (resolve, reject) {
        const tran = conn.multi(queries);
        tran.exec(function (err, replies) {
            if (err) {
                this.discard();
                reject(err);
            } else {
                resolve(replies);
            }
        });
    });

    try {
        await promise
            .then(function (message) {
                rtn = message;
            })
            .catch(function (err) {
                rtn = false;
                logger.error('[' + that.constructor.name + '] code: ' + err.code + ', message: ' + err.message + ', stack: ' + err.stack);
                throw err;
            });
    } catch (err) {
        throw this.errorHandling(errors.failedCache);
    }

    return rtn;
};
