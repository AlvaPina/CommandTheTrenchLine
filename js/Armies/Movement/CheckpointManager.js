export default class CheckpointManager {
    constructor() {
        this.orderedCheckpoints = []; // vector con los checkpoints ordenados
    }

    pushBack(checkpointComp) {
        this.checkpointComps.push(checkpointComp);
        this.#orderCheckpoint(checkpointComp);
    }

    // retrona el checkpoint de la derecha o izquierda segun indiques
    getNextCheckpoint(checkpointComp, side) { // side puede ser o 'left' o 'right'
        for (let i = 1; i <= this.orderedCheckpoints.length(); i++) {
            if (checkpointComp === this.orderedCheckpoints[i]) {
                if(side === 'left'){
                    return this.orderedCheckpoints[i - 1]
                }
                else if(side === 'right'){
                    return this.orderedCheckpoints[i + 1]
                }
            }
        }
        return null;
    }

    #orderCheckpoint(checkpoint) {
        let MyPosX = checkpoint.getPosX();
        for (let i = 1; i <= this.orderedCheckpoints.length(); i++) {
            if (MyPosX < this.orderedCheckpoints[i].getPosX()) {
                orderedCheckpoints.splice(i, 0, checkpoint); // en el indice i, borramos 0 elementos y añadimos checkpoint
            }
        }
    }
}