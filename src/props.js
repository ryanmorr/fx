/**
 * Import dependencies
 */
import { isArray, includes, parseColor } from './util';

/**
 * Common variables
 */
const has = {}.hasOwnProperty;
const valueRe = /([\+\-]?[0-9|auto\.]+)(%|\w+)?/;

/**
 * Get the value and units of a
 * CSS property
 *
 * @param {String} style
 * @return {Array}
 * @api private
 */
function getValue(style) {
    const match = valueRe.exec(style);
    return [parseFloat(match[1]) || 0, match[2] || 'px'];
}

/**
 * Determine the start point for
 * the element
 *
 * @param {Element} el
 * @param {String} prop
 * @param {String} end
 * @param {String} units
 * @return {Number}
 */
function getStartValue(el, prop, end, units) {
    let start = parseFloat(getStyle(el, prop)) || 0;
    if (units !== 'px') {
        setStyle(el, prop, (end || 1) + units);
        start = ((end || 1) / parseFloat(getStyle(el, prop))) * start;
        setStyle(el, prop, start + units);
    }
    return start;
}

/**
 * Get the computed value of a style
 * property for an element
 *
 * @param {Element} el
 * @param {String} prop
 * @return {String}
 * @api private
 */
function getStyle(el, prop) {
    const style = el.ownerDocument.defaultView.getComputedStyle(el, null);
    return prop in style ? style[prop] : null;
}

/**
 * Set the value of an element's
 * style property
 *
 * @param {Element} el
 * @param {String} prop
 * @param {String} value
 * @api private
 */
function setStyle(el, prop, value) {
    el.style[prop] = value;
}

/**
 * Get the starting and ending values
 * for each property of an animation
 *
 * @param {Element} el
 * @param {Object} props
 * @return {Array}
 * @api private
 */
export function getProperties(el, props) {
    const startProps = Object.create(null);
    const endProps = Object.create(null);
    const units = Object.create(null);
    let prop, value, to, from;
    for (prop in props) {
        if (has.call(props, prop)) {
            value = props[prop];
            [from, to] = isArray(value) ? value : [null, value];
            if (includes(prop, 'color')) {
                from = from == null ? getStyle(el, prop) : from;
                startProps[prop] = parseColor(from);
                endProps[prop] = parseColor(to);
            } else if (prop === 'scrollTop' || prop === 'scrollLeft') {
                from = from == null ? el[prop] : from;
                startProps[prop] = from;
                endProps[prop] = to;
            } else {
                const [value, length] = getValue(to);
                from = from == null ? getStartValue(el, prop, value, length) : getValue(from)[0];
                startProps[prop] = from;
                endProps[prop] = value;
                units[prop] = length;
            }
        }
    }
    return [startProps, endProps, units];
}

/**
 * Set multiple style properties for
 * an element
 *
 * @param {Element} el
 * @param {Object} props
 * @param {Object} units
 * @api private
 */
export function setProperties(el, props, units) {
    let prop, value;
    for (prop in props) {
        value = props[prop];
        switch (prop) {
            case 'opacity':
                el.style.opacity = value;
                break;
            case 'scrollTop':
            case 'scrollLeft':
                el[prop] = value;
                break;
            default:
                if (includes(prop, 'color')) {
                    el.style[prop] = `rgb(
                        ${Math.floor(value[0])}, 
                        ${Math.floor(value[1])}, 
                        ${Math.floor(value[2])}
                    )`;
                } else {
                    const length = units[prop];
                    setStyle(el, prop, value + length);
                }
        }
    }
}
