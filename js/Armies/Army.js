import LifeComponent from './LifeComponent.js';
import MovementComponent from './MovementComponent.js';

import { getRandomInt, delay } from '../utils.js';
import Humanoid from './Humanoid.js';

export default class Army extends Phaser.GameObjects.Container {
    constructor(scene, xPos, config) {
        super(scene, xPos, 100);
        this.scene = scene;
        this.scene.add.existing(this);

        this.state = 'Idle';

        this.soldiers = []; // Contiene los soldados del army

        this.armyNumber = config.ArmyNumber;
        this.SoldierHealth = config.SoldierHealth;
        this.numberOfSoldiers = config.NumberOfSoldiers;
        this.ArmySpeed = config.ArmySpeed;
        this.Team = config.ArmyTeam; // true es army de jugador
        this.ArmyAnimKey = config.ArmyAnimKey;
        this.x = xPos; this.y = 100;

        this.targetX = xPos;

        //Delays
        this.moveDelay = 1000; // Cooldown en milisegundos
        this.canMove = true;
        this.canChange = true;

        //Vida
        let ArmyHealth = this.SoldierHealth * this.numberOfSoldiers;
        this.lifeComponent = new LifeComponent(ArmyHealth, this);
        this.isDestroyed = false;

        //Movimiento
        this.movementComponent = new MovementComponent(this, this.ArmySpeed);

        // Crear la imagen de fondo, texto y barra
        if (config.ArmyTeam) {
            this.background = this.scene.add.image(0, 0, this.ArmyAnimKey + 'Green').setOrigin(0.5, 0.5);
            this.lifeRectagle = this.scene.add.image(0, 0, 'barGreen').setOrigin(0.5, 0.5).setDisplaySize(100, 50);
        }
        else {
            this.background = this.scene.add.image(0, 0, this.ArmyAnimKey + 'Grey').setOrigin(0.5, 0.5);
            this.lifeRectagle = this.scene.add.image(0, 0, 'barGrey').setOrigin(0.5, 0.5).setDisplaySize(100, 50);
        }
        this.background.setDisplaySize(100, 50);
        this.armyText = this.scene.add.text(20, -5, this.armyNumber, {
            fontSize: '32px',
            color: '#fff'
        }).setOrigin(0.5, 0.5);

        // Agrupar la barra de vida, la imagen y el texto en el contenedor
        this.add([this.background, this.armyText, this.lifeRectagle]);

        // Definir los limites del area vertical para los soldados
        const minY = 250;
        const maxY = window.game.config.height - 40;

        // Calcular el espacio total disponible
        const totalHeight = maxY - minY;

        // Calcular el espaciado uniforme entre soldados
        const minSpacing = totalHeight / this.numberOfSoldiers;

        // Variacion maxima en la posicion Y segun el numero de soldados
        const maxVariation = Math.max(1, minSpacing / 2);

        // Crear los humanoids con espaciado uniforme y luego añadir variacion
        for (let i = 0; i < this.numberOfSoldiers; i++) {
            let x = xPos;
            let y = minY + i * minSpacing;

            y += getRandomInt(1, maxVariation);

            let soldier = new Humanoid(scene, x, y, this);
            soldier.setDepth(y);
            soldier.setScale(0.2);
            this.soldiers.push(soldier);
        }
    }

    setState(newState) {
        //if(this.Team) console.log(newState);
        this.state = newState;
    }

    // Metodo para mover todo el ejercito hacia una posicion objetivo en el eje X
    moveArmy(movementX) {
        if (this.canMove) {
            this.setState('Moving');
            this.canMove = false;
            this.targetX += movementX;
            // Actualizo posicion general de la army
            this.movementComponent.moveTo(this.targetX, this.y);
            // Actualizo la posicion de los soldados
            this.ArmyMoveTo(this.targetX);
            setTimeout(() => {
                this.canMove = true;
            }, this.moveDelay);
        }
    }

    ArmyOrder(newOrder) {
        this.soldiers.forEach(soldier => {
            soldier.setOrder(newOrder)
        });
    }

    ArmyMoveTo(targetX) {
        this.soldiers.forEach(soldier => {
            soldier.moveTo(targetX, soldier.y);
        });
    }

    // Metodo para ver la distancia de las armies enemigas
    CheckObjective() {
        let objetivo = false;
        this.scene.getArmies(this.Team).forEach((army) => {
            if (Math.abs(army.x - this.x) <= 200 && !army.isDestroyed) {
                if (this.movementComponent.getDirectionX() > 0 && army.x - this.x > 0 || this.movementComponent.getDirectionX() < 0 && army.x - this.x < 0) {
                    objetivo = true;
                    army.addHealth(-1);
                }
            }
        });
        return objetivo;
    }

    // Reagrupa los soldados para rellenar posiciones de soldados muertos, se usara cuando lleguen a la trinchera
    groupArmy() {

    }

    // Modificar vida del ejercito
    addHealth(amount) {
        this.lifeComponent.addHealth(amount);
        this.updateHealthBar();
    }

    // Actualiza la escala de la barra de vida en el eje Y
    updateHealthBar() {
        const healthRatio = this.lifeComponent.getRatio();        
        this.lifeRectagle.setDisplaySize(80 * healthRatio, 50);
    }
    

    getConfig() {
        return {
            speed: this.ArmySpeed,
            animKey: this.ArmyAnimKey,
            team: this.Team,
        };
    }

    armyDestroy() {
        console.log("DestroyArmy") + this.Team;
        this.isDestroyed = true;
        if (this.Team) console.log("Retornando NPC Army")
        else console.log("Retornando playerArmy")
        this.scene.getArmies(!this.Team).pop(this.armyNumber)
        this.scene.checkGameOver()
        this.destroy();
    }

    getArmyState() {
        return this.state;
    }
    // Actualiza lo necesario al entrar a un estado por primera vez
    onEnterState() {
        if (this.state !== this.previousState) {
            this.previousState = this.state;

            if (this.state == 'Idle' || this.state == 'Attacking') {
                const direction = this.team ? -1 : 1;
                this.movementComponent.setDirection(direction);
            }
            else if (this.state == 'Moving') {

            }
        }
    }
    updateState() {
        if (this.canChange) {
            this.canChange = false;
            if (this.CheckObjective()) {
                this.setState('InCombat');
                this.ArmyOrder('Attacking');
            }
            else if (this.movementComponent.getTargetPosition() != null) { // Comprobar si TargetPosition esta en direccion a la base y entonces ahi si, retroceder
                //console.log("Moving");
                this.setState('Moving');
                this.ArmyOrder('Moving');
            }
            else {
                this.setState('Idle');
            }
            this.canChange = true;
        }
    }
    preUpdate(t, dt) {
        if(this.isDestroyed) return;
        //console.log(this.state);
        //console.log(this.soldiers.length);
        this.updateState()
        this.onEnterState();
        
        //if(this.Team) console.log(this.movementComponent.getDirectionX());


        switch (this.state) {
            case 'InCombat': // Solo puede recibir la orden de retirarse y de moverse para atras
                break;

            case 'Moving': // Puede recibir todo tipo de ordenes
                this.movementComponent.movement();
                break;

            case 'Idle': // Puede recibir todo tipo de ordenes
                break;

            case 'Fleeing': // No puede recibir ordenes
                // mirar si ha llegado a la base, si ha llegado pasa a estado 'Idle' y por tanto ya se puede mover
                break;
        }
    }
}
