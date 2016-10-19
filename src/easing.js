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
 * Export easing functions
 */
export default easingFunctions;
