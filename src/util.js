const toString = {}.toString;

export function isArray(obj) {
    if ('isArray' in Array) {
        return Array.isArray(obj);
    }
    return toString.call(obj) === '[object Array]';
}

export function includes(str, searchStr) {
    str = str.toLowerCase();
    if (str.includes) {
        return str.includes(searchStr);
    }
    return str.indexOf(searchStr) !== -1;
}
