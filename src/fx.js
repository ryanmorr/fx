/**
 * Import dependencies
 */
import { getProperties, setProperties } from './props';

/**
 * Default animation options
 */
const defaultDuration = 700;
const defaultEasing = 'ease-out';

/**
 * Transitional easing functions
 */
const easingFunctions = {

    linear(t, b, c, d) {
        return c * t / d + b;
    },

    'ease-in'(t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },

    'ease-out'(t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },

    'ease-in-out'(t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    }
};

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
        this.duration = duration;
        this.frame = Object.create(null);
        this.easingFunction = easingFunctions[easing];
        const [startProps, endProps] = getProperties(this.el, props);
        this.startProps = startProps;
        this.endProps = endProps;
        requestAnimationFrame(this.step.bind(this));
    }

    /**
     * Advance the properties of the
     * animation by 1 frame
     *
     * @param {Number} timestamp
     * @api private
     */
    step(timestamp) {
        if (!this.startTime) {
            this.startTime = timestamp;
        }
        if (timestamp < this.startTime + this.duration) {
            this.currentTime = timestamp - this.startTime;
            let prop, start, end;
            for (prop in this.startProps) {
                start = this.startProps[prop];
                end = this.endProps[prop];
                this.frame[prop] = this.easingFunction(
                    this.currentTime,
                    start,
                    end - start,
                    this.duration
                );
            }
            setProperties(this.el, this.frame);
            requestAnimationFrame(this.step.bind(this));
        } else {
            setProperties(this.el, this.endProps);
        }
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
