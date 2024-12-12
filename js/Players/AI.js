export default class AI {
    constructor(scene, armies) {
        this.scene = scene;
        this.armies = armies;
        this.inputDelay = 100; // Cooldown en milisegundos
        this.canInteract = true;
    }

    update() {
        if (this.canInteract) {
            const randomArmy = Phaser.Math.Between(0, this.armies.length - 1);
            const randomDirection = Phaser.Math.Between(0, 1);
            const moveDistance = 400;

            this.canInteract = false;
            if (randomDirection === 0) {
                this.armies[randomArmy].moveArmy(-moveDistance);
            } else {
                this.armies[randomArmy].moveArmy(moveDistance);
            }
            setTimeout(() => this.canInteract = true, this.inputDelay);
        }
    }
}
