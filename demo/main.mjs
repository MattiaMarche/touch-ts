/**
 * Build your lib first: `npm run build` (or `pnpm build`), then serve this folder with a local server.
 */
import { TouchScreen } from '../dist/index.mjs';

// For each box add a click event
document.querySelectorAll( '.box' ).forEach( ( box ) => {
    box.addEventListener( 'click', () => {
        console.log( '[Box] Info: you clicked box:', box );
    });
});

// Create a new TouchScreen instance
const touchScreen = new TouchScreen( undefined, undefined, true );
