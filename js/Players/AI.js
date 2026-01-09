export default class AI {
    constructor(scene) {
        this.scene = scene;

        this.inputDelay = 1500; // Intervalo de decisión
        this.canInteract = true;
        
        // Mapa para rastrear la vida anterior y detectar daño recibido
        // Key: army, Value: previousHealth
        this.healthMemory = new Map();
    }

    update() {
        if (this.canInteract) {
            this.think();
        }
    }

    think() {
        // Obtener ejercitos enemigos (del player) vivos
        const armies = this.scene.getArmies(true).filter(a => !a.isDestroyed);
        if (armies.length === 0) return;

        // Ordenamos por posición X ascendente (Izquierda -> Derecha)
        // Como el enemigo va de Derecha a Izquierda:
        // - El índice 0 es la unidad MÁS ADELANTADA (Menor X, más cerca del jugador)
        // - El índice armies.length-1 es la unidad MÁS ATRÁS.
        const sortedArmies = [...armies].sort((a, b) => a.x - b.x);

        // Control de "quién sigue a quién" para los de Asalto e Infantería en este turno
        const followersCount = new Map(); 

        sortedArmies.forEach(army => {
            // Actualizar memoria de daño
            const currentHP = army.getCurrentHealth ? army.getCurrentHealth() : army.lifeComponent.currentHealth; 
            const prevHP = this.healthMemory.get(army) || currentHP;
            const tookDamage = currentHP < prevHP;
            this.healthMemory.set(army, currentHP);

            if (this.checkRetreatConditions(army)) {
                return; // Si decide retirarse, no hace nada más
            }

            // Si ya está huyendo o curándose, pasamos
            if (army.state === 'Fleeing' || army.state === 'Healing') return;

            // Usamos constructor.name para saber el tipo
            const type = army.constructor.name; 

            switch (type) {
                case 'TankArmy':
                    this.handleTank(army);
                    break;

                case 'SniperArmy':
                    this.handleSniper(army, sortedArmies, tookDamage);
                    break;

                case 'AssaultArmy':
                    this.handleAssault(army, sortedArmies, followersCount);
                    break;

                default: 
                    // InfanteryArmy y otros (ahora se comportan parecido a asalto)
                    this.handleInfantry(army, sortedArmies, followersCount);
                    break;
            }
        });

        // Cooldown para volver a pensar
        this.canInteract = false;
        this.scene.time.delayedCall(this.inputDelay, () => {
            this.canInteract = true;
        });
    }

    // retirada cuando 50% o 25% de vida
    checkRetreatConditions(army) {
        const maxHP = army.getMaxHealth ? army.getMaxHealth() : army.lifeComponent.maxHealth;
        const currentHP = army.getCurrentHealth ? army.getCurrentHealth() : army.lifeComponent.currentHealth;
        const pct = currentHP / maxHP;

        if (!army._aichecked50 && pct <= 0.50) {
            army._aichecked50 = true;
            if (Phaser.Math.RND.frac() < 0.5) { 
                army.setState('Fleeing');
                return true;
            }
        }
        if (!army._aichecked25 && pct <= 0.25) {
            army._aichecked25 = true;
            if (Phaser.Math.RND.frac() < 0.5) {
                army.setState('Fleeing');
                return true;
            }
        }
        return false;
    }

    // tanque siempre avanza
    handleTank(army) {
        // Izquierda es avanzar para el enemigo
        army.moveArmyWithArrows('left');
    }

    // sniper comportamiento cobarde
    handleSniper(army, sortedArmies, tookDamage) {
        if (tookDamage) {
            army.moveArmyWithArrows('right'); 
            return;
        }

        const amIFrontLine = (sortedArmies[0] === army);

        if (amIFrontLine && sortedArmies.length > 1) {
            army.moveArmyWithArrows('right');
        } else {
            army.moveArmyWithArrows('left');
        }
    }

    // el asalto sigue al tanque y sino a la infanteria
    handleAssault(army, sortedArmies, followersCount) {
        let myIndex = sortedArmies.indexOf(army);
        let leader = null;

        // busca tanque
        for (let i = myIndex - 1; i >= 0; i--) {
            const candidate = sortedArmies[i];
            const cType = candidate.constructor.name;
            
            if (cType === 'TankArmy') {
                const currentFollowers = followersCount.get(candidate) || 0;
                if (currentFollowers < 1) {
                    leader = candidate;
                    followersCount.set(candidate, currentFollowers + 1);
                    break; 
                }
            }
        }

        // si no hay tanque busca infanteria
        if (!leader) {
            for (let i = myIndex - 1; i >= 0; i--) {
                const candidate = sortedArmies[i];
                const cType = candidate.constructor.name;
                
                if (cType === 'InfanteryArmy') {
                    const currentFollowers = followersCount.get(candidate) || 0;
                    if (currentFollowers < 1) {
                        leader = candidate;
                        followersCount.set(candidate, currentFollowers + 1);
                        break; 
                    }
                }
            }
        }

        // Aplicar movimiento
        this.applyFollowLogic(army, leader);
    }

    // Infanteria intenta seguir al tanque, sino avanza
    handleInfantry(army, sortedArmies, followersCount) {
        let myIndex = sortedArmies.indexOf(army);
        let leader = null;

        // Solo busca Tanques para protegerlos
        for (let i = myIndex - 1; i >= 0; i--) {
            const candidate = sortedArmies[i];
            const cType = candidate.constructor.name;
            
            if (cType === 'TankArmy') {
                const currentFollowers = followersCount.get(candidate) || 0;
                if (currentFollowers < 1) { // Límite de seguidores
                    leader = candidate;
                    followersCount.set(candidate, currentFollowers + 1);
                    break;
                }
            }
        }

        this.applyFollowLogic(army, leader);
    }

    // Helper para no repetir código de seguir/avanzar
    applyFollowLogic(army, leader) {
        if (leader) {
            // Distancia positiva porque el enemigo va hacia izquierda (X menor), yo estoy en X mayor
            const dist = army.x - leader.x; 
            
            if (dist > 150) { 
                // Muy lejos, corre
                army.moveArmyWithArrows('left');
            } else if (dist < 50) {
                // Muy cerca, espacio
                army.moveArmyWithArrows('right');
            }
            // Entre 50 y 150 mantiene posición (no hace nada)
        } else {
            // Si no hay líder, avanza a la guerra
            army.moveArmyWithArrows('left');
        }
    }
}