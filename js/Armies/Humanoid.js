export default class Humanoid extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, speed, animKey) {
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);

        this.targetPosition = null;
        this.lastDirection = 'right';

        this.speed = speed;
        this.animKey = animKey;

        this.currentAnim = this.animKey + 'Idle';
        this.previousAnim = this.animKey + 'Idle';

        this.xImageOffsetRight = this.displayOriginX + 100;
        this.xImageOffsetLeft = this.displayOriginX + 50;
    }

    moveTo(targetX, targetY){
        this.targetPosition = { x: targetX, y: targetY };
        this.currentAnim = this.animKey + 'Run';
    }

    // Metodo de movimiento hacia la target position
    movement() {
        if (!this.targetPosition) return;  // Si no hay targetPosition, no hacemos nada

        // Calcular las diferencias en X e Y
        const distanceX = this.targetPosition.x - this.x;
        const distanceY = this.targetPosition.y - this.y;

        // Calcular la distancia total al objetivo
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        // Calcular la direccion normalizada hacia el objetivo
        const directionX = distanceX / distance;
        const directionY = distanceY / distance;

        // Si estamos lo suficientemente cerca del objetivo, detenemos el movimiento
        if (distance < 1) {
            this.targetPosition = null;  // Al llegar, eliminamos el target
            console.log('Destino alcanzado');
            if (directionX < 0 && this.lastDirection === 'left') { // Queremos que siempre se quede mirando para la derecha.
                this.setFlipX(false);
                this.lastDirection = 'right';
                //this.x += 13;
                this.setDisplayOrigin(this.xImageOffsetLeft, this.displayOriginY);
            }
            this.currentAnim = this.animKey + 'Idle';
            return;
        }
        else{

            // Que mire hacia donde camine
            if (directionX > 0 && this.lastDirection !== 'right') {
                this.setFlipX(false);
                this.lastDirection = 'right';
                this.setDisplayOrigin(this.xImageOffsetLeft, this.displayOriginY);
            } else if (directionX < 0 && this.lastDirection !== 'left') {
                this.setFlipX(true);
                this.lastDirection = 'left';
                this.setDisplayOrigin(this.xImageOffsetRight, this.displayOriginY);
            }

            // Actualizar la posicion del soldado en base a la velocidad y el tiempo
            this.x += directionX * this.speed * this.scene.game.loop.delta / 1000;
            this.y += directionY * this.speed * this.scene.game.loop.delta / 1000;
        }
    }

    // Es solo un rasgo visual a excepcion de la generacion de granadas.
    attack(){

    }

    manageAnims(){
        // Hacemos play solo cuando currentAnim se ha actualizado
        if (this.currentAnim !== this.previousAnim) {
            this.play(this.currentAnim);
            this.previousAnim = this.currentAnim;
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.movement();
        this.manageAnims();
    }
}
