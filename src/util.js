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
 * Does the string contain the
 * provided string
 *
 * @param {String} str
 * @param {String} searchStr
 * @return {Boolean}
 * @api private
 */
export function includes(str, searchStr) {
    str = str.toLowerCase();
    if (str.includes) {
        return str.includes(searchStr);
    }
    return str.indexOf(searchStr) !== -1;
}
