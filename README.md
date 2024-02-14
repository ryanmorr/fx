# fx

[![Version Badge][version-image]][project-url]
[![License][license-image]][license-url]
[![Build Status][build-image]][build-url]

> JavaScript animation library

## Install

Download the [CJS](https://github.com/ryanmorr/fx/raw/master/dist/cjs/fx.js), [ESM](https://github.com/ryanmorr/fx/raw/master/dist/esm/fx.js), [UMD](https://github.com/ryanmorr/fx/raw/master/dist/umd/fx.js) versions or install via NPM:

```sh
npm install @ryanmorr/fx
```

## Usage

Provide an element, nodelist, or selector string and an object that maps CSS properties to a value that the property will be animated to. It returns a promise that is resolved when the animation is complete:

```javascript
import fx from '@ryanmorr/fx';

await fx('#foo', {
    width: 100,
    height: 200
});
```

Optionally specify the duration in milliseconds (defaults to 1000):

```javascript
fx(element, {
    width: 100,
    duration: 500
});
```

Optionally provide an easing method as a string, supporting "linear", "ease-in", "ease-out", and the default "ease-in-out":

```javascript
fx(element, {
    opacity: 0,
    easing: 'ease-in'
});
```

Define a starting value for the animation by using an array, with the start value at the first index and the end value at the last index:

```javascript
fx(element, {
    width: [100, 500]
});
```

Add units to the value to override the default "px" used by most properties:

```javascript
fx(element, {
    height: '5em'
});
```

Supports 2D transforms:

```javascript
fx(element, {
    translateX: 100,
    translateY: 100,
    scaleX: 2,
    scaleY: 2,
    rotate: 45
});
```

Supports colors as hex or RGB:

```javascript
fx(element, {
    color: '#0000FF',
    backgroundColor: 'rgb(255, 0, 0)'
});
```

Supports custom properties:

```javascript
fx(element, {
    '--value': 100
});
```

Supports scrolling:

```javascript
fx(element, {
    scrollTop: 100,
    scrollLeft: 100
});
```

Supports motion path:

```javascript
fx(element, {
    offsetDistance: '100%'
});
```
Supports a custom easing function:

```javascript
function bounceIn(t) {
    if (t < 1 / 2.75) {
        return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
        return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
        return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
}

fx(element, {
    translateX: 500,
    easing: bounceIn
});
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).

[project-url]: https://github.com/ryanmorr/fx
[version-image]: https://img.shields.io/github/package-json/v/ryanmorr/fx?color=blue&style=flat-square
[build-url]: https://github.com/ryanmorr/fx/actions
[build-image]: https://img.shields.io/github/actions/workflow/status/ryanmorr/fx/node.js.yml?style=flat-square
[license-image]: https://img.shields.io/github/license/ryanmorr/fx?color=blue&style=flat-square
[license-url]: UNLICENSE