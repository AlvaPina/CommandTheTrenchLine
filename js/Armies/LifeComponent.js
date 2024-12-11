export default class LifeComponent {
    constructor(initialHealth, army) {
        this.health = initialHealth;  // Vida total del ejercito
        this.army = army;             // Referencia al ejercito (lista de humanoides)
    }

    // Reducir la vida del ejercito
    addHealth(amount) {
        this.health += amount;

        // Si la vida baja por debajo de un umbral, eliminar soldados del ejército
        if(amount < 0){
            this.checkSoldierLosses();
        }
    }

    // Chequear si algun soldado debe "morir" cuando la vida baja, direction puede ser "TeamBase" o "EnemyBase"
    checkSoldierLosses() {
        const soldiersToKill = Math.floor((1 - (this.health / 100)) * this.army.soldiers.length);

        // Eliminar soldados si la salud ha bajado lo suficiente
        while (this.army.soldiers.length > soldiersToKill && this.army.soldiers.length > 0) {
            const soldier = this.army.soldiers.pop(); // Eliminar el ultimo soldado de la lista
            soldier.destroy(); // Destruir el objeto grafico
        }
    }

    // Verificar si el ejercito ha sido destruido
    isDead() {
        return this.health <= 0;
    }
}
