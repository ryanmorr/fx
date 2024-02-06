const UNITS_RE = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/;
const RGB_RE = /^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*([.\d]+))?\)$/;
const HEX6_RE = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
const HEX3_RE = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

const defaultProps = {
    duration: 1000,
    easing: 'ease-in-out'
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

function splitUnits(val) {
    if (typeof val === 'number') {
        return [val, 'px'];
    }
    return UNITS_RE.exec(val);
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

function getValues(el, props) {
    const startValues = {};
    const endValues = {};
    const units = {};
    for (const prop in props) {
        const value = props[prop];
        let [from, to] = Array.isArray(value) ? value : [null, value];
        if (isColor(prop)) {
            from = from == null ? getComputedStyle(el)[prop] : from;
            startValues[prop] = parseColor(from);
            endValues[prop] = parseColor(to);
        } else if (prop === 'scrollTop' || prop === 'scrollLeft') {
            from = from == null ? el[prop] : from;
            startValues[prop] = from;
            endValues[prop] = to;
        } else {
            const [value, unit] = splitUnits(to);
            from = from == null ? getComputedStyle(el)[prop] || 0 : splitUnits(from)[0];
            startValues[prop] = parseFloat(from);
            endValues[prop] = parseFloat(value);
            units[prop] = unit;
        }
    }
    return [startValues, endValues, units];
}

function setProperty(el, prop, value, unit) {
    switch (prop) {
        case 'opacity':
            el.style[prop] = value;
            break;
        case 'scrollTop':
        case 'scrollLeft':
            el[prop] = value;
            break;
        default:
            if (prop in el.style) {
                if (isColor(prop)) {
                    el.style[prop] = `rgb(${Math.floor(value[0])}, ${Math.floor(value[1])}, ${Math.floor(value[2])}, ${value[3]})`;
                } else {
                    el.style[prop] = value + unit;
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
