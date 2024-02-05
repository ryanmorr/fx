import easingFunctions from './easing';
import { getProperties, setProperties } from './props';

const defaultDuration = 700;
const defaultEasing = 'ease-in-out';

export default function fx(el, props, duration = defaultDuration, easing = defaultEasing) {
    el = typeof el === 'string' ? document.querySelector(el) : el;
    return new Promise((resolve) => {
        const frame = {};
        const easingFunction = easingFunctions[easing];
        const [startProps, endProps, units] = getProperties(el, props);
        let startTime, currentTime;
        const tick = (timestamp) => {
            if (!startTime) {
                startTime = timestamp;
            }
            if (timestamp < startTime + duration) {
                currentTime = timestamp - startTime;
                let start, end, prop, i, len;
                for (prop in startProps) {
                    start = startProps[prop];
                    end = endProps[prop];
                    if (Array.isArray(start)) {
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
                setProperties(el, frame, units);
                requestAnimationFrame(tick);
            } else {
                setProperties(el, endProps, units);
                resolve();
            }
        };
        requestAnimationFrame(tick);
    });
}
