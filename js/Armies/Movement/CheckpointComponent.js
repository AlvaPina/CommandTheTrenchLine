export default class CheckpointComponent {
    constructor(posX, CheckpointManager, maxArmyCapacity = -1) {
        this.posX = posX;
        this.maxArmyCapacity = maxArmyCapacity;
        this.armies = []; // armies estacionadas
        CheckpointManager.pushBack(this);
    }

    getPosX(){ return this.posX; }

    getContainedArmies(){ // devuelve los armies estacionados
        return this.armies;
    }

    checkAddArmy(army){ // comprueba si cabe otra army
        if(this.armies.length() < this.maxArmyCapacity){
            this.armies.push(army);
        }
    }
}