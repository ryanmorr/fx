# fx

> A lightweight and standalone JavaScript animation library

## Usage

Perform tweens on almost all CSS properties, including transforms, colors, and scroll position. Additionally supports CSS units, transitional easing functions, effects, queued animations, custom events, and promise-style callbacks:

```javascript
import fx from 'fx';

// Start a new animation
fx('#foo').animate({
    width: 100,
    height: '3em',
    translateX: '100%',
    translateY: [10, 60],
    backgroundColor: '#FF0000',
});

// Provide a duration, easing function, and add a callback function
fx(element).animate({scrollTop: 100}, 1000, 'ease-in-expo').then(() => {
    console.log('Animation complete') ;
});

// Queue multiple effects
fx('#bar').fadeIn().scale(100).fadeOut();

// Subscribe to custom events
fx(el).on('start', () => {
    console.log('Animation started');
}).on('tick', (progress) => {
    console.log('Animation progress:' + progress + '%');
}).on('done', () => {
    console.log('Animation completed');
});
```

## API

### fx(element)

Create a new instance by passing a DOM element or selector string:

```javascript
const animation = fx('#foo');
```

### fx#animate(properties[, duration, easing, ...callbacks])

Start an animation by providing an object that maps CSS properties to the value it should be animated to. Optionally provide a duration in milliseconds (defaults to 700), an easing function (defaults to 'ease-in-out-quart'), and one or more callback functions. Returns the `fx` instance:

```javascript
fx('#foo').animate({
    width: 100, // Uses pixels as default CSS unit
    height: '3em', // Explicitly define any CSS unit to use instead
    top: [50, 100], // Provide an array to define the starting point for an animation ([from, to])
    scale: 0.5, // Supports CSS transforms
    scrollLeft: 100, // Supports scrolling
    backgroundColor: '#FF0000', // Supports colors
}, 1000, 'ease-out-circ');
```

### fx#fadeIn([duration, easing, ...callbacks])

Fade an element in. Optionally provide a duration in milliseconds (defaults to 350), an easing function (defaults to 'ease-in-quart'), and one or more callback functions. Returns the `fx` instance:

```javascript
fx('#foo').fadeIn(400, 'ease-in-sine');
```

### fx#fadeOut([duration, easing, ...callbacks])

Fade an element out. Optionally provide a duration in milliseconds (defaults to 350), an easing function (defaults to 'ease-out-quart'), and one or more callback functions. Returns the `fx` instance:

```javascript
fx('#foo').fadeOut(300);
```

### fx#slideIn([direction, duration, easing, ...callbacks])

Slide and fade an element in. Optionally provide a direction (defaults to "top"), a duration in milliseconds (defaults to 350), an easing function (defaults to 'ease-in-quart'), and one or more callback functions. Returns the `fx` instance:

```javascript
fx('#foo').slideIn('left', 600, 'ease-in-out-expo', () => console.log('done'));
```

### fx#slideOut([direction, duration, easing, ...callbacks])

Slide and fade an element out. Optionally provide a direction (defaults to "bottom"), a duration in milliseconds (defaults to 350), an easing function (defaults to 'ease-out-quart'), and one or more callback functions. Returns the `fx` instance:

```javascript
fx('#foo').slideOut('right');
```

### fx#move(x, y[, duration, easing, ...callbacks])

Move an element via the `translateX` and `translateY` CSS transform properties. Optionally provide a duration in milliseconds (defaults to 350), an easing function (defaults to 'ease-in-out-quart'), and one or more callback functions. Returns the `fx` instance:

```javascript
fx('#foo').move(100, '5em');
```

### fx#scale(percent[, duration, easing, ...callbacks])

Scale an element up or down by percentage via the `scale` CSS transform property. Optionally provide a duration in milliseconds (defaults to 350), an easing function (defaults to 'ease-in-out-quart'), and one or more callback functions. Returns the `fx` instance:

```javascript
fx('#foo').scale(150);
```

### fx#highlight([color, property, duration, easing, ...callbacks])

Highlight an element by flashing a color. Optionally provide the color in RGB or hex format (defaults to "#ffff9c"), the color property to animate (defaults to `backgroundColor`), a duration in milliseconds (defaults to 700), an easing function (defaults to 'ease-in-out-quart'), and one or more callback functions. Returns the `fx` instance:

```javascript
fx('#foo').highlight('#FF0000', 'color');
```

### fx#then(fn)

Add a callback function to the currently running animation or the last animation in the queue:

```javascript
fx('#foo').fadeIn().then(() => {
    console.log('done'); 
});
```

### fx#stop(fn)

Stop the currently running animation:

```javascript
fx('#foo').fadeIn().stop();
```

### fx#on(name, fn)

Subscribe a callback function to one of the custom events:

```javascript
const animation = fx(element);

animation.on('start', () => {
    console.log('Animation started');
});

animation.on('tick', (progress, frame) => {
    console.log('Animation progress:' + progress + '%');
});

animation.on('done', () => {
    console.log('Animation completed');
});
```

### fx#clear()

Clear the animation queue:

```javascript
fx('#foo').fadeIn().fadeOut().clear();
```

## Installation

fx is [CommonJS](http://www.commonjs.org/) and [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) compatible with no dependencies. You can download the [development](http://github.com/ryanmorr/fx/raw/master/dist/fx.js) or [minified](http://github.com/ryanmorr/fx/raw/master/dist/fx.min.js) version, or install it in one of the following ways:

``` sh
npm install ryanmorr/fx

bower install ryanmorr/fx
```

## License

This project is dedicated to the public domain as described by the [Unlicense](http://unlicense.org/).