export default class CheckpointManager {
    constructor() {
        this.orderedCheckpoints = []; // vector con los checkpoints ordenados
    }

    pushBack(checkpoint) { // insertamos de forma ordenada
        let MyPosX = checkpoint.getPosX();
        let i = 0;

        // Si orderedCheckpoints esta vacio metemos el primero
        if(this.orderedCheckpoints.length == 0){
            this.orderedCheckpoints.push(checkpoint);
            return;
        }

        while (i < this.orderedCheckpoints.length) {
            if (MyPosX < this.orderedCheckpoints[i].getPosX()) {
                this.orderedCheckpoints.splice(i, 0, checkpoint); // en el indice i, borramos 0 elementos y añadimos checkpoint
                return;
            } i++;
        }

        // MyPosX era el mayor de todos, lo metemos con push entonces
        this.orderedCheckpoints.push(checkpoint);
    }

    // retorna el checkpoint de la derecha o izquierda segun se pida
    getNextCheckpoint(checkpointComp, side) { // side puede ser 'left' o 'right'
        const i = this.orderedCheckpoints.indexOf(checkpointComp);
        if (i === -1) return null; // no esta en la lista

        if (side === 'left') {
            if (i === 0) return null; // no hay mas a la izquierda
            return this.orderedCheckpoints[i - 1];
        }

        if (side === 'right') {
            if (i === this.orderedCheckpoints.length - 1) return null; // no hay mas a la derecha
            return this.orderedCheckpoints[i + 1];
        }

        return null; // por si pasan un side raro
    }
}