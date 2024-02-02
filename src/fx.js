import Queue from './queue';
import easingFunctions from './easing';
import { getProperties, setProperties, getStyle } from './props';
import { isArray } from './util';

const defaultDuration = 700;
const defaultEasing = 'ease-in-out';

class FX {

    constructor(el) {
        this.el = typeof el === 'string' ? document.querySelector(el) : el;
        this.events = Object.create(null);
        this.queue = new Queue();
        this.animating = false;
    }

    getElement() {
        return this.el;
    }

    isAnimating() {
        return this.animating;
    }

    animate(props, duration = defaultDuration, easing = defaultEasing, ...callbacks) {
        if (this.isAnimating()) {
            this.queue.enqueue([props, duration, easing, ...callbacks]);
            return this;
        }
        this.animating = true;
        this.emit('start');
        this.promise = new Promise((resolve) => {
            this.resolve = resolve;
            const el = this.el;
            const frame = Object.create(null);
            const easingFunction = easingFunctions[easing];
            let startTime, currentTime, startProps, endProps, units, willChange;
            const tick = (timestamp) => {
                if (!startTime) {
                    startTime = timestamp;
                }
                if (this.isAnimating() && (timestamp < startTime + duration)) {
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
                    setProperties(el, frame, units);
                    requestAnimationFrame(tick);
                    this.emit('tick', Math.round((currentTime / duration) * 100), frame);
                } else {
                    setProperties(el, endProps, units);
                    this.emit('tick', 100, endProps);
                    this.complete();
                }
            };
            requestAnimationFrame(() => {
                [startProps, endProps, units, willChange] = getProperties(el, props);
                if (willChange.length) {
                    el.style.willChange = willChange.join(', ');
                }
                requestAnimationFrame(tick);
            });
        });
        callbacks.forEach((fn) => this.promise.then(fn));
        return this;
    }

    fadeIn(duration = 350, easing = 'ease-in', ...callbacks) {
        return this.animate({opacity: [0, 1]}, duration, easing, ...callbacks);
    }

    fadeOut(duration = 350, easing = 'ease-out', ...callbacks) {
        return this.animate({opacity: 0}, duration, easing, ...callbacks);
    }

    slideIn(direction = 'top', duration = 350, easing = 'ease-in', ...callbacks) {
        let props;
        switch (direction) {
            case 'left':
                props = {translateX: ['-100%', 0], opacity: [0, 1]};
                break;
            case 'right':
                props = {translateX: ['100%', 0], opacity: [0, 1]};
                break;
            case 'bottom':
                props = {translateY: ['100%', 0], opacity: [0, 1]};
                break;
            case 'top':
            default:
                props = {translateY: ['-100%', 0], opacity: [0, 1]};
                break;
        }
        return this.animate(props, duration, easing, ...callbacks);
    }

    slideOut(direction = 'bottom', duration = 350, easing = 'ease-out', ...callbacks) {
        let props;
        switch (direction) {
            case 'left':
                props = {translateX: '-100%', opacity: 0};
                break;
            case 'right':
                props = {translateX: '100%', opacity: 0};
                break;
            case 'top':
                props = {translateY: '-100%', opacity: 0};
                break;
            case 'bottom':
            default:
                props = {translateY: '100%', opacity: 0};
                break;
        }
        return this.animate(props, duration, easing, ...callbacks);
    }

    move(x, y, duration = 350, easing = 'ease-in-out', ...callbacks) {
        return this.animate({translateX: x, translateY: y}, duration, easing, ...callbacks);
    }

    scale(percent, duration = 350, easing = 'ease-in-out', ...callbacks) {
        return this.animate({scale: percent / 100}, duration, easing, ...callbacks);
    }

    highlight(color = '#ffff9c', prop = 'backgroundColor',
              duration = 700, easing = 'ease-in-out', ...callbacks) {
        const to = getStyle(this.el, prop);
        return this.animate({[prop]: [color, to]}, duration, easing, ...callbacks);
    }

    then(fn) {
        if (!this.queue.isEmpty()) {
            this.queue.getLast().push(fn);
        } else if (this.promise) {
            this.promise.then(fn);
        }
        return this;
    }

    stop() {
        if (this.isAnimating()) {
            this.animating = false;
        }
        return this;
    }

    clear() {
        if (!this.queue.isEmpty()) {
            this.queue.clear();
        }
        return this;
    }

    on(name, fn) {
        if (!(name in this.events)) {
            this.events[name] = [];
        }
        this.events[name].push(fn);
        return this;
    }

    complete() {
        if (this.isAnimating()) {
            this.animating = false;
            this.el.style.removeProperty('will-change');
            this.resolve();
            this.emit('done');
            this.promise = this.resolve = null;
            if (!this.queue.isEmpty()) {
                this.animate.apply(this, this.queue.dequeue());
            }
        }
    }

    emit(name, ...args) {
        const callbacks = this.events[name];
        if (callbacks && callbacks.length) {
            callbacks.forEach((callback) => callback(...args));
        }
    }
}

export default function fx(el) {
    return new FX(el);
}
