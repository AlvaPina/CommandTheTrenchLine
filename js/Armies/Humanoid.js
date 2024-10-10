export default class Humanoid extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);

        this.targetPosition = null;
        
        this.speed = 100;

        this.play('infanterySoldierIdle');
    }

    moveTo(targetX, targetY){
        this.targetPosition = { x: targetX, y: targetY };
    }

    // Metodo de movimiento hacia la target position
    movement() {
        if (!this.targetPosition) return;  // Si no hay targetPosition, no hacemos nada

        // Calcular las diferencias en X e Y
        const distanceX = this.targetPosition.x - this.x;
        const distanceY = this.targetPosition.y - this.y;

        // Calcular la distancia total al objetivo
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // Si estamos lo suficientemente cerca del objetivo, detenemos el movimiento
        if (distance < 1) {
            this.targetPosition = null;  // Al llegar, eliminamos el target
            console.log('Destino alcanzado');
            return;
        }

        // Calcular la dirección normalizada hacia el objetivo
        const directionX = distanceX / distance;
        const directionY = distanceY / distance;

        // Actualizar la posición del soldado en base a la velocidad y el tiempo
        this.x += directionX * this.speed * this.scene.game.loop.delta / 1000;
        this.y += directionY * this.speed * this.scene.game.loop.delta / 1000;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.movement();
    }
}
