import { TouchEventsNames, TouchTypes } from "../types/touch-screen";

/**
 * @XAB {namespace: XTS, type: context, name: TouchScreen}
 * @description Class handling touch events on the screen to provide scroll functionalities
 * for scrollable elements.
 */
export class TouchScreen {
    /**
     * STATIC VARIABLES
     */
    /**
     * @description {number} Basic steps taken by a smooth movement to complete itself, modified by the
     * delta time calculated for each movement in this way: delta.time * TouchScreen.MOVEMENT_STEPS.
     */
    private static MOVEMENT_STEPS: number = 20;
    /**
     * @description {number} Milliseconds to wait before setting the scroll event as finished.
     */
    private static STOP_DELAY: number = 1;
    /**
     * @description {number} Multiplier applied to delta time when calculating the speed of a continuous
     * movement.
     */
    private static TIME_MULTIPLIER: number = 0.008;
    /**
     * @description {number} Milliseconds that should pass between two movement changes to consider the
     * movement as interrupted and set its deltas to zero.
     */
    private static ZERO_THRESHOLD: number = 200;


    /**
     * PRIVATE VARIABLES
     */
    /**
     * @description {string} Name of the attribute used to detect if an element is scrollable (true)
     * or not (false).
     * Default: 'tss'.
     */
    private attribute: string;
    /**
     * @description {boolean} Defines if elements should continue scrolling after the
     * user stops interacting with the screen when the movement had enough speed (true), or not (false).
     * Default: true.
     */
    private continuous: boolean;
    /**
     * @description {HTMLElement | null} HTML element that is currently being scrolled.
     * Null if no scrolling is happening.
     */
    private element: HTMLElement | null = null;
    /**
     * @description {TouchEventsNames} Names of the events used to handle user interactions.
     */
    private eventNames: TouchEventsNames;
    /**
     * @description {number} Limits the number of iterations to find a scrollable
     * element when a touch start or mouse down event is triggered.
     * Default: 50.
     */
    private iterationLimit: number;
    /**
     * @description {number} Total last horizontal delta detected of the mouse or touch event.
     * Default: 0.
     */
    private lastDeltaX: number = 0;
    /**
     * @description {number} Total last vertical delta detected of the mouse or touch event.
     * Default: 0.
     */
    private lastDeltaY: number = 0;
    /**
     * @description {number} Timestamp of the last touch end or mouse up event.
     * Default: 0.
     */
    private lastEnd: number = 0;
    /**
     * @description {number} Timestamp of the last touch start or mouse down event.
     * Default: 0.
     */
    private lastStart: number = 0;
    /**
     * @description {number} Last X coordinate detected of the mouse or touch event.
     * Default: 0.
     */
    private lastX: number = 0;
    /**
     * @description {number} Last Y coordinate detected of the mouse or touch event.
     * Default: 0.
     */
    private lastY: number = 0;
    /**
     * @description {number} Minimum amount of pixels that should be scrolled to consider a movement as
     * continuos (moving after scroll have scroll ends).
     */
    private minimum: number = 25;
    /**
     * @description {number} Sensibility of the touch movements, higher values
     * means greater movements.
     * IMPORTANT: if this parameter is differet from 1 the page will not follow the finger/mouse
     * exactly, but the movements will be amplified (or reduced) accordingly.
     * Default: 1.
     */
    private sensibility: number = 1;
    /**
     * @description {boolean} Additional flag to detect if the user is currently scrolling.
     * Default: false.
     */
    private scrolling: boolean = false;
    /**
     * @description {any} Interval object used for smooth scrolling (for continuous scroll).
     * Default: null.
     */
    private scrollInterval: any = null;
    /**
     * @description {any} Timeout used to posticipate the end of the scroll, to prevent errors in
     * its detection.
     * Default: null.
     */
    private stopTimeout: any = null;
    /**
     * @description {TouchTypes} Scrolling type, defines if should handle vertical, horizontal or both scrolls.
     * Default: TouchTypes.BOTH.
     */
    private type: TouchTypes;
    /**
     * @description {number} Total space in pixels scrolled in the last movement.
     * Aggregates horizontal and vertical movements.
     * Default: 0.
     */
    private totalDelta: number = 0;


    /**
     * CONSTRUCTOR AND HOOKS
     */

    /**
     * @XAB {namespace: XTS, type: context, name: TouchScreen}
     * @description Creates a new instance of the class handling touch events on the screen.
     * @param {string | null} attribute (Optional) Name of the attribute used to detect if an element is
     * scrollable (true) or not (false).
     * IMPORTANT: if null this feature will be replaced by a more complex detection based on the
     * element's scrollability, but this will impact performances negatively.
     * If undefined, 'tss' will be used.
     * If starts with "." or "#" it will be considered as a class or id selector respectively,
     * and the attribute name will be extracted from it.
     * Remember: if an attribute is specified, it must be added to all elements that should be handled by this class.
     * Default: 'tss'.
     * @param {TouchTypes} type (Optional) Scrolling type, defines if should handle vertical, horizontal
     * or both scrolls.
     * Default: TouchTypes.BOTH.
     * @param {TouchTypes} continuous (Optional) Defines if elements should continue scrolling after the
     * user stops interacting with the screen when the movement had enough speed (true), or not (false).
     * Default: true.
     * @param {number} minimum (Optional) Minimum amount of pixels that should be scrolled to consider
     * a movement continuos (moving after scroll have scroll ends).
     * Default: 25.
     * @param {number} sensibility (Optional) Sensibility of the touch movements, higher values
     * means greater movements.
     * IMPORTANT: if this parameter is differet from 1 the page will not follow the finger/mouse
     * exactly, but the movements will be amplified (or reduced) accordingly.
     * Default: 1.
     * @param {number} iterationLimit (Optional) Limits the number of iterations to find a scrollable
     * element when a touch start or mouse down event is triggered.
     * Default: 50.
     * @param {boolean} isTouch (Optional) Defines if should handle touch events (true) or click events (false).
     * If not defined will be detected from browser's data.
     * @return {TouchScreen} New instance of this class.
     */
    constructor ( attribute?: string | null, type?: TouchTypes, continuous?: boolean, minimum?: number, sensibility?: number, iterationLimit?: number, isTouch?: boolean ) {
        if ( typeof continuous === 'undefined' ) {
            this.continuous = true;
        } else {
            this.continuous = continuous;
        }
        if ( typeof type === 'undefined' ) {
            this.type = TouchTypes.BOTH;
        } else {
            this.type = type;
        }
        switch ( this.type ) {
            case TouchTypes.HORIZONTAL:
                this.scrollBy = ( x: number, y: number ) => {
                    // This method can be called only when an element is set.
                    ( this.element as HTMLElement ).scrollLeft += this.getDelta( x );
                };
                break;
            case TouchTypes.VERTICAL:
                this.scrollBy = ( x: number, y: number ) => {
                    // This method can be called only when an element is set.
                    ( this.element as HTMLElement ).scrollTop += this.getDelta( y );
                };
                break;
            default:
                break;
        }
        if ( typeof attribute === 'undefined' ) {
            this.attribute = 'tss';
        } else {
            if ( attribute === null ) {
                console.warn( '[TouchScreen] Warning: attribute set to null, using scrollability detection which could impact performances.' );
                this.isScrollable = ( element: HTMLElement ): boolean => {
                    const scrollability = this.getScrollability( element );
                    if ( this.type === TouchTypes.BOTH ) {
                        return scrollability.x || scrollability.y;
                    }
                    if ( this.type === TouchTypes.HORIZONTAL ) {
                        return scrollability.x;
                    }
                    return scrollability.y;
                }
                this.attribute = '';
            } else if ( attribute.startsWith( '.' ) ) {
                this.attribute = attribute.substring( 1 );
                this.isScrollable = ( element: HTMLElement ): boolean => {
                    return element.classList.contains( this.attribute );
                };
            } else if ( attribute.startsWith( '#' ) ) {
                this.attribute = attribute.substring( 1 );
                this.isScrollable = ( element: HTMLElement ): boolean => {
                    return element.id === this.attribute;
                };
            } else {
                this.attribute = attribute;
            }
        }
        if ( typeof minimum !== 'undefined' ) {
            this.minimum = minimum;
        }
        if ( typeof sensibility !== 'undefined' ) {
            this.sensibility = sensibility;
            if ( this.sensibility !== 1 ) {
                this.getDelta = ( value: number ): number => value * this.sensibility;
            }
        }
        if ( typeof iterationLimit === 'undefined' ) {
            this.iterationLimit = 50;
        } else {
            this.iterationLimit = iterationLimit;
        }
        if ( typeof isTouch === 'undefined' ) {
            // @ts-ignore
            isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
        }
        if ( isTouch ) {
            this.eventNames = {
                end: 'touchend',
                move: 'touchmove',
                start: 'touchstart'
            };
            this.getX = ( event: TouchEvent ) => event.touches[0].clientX;
            this.getY = ( event: TouchEvent ) => event.touches[0].clientY;
        } else {
            this.eventNames = {
                end: 'mouseup',
                move: 'mousemove',
                start: 'mousedown'
            };
            this.getX = ( event: MouseEvent ) => event.clientX;
            this.getY = ( event: MouseEvent ) => event.clientY;
        }
        this.addEvents();
        this.preventSelection();
    }


    /**
     * STATIC METHODS
     */


    /**
     * PRIVATE METHODS
     */

    private addEvents() {
        window.addEventListener( this.eventNames.end, this.onEnd.bind( this ) );
        window.addEventListener( this.eventNames.start, this.onStart.bind( this ) );
    }

    private addMoveEvent() {
        window.addEventListener( this.eventNames.move, this.onMove.bind( this ) );
    }

    /**
     * @description (Overwritable) Applies the sensibility factor to the given value.
     * Should be overwritten in the constructor if a sensibility different from 1 is set.
     * @param {number} value Value to apply the sensibility factor to.
     * @return {number} Value modified by the sensibility factor.
     */
    private getDelta( value: number ): number {
        return value;
    }

    /**
     * @description (Overwritable) Gets the X coordinate of the mouse or touch event.
     * Should be overwritten in the constructor to assing the correct method accordingly
     * to the handler type (handling touches or clicks).
     * @param {MouseEvent | TouchEvent} event Event triggered.
     * @return {number} X coordinate of mouse or touch event.
     */
    private getX( event: MouseEvent | TouchEvent ): number {
        return 0;
    }

    /**
     * @description (Overwritable) Gets the Y coordinate of the mouse or touch event.
     * Should be overwritten in the constructor to assing the correct method accordingly
     * to the handler type (handling touches or clicks).
     * @param {MouseEvent | TouchEvent} event Event triggered.
     * @return {number} Y coordinate of mouse or touch event.
     */
    private getY( event: MouseEvent | TouchEvent ): number {
        return 0;
    }

    private onEnd( event: Event ) {
        this.removeMoveEvent();
        if ( this.totalDelta < this.minimum ) {
            this.element = null;
            this.scrolling = false;
            return;
        }
        event.preventDefault();
        if ( this.continuous ) {
            this.lastEnd = event.timeStamp;
            const delta = {
                time: ( this.lastEnd - this.lastStart ) * TouchScreen.TIME_MULTIPLIER,
                x: 0,
                y: 0
            };
            if ( this.lastDeltaX !== 0 ) {
                delta.x = this.lastDeltaX / delta.time;
            }
            if ( this.lastDeltaY !== 0 ) {
                delta.y = this.lastDeltaY / delta.time;
            }
            // @ts-ignore
            this.smoothScrollBy( this.element, delta.x, delta.y, TouchScreen.MOVEMENT_STEPS / delta.time );
            this.lastDeltaX = 0;
            this.lastDeltaY = 0;
        }
        if ( this.stopTimeout !== null ) {
            clearTimeout( this.stopTimeout );
        }
        this.scrolling = false;
        this.stopTimeout = setTimeout( () => {
            clearTimeout( this.stopTimeout );
            this.element = null;
            this.scrolling = false;
        }, TouchScreen.STOP_DELAY );
    }

    private onMove( event: Event ) {
        if ( this.element === null ) {
            return;
        }
        event.preventDefault();
        const coordinates = this.getCoordinates( event );
        const delta = {
            x: this.lastX - coordinates.x,
            y: this.lastY - coordinates.y
        };
        this.scrollBy( delta.x, delta.y );
        this.lastX = coordinates.x;
        this.lastY = coordinates.y;
        this.totalDelta += Math.abs( delta.x ) + Math.abs( delta.y );
        if ( this.totalDelta > this.minimum ) {
            this.scrolling = true;
            if ( this.continuous ) {
                if ( ( event.timeStamp - this.lastStart ) > TouchScreen.ZERO_THRESHOLD ) {
                    this.lastDeltaX = 0;
                    this.lastDeltaY = 0;
                    this.lastStart = event.timeStamp;
                } else {
                    this.lastDeltaX += this.getDelta( delta.x );
                    this.lastDeltaY += this.getDelta( delta.y );
                }
            }
        }
    }

    private onStart( event: Event ) {
        this.element = this.findScrollable( event.target as HTMLElement, 0 );
        if ( this.element === null ) {
            return;
        }
        this.totalDelta = 0;
        if ( this.continuous ) {
            this.lastStart = event.timeStamp;
        }
        this.setCoordinates( event );
        this.addMoveEvent();
    }

    private preventSelection() {
        const style = document.createElement( 'style' );
        style.innerHTML = `
            * {
                user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
                -moz-user-select: none;
            }
        `;
        document.head.appendChild(style);
    }

    private removeMoveEvent() {
        window.removeEventListener( this.eventNames.move, this.onMove.bind( this ) );
    }

    /**
     * @description (Overwritable) Scrolls by the given amounts of pixel.
     * Should be overwritten in the constructor to assing the correct method accordingly
     * to the scroll type (horizontal, vertical or both).
     * @param {number} x Amout of horizontal pixels to scroll.
     * @param {number} y Amout of vertical pixels to scroll.
     */
    private scrollBy( x: number, y: number ) {
        // Ignore next two TS checks since this method will be called only when an element is set.
        // @ts-ignore
        this.element.scrollLeft += this.getDelta( x );
        // @ts-ignore
        this.element.scrollTop += this.getDelta( y );
    }

    private setCoordinates( event: Event ) {
        this.lastX = this.getX( event as MouseEvent | TouchEvent );
        this.lastY = this.getY( event as MouseEvent | TouchEvent );
    }

    private smoothScrollBy( element: HTMLElement, x: number, y: number, time: number ) {
        if ( this.scrollInterval !== null ) {
            clearInterval( this.scrollInterval );
        }
        const delta = {
            x: x,
            y: y
        };
        let count = 0;
        this.scrollInterval = setInterval( () => {
            if ( element === null ) {
                clearInterval( this.scrollInterval );
                return;
            }
            let value = 0;
            if ( Math.abs( delta.x ) > 1 && this.type !== TouchTypes.VERTICAL ) {
                value = delta.x / time;
                element.scrollLeft += value;
                delta.x -= value;
            }
            if ( Math.abs( delta.y ) > 1 && this.type !== TouchTypes.HORIZONTAL ) {
                value = delta.y / time;
                element.scrollTop += delta.y / time;
                delta.y -= value;
            }
            count++;
            if ( count >= time ) {
                clearInterval( this.scrollInterval );
            }
        }, 10 );
    }


    /**
     * METHODS
     */

    /**
     * @XAB {namespace: XTS, context: TouchScreen, type: method, name: findScrollable}
     * @description Finds the nearest scrollable element starting from the specified element and
     * searching all parent elements.
     * The search will stop when examinated a number of elements equal to the iteration limit set in
     * this instance.
     * The iteration parameter should be set to 0 when calling this method.
     * If the iteration parameter will be greater than zero the search will stop earlier.
     * @param {HTMLElement | null} startElement Element to start the search from.
     * @param {number} iteration Current iteration index, should be zero when calling this method.
     * If the iteration parameter will be greater than zero the search will stop earlier.
     * @return {HTMLElement | null} Scrollable element found, null if not found.
     */
    public findScrollable( startElement: HTMLElement | null, iteration: number ): HTMLElement | null {
        if ( startElement === null ) {
            return null;
        }
        if ( this.isScrollable( startElement ) ) {
            return startElement;
        }
        if ( iteration > this.iterationLimit ) {
            return null;
        }
        return this.findScrollable( startElement.parentElement, iteration + 1 );
    }

    /**
     * @XAB {namespace: XTS, context: TouchScreen, type: method, name: getCoordinates}
     * @description Gets the coordinates from an event.
     * Will be adjusting when this instance is created to be optimized for touch or mouse events,
     * depending on the constructor's parameters or the browser's data.
     * @param {Event} event Event to get the coordinates from.
     * @return {{ x: number; y: number; }} Touch or mouse event's coordinates.
     */
    public getCoordinates( event: Event ): { x: number; y: number; } {
        return {
            x: this.getX( event as MouseEvent | TouchEvent ),
            y: this.getY( event as MouseEvent | TouchEvent )
        };
    }

    /**
     * @XAB {namespace: XTS, context: TouchScreen, type: method, name: getScrollability}
     * @description Returns the scrollability of the specified element in both axis.
     * @param {Element} element Element to check.
     * @return {{ x: boolean; y: boolean; }} Object containing the scrollability in both axis.
     */
    public getScrollability ( element: Element ): { x: boolean; y: boolean; } {
        if ( !( element instanceof HTMLElement ) ) {
          return { x: false, y: false };
        }
        const cs = getComputedStyle( element );
        const overflowXAllows: boolean =
          cs.overflowX === "auto" || cs.overflowX === "scroll" || cs.overflowX === "overlay";
        const overflowYAllows: boolean =
          cs.overflowY === "auto" || cs.overflowY === "scroll" || cs.overflowY === "overlay";
        const x = overflowXAllows && element.scrollWidth > element.clientWidth + 1;
        const y = overflowYAllows && element.scrollHeight > element.clientHeight + 1;
        return { x, y };
    }

    /**
     * @XAB {namespace: XTS, context: TouchScreen, type: method, name: isScrollable}
     * @description Returns if the specified element is considered as scrollable by this instance.
     * @param {HTMLElement} element Element to check.
     * @return {boolean} True if scrollable, false otherwise.
     */
    public isScrollable( element: HTMLElement ): boolean {
        return element.hasAttribute( this.attribute );
    }

    /**
     * @XAB {namespace: XTS, context: TouchScreen, type: method, name: isScrolling}
     * @description Returns if this instance is currently handling a scroll event.
     * Smooth scrollings performing after the user stops interacting are not considered scrolling
     * events.
     * @return {boolean} True if this instance is handling a scroll event, false otherwise.
     */
    public isScrolling(): boolean {
        return this.scrolling && this.element !== null;
    }
}
