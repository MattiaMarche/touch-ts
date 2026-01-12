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

const touchScreen = new TouchScreen();
```

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
