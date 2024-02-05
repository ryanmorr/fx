const cache = {};
const hex6Re = /^#?(\w{2})(\w{2})(\w{2})$/;
const hex3Re = /^#?(\w{1})(\w{1})(\w{1})$/;
const rgbRe = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
const defaultDuration = 1000;
const defaultEasing = 'linear';

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

function parseColor(str) {
    if (str in cache) {
        return cache[str];
    }
    let color = str.match(hex6Re), value;
    if (color && color.length === 4) {
        value = [
            parseInt(color[1], 16),
            parseInt(color[2], 16),
            parseInt(color[3], 16)
        ];
        cache[str] = value;
        return value;
    }
    color = str.match(rgbRe);
    if (color && color.length === 4) {
        value = [
            parseInt(color[1], 10),
            parseInt(color[2], 10),
            parseInt(color[3], 10)
        ];
        cache[str] = value;
        return value;
    }
    color = str.match(hex3Re);
    if (color && color.length === 4) {
        value = [
            parseInt(color[1] + color[1], 16),
            parseInt(color[2] + color[2], 16),
            parseInt(color[3] + color[3], 16)
        ];
        cache[str] = value;
        return value;
    }
}

function getValues(el, props) {
    const startValues = {};
    const endValues = {};
    const units = {};
    for (const prop in props) {
        const value = props[prop];
        let [from, to] = Array.isArray(value) ? value : [null, value];
        if (prop.toLowerCase().includes('color')) {
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
                if (prop.toLowerCase().includes('color')) {
                    el.style[prop] = `rgb(${Math.floor(value[0])}, ${Math.floor(value[1])}, ${Math.floor(value[2])})`;
                } else {
                    el.style[prop] = value + unit;
                }
            }
    }
}

export default function fx(el, props, duration = defaultDuration, easing = defaultEasing) {
    el = typeof el === 'string' ? document.querySelector(el) : el;
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
