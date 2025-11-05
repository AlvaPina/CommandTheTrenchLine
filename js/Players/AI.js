export default class AI {
    constructor(scene) {
        this.scene = scene;
        this.inputDelay = 10000; // Cooldown en milisegundos
        this.canInteract = true;
    }

    update() {
        if (this.canInteract) {
            const armies = this.scene.getArmies(true).filter(a => !a.isDestroyed);
            if (armies.length === 0) return; // Por si no quedan army
            const dir = Phaser.Math.Between(0, 2) === 0 ? 1 : -1; // 70% avanzar (1), 30% retroceder (-1)
            const moveDistance = 400 * dir;

            // Intenta algunas veces por si el elegido no puede moverse (bloqueo por combate, cooldown, etc.)
            let moved = false;
            for (let i = 0; i < Math.min(3, armies.length); i++) {
                const idx = Phaser.Math.Between(0, armies.length - 1);
                if (armies[idx].moveArmy(moveDistance)) {
                    moved = true;
                    break;
                }
            }

            // Solo ponemos cooldown si realmente se ejecutó una orden
            if (moved) {
                this.canInteract = false;
                this.scene.time.delayedCall(this.inputDelay, () => {
                    this.canInteract = true;
                });
            }
            setTimeout(() => this.canInteract = true, this.inputDelay);
        }
    }
}
