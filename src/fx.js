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
    opacity: ''
};

const easingFunctions = {
    'linear': (t) => t,
    'ease-in': (t) => Math.pow(t, 1.675),
    'ease-out': (t) =>  1 - Math.pow(1 - t, 1.675),
    'ease-in-out': (t) =>  .5 * (Math.sin((t - .5) * Math.PI) + 1)
};

function calculatePosition(ease, start, end, percentage) {
    if (Array.isArray(start)) {
        return start.map((val, i) => calculatePosition(ease, val, end[i], percentage));
    }
    return start + (end - start) * ease(percentage);
}

function getStyle(el, prop) {
    return getComputedStyle(el)[prop];
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

function getStartValue(el, prop, value, unit) {
    const numericValue = parseFloat(value);
    if (value === 'none' || numericValue === 0) {
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
    const convertedUnit = (baseline / temp.offsetWidth) * numericValue;
    parent.removeChild(temp);
    return cache[key] = convertedUnit;
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

function setTransformAxis(el, transform, name, props, from, to, index, units) {
    if (name in props) {
        const propTo = props[name];
        const [propFrom, value] = Array.isArray(propTo) ? propTo : [null, propTo];
        const unit = extractUnit(value);
        if (propFrom) {
            from[index] = parseFloat(propFrom);
        } else {
            from[index] = getStartValue(el, transform, from[index], unit);
        }
        to[index] = parseFloat(value);
        if (unit) {
            units[transform][index] = unit;
        } 
    } else {
        from[index] = parseFloat(from[index]);
        to[index] = from[index];
    }
}

function setTransform(el, transform, props, startValues, endValues, units) {
    const defaultValue = transform === 'scale' ? 1 : 0;
    const to = [defaultValue, defaultValue];
    const from = getTransform(el, transform, defaultValue);
    units[transform] = [];
    setTransformAxis(el, transform, transform + 'X', props, from, to, 0, units);
    setTransformAxis(el, transform, transform + 'Y', props, from, to, 1, units);
    startValues[transform] = from;
    endValues[transform] = to;
}

function getValues(el, props) {
    const startValues = {};
    const endValues = {};
    const units = {};
    for (const prop in props) {
        const value = props[prop];
        let [from, to] = Array.isArray(value) ? value : [null, value];
        if (isColor(prop)) {
            from = from == null ? getStyle(el, prop) : from;
            startValues[prop] = parseColor(from);
            endValues[prop] = parseColor(to);
        } else if (prop === 'scrollTop' || prop === 'scrollLeft') {
            from = from == null ? el[prop] : from;
            startValues[prop] = from;
            endValues[prop] = to;
        } else if (prop.startsWith('translate') || prop.startsWith('scale')) {
            const transform = prop.slice(0, -1);
            if (!(transform in startValues)) {
                setTransform(el, transform, props, startValues, endValues, units);
            }
        } else {
            const unit = extractUnit(to);
            from = from == null ? getStartValue(el, prop, getStyle(el, prop), unit) || 0 : parseFloat(from);
            startValues[prop] = from;
            endValues[prop] = parseFloat(to);
            units[prop] = unit;
        }
    }
    return [startValues, endValues, units];
}

function setProperty(el, prop, value, unit) {
    switch (prop) {
        case 'scrollTop':
        case 'scrollLeft':
            el[prop] = value;
            break;
        case 'scale':
        case 'translate':
            el.style[prop] = value[0] + getUnit(prop, unit[0]) + ' ' + value[1] + getUnit(prop, unit[1]);
            break;
        default:
            if (prop in el.style) {
                if (isColor(prop)) {
                    el.style[prop] = `rgb(${Math.floor(value[0])}, ${Math.floor(value[1])}, ${Math.floor(value[2])}, ${value[3]})`;
                } else {
                    el.style[prop] = value + getUnit(prop, unit);
                }
            }
    }
}

export default function fx(target, props) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    const {duration, easing} = Object.assign(defaultProps, props);
    return new Promise((resolve) => {
        let startTime;
        const ease = easingFunctions[easing];
        const [startValues, endValues, units] = getValues(el, props);
        const tick = (timestamp) => {
            if (!startTime) {
                startTime = timestamp;
            }
            const currentTime = Math.min(timestamp - startTime, duration);
            const percentage = currentTime / duration;
            for (const prop in startValues) {
                setProperty(el, prop, calculatePosition(ease, startValues[prop], endValues[prop], percentage), units[prop]);
            }
            if (percentage < 1) {
                requestAnimationFrame(tick);
            } else {
                resolve();
            }
        };
        requestAnimationFrame(tick);
    });
}
