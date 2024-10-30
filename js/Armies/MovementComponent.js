// MovementComponent.js
export default class MovementComponent {
    constructor(gameObject, speed) {
        this.gameObject = gameObject;
        this.speed = speed;
        this.targetPosition = null;
    }

    // Establece una posicion objetivo
    moveTo(targetX, targetY) {
        this.targetPosition = { x: targetX, y: targetY };
    }

    // Realiza el movimiento hacia el objetivo
    movement() {
        if (!this.targetPosition) return;  // Si no hay targetPosition, no hacemos nada

        // Calcular las diferencias en X e Y
        const distanceX = this.targetPosition.x - this.gameObject.x;
        const distanceY = this.targetPosition.y - this.gameObject.y;

        // Calcular la distancia total al objetivo
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // Calcular la direccion normalizada hacia el objetivo
        const directionX = distanceX / distance;
        const directionY = distanceY / distance;

        // Si estamos lo suficientemente cerca del objetivo, detener el movimiento
        if (distance < 1) {
            this.targetPosition = null;
            console.log('Destino alcanzado');
            return;
        }

        // Actualizar la posicion del sprite basado en la velocidad y el tiempo del bucle
        this.gameObject.x += directionX * this.speed * this.gameObject.scene.game.loop.delta / 1000;
        this.gameObject.y += directionY * this.speed * this.gameObject.scene.game.loop.delta / 1000;
    }
}
