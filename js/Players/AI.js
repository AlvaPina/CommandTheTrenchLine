export default class AI {
    constructor(scene) {
        this.scene = scene;
        this.inputDelay = 10000; // Cooldown en milisegundos
        this.canInteract = true;
    }

    update() {
        if (this.canInteract) {
            this.armies = this.scene.getArmies(true);
            const randomArmy = Phaser.Math.Between(0, this.armies.length - 1);
            if(this.armies.length === 0) return; // Por si no quedan army
            const randomDirection = Phaser.Math.Between(0, 2);
            const moveDistance = 400;

            this.canInteract = false;
            if (randomDirection === 0) {
                this.armies[randomArmy].moveArmy(moveDistance);
            } else {
                this.armies[randomArmy].moveArmy(-moveDistance);
            }
            setTimeout(() => this.canInteract = true, this.inputDelay);
        }
    }
}
