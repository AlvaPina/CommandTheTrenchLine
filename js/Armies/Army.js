import LifeComponent from './LifeComponent.js';

import { getRandomInt, delay } from '../utils.js';
import Humanoid from './Humanoid.js';

export default class Army {
    constructor(scene, xPos, ArmyClass) {
        this.scene = scene;
        this.soldiers = []; // Contiene los soldados del army

        const config = ArmyClass.getConfig();

        this.ArmyHealth = config.ArmyHealth;
        this.numberOfSoldiers = config.NumberOfSoldiers;
        this.ArmySpeed = config.ArmySpeed;
        this.ArmyAnimKey = config.ArmyAnimKey;
        
        this.lifeComponent = new LifeComponent(this.ArmyHealth, this);

        // Definir los limites del area vertical para los soldados
        const minY = 40;
        const maxY = window.game.config.height - 40;

        // Calcular el espacio total disponible
        const totalHeight = maxY - minY;

        // Calcular el espaciado uniforme entre soldados
        const minSpacing = totalHeight / this.numberOfSoldiers;
        console.log(window.game.config.height);
        console.log(minSpacing);

        // Variacion maxima en la posicion Y segun el numero de soldados
        const maxVariation = Math.max(1, minSpacing/2);

        // Crear los humanoids con espaciado uniforme y luego añadir variacion
        for (let i = 0; i < this.numberOfSoldiers; i++) {
            let x = xPos;
            let y = minY + i * minSpacing;

            y += getRandomInt(1, maxVariation);

            let soldier = new Humanoid(scene, x, y, this.ArmySpeed, this.ArmyAnimKey);
            soldier.setDepth(y);
            soldier.setScale(0.25);
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
        this.soldiers.forEach(soldier => {
            this.executeWithRandomDelay(() => {
                soldier.moveTo(soldier.x + movementX, soldier.y);
            });
        });
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
    groupArmy(){

    }
    
    // Modificar vida del ejercito, puede restar quitar vida tambien
    addHealth(amount) {
        this.lifeComponent.addHealth(amount);
    }

    preUpdate(t, dt) {
        this.soldiers.forEach(soldier => {
            soldier.preUpdate(t, dt);
            soldier.setDepth(soldier.y);
        });
    }
}
