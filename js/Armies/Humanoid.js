import MovementComponent from './MovementComponent.js';

export default class Humanoid extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, army) {
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);

        this.army = army;

        const config = this.army.getConfig();
        this.speed = config.speed;
        this.animKey = config.animKey;
        this.team = config.team;

        this.state = 'Moving';
        this.previousState = 'Idle';

        if (this.team) this.lastDirection = 'left';
        else this.lastDirection = 'right';

        // Calcula un desplazamiento de origen de 20 pixeles que es donde tenemos la cabeza del soldado
        // y donde queremos que rote
        this.originRight = 1 - 20 / this.width;
        this.originLeft = 20 / this.width;

        this.movementComponent = new MovementComponent(this, this.speed);
    }

    #setState(newState){
        this.previousState = this.state;
        this.state = newState;
    }

    setOrder(newState){ // añadir un delay y una cola de ordenes, este es el unico metodo que puede usar army, el resto deberian ser privados
        this.setState(newState); //recuerdo, hacer esto con la cola de ordenes
    }

    moveTo(targetX, targetY) {
        console.log("MOVETO");
        this.movementComponent.moveTo(targetX, targetY);
        this.setOrder('Moving');
    }

    // Metodo de movimiento hacia la target position
    #movement() {
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
            this.setState('Idle');
            return;
        } else {
            const directionX = this.movementComponent.getDirectionX();

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
    #attack() {
        // Debo hacer que se turnen entre el idle con tiempo random y el shoot.

    }

    #manageAnims() {
        // Hacemos play solo cuando el estado se ha actualizado
        if (this.state !== this.previousState) {
            this.previousState = this.state;
            this.play(this.animKey + this.state);
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        switch (this.state) {
            case 'Idle':
                //if (this.movementComponent.getTargetPosition != null) this.setState('Moving');
                break;

            case 'Moving':
                this.#movement();
                break;

            case 'ClimbingUp':

                break;
            case 'ClimbingDown':

                break;

            case 'Attacking':
                this.#attack();
                break;
            case 'Fleeing':

                break;
        }
        this.#manageAnims();
    }
}
