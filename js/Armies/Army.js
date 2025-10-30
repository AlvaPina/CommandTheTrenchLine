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

    _getNearestEnemyX() {
        const enemies = this.scene.getArmies(this.Team).filter(a => !a.isDestroyed);
        if (enemies.length === 0) return null;

        let nearest = enemies[0];
        let bestDist = Math.abs(enemies[0].x - this.x);

        for (let i = 1; i < enemies.length; i++) {
            const d = Math.abs(enemies[i].x - this.x);
            if (d < bestDist) { bestDist = d; nearest = enemies[i]; }
        }
        return nearest.x;
    }

    _refreshFacingToNearestEnemy() {
        let direction = this.movementComponent.getDirectionX(); // conserva si estamos moviendo

        const nearestEnemyX = this._getNearestEnemyX();
        if (nearestEnemyX != null) {
            const toEnemy = Math.sign(nearestEnemyX - this.x);
            if (toEnemy !== 0) direction = toEnemy;
        }

        // Por defecto si falla
        if (direction == null || direction === 0) {
            direction = this.Team ? 1 : -1;
        }

        this.movementComponent.setDirection(direction);
    }

    _updateOrientation(t) {
        // mantener facing hacia el enemigo más cercano cuando no estoy moviéndome
        if ((this.state === 'Idle' || this.state === 'InCombat') && t >= this._nextFacingAt) {
            this._refreshFacingToNearestEnemy();
            this._nextFacingAt = t + this.facingRefreshCooldownMs;
        }
    }

    getArmyState() {
        return this.state;
    }
    // Actualiza lo necesario al entrar a un estado por primera vez
    onEnterState() {
        if (this.state !== this.previousState) {
            this.previousState = this.state;

            if (this.state === 'InCombat') {
                // Ordena atacar una única vez (cada soldado ya aplica su propio delay)
                this.ArmyOrder('Attacking');
            }

            if (this.state === 'Idle' || this.state === 'InCombat') {
                this._refreshFacingToNearestEnemy();
                this._nextFacingAt = 0; // refresco rápido la primera vez
            }
        }
    }
    updateState() {
        if (this.CheckObjective()) {
            this.setState('InCombat');
        }
    }
    preUpdate(t, dt) {
        if (this.isDestroyed) return;
        //console.log(this.state);
        //console.log(this.soldiers.length);
        this.updateState()
        this.onEnterState();
        this._updateOrientation(t);
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
