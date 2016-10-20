/**
 * Common variables
 */
const toString = {}.toString;
const hex6Re = /^#?(\w{2})(\w{2})(\w{2})$/;
const hex3Re = /^#?(\w{1})(\w{1})(\w{1})$/;
const rgbRe = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
const colorCache = Object.create(null);

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

/**
 * Parse a CSS color hex and rgb value
 * to extract the numberic codes
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */
export function parseColor(str) {
    if (str in colorCache) {
        return colorCache[str];
    }
    let color = str.match(hex6Re), value;
    if (color && color.length === 4) {
        value = [
            parseInt(color[1], 16),
            parseInt(color[2], 16),
            parseInt(color[3], 16)
        ];
        colorCache[str] = value;
        return value;
    }
    color = str.match(rgbRe);
    if (color && color.length === 4) {
        value = [
            parseInt(color[1], 10),
            parseInt(color[2], 10),
            parseInt(color[3], 10)
        ];
        colorCache[str] = value;
        return value;
    }
    color = str.match(hex3Re);
    if (color && color.length === 4) {
        value = [
            parseInt(color[1] + color[1], 16),
            parseInt(color[2] + color[2], 16),
            parseInt(color[3] + color[3], 16)
        ];
        colorCache[str] = value;
        return value;
    }
}
