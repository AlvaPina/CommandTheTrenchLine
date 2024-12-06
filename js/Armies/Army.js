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

        this.SoldierHealth = config.SoldierHealth;
        this.numberOfSoldiers = config.NumberOfSoldiers;
        this.ArmySpeed = config.ArmySpeed;
        this.Team = config.ArmyTeam;
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

        //Movimiento
        this.movementComponent = new MovementComponent(this, this.ArmySpeed);

        // Crear la imagen de fondo, texto y barra
        this.background = this.scene.add.image(0, 0, this.ArmyAnimKey + 'Image').setOrigin(0.5, 0.5);
        this.background.setDisplaySize(100, 100);
        this.armyText = this.scene.add.text(0, -30, '1', {
            fontSize: '32px',
            color: '#fff'
        }).setOrigin(0.5, 0.5);
        this.lifeRectagle = this.scene.add.rectangle(0, 0, 100, 30, 0x00f000);

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
        this.state = newState;
    }

    // Ejecutar una accion con un retraso aleatorio
    executeWithRandomDelay(action) {
        const randomDelay = getRandomInt(0, 800);
        setTimeout(action, randomDelay);
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
            this.executeWithRandomDelay(() => {
                soldier.setOrder(newOrder)
            });
        });
    }

    ArmyMoveTo(targetX) {
        this.soldiers.forEach(soldier => {
            this.executeWithRandomDelay(() => {
                soldier.moveTo(targetX, soldier.y);
            });
        });
    }

    // Metodo para ver la distancia de las armies enemigas
    CheckObjective() {
        let objetivo = false;
        this.scene.getArmies(this.Team).forEach((army) => {
            if (Math.abs(army.x - this.x) <= 200) {
                if (this.movementComponent.getDirectionX() > 0 && army.x - this.x > 0) {
                    objetivo = true;
                }
                else if (this.movementComponent.getDirectionX() < 0 && army.x - this.x < 0) {
                    objetivo = true;
                }
            }
        });
        return objetivo;
    }

    // Reagrupa los soldados para rellenar posiciones de soldados muertos, se usara cuando lleguen a la trinchera
    groupArmy() {

    }

    // Modificar vida del ejercito, puede restar quitar vida tambien
    addHealth(amount) {
        this.lifeComponent.addHealth(amount);
    }

    getConfig() {
        return {
            speed: this.ArmySpeed,
            animKey: this.ArmyAnimKey,
            team: this.Team,
        };
    }

    getArmyState() {
        return this.state;
    }
    // Actualiza lo necesario al entrar a un estado por primera vez
    onEnterState() {
        if (this.state !== this.previousState) {
            this.previousState = this.state;

            if (this.state == 'Idle' || this.state == 'Attacking') {
                const direction = this.team ? 1 : -1;
                this.movementComponent.setDirection(direction);
            }
            else if (this.state == 'Moving'){
                
            }
        }
    }
    updateState(){
        if (this.canChange) {
            this.canChange = false;
            if (this.CheckObjective()) {
                console.log("CheckObjective");
                this.setState('InCombat');
                this.ArmyOrder('Attacking');
            }
            else if (this.movementComponent.getTargetPosition() != null) { // Comprobar si TargetPosition esta en direccion a la base y entonces ahi si, retroceder
                console.log("Moving");
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
        this.updateState()
        this.onEnterState();
        
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
