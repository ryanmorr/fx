const defaultProps = {
    duration: 1000,
    easing: 'linear'
};

const easingFunctions = {
    'linear': (t) => t,
    'ease-in': (t) => Math.pow(t, 1.675),
    'ease-out': (t) =>  1 - Math.pow(1 - t, 1.675),
    'ease-in-out': (t) =>  .5 * (Math.sin((t - .5) * Math.PI) + 1)
};

function calculateEase(ease, start, end, percentage) {
    return start + (end - start) * ease(percentage);
}

function splitUnits(val) {
    if (typeof val === 'number') {
        return [val, 'px'];
    }
    return /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(val);
}

function isColor(prop) {
    return prop.toLowerCase().includes('color');
}

function parseColor(color) {
    if (color.startsWith('rgb')) {
        const match = /^rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*(\d{1,3}))?\)$/.exec(color);
        return [
            parseInt(match[1], 10),
            parseInt(match[2], 10),
            parseInt(match[3], 10),
            match[4] == null ? 1 : match[4]
        ];
    }
    const hex = color.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => r + r + g + g + b + b);
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return [
        parseInt(match[1], 16),
        parseInt(match[2], 16),
        parseInt(match[3], 16),
        1
    ];
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
            from = from == null ? parseFloat(getComputedStyle(el)[prop]) || 0 : splitUnits(from)[0];
            startValues[prop] = from;
            endValues[prop] = value;
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
                    el.style[prop] = `rgba(${Math.floor(value[0])}, ${Math.floor(value[1])}, ${Math.floor(value[2])}, ${value[3]})`;
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
                const start = startValues[prop];
                const end = endValues[prop];
                const unit = units[prop];
                const value = Array.isArray(start) ? start.map((val, i) => calculateEase(ease, val, end[i], percentage)) : calculateEase(ease, start, end, percentage);
                setProperty(el, prop, value, unit);
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
