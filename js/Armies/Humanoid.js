import MovementComponent from './Movement/MovementComponent.js';

export default class Humanoid extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, army) {
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);

        this.army = army;

        const config = this.army.getConfig();
        this.speed = config.speed;
        this.team = config.team;
        if (config.team) this.animKey = config.animKey + 'Green';
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
        this.shootKeys = ['gunRifleShoot1', 'gunRifleShoot2', 'gunRifleShoot3', 'gunRifleShoot4', 'gunRifleShoot5'];
        this.shootVolume = 0.2;

        // bind para que en cada loop de la anim de atacar también suene
        this.attackSoundBound = false;

        // pausas entre disparos
        this.attackPauseMinMs = 500;
        this.attackPauseMaxMs = 2000;

        // Variable para guardar el timer de la orden pendiente
        this.timerOrder = null;
    }

    #setState(newState) {
        if (this.state == newState) return;
        if (newState == 'Moving' && !this.movementComponent.targetPosition) return;
        this.state = newState;
        this.#onEnterState();
    }

    setOrder(newState, params) { // añadir un delay y una cola de ordenes, este es el unico metodo que puede usar army, el resto deberian ser privados
        // ponerle prioridades a las acciones
        //console.log("NEW STATE:" + newState);
        if (this.state == 'Dying') return;

        // Esto evita que si das una orden y luego otra rápida, la primera se ejecute tarde y pise a la nueva.
        if (this.timerOrder) {
            this.timerOrder.remove(false);
            this.timerOrder = null;
        }

        this.lastorder = newState;

        // Retraso aleatorio entre 0 y 800 ms
        const randomDelay = Phaser.Math.Between(100, 800);

        // Ejecuta la orden después del retraso
        // Guardamos la referencia del timer
        this.timerOrder = this.scene.time.delayedCall(randomDelay, () => {

            this.timerOrder = null; // Limpiamos referencia al terminar

            if (this.state == 'Dying') return;

            // Si no se dio otra orden diferente no ejecutaremos esta orden porque ya no tiene sentido...
            if (this.lastorder != newState) return;

            if (params) {
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
        if (this.state == 'Dying') return;
        this.setOrder('Moving', [targetX, targetY]);
    }

    isDead() {
        return this.state === 'Dying';
    }

    die() {
        // Cancelar ordenes pendientes al morir, creo que este era el fallo que me envio Toni por correo
        if (this.timerOrder) {
            this.timerOrder.remove(false);
            this.timerOrder = null;
        }
        this.#setState('Dying');
        this.play(this.animKey + this.state);
    }

    // direction puede ser "1" o "-1" y no tiene en cuenta el team
    #soldierOrientationAux(direction) {
        if (direction == 1) {
            this.setFlipX(false);
            this.setOrigin(this.originRight, 0.5);
        }
        else if (direction == -1) {
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

    // reproducir 1 de los 5 sonidos al azar
    #playRandomShoot() {
        const idx = Phaser.Math.Between(0, this.shootKeys.length - 1);
        const key = this.shootKeys[idx];
        this.scene.sound.play(key, { volume: this.shootVolume });
    }

    // Es solo un rasgo visual a excepcion de la generacion de granadas.
    #attack() {

    }

    // Se le llama una vez para que haga: Attacking -> Idle (pausa) -> Attacking
    #attackCycle() {
        if (this.attackSoundBound) return;

        this.on('animationcomplete', (anim) => {
            // Solo si termina la anim de atacar de este sprite
            if (anim.key === (this.animKey + 'Attacking')) {
                // Pasar a Idle un rato alatorio
                const pauseMs = Phaser.Math.Between(this.attackPauseMinMs, this.attackPauseMaxMs);
                this.#setState('Idle');

                // Tras la pausa, volver a Attacking si sigue siendo la orden actual
                this.scene.time.delayedCall(pauseMs, () => {
                    if (this.state !== 'Dying' && this.lastorder === 'Attacking') {
                        this.#setState('Attacking');
                    }
                });
            }
        });

        this.attackSoundBound = true;
    }

    // Actualiza lo necesario al entrar a un estado por primera vez
    #onEnterState() {
        this.play(this.animKey + this.state);

        if (this.state == 'Idle' || this.state == 'Attacking') {
            this.#soldierOrientationAux(this.movementComponent.soldierOrientation("EnemyBase", this.team));
        }
        else if (this.state == 'Moving') {
            this.#movingOrientation()
        }

        if (this.state === 'Attacking') {
            // empezar primera rafaga (suena una vez)
            this.#playRandomShoot();
            // asegurar ciclo (una sola vez)
            this.#attackCycle();
        }

    }
    //Orientarlo hacia la direccion de movimiento que me la da el MovementComponent
    #movingOrientation() {
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
