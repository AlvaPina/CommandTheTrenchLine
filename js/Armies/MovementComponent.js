// MovementComponent.js
export default class MovementComponent {
    constructor(sprite, speed) {
        this.sprite = sprite;
        this.speed = speed;
        this.targetPosition = null;
    }

    // Definir el método `moveTo` que establece una posición objetivo
    moveTo(targetX, targetY) {
        this.targetPosition = { x: targetX, y: targetY };
    }

    // Definir el método `movement` que realiza el movimiento hacia el objetivo
    movement() {
        if (!this.targetPosition) return;  // Si no hay targetPosition, no hacemos nada

        // Calcular las diferencias en X e Y
        const distanceX = this.targetPosition.x - this.sprite.x;
        const distanceY = this.targetPosition.y - this.sprite.y;

        // Calcular la distancia total al objetivo
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // Calcular la dirección normalizada hacia el objetivo
        const directionX = distanceX / distance;
        const directionY = distanceY / distance;

        // Si estamos lo suficientemente cerca del objetivo, detener el movimiento
        if (distance < 1) {
            this.targetPosition = null;
            console.log('Destino alcanzado');
            return;
        }

        // Actualizar la posición del sprite basado en la velocidad y el tiempo del bucle
        this.sprite.x += directionX * this.speed * this.sprite.scene.game.loop.delta / 1000;
        this.sprite.y += directionY * this.speed * this.sprite.scene.game.loop.delta / 1000;
    }
}
