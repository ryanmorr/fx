/**
 * Import dependencies
 */
import { isArray, includes, parseColor } from './util';

/**
 * Common variables
 */
const has = {}.hasOwnProperty;

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
                from = from == null ? parseFloat(getStyle(el, prop)) || 0 : from;
                startProps[prop] = from;
                endProps[prop] = to;
            }
        }
    }
    return [startProps, endProps];
}

/**
 * Set multiple style properties for
 * an element
 *
 * @param {Element} el
 * @param {Object} props
 * @api private
 */
export function setProperties(el, props) {
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
                    el.style[prop] = value + 'px';
                }
        }
    }
}
