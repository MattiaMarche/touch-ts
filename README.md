# Touch Screen TS

A super light TypeScript library for handling touch events and gestures in web applications, focussed on industrial HDMI displays.

## Quick start

You can use it in any web page:

### Install the module

```bash
npm install @mattiamarchesini/touch-ts
```

### Just use it

- Import the `TouchScreen` class
- Instantiate it once, it will handle scrolling automatically, and you can also use it all around the app

### Initialization

Create a new instance:

```ts
import { TouchScreen } from '@mattiamarchesini/touch-ts';

/**
 * @description Creates a new instance of the class handling touch events on the screen.
 * @param {string} attribute
 * @param {TouchTypes} type
 * @param {TouchTypes} continuous
 * @param {number} minimum
 * @param {number} sensibility
 * @param {number} iterationLimit
 * @param {boolean} isTouch
 * @return {TouchScreen} New instance of this class.
 */
const touchScreen = new TouchScreen();
```

Where parameters are, in order:

- `attribute`: Name of the attribute used to detect if an element is scrollable (true) or not (false).
  IMPORTANT: if null this feature will be replaced by a more complex detection based on the element's scrollability, but this will impact performances negatively.
  If undefined, 'tss' will be used.
  Remember: if an attribute is specified, it must be added to all elements that should be handled by this class.
  Default: 'tss'.
- `type`: Scrolling type, defines if should handle vertical, horizontal or both scrolls.
  Default: `TouchTypes.BOTH`.
- `continuous`: Defines if elements should continue scrolling after the user stops interacting with the screen when the movement had enough speed (true), or not (false).
  Default: true.
- `minimum`: Minimum amount of pixels that should be scrolled to consider a movement continuos (moving after scroll have scroll ends).
  Default: 25.
- `sensibility`: Sensibility of the touch movements, higher values means greater movements.
  IMPORTANT: if this parameter is differet from 1 the page will not follow the finger/mouse exactly, but the movements will be amplified (or reduced) accordingly.
  Default: 1.
- `iterationLimit`: Limits the number of iterations to find a scrollable element when a touch start or mouse down event is triggered.
  Default: 50.
- `isTouch`: Defines if should handle touch events (true) or click events (false).
  If not defined will be detected from browser's data.
  Default: detected from browser's data.

## Technical details

### Performance

This library is built with performance in mind, using efficient algorithms to handle touch events and gestures with minimal latency and no unnecessary events firing.

The bundle size is super light, but it could still be improved since the current version is built to be compatible with older browsers, if you need a lighter version for modern browsers only, please open an issue or a PR.

### Framework agnostic

This library is framework agnostic, so you can use it with any framework you like (React, Vue, Angular, Svelte, etc.) or even with plain JavaScript/TypeScript.


### Demo - Quick start

This repo comes with a fully working demo in `/demo/index.html`, to see it run:

```bash
npm install
npm run demo
```

And open [http://127.0.0.1:5173/demo/](http://127.0.0.1:5173/demo/) in your browser.


## Author

- Name: Mattia
- Surname: Marchesini
- Email: [info@mattiamarchesini.com](info@mattiamarchesini.com)
- Country: Italy


## License

This project is licensed under the **Attribution License (MIT-Style)**.
You are free to use and modify the code, would be really appreciated if you give credit to the original author.

© 2026 [Mattia Marchesini](https://github.com/MattiaMarche)
