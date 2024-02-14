let raf = 0;
const animations = [];
const cache = {};

const UNITS_RE = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/;
const RGB_RE = /^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*([.\d]+))?\)$/;
const HEX6_RE = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
const HEX3_RE = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

const defaultProps = {
    duration: 1000,
    easing: 'ease-in-out'
};

const defaultUnits = {
    all: 'px',
    scale: '',
    rotate: 'deg',
    translate: 'px',
    opacity: '',
    offsetDistance: '%'
};

const easingFunctions = {
    'linear': (t) => t,
    'ease-in': (t) => Math.pow(t, 1.675),
    'ease-out': (t) =>  1 - Math.pow(1 - t, 1.675),
    'ease-in-out': (t) =>  .5 * (Math.sin((t - .5) * Math.PI) + 1)
};

function removeAnimation(animation) {
    const index = animations.indexOf(animation);
    if (index > -1) {
        animations.splice(index, 1);
    }
}

function getBounds(data) {
    return Array.isArray(data) ? data : [null, data];
}

function extractUnit(value) {
    const match = UNITS_RE.exec(value);
    return match && match[1] ? match[1] : null;
}

function getUnit(prop, unit) {
    return unit == null ? (prop in defaultUnits ? defaultUnits[prop] : defaultUnits.all) : unit;
}

function isColor(prop) {
    return prop.toLowerCase().includes('color');
}

function extractRGB(re, color, radix) {
    const match = re.exec(color);
    return [
        parseInt(match[1], radix),
        parseInt(match[2], radix),
        parseInt(match[3], radix),
        match[4] == null ? 1 : parseFloat(match[4])
    ];
}

function parseColor(color) {
    if (color.startsWith('rgb')) {
        return extractRGB(RGB_RE, color, 10);
    }
    return extractRGB(HEX6_RE, color.replace(HEX3_RE, (m, r, g, b) => r + r + g + g + b + b), 16);
}

// Adapted from: https://github.com/juliangarnier/anime/blob/refs/tags/v3.2.2/src/index.js#L408
function convertPixelsToUnit(el, value, unit) {
    const key = value + unit;
    if (key in cache) {
        cache[key];
    }
    const baseline = 100;
    const temp = document.createElement(el.tagName);
    const parent = (el.parentNode && (el.parentNode !== document)) ? el.parentNode : document.body;
    parent.appendChild(temp);
    temp.style.position = 'absolute';
    temp.style.width = baseline + unit;
    const convertedUnit = (baseline / temp.offsetWidth) * parseFloat(value);
    parent.removeChild(temp);
    return cache[key] = convertedUnit;
}

function getStartValue(el, prop, value, unit) {
    const numericValue = parseFloat(value);
    if (value === 'none' || value === '' || numericValue === 0) {
        return 0;
    }
    if (unit == null) {
        return numericValue;
    }
    if (prop === 'scale' && unit === '%') {
        return numericValue * 100;
    }
    const valueUnit = extractUnit(value);
    if (unit === valueUnit || 'deg' === valueUnit || 'rad' === valueUnit || 'turn' === valueUnit) {
        return numericValue;
    }
    return convertPixelsToUnit(el, value, unit);
}

function getStyle(el, prop) {
    const style = getComputedStyle(el);
    return prop.includes('-') ? style.getPropertyValue(prop) : style[prop];
}

function setStyle(el, prop, value) {
    if (prop.includes('-')) {
        el.style.setProperty(prop, value);
    } else {
        el.style[prop] = value;
    }
}

function getTransform(el, prop, defaultValue) {
    const values = [defaultValue, defaultValue];
    const style = getStyle(el, prop);
    if (style !== 'none') {
        const parts = style.split(' ');
        if (prop === 'scale' && parts.length === 1) {
            values[0] = values[1] = style;
        } else {
            parts.forEach((v, i) => values[i] = v);
        }
    }
    return values;
}

function processTween(el, props) {
    const start = {};
    const end = {};
    const units = {};
    Object.keys(props).forEach((prop) => {
        let [from, to] = getBounds(props[prop]);
        switch (prop) {
            case 'scrollTop':
            case 'scrollLeft':
                start[prop] = from == null ? el[prop] : from;
                end[prop] = to;
                break;
            case 'scaleX':
            case 'scaleY':
            case 'translateX':
            case 'translateY': {
                const transform = prop.slice(0, -1);
                if (!start[transform]) {
                    const defaultValue = transform === 'scale' ? 1 : 0;
                    from = getTransform(el, transform, defaultValue);
                    to = [defaultValue, defaultValue];
                    units[transform] = [];
                    ['X', 'Y'].forEach((axis, index) => {
                        const transformAxis = transform + axis;
                        if (transformAxis in props) {
                            const [fromValue, toValue] = getBounds(props[transformAxis]);
                            const unit = extractUnit(toValue);
                            from[index] = fromValue == null ? getStartValue(el, transform, from[index], unit) : parseFloat(fromValue);
                            to[index] = parseFloat(toValue);
                            units[transform][index] = unit;
                        } else {
                            from[index] = to[index] = parseFloat(from[index]);
                        }
                    });
                    start[transform] = from;
                    end[transform] = to;
                }
                break;
            }
            default:
                if (isColor(prop)) {
                    start[prop] = parseColor(from == null ? getStyle(el, prop) : from);
                    end[prop] = parseColor(to);
                } else {
                    const unit = extractUnit(to);
                    start[prop] = from == null ? getStartValue(el, prop, getStyle(el, prop), unit) : parseFloat(from);
                    end[prop] = parseFloat(to);
                    units[prop] = unit;
                }
        }
    });
    return [start, end, units];
}

function setProperty(el, prop, value, unit) {
    switch (prop) {
        case 'scrollTop':
        case 'scrollLeft':
            el[prop] = value;
            break;
        case 'scale':
        case 'translate':
            setStyle(el, prop, value[0] + getUnit(prop, unit[0]) + ' ' + value[1] + getUnit(prop, unit[1]));
            break;
        default:
            setStyle(el, prop, isColor(prop) ? `rgb(${Math.floor(value[0])}, ${Math.floor(value[1])}, ${Math.floor(value[2])}, ${value[3]})` : value + getUnit(prop, unit));
    }
}

function play(update) {
    if (raf === 0) {
        raf = requestAnimationFrame(tick);
    }
    return new Promise((resolve) => {
        const done = () => (resolve(), removeAnimation(animation));
        const animation = (timestamp) => update(timestamp, done);
        animations.push(animation);
    });
}

function tick(timestamp) {
    for (let i = animations.length; i--;) animations[i](timestamp);
    raf = (animations.length > 0) ? requestAnimationFrame(tick) : 0;
}

function calc(ease, start, end, percentage) {
    if (Array.isArray(start)) {
        return start.map((val, i) => calc(ease, val, end[i], percentage));
    }
    return start + (end - start) * ease(percentage);
}

function animate(el, props, duration, ease) {
    let startTime;
    const [start, end, units] = processTween(el, props);
    return play((timestamp, done) => {
        if (!startTime) {
            startTime = timestamp;
        }
        const currentTime = Math.min(timestamp - startTime, duration);
        const percentage = currentTime / duration;
        Object.keys(start).forEach((prop) => setProperty(el, prop, calc(ease, start[prop], end[prop], percentage), units[prop]));
        if (percentage >= 1) {
            done();
        }
    });
}

export default function fx(target, props) {
    const elements = typeof target === 'string' ? document.querySelectorAll(target) : target;
    const {duration, easing} = Object.assign(defaultProps, props);
    const ease = typeof easing === 'string' ? easingFunctions[easing] : easing;
    if (elements.nodeName) {
        return animate(elements, props, duration, ease);
    }
    if (elements.length === 1) {
        return animate(elements[0], props, duration, ease);
    }
    return Promise.all(Array.from(elements).map((el) => animate(el, props, duration, ease)));
}
