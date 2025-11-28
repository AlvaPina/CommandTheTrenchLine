import LifeComponent from './LifeComponent.js';
import MovementComponent from './Movement/MovementComponent.js';

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
        this.distanceView = config.DistanceView;
        this.Team = config.ArmyTeam; // true es army de jugador
        this.ArmyAnimKey = config.ArmyAnimKey;
        this.x = xPos; this.y = 100;

        this.actualCheckpoint = scene.getRespawnCheckpoint(this.Team);
        this.targetX = xPos;
        
        //Delays
        this.moveDelay = 1000; // Cooldown en milisegundos
        this.canMove = true;
        this.canChange = true;

        // Crear background y texto
        if (config.ArmyTeam) {
            this.background = this.scene.add.image(0, 0, this.ArmyAnimKey + 'Green').setOrigin(0.5, 0.5);
        } else {
            this.background = this.scene.add.image(0, 0, this.ArmyAnimKey + 'Grey').setOrigin(0.5, 0.5);
        }
        this.background.setDisplaySize(100, 50);

        this.armyText = this.scene.add.text(20, -5, this.armyNumber, {
            fontSize: '32px',
            color: '#fff'
        }).setOrigin(0.5, 0.5);

        // Agrupar en el contenedor (sin la barra, que ahora la crea LifeComponent)
        this.add([this.background, this.armyText]);

        //Vida
        const ArmyHealth = this.SoldierHealth * this.numberOfSoldiers;
        this.lifeComponent = new LifeComponent(ArmyHealth, this, {
            team: this.Team,
            barWidth: 80,   // como tenías
            barHeight: 50,  // como tenías
            offsetX: 0,     // centrada en el container (0,0)
            offsetY: 0,
            background: this.background, // se la pasamos (por si mañana la quieres usar)
        });

        this.isDestroyed = false;

        //Movimiento
        this.movementComponent = new MovementComponent(this, this.ArmySpeed);

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

        this.moveArmy(this.actualCheckpoint.getPosX());
    }

    setState(newState) {
        this.state = newState;
    }

    // Metodo para mover todo el ejercito hacia una posicion objetivo en el eje X
    // No puede moverse hacia el enemigo cuando esta en combate, en ese caso retorna false
    moveArmy(movementX) {
        // Delay
        if (!this.canMove) return;
        // Movemos al Army
        this.setState('Moving');
        this.canMove = false;
        this.movementComponent.moveTo(movementX, this.y); // Actualizo posicion general de la army
        this.ArmyMoveTo(movementX); // Actualizo la posicion de los soldados
        setTimeout(() => { // Delay
            this.canMove = true;
        }, this.moveDelay);
    }

    moveArmyWithArrows(arrow){ // para mover con la derecha o la izquierda, arrow: 'left' o 'right'
        // No permitimos movimientos hacia el enemigo
        if (this.state === 'InCombat') {
            const enemy = this._getTargetEnemy(1.0);
            const enemyX = enemy ? enemy.x : null;
            if (enemyX != null) {
                const dx = enemyX - this.x; // distancia signed al enemigo
                const absDx = Math.abs(dx);
                const toEnemy = Math.sign(dx); // -1 si está a la izq, +1 si a la dcha
                const intendedDir = Math.sign(movementX - this.x); // dirección deseada

                if (intendedDir !== 0 && toEnemy !== 0) {
                    // Bloquear sólo si está dentro de rango de visión
                    if (absDx <= this.distanceView && intendedDir === toEnemy) {
                        return false; // cancelar la orden (no avanzar hacia el enemigo en combate)
                    }
                }
            }
        }
        // Delay
        if (!this.canMove) return false;
        let checkman = this.scene.getCheckpointManager();
        let nextCheckpoint = checkman.getNextCheckpoint(this.actualCheckpoint, arrow);
        if(nextCheckpoint == null) return false;
        if(this.actualCheckpoint.checkAddArmy()){
            this.actualCheckpoint = nextCheckpoint;
            this.moveArmy(this.actualCheckpoint.getPosX());
            return true;
        }
        return false;
    }

    // Envía una orden a todos los soldados
    ArmyOrder(newOrder) {
        this.soldiers.forEach(soldier => {
            soldier.setOrder(newOrder)
        });
    }

    // Mueve todos los soldados hacia una posición X específica
    ArmyMoveTo(targetX) {
        if (this.Team) console.log("MoveArmy");
        this.soldiers.forEach(soldier => {
            soldier.moveTo(targetX, soldier.y);
        });
    }

    // Reagrupa los soldados para rellenar posiciones de soldados muertos, se usara cuando lleguen a la trinchera
    groupArmy() {

    }

    // Modificar vida del ejercito
    addHealth(amount) {
        this.lifeComponent.addHealth(amount);
        this._syncSoldiersWithHealth();    // bajas según vida
        if (this.lifeComponent.isDead()) {
            this.armyDestroy();
        }
    }

    // Actualiza la escala de la barra de vida en el eje Y
    updateHealthBar() {
        const healthRatio = this.lifeComponent.getRatio();
        this.lifeRectagle.setDisplaySize(80 * healthRatio, 50);
    }

    // Devuelve un objeto con la configuración del ejército
    getConfig() {
        return {
            speed: this.ArmySpeed,
            animKey: this.ArmyAnimKey,
            team: this.Team,
        };
    }

    // Destruye el ejército completamente cuando muere
    armyDestroy() {
        console.log("DestroyArmy") + this.Team;
        this.isDestroyed = true;
        if (this.Team) console.log("Retornando NPC Army")
        else console.log("Retornando playerArmy")
        this.scene.getArmies(!this.Team).pop(this.armyNumber)
        this.scene.checkGameOver()
        this.destroy();
    }

    // Devuelve el enemigo más cercano en base a distanceView * Factor
    // Factor que puede potenciar ese distanceView. Por ejemplo rangeFactor = 1.2
    // Factor = 1 no potencia ni disminuye distanceView.
    _getTargetEnemy(rangeFactor = 1) {
        const enemies = this.scene.getArmies(this.Team).filter(a => !a.isDestroyed);
        if (enemies.length === 0) return null;

        const maxDist = this.distanceView * rangeFactor;
        const facing = Math.sign(this.movementComponent.getDirectionX() ?? 0) || 0;

        let best = null; // Mejor enemigo encontrado
        let bestAbsDx = Infinity; // Su distancia absoluta

        for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];
            const dx = e.x - this.x; // Diferencia en X
            const absDx = Math.abs(dx); // Valor absoluto

            // Debe estar dentro de rango y delante (mismo signo que el facing)
            const dirToEnemy = Math.sign(dx);
            const inFront = (facing === 0) ? true : (dirToEnemy === facing); // si no hay facing, no filtramos por delante
            if (absDx <= maxDist && dirToEnemy !== 0 && inFront) {
                if (absDx < bestAbsDx) {
                    best = e;
                    bestAbsDx = absDx;
                }
            }
        }
        return best;
    }

    // Actualiza la orientación del ejército para que mire al enemigo más cercano
    _refreshFacingToNearestEnemy() {
        let direction = this.movementComponent.getDirectionX(); // conserva si estamos moviendo

        const enemy = this._getTargetEnemy(1.0);
        const nearestEnemyX = enemy ? enemy.x : null;
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

    // Actualiza la orientación con un pequeño delay (cooldown)
    _updateOrientation(t) {
        // mantener facing hacia el enemigo más cercano cuando no estoy moviéndome
        if ((this.state === 'Idle' || this.state === 'InCombat') && t >= this._nextFacingAt) {
            this._refreshFacingToNearestEnemy();
            this._nextFacingAt = t + this.facingRefreshCooldownMs;
        }
    }

    // Mantiene los soldados vivos alineados con la vida del Army
    _syncSoldiersWithHealth() {
        const healthPerSoldier = this.SoldierHealth;

        // Usamos ceil para redondear y que el último soldado NO muera hasta que la vida sea 0
        const expected = Math.max(0, Math.ceil(this.lifeComponent.health / healthPerSoldier));

        let toRemove = this.soldiers.length - expected;

        while (toRemove > 0 && this.soldiers.length > 0) {
            this._killOnePorximitySoldier();
            toRemove--;
        }
    }

    // Mata al soldado mas adelantado con una probabilidad mayor
    _killOnePorximitySoldier() {
        if (this.soldiers.length === 0) return;

        // Dirección hacia donde avanza el army ahora
        let dir = Math.sign(this.movementComponent.getDirectionX() ?? 0);
        if (dir === 0) dir = this.Team ? 1 : -1;

        // Encuentra el índice del más adelantado en esa dirección
        let frontIndex = 0;
        let best = -Infinity;
        for (let i = 0; i < this.soldiers.length; i++) {
            const s = this.soldiers[i];
            const projected = dir * s.x; // mayor projected = más adelantado
            if (projected > best) {
                best = projected;
                frontIndex = i;
            }
        }

        // Con alta probabilidad, mata al más adelantado; si no, uno al azar
        const probability = 0.7; // 70% al de delante, 30% aleatorio
        let indexToRemove = frontIndex;
        if (Math.random() > probability) {
            indexToRemove = Phaser.Math.Between(0, this.soldiers.length - 1);
        }

        // Seleccionamos el soldado del array de soldiers con splice y lo matamos
        const [soldier] = this.soldiers.splice(indexToRemove, 1);
        if (soldier) soldier.die();
    }

    // Devuelve el estado actual del ejército
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

    // Actualiza el estado del ejército según si hay enemigos cerca o no
    updateState() {
        // 1) ¿Hay enemigo en rango normal? -> entrar/seguir en combate con ese objetivo
        const target = this._getTargetEnemy(1.0);

        if (target) {
            this.currentEnemy = target;
            this.setState('InCombat');
            return;
        }

        // 2) No hay en rango normal; si ya estábamos en combate, aguantamos con rango extendido
        if (this.state === 'InCombat') {
            const enemy = this._getTargetEnemy(1.2);
            if (enemy) {
                this.currentEnemy = enemy;
                // seguimos en InCombat sin cambiar estado
                return;
            }
            // 3) Se acabó el ataque
            this.currentEnemy = null;
            this.setState(this.movementComponent.getTargetPosition() ? 'Moving' : 'Idle');
            this.ArmyOrder(this.movementComponent.getTargetPosition() ? 'Moving' : 'Idle')
            return;
        }

        // 4) Estado normal fuera de combate
        this.currentEnemy = null;
    }

    // Actualiza la IA y movimiento del ejército en cada frame
    preUpdate(t, dt) {
        if (this.isDestroyed) return;
        //console.log(this.state);
        //console.log(this.soldiers.length);
        this.updateState();
        this.onEnterState();
        this._updateOrientation(t);
        //if(this.Team) console.log(this.movementComponent.getDirectionX());


        switch (this.state) {
            case 'InCombat': // Solo puede recibir la orden de retirarse y de moverse para atras
                if (this.currentEnemy && !this.currentEnemy.isDestroyed) {
                    this.currentEnemy.addHealth(-1);
                }
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
