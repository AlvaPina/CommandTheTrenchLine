import MovementComponent from './MovementComponent.js';

export default class Humanoid extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, speed, animKey) {
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);

        this.targetPosition = null;
        this.lastDirection = 'right';

        this.speed = speed;
        this.animKey = animKey;

        this.currentAnim = this.animKey + 'Idle';
        this.previousAnim = this.animKey + 'Idle';

        this.setOrigin(0.3,0.5);
        this.xImageOffsetRight = this.displayOriginX + 100;
        this.xImageOffsetLeft = this.displayOriginX + 50;

        this.movementComponent = new MovementComponent(this, speed);
    }

    moveTo(targetX, targetY){
        this.movementComponent.moveTo(targetX, targetY);
        this.currentAnim = this.animKey + 'Run';
    }

    // Metodo de movimiento hacia la target position
    movement() {
        this.movementComponent.movement();
        if (!this.movementComponent.targetPosition) {  // Si el objetivo se alcanzo
            if (this.lastDirection === 'left') {
                this.setFlipX(false);
                this.lastDirection = 'right';
                this.setDisplayOrigin(this.xImageOffsetLeft, this.displayOriginY);
            }
            this.currentAnim = this.animKey + 'Idle';
            return;
        } else {
            // Control de orientacion
            const distanceX = this.movementComponent.targetPosition.x - this.x;
            const directionX = distanceX / Math.abs(distanceX);

            if (directionX > 0 && this.lastDirection !== 'right') {
                this.setFlipX(false);
                this.lastDirection = 'right';
                this.setDisplayOrigin(this.xImageOffsetLeft, this.displayOriginY);
            } else if (directionX < 0 && this.lastDirection !== 'left') {
                this.setFlipX(true);
                this.lastDirection = 'left';
                this.setDisplayOrigin(this.xImageOffsetRight, this.displayOriginY);
            }
        }
    }

    // Es solo un rasgo visual a excepcion de la generacion de granadas.
    attack(){

    }

    manageAnims(){
        // Hacemos play solo cuando currentAnim se ha actualizado
        if (this.currentAnim !== this.previousAnim) {
            this.play(this.currentAnim);
            this.previousAnim = this.currentAnim;
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.movement();
        this.manageAnims();
    }
}
