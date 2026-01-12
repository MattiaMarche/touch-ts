/**
 * @description Interface representing the names of touch events.
 * end: Name of the touch end event.
 * move: Name of the touch move event.
 * start: Name of the touch start event.
 */
export interface TouchEventsNames {
    end: string;
    move: string;
    start: string;
};

/**
 * @description Enum representing different types of touch interactions.
 * HORIZONTAL: Represents horizontal touch movements.
 * VERTICAL: Represents vertical touch movements.
 * BOTH: Represents both horizontal and vertical touch movements.
 * @enum {number}
 */
export enum TouchTypes {
    HORIZONTAL = 0,
    VERTICAL = 1,
    BOTH = 2
};
