/**
 * Keyboard repräsentiert den aktuellen Tastenzustand.
 * Wird vom Input-System genutzt, um Spielerbewegungen zu steuern.
 */
class Keyboard {

    /**
     * Bewegung nach links aktiv
     */
    LEFT = false;

    /**
     * Bewegung nach rechts aktiv
     */
    RIGHT = false;

    /**
     * Springen / nach oben
     */
    UP = false;

    /**
     * nach unten / crouch (falls genutzt)
     */
    DOWN = false;

    /**
     * Sprungtaste (z. B. SPACE)
     */
    SPACE = false;

    /**
     * Wurf- / Actiontaste (z. B. D für Bottle throw)
     */
    D = false;
}