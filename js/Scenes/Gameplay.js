import Army from '../Armies/Army.js';
import InfanteryArmy from '../Armies/Types/InfanteryArmy.js';

export class Gameplay extends Phaser.Scene{
    constructor() {
        super({ key: 'Gameplay' });
    }

    preload() {
        console.log("Inicia el Gameplay");
    }
    create() {
        
        const gameWidth = this.game.config.width;
        const gameHeight = this.game.config.height;

        //Background Image
        let background = this.add.image(gameWidth / 2, gameHeight / 2, 'gameplayBackground').setOrigin(0.5, 0.5);

        // Crear un Army de Infanteria y moverlo
        this.army = new InfanteryArmy(this, 100);
        this.army.moveArmy(100);

        // Musica
        const backgroundMusic = this.sound.add('backgroundMusic');
        backgroundMusic.play({ loop: true });

        // Configurar las teclas de entrada
        this.cursors = this.input.keyboard.createCursorKeys();
        this.moveDelay = 1000; // Retraso en milisegundos
        this.canMove = true;
    }

    update() {
        //Input flechas
        if (this.cursors.right.isDown && this.canMove) {
            this.canMove = false;
            this.army.moveArmy(100); 

            // Temporizador antes de poner canMove = true
            setTimeout(() => {
                this.canMove = true;
            }, this.moveDelay);

        } else if (this.cursors.left.isDown && this.canMove) {
            this.canMove = false;
            this.army.moveArmy(-100);

            setTimeout(() => {
                this.canMove = true;
            }, this.moveDelay);
        }
    }
}