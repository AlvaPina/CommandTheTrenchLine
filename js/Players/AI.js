export default class AI {
    constructor(scene) {
        this.scene = scene;
        this.inputDelay = 5000; // Cooldown en milisegundos
        this.canInteract = true;
    }

    update() {
           if (this.canInteract) {
            const armies = this.scene.getArmies(true).filter(a => !a.isDestroyed);
            if (armies.length === 0) return; // Por si no quedan army
            const dir = Phaser.Math.Between(0, 2) === 0 ? 'right' : 'left'; // 33% retroceder (right), 66% avanzar (left)

            // Intenta algunas veces por si el elegido no puede moverse (bloqueo por combate, cooldown, etc.)
            let moved = false;
            for (let i = 0; i < Math.min(3, armies.length); i++) {
                const idx = Phaser.Math.Between(0, armies.length - 1);
                if (armies[idx].moveArmyWithArrows(dir)) {
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
        }
    }
}
