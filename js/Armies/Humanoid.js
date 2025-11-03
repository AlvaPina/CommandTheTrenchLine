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

        if (this.team) this.lastDirection = 'left';
        else this.lastDirection = 'right';

        // Calcula un desplazamiento de origen de 20 pixeles que es donde tenemos la cabeza del soldado
        // y donde queremos que rote
        this.originRight = 1 - 20 / this.width;
        this.originLeft = 20 / this.width;

        this.movementComponent = new MovementComponent(this, this.speed);

        //Sounds
        this.gunShootSound = this.scene.sound.add('gunRifleShoot');
        this.gunShootSound.setVolume(0.03);
    }

    #setState(newState) {
        if (this.state == newState) return;
        if(newState == 'Moving' && !this.movementComponent.targetPosition) return;
        this.state = newState;
        this.#onEnterState();
    }

    setOrder(newState,params) { // añadir un delay y una cola de ordenes, este es el unico metodo que puede usar army, el resto deberian ser privados
        // ponerle prioridades a las acciones
        //console.log("NEW STATE:" + newState);
        if(this.state == 'Dying') return;

        this.lastorder = newState;

        // Retraso aleatorio entre 0 y 800 ms
        const randomDelay = Phaser.Math.Between(100, 800);
        
        // Ejecuta la orden después del retraso
        this.scene.time.delayedCall(randomDelay, () => {
            if(this.state == 'Dying') return;

            // Si no se dio otra orden diferente no ejecutaremos esta orden porque ya no tiene sentido...
            if(this.lastorder != newState) return;

            if(params){
                switch (newState) {
                case 'Idle':
                
                    break;
                case 'Moving':
                    this.movementComponent.moveTo(params[0], params[1]);
                    this.#movingOrientation()
                    break;
                case 'Attacking':
                    break;
                case 'Dying':
                    break;
                case 'ClimbingUp':
                    break;
                case 'ClimbingDown':
                    break;
                }
            }
            this.#setState(newState);
            //if(this.team) console.log("Cambio Estado: " + newState);

        });
    }

    moveTo(targetX, targetY) {
        if(this.state == 'Dying') return;
        this.setOrder('Moving', [targetX, targetY]);
    }

    die() {
        this.#setState('Dying');
        this.play(this.animKey + this.state);
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
            this.#setState('Idle');
        }
    }

    // Es solo un rasgo visual a excepcion de la generacion de granadas.
    #attack() {
        if (!this.gunShootSound.isPlaying) {
            this.gunShootSound.play();
        }
    }
    // Actualiza lo necesario al entrar a un estado por primera vez
    #onEnterState() {
        if(this.team) console.log("Anim: " + this.animKey + this.state)
        this.play(this.animKey + this.state);

        if (this.state == 'Idle' || this.state == 'Attacking') {
            this.#soldierOrientationAux(this.movementComponent.soldierOrientation("EnemyBase", this.team));
        }
        else if (this.state == 'Moving'){
            this.#movingOrientation()
        }
    }
    //Orientarlo hacia la direccion de movimiento que me la da el MovementComponent
    #movingOrientation(){
        //if(this.team) console.log(this.movementComponent.getDirectionX());
        this.#soldierOrientationAux(this.movementComponent.getDirectionX());
    }

    preUpdate(time, delta) {
        //if(this.team) console.log("Estado Actual: " + this.state);
        super.preUpdate(time, delta);

        switch (this.state) {
            case 'Idle':
                break;
            case 'Moving':
                this.#movement();
                break;
            case 'Attacking':
                this.#attack();
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
