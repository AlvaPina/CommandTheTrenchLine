import LifeComponent from './LifeComponent.js';
import MovementComponent from './MovementComponent.js';

import { getRandomInt, delay } from '../utils.js';
import Humanoid from './Humanoid.js';

export default class Army extends Phaser.GameObjects.Container{
    constructor(scene, xPos, config) {
        super(scene, xPos, 100);
        this.scene = scene;
        this.scene.add.existing(this);

        this.soldiers = []; // Contiene los soldados del army

        this.ArmyHealth = config.ArmyHealth;
        this.numberOfSoldiers = config.NumberOfSoldiers;
        this.ArmySpeed = config.ArmySpeed;
        this.team = config.ArmyTeam;
        this.ArmyAnimKey = config.ArmyAnimKey;
        this.x = xPos; this.y = 100;

        //Delays
        this.moveDelay = 1000; // Cooldown en milisegundos
        this.canMove = true;

        this.lifeComponent = new LifeComponent(this.ArmyHealth, this);
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
        const minY = 200;
        const maxY = window.game.config.height - 20;

        // Calcular el espacio total disponible
        const totalHeight = maxY - minY;

        // Calcular el espaciado uniforme entre soldados
        const minSpacing = totalHeight / this.numberOfSoldiers;
        console.log(window.game.config.height);
        console.log(minSpacing);

        // Variacion maxima en la posicion Y segun el numero de soldados
        const maxVariation = Math.max(1, minSpacing / 2);

        // Crear los humanoids con espaciado uniforme y luego añadir variacion
        for (let i = 0; i < this.numberOfSoldiers; i++) {
            let x = xPos;
            let y = minY + i * minSpacing;

            y += getRandomInt(1, maxVariation);

            let soldier = new Humanoid(scene, x, y, this.ArmySpeed, this.ArmyAnimKey);
            soldier.setDepth(y);
            soldier.setScale(0.2);
            this.soldiers.push(soldier);
        }
    }

    // Ejecutar una accion con un retraso aleatorio
    executeWithRandomDelay(action) {
        const randomDelay = getRandomInt(0, 1000);
        setTimeout(action, randomDelay);
    }

    // Metodo para mover todo el ejercito hacia una posicion objetivo en el eje X
    moveArmy(movementX) {
        if (this.canMove) {
            this.canMove = false;
            let targetX = this.x + movementX;
            // Actualizo posicion general de la army
            this.movementComponent.moveTo(targetX, this.y);
            // Actualizo la posicion de los soldados
            this.soldiers.forEach(soldier => {
                this.executeWithRandomDelay(() => {
                    soldier.moveTo(targetX, soldier.y);
                });
            });
            setTimeout(() => {
                this.canMove = true;
            }, this.moveDelay);
        }
    }

    // Metodo que se usara cuando avisten a un enemigo al que disparar
    ArmyAttack() {
        this.soldiers.forEach(soldier => {
            this.executeWithRandomDelay(() => {
                soldier.attack();
            });
        });
    }

    // Reagrupa los soldados para rellenar posiciones de soldados muertos, se usara cuando lleguen a la trinchera
    groupArmy() {

    }

    // Modificar vida del ejercito, puede restar quitar vida tambien
    addHealth(amount) {
        this.lifeComponent.addHealth(amount);
    }

    preUpdate(t, dt) {
        this.movementComponent.movement();
    }
}
