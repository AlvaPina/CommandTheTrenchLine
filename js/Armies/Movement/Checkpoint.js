export default class Checkpoint {
    constructor(posX, CheckpointManager, maxArmyCapacity = -1) {
        this.posX = posX;
        this.maxArmyCapacity = maxArmyCapacity;
        this.armies = []; // armies estacionadas
        CheckpointManager.pushBack(this);
    }

    getFirstFreeIndex() {
        // busca el primer índice libre (null/undefined) en el array
        for (let i = 0; i < this.armies.length; i++) {
            if (!this.armies[i]) {
                return i;
            }
        }

        // si no habia huecos y no hay capacidad maxima, el siguiente hueco es al final
        if (this.maxArmyCapacity === -1) {
            return this.armies.length;
        }

        // si no hay huecos y no hemos llegado a la capacidad maxima, el siguiente es al final
        if (this.armies.length < this.maxArmyCapacity) {
            return this.armies.length;
        }

        return -1;
    }

    getPosX(team) { // devuelve la posicion del hueco mas adeltando para ese equipo
        let spacingOffsetX = team ? -30 : 30; // esto es el espaceado entre los ejercitos dentro de la trinchera

        const index = this.getFirstFreeIndex();
        if (index === -1) { // no hay sitio libre
            return null;
        }

        return this.posX - spacingOffsetX + index * spacingOffsetX;
    }

    getContainedArmies() { // devuelve los armies estacionados
        return this.armies;
    }

    checkAddArmy(army) { // comprueba si cabe otra army
        const index = this.getFirstFreeIndex();
        if (index === -1) return false; // no habia hueco
        this.armies[index] = army;
        return true;
    }

    removeArmy(army) { // saca al army de la trinchera
        const index = this.armies.indexOf(army);
        if (index !== -1) {
            // dejamos el hueco libre
            this.armies[index] = null;
        }
    }
}