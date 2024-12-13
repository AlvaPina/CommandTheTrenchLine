export default class LifeComponent {
    constructor(initialHealth, army) {
        this.initialHealth = initialHealth;
        this.health = initialHealth;  // Vida total del ejercito
        this.army = army;             // Referencia al ejercito (lista de humanoides)
    }

    // Reducir la vida del ejercito
    addHealth(amount) {
        this.health += amount;
        if (this.health < 0) {
            this.health = 0;
        }
        // Si la vida baja, mirar si hay que eliminar soldados del ejercito
        if(amount < 0){
            this.checkSoldierLosses();
        }
    }

    // Chequear si algun soldado debe "morir" cuando la vida baja, direction puede ser "TeamBase" o "EnemyBase"
    checkSoldierLosses() {
        //console.log("length: " +this.army.soldiers.length);

        const healthPerSoldier = this.army.SoldierHealth;
        const currentSoldiers = this.army.soldiers.length;
        const expectedSoldiers = Math.floor(this.army.lifeComponent.health / healthPerSoldier);

        if (currentSoldiers + 1 > expectedSoldiers) {
            const soldier = this.army.soldiers.pop(); // Eliminar el ultimo soldado de la lista
            if(soldier) soldier.die();
            if(this.isDead()) this.army.armyDestroy();
        }
    }


    // Verificar si el ejercito ha sido destruido
    isDead() {
        return this.health <= 0;
    }

    // devuelve el ratio para representar la barra de vida
    getRatio(){
        const healthRatio = this.health / this.initialHealth;
        return healthRatio;
    }
}
