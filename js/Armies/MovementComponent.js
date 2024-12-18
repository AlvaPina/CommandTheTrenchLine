// MovementComponent.js
export default class MovementComponent {
    constructor(gameObject, speed) {
        this.gameObject = gameObject;
        this.speed = speed;
        this.targetPosition = null;
        this.directionX = null;
        this.directionY = null;
    }

    // Establece una posicion objetivo
    moveTo(targetX, targetY) {
        this.targetPosition = { x: targetX, y: targetY };
        this.updateDistanceAndDirection();
    }

    // Realiza el movimiento hacia el objetivo
    movement() {
        if (!this.targetPosition) return;  // Si no hay targetPosition, no hacemos nada

        this.updateDistanceAndDirection();

        // Si estamos lo suficientemente cerca del objetivo, detener el movimiento
        if (this.distance < 1) {
            this.targetPosition = null;
            //console.log('Destino alcanzado');
            // Decir a la army que se pare (evento de parate)
            return;
        }

        // Actualizar la posicion del sprite basado en la velocidad y el tiempo del bucle
        this.gameObject.x += this.directionX * this.speed * this.gameObject.scene.game.loop.delta / 1000;
        this.gameObject.y += this.directionY * this.speed * this.gameObject.scene.game.loop.delta / 1000;
    }

    updateDistanceAndDirection(){
        // Calcular las diferencias en X e Y
        const distanceX = this.targetPosition.x - this.gameObject.x;
        const distanceY = this.targetPosition.y - this.gameObject.y;

        // Calcular la distancia total al objetivo
        this.distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // Calcular la direccion normalizada hacia el objetivo
        this.directionX = distanceX / this.distance;
        this.directionY = distanceY / this.distance;
    }

    // Devuelve la direccion en base a donde quieres que mire el army de un equipo concreto, direction puede ser "TeamBase" o "EnemyBase"
    soldierOrientation(direction, team){ 
        if(direction == "EnemyBase" && team || direction == "TeamBase" && !team){
            return 1;
        }
        else if(direction == "TeamBase" && team || direction == "EnemyBase" && !team){
            return -1;
        }
    }

    getDirectionX(){
        return this.directionX;
    }

    setDirection(newDir){
        this.directionX = newDir;
    }

    getTargetPosition(){
        return this.targetPosition;
    }

    stopMovement() {
        this.targetPosition = null;
        this.directionX = 0;
        this.directionY = 0;
        console.log('Movimiento detenido');
    }
}
