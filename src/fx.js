/**
 * Import dependencies
 */
import easingFunctions from './easing';
import { getProperties, setProperties } from './props';
import { isArray } from './util';

/**
 * Default animation options
 */
const defaultDuration = 700;
const defaultEasing = 'ease-out';

/**
 * Animation class
 *
 * @class FX
 * @api private
 */
class FX {

    /**
     * Instantiate the class providing a
     * CSS selector string or DOM element
     * to be animated
     *
     * @constructor
     * @param {Element|String} el
     * @api private
     */
    constructor(el) {
        this.el = typeof el === 'string' ? document.querySelector(el) : el;
    }

    /**
     * Get the animation element
     *
     * @return {Element}
     * @api public
     */
    getElement() {
        return this.el;
    }

    /**
     * Animate the element
     *
     * @param {Object} props
     * @param {Number} duration (optional)
     * @param {String} easing (optional)
     * @api public
     */
    animate(props, duration = defaultDuration, easing = defaultEasing) {
        const el = this.el;
        const frame = Object.create(null);
        const easingFunction = easingFunctions[easing];
        let startTime, currentTime, startProps, endProps;
        const step = (timestamp) => {
            if (!startTime) {
                startTime = timestamp;
            }
            if (timestamp < startTime + duration) {
                currentTime = timestamp - startTime;
                let start, end, prop, i, len;
                for (prop in startProps) {
                    start = startProps[prop];
                    end = endProps[prop];
                    if (isArray(start)) {
                        frame[prop] = [];
                        for (i = 0, len = start.length; i < len; i++) {
                            frame[prop][i] = easingFunction(
                                currentTime,
                                start[i],
                                end[i] - start[i],
                                duration
                            );
                        }
                    } else {
                        frame[prop] = easingFunction(
                            currentTime,
                            start,
                            end - start,
                            duration
                        );
                    }
                }
                setProperties(el, frame);
                requestAnimationFrame(step);
            } else {
                setProperties(el, endProps);
            }
        };
        requestAnimationFrame(() => {
            [startProps, endProps] = getProperties(el, props);
            requestAnimationFrame(step);
        });
    }
}

/**
 * Factory function for creating
 * `FX` instances
 *
 * @param {Element|String} tpl
 * @return {FX}
 * @api public
 */
export default function fx(el) {
    return new FX(el);
}
