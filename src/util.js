/**
 * Common variables
 */
const toString = {}.toString;

/**
 * Is the object an array?
 *
 * @param {*} obj
 * @return {Boolean}
 * @api private
 */
export function isArray(obj) {
    if ('isArray' in Array) {
        return Array.isArray(obj);
    }
    return toString.call(obj) === '[object Array]';
}

/**
 * Get a timestamp
 *
 * @return {Number}
 * @api private
 */
export function now() {
    if ('performance' in window) {
        return window.performance.now() + window.performance.timing.navigationStart;
    }
    return Date.now();
}
