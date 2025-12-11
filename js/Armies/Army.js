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
        this.deadSoldiers = []; // Contiene soldados muertos

        this.armyNumber = config.ArmyNumber;
        this.SoldierHealth = config.SoldierHealth;
        this.numberOfSoldiers = config.NumberOfSoldiers;
        this.ArmySpeed = config.ArmySpeed;
        this.distanceView = config.DistanceView;
        this.Team = config.ArmyTeam; // true es army de jugador
        this.ArmyAnimKey = config.ArmyAnimKey;
        this.x = xPos; this.y = 100;

        this.actualCheckpoint = null;
        this.targetCheckpoint = scene.getRespawnCheckpoint(this.Team);
        this.targetX = xPos;

        //Delays
        this.moveDelay = 1000; // Cooldown en milisegundos
        this.canMove = true;
        this.canChange = true;

        // Voces
        this.voiceVolume = 0.5;
        this.voiceAlreadyAdvancingKey = 'voiceAlreadyAdvancing';
        this.voiceNextPlay = {}; // Cooldown por voz (en ms)

        this.voiceAttackKeys = [
            'voiceAttack1',
            'voiceAttack2',
            'voiceAttack3',
            'voiceAttack4',
            'voiceAttack5'
        ];
        this.voiceAdvanceKeys = [
            'voiceAdvance1',
            'voiceAdvance2',
            'voiceAdvance3',
            'voiceAdvance4'
        ];
        this.voiceDeathKeys = [
            'voiceDeath1',
            'voiceDeath2',
            'voiceDeath3',
            'voiceDeath4'
        ];
        this.voiceRetreatKey = 'voiceRetreat';

        // Crear background y texto
        if (config.ArmyTeam) {
            this.background = this.scene.add.image(0, 0, config.ImageKey + 'Green').setOrigin(0.5, 0.5);
        } else {
            this.background = this.scene.add.image(0, 0, config.ImageKey + 'Grey').setOrigin(0.5, 0.5);
        }
        this.background.setDisplaySize(100, 50);

        this.armyText = this.scene.add.text(20, -5, this.armyNumber, {
            fontSize: '32px',
            color: '#fff'
        }).setOrigin(0.5, 0.5);

        // Escudo proteccion
        this.protectionBonus = 0; // se lo da las trincheras para reducir el daño
        this.shieldImage = this.scene.add.image(45, -15, 'shield').setOrigin(0.5, 0.5);
        this.shieldImage.setScale(0.05);
        this.shieldImage.setVisible(false);

        // Agrupar en el contenedor (sin la barra, que ahora la crea LifeComponent)
        this.add([this.background, this.armyText, this.shieldImage]);

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
        this.maxHealth = ArmyHealth; // vida maxima que puede tener el army
        this.maxDamageTaken = 0; // mayor daño acumulado sufrido en toda la partida

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

        this.moveArmy(this.targetCheckpoint.posX);
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

    moveArmyWithArrows(arrow) { // arrow: 'left' o 'right'
        // No te mueves si estas retirandote
        if (this.state === 'Fleeing') return false;

        // No permitimos movimientos hacia el enemigo cuando estamos en combate
        if (this.state === 'InCombat') {
            const enemy = this._getTargetEnemy(1.0);
            const enemyX = enemy ? enemy.x : null;
            if (enemyX != null) {
                const dx = enemyX - this.x;                 // distancia al enemigo
                const absDx = Math.abs(dx);
                const toEnemy = Math.sign(dx);              // -1 izq, +1 dcha
                const intendedDir = (arrow === 'right') ? 1 : -1;

                if (absDx <= this.distanceView && intendedDir === toEnemy) {
                    return false; // no avanzamos hacia el enemigo en combate
                }
            }
        }

        // Cooldown
        if (!this.canMove) return false;

        // Calcular el siguiente checkpoint a partir de la posicion del ejercito, equipo y arrow input

        const checkman = this.scene.getCheckpointManager();
        let nextCheckpoint = null;
        if (this.actualCheckpoint === null) { // Si no esta en una trinchera
            nextCheckpoint = checkman.getCheckpointFromPosAndSide(this.x, arrow, this.Team);
        }
        else { // Si se encuentra en una trinchera
            nextCheckpoint = checkman.getNextCheckpoint(this.actualCheckpoint, arrow);
            //quitar el army de esa trinchera
            this.actualCheckpoint.removeArmy(this);
            this.actualCheckpoint = null;
        }


        if (!nextCheckpoint) return false; // no hay más trincheras en esa dirección

        // Si ya estoy yendo a ese checkpoint
        if (this.targetCheckpoint === nextCheckpoint) {
            if (arrow === 'right') {
                console.log("Ya estoy yendo a la derecha");
            } else {
                console.log("Ya estoy yendo a la izquierda");
            }
            this.playVoice(this.voiceAlreadyAdvancingKey, 1500);
            return false;
        }

        // Actualizar target y lanzar movimiento
        this.targetCheckpoint = nextCheckpoint;
        this.moveArmy(this.targetCheckpoint.posX);
        this.playRandomFrom(this.voiceAdvanceKeys);
        return true;
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
        let newAmount = amount;
        if (amount < 0) { newAmount = amount * (100 - this.protectionBonus)/100; } // aplicamos bonus/escudo de proteccion

        this.lifeComponent.addHealth(newAmount);

        // Si hemos recibido daño, actualizamos el máximo daño sufrido
        if (newAmount < 0) {
            const currentHealth = this.lifeComponent.health;
            const damageTakenNow = this.maxHealth - currentHealth;

            if (damageTakenNow > this.maxDamageTaken) {
                this.maxDamageTaken = damageTakenNow;
            }
        }

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

    setProtectionBonuss(amount){
        if(this.protectionBonus === amount) return;
        this.protectionBonus = amount;
        if(amount > 0){ // activar imagen escudito
            this.shieldImage.setVisible(true);
        }
        else this.shieldImage.setVisible(false);
    }

    // Devuelve el enemigo más cercano (prioriza armies, luego bases) en base a distanceView * Factor
    // Factor que puede potenciar ese distanceView. Por ejemplo rangeFactor = 1.2
    // Factor = 1 no potencia ni disminuye distanceView.
    _getTargetEnemy(rangeFactor = 1) {
        const maxDist = this.distanceView * rangeFactor;
        const facing = Math.sign(this.movementComponent.getDirectionX() ?? 0) || 0;

        // Función interna para elegir el mejor objetivo de una lista
        const pickBest = (targets) => {
            let best = null; // Mejor enemigo encontrado
            let bestAbsDx = Infinity; // Su distancia absoluta

            for (let i = 0; i < targets.length; i++) {
                const e = targets[i];
                const dx = e.x - this.x; // Diferencia en X
                const absDx = Math.abs(dx); // Valor absoluto

                // Debe estar dentro de rango y delante (mismo signo que el facing)
                const dirToEnemy = Math.sign(dx);
                const inFront = (facing === 0) ? true : (dirToEnemy === facing); // si no hay facing, no filtramos por delante
                if (absDx <= maxDist && inFront) {
                    if (absDx < bestAbsDx) {
                        best = e;
                        bestAbsDx = absDx;
                    }
                }
            }
            return best;
        };

        // 1) primero vemos las armies enemigas vivas
        const enemyArmies = this.scene.getArmies(this.Team).filter(a => !a.isDestroyed);
        const bestArmy = pickBest(enemyArmies);
        if (bestArmy) return bestArmy;

        // 2) Si no hay armies en rango, miramos si podemos atacar base enemiga
        const bases = (this.scene.teamBases || []).filter(
            b => b.armyTeam === !this.Team && !b.isDestroyed
        );
        const bestBase = pickBest(bases);
        return bestBase || null;
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

    reviveDeadSoldier() { // elije un soldado muerto y lo revive
        if (this.deadSoldiers.length === 0) {
            console.warn("No hay soldados muertos que revivir");
            return;
        }
        let soldier = this.deadSoldiers.pop();

        let newSoldier = new Humanoid(this.scene, this.x, soldier.y, this);
        newSoldier.setDepth(soldier.y);
        newSoldier.setScale(0.2);
        this.soldiers.push(newSoldier);
    }

    // Mantiene los soldados vivos alineados con la vida del Army
    _syncSoldiersWithHealth() {
        const healthPerSoldier = this.SoldierHealth;

        // Usamos ceil para redondear y que el último soldado NO muera hasta que la vida sea 0
        const expected = Math.max(0, Math.ceil(this.lifeComponent.health / healthPerSoldier));

        let toRemove = this.soldiers.length - expected;

        // matar soldados
        while (toRemove > 0 && this.soldiers.length > 0) {
            this._killOnePorximitySoldier();
            toRemove--;
        }

        // revivir soldados
        while (toRemove < 0 && this.soldiers.length < this.numberOfSoldiers) {
            this.reviveDeadSoldier();
            toRemove++;
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
        if (soldier) {
            soldier.die();
            this.playRandomFrom(this.voiceDeathKeys);
            this.deadSoldiers.push(soldier);
        }
    }

    // Devuelve el estado actual del ejército
    getArmyState() {
        return this.state;
    }

    // Actualiza lo necesario al entrar a un estado por primera vez
    onEnterState() {
        if (this.state !== this.previousState) {
            this.previousState = this.state;

            if (this.state === 'Fleeing') {
                this.targetCheckpoint = this.scene.getRespawnCheckpoint(this.Team);
                this.actualCheckpoint = this.scene.getRespawnCheckpoint(this.Team);
                this.movementComponent.moveTo(this.targetCheckpoint.posX, this.y);
                this.ArmyMoveTo(this.targetCheckpoint.posX);
                this.playVoice(this.voiceRetreatKey);
            }

            if (this.state === 'Healing') {
                this.healthTimeCount = 0;   // para contar milisegundos
            }

            if (this.state === 'InCombat') {
                // Ordena atacar una única vez (cada soldado ya aplica su propio delay)
                this.ArmyOrder('Attacking');
                this.playRandomFrom(this.voiceAttackKeys);
            }

            if (this.state === 'Idle' || this.state === 'InCombat') {
                this._refreshFacingToNearestEnemy();
                this._nextFacingAt = 0; // refresco rápido la primera vez
            }
        }
    }

    // Actualiza el estado del ejército según si hay enemigos cerca o no
    updateState() {
        if (this.state === 'Fleeing') return false;
        if (this.state === 'Healing') return false;

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
        if (this.Team) console.log(this.state);


        switch (this.state) {
            case 'InCombat': // Solo puede recibir la orden de retirarse y de moverse para atras
                if (this.currentEnemy && !this.currentEnemy.isDestroyed) {
                    this.currentEnemy.addHealth(-1);
                }
                break;

            case 'Moving':
                // Mover físicamente según MovementComponent
                this.movementComponent.movement();

                // Comprobar llegada al checkpoint objetivo (si hay)
                if (this.targetCheckpoint) {
                    // usamos SIEMPRE el centro de la trinchera para saber si hemos llegado
                    const cpCenterX = this.targetCheckpoint.posX;
                    const smallOffset = 10;

                    if (Math.abs(this.x - cpCenterX) <= smallOffset) {
                        const slotIndex = this.targetCheckpoint.checkAddArmy(this);

                        // 1) Intentamos estacionar
                        if (slotIndex !== -1) {
                            // Hay hueco, nos quedamos en esta trinchera
                            this.actualCheckpoint = this.targetCheckpoint;

                            // Ahora sí, pillamos la X del hueco
                            const slotX = this.targetCheckpoint.getSlotPosX(this.Team, slotIndex);
                            if (slotX != null) {
                                this.x = slotX;
                                this.ArmyMoveTo(slotX);
                            } else {
                                // caso raro: se llenó justo en medio del proceso
                                console.log("CASOOOOOO RAROOOOOOOOOOOOOO");
                                this.x = cpCenterX;
                                this.ArmyMoveTo(cpCenterX);
                            }

                            this.targetCheckpoint = null;
                            this.setState('Idle');
                        } else {
                            // 2) Trinchera llena, vamos a la siguiente en la misma dirección
                            const dir = Math.sign(this.movementComponent.getDirectionX() || (this.Team ? 1 : -1));
                            const side = dir >= 0 ? 'right' : 'left';

                            const checkman = this.scene.getCheckpointManager();
                            const nextCp = checkman.getNextCheckpoint(this.targetCheckpoint, side);

                            if (nextCp) {
                                this.targetCheckpoint = nextCp;
                                // IMPORTANTE: aquí usamos el centro de la trinchera como objetivo
                                this.moveArmy(this.targetCheckpoint.posX);
                            } else {
                                // no hay más trincheras en esa dirección
                                this.targetCheckpoint = null;
                                this.setState('Idle');
                            }
                        }
                    }
                }
                break;
            case 'Idle': // Puede recibir todo tipo de ordenes
                break;

            case 'Fleeing': // No puede recibir ordenes
                this.movementComponent.movement();
                // mirar si ha llegado a la base, si ha llegado pasa a estado 'Healing' y por tanto ya se puede mover
                if (this.targetCheckpoint && Math.abs(this.x - this.targetCheckpoint.posX) <= 10) {
                    this.setState('Healing');
                }
                break;
            case 'Healing':
                // contador, cada segundo 1 añade vida, comprueba si debe añadir humanoide y comprueba si ha llegado a la maxima vida que puede curar
                // Cuando termina con este estado pasa a Idle y pone su checkpoint en el checkpoint inicial
                this.healthTimeCount += dt;
                if (this.healthTimeCount > 10) {
                    this.healthTimeCount = 0;
                    // comprobamos si le podemos subir mas la vida
                    let maxHealing = this.maxHealth - this.maxDamageTaken * 0.5; // se puede curar maximo 50% del daño maximo recibido
                    if (this.lifeComponent.health + 1 > this.maxHealth || this.lifeComponent.health + 1 > maxHealing) {
                        this.setState('Idle');
                        return; // terminamo de curar
                    }
                    this.addHealth(1);
                }
                break;
        }
    }

    // Helpers sonido
    playRandomFrom(keysArray, cooldownMs = 0) {
        if (!this.Team || !keysArray || keysArray.length === 0) return;

        const index = Phaser.Math.Between(0, keysArray.length - 1);
        const key = keysArray[index];
        this.playVoice(key, cooldownMs);
    }

    playVoice(key, cooldownMs = 0) {
        if (!this.Team || !key) return;

        // Comprobamos cooldown por key
        const now = this.scene.time.now || 0;
        const nextAllowed = this.voiceNextPlay[key] || 0;

        if (now < nextAllowed) {
            // todavía en cooldown, no sonamos
            return;
        }

        this.voiceNextPlay[key] = now + cooldownMs;
        this.scene.sound.play(key, { volume: this.voiceVolume });
    }
}
