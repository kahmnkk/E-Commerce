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
