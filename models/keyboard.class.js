/**
 * Simple keyboard state holder used by the input system to control player movement.
 */
class Keyboard {

    /** Movement left pressed */
    LEFT = false;

    /** Movement right pressed */
    RIGHT = false;

    /** Jump / up pressed */
    UP = false;

    /** Down / crouch pressed (if used) */
    DOWN = false;

    /** Jump key (e.g. SPACE) */
    SPACE = false;

    /** Throw/action key (e.g. D for bottle throw) */
    D = false;
}