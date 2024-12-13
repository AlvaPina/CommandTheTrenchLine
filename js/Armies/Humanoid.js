import MovementComponent from './MovementComponent.js';

export default class Humanoid extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, army) {
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);

        this.army = army;

        const config = this.army.getConfig();
        this.speed = config.speed;
        this.team = config.team;
        if(config.team) this.animKey = config.animKey + 'Green';
        else this.animKey = config.animKey + 'Grey';
        this.state = 'Moving';
        this.previousState = 'Idle';

        if (this.team) this.lastDirection = 'left';
        else this.lastDirection = 'right';

        // Calcula un desplazamiento de origen de 20 pixeles que es donde tenemos la cabeza del soldado
        // y donde queremos que rote
        this.originRight = 1 - 20 / this.width;
        this.originLeft = 20 / this.width;

        this.movementComponent = new MovementComponent(this, this.speed);

        //Sounds
        this.gunShootSound = this.scene.sound.add('gunRifleShoot');
        this.gunShootSound.setVolume(0.1);
    }

    #setState(newState) {
        this.previousState = this.state;
        this.state = newState;
    }

    setOrder(newState) { // añadir un delay y una cola de ordenes, este es el unico metodo que puede usar army, el resto deberian ser privados
        //console.log("NEW STATE:" + newState);
        if(this.state == 'Dying') return;
        this.setState(newState); //recuerdo, hacer esto con la cola de ordenes
    }

    moveTo(targetX, targetY) {
        if(this.state == 'Dying') return;
        this.movementComponent.moveTo(targetX, targetY);
        this.#movingOrientation()
        this.setOrder('Moving');
    }

    die() {
        this.setState('Dying');
        this.play(this.animKey + this.state);
        // eliminarlos después de un tiempo...
    }
    
    // direction puede ser "1" o "-1" y no tiene en cuenta el team
    #soldierOrientationAux(direction){ 
        if(direction == 1){
            this.setFlipX(false);
            this.setOrigin(this.originRight, 0.5);
        }
        else if(direction == -1){
            this.setFlipX(true);
            this.setOrigin(this.originLeft, 0.5);
        }
    }

    // Metodo de movimiento hacia la target position
    #movement() {
        this.movementComponent.movement();
        if (!this.movementComponent.targetPosition) {  // Si el objetivo se alcanzo
            this.setState('Idle');
        }
    }

    // Es solo un rasgo visual a excepcion de la generacion de granadas.
    #attack() {
        if (!this.gunShootSound.isPlaying) {
            this.gunShootSound.play();
        }

        // Debo hacer que se turnen entre el idle con tiempo random y el shoot.

    }
    // Actualiza lo necesario al entrar a un estado por primera vez
    #onEnterState() {
        if (this.state !== this.previousState) {
            this.previousState = this.state;
            this.play(this.animKey + this.state);

            if (this.state == 'Idle' || this.state == 'Attacking') {
                this.#soldierOrientationAux(this.movementComponent.soldierOrientation("EnemyBase", this.team));
            }
            else if (this.state == 'Moving'){
                this.#movingOrientation()
            }
        }
    }
    //Orientarlo hacia la direccion de movimiento que me la da el MovementComponent
    #movingOrientation(){
        //console.log(this.movementComponent.getDirectionX());
        this.#soldierOrientationAux(this.movementComponent.getDirectionX());
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        switch (this.state) {
            case 'Idle':
                this.#onEnterState();
                break;
            case 'Moving':
                this.#movement();
                this.#onEnterState();
                break;
            case 'Attacking':
                this.#attack();
                this.#onEnterState();
                break;
            case 'Dying':
                break;
            case 'ClimbingUp':
                break;
            case 'ClimbingDown':
                break;
        }
    }
}
