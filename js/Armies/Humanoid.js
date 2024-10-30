import MovementComponent from './MovementComponent.js';

export default class Humanoid extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, speed, animKey, team) {
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);

        this.speed = speed;
        this.animKey = animKey;
        this.team = team;
        this.currentAnim = this.animKey + 'Idle';
        this.previousAnim = this.animKey + 'Idle';

        if (this.team) this.lastDirection = 'left';
        else this.lastDirection = 'right';

        // Calcula un desplazamiento de origen de 20 pixeles que es donde tenemos la cabeza del soldado
        // y donde queremos que rote
        this.originRight = 1 - 20 / this.width;
        this.originLeft = 20 / this.width;

        this.movementComponent = new MovementComponent(this, speed);
    }

    moveTo(targetX, targetY) {
        this.movementComponent.moveTo(targetX, targetY);
        this.currentAnim = this.animKey + 'Run';
    }

    // Metodo de movimiento hacia la target position
    movement() {
        this.movementComponent.movement();
        if (!this.movementComponent.targetPosition) {  // Si el objetivo se alcanzo
            if (this.lastDirection === 'left' && this.team) {
                this.setFlipX(false);
                this.setOrigin(this.originRight, 0.5);
                this.lastDirection = 'right';
            }
            else if (this.lastDirection === 'right' && !this.team) {
                this.setFlipX(true);
                this.setOrigin(this.originLeft, 0.5);
                this.lastDirection = 'left';
            }
            this.currentAnim = this.animKey + 'Idle';
            return;
        } else {
            // Control de orientacion
            const distanceX = this.movementComponent.targetPosition.x - this.x;
            const directionX = distanceX / Math.abs(distanceX);

            if (directionX > 0 && this.lastDirection !== 'right') {
                this.setFlipX(false);
                this.setOrigin(this.originRight, 0.5);
                this.lastDirection = 'right';
            } else if (directionX < 0 && this.lastDirection !== 'left') {
                this.setFlipX(true);
                this.setOrigin(this.originLeft, 0.5);
                this.lastDirection = 'left';
            }
        }
    }

    // Es solo un rasgo visual a excepcion de la generacion de granadas.
    attack() {
        this.currentAnim = this.animKey + 'Shoot';
    }

    manageAnims() {
        // Hacemos play solo cuando currentAnim se ha actualizado
        if (this.currentAnim !== this.previousAnim) {
            this.play(this.currentAnim);
            this.previousAnim = this.currentAnim;
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.currentAnim == this.animKey + 'Run') {
            this.movement();
        }
        this.manageAnims();
    }
}
