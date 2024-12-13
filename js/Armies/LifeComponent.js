export default class LifeComponent {
    constructor(initialHealth, army) {
        this.health = initialHealth;  // Vida total del ejercito
        this.army = army;             // Referencia al ejercito (lista de humanoides)
    }

    // Reducir la vida del ejercito
    addHealth(amount) {
        this.health = Math.max(0, this.health + amount);

        // Si la vida baja por debajo de un umbral, eliminar soldados del ejército
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

        if (currentSoldiers > expectedSoldiers) {
            const soldier = this.army.soldiers.pop(); // Eliminar el ultimo soldado de la lista
            soldier.die();
            if(this.isDead()) this.army.armyDestroy();
        }
    }


    // Verificar si el ejercito ha sido destruido
    isDead() {
        return this.health <= 0;
    }
}
