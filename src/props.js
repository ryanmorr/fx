/**
 * Import dependencies
 */
import { isArray } from './util';

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
    const style = document.defaultView.getComputedStyle(el, null);
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
        value = props[prop];
        [from, to] = isArray(value) ? value : [null, value];
        from = from == null ? parseFloat(getStyle(el, prop)) || 0 : from;
        startProps[prop] = from;
        endProps[prop] = to;
    }
    return [startProps, endProps];
}

/**
 * Set the value of each property of
 * an animation for the current frame
 *
 * @param {Element} el
 * @param {Object} frame
 * @api private
 */
export function setProperties(el, frame) {
    let prop, value;
    for (prop in frame) {
        value = frame[prop];
        el.style[prop] = value + 'px';
    }
}
