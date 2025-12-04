export default class Checkpoint {
    constructor(posX, CheckpointManager, maxArmyCapacity = -1) {
        this.posX = posX;
        this.maxArmyCapacity = maxArmyCapacity;
        this.armies = []; // armies estacionadas
        CheckpointManager.pushBack(this);
    }

    getPosX(team){ // devuelve la posicion teniendo en cuenta la posicion de orden/capacidad y el equipo
        let spacingOffsetX = team ? -20 : 20; // esto es el espaceado entre los ejercitos dentro de la trinchera
        //console.log(this.armies.length)
        return this.posX + spacingOffsetX + this.armies.length * spacingOffsetX;
    }

    getContainedArmies(){ // devuelve los armies estacionados
        return this.armies;
    }

    checkAddArmy(army){ // comprueba si cabe otra army
        if(this.maxArmyCapacity == -1 || this.armies.length < this.maxArmyCapacity){
            //console.log("push");
            this.armies.push(army);
            //console.log(this.armies.length)
            return true;
        }
        return false;
    }
}