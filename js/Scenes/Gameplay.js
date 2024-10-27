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
        this.army.moveArmy(50);

        // Configurar las teclas de entrada
        this.cursors = this.input.keyboard.createCursorKeys();
        this.inputDelay = 100; // Cooldown en milisegundos
        this.canInteract = true;
    }

    update() {
        //Input flechas
        if (this.cursors.right.isDown && this.canInteract) {
            this.canInteract = false;
            this.army.moveArmy(450); 

            // Temporizador antes de poner canInteract = true
            setTimeout(() => {
                this.canInteract = true;
            }, this.inputDelay);

        } else if (this.cursors.left.isDown && this.canInteract) {
            this.canInteract = false;
            this.army.moveArmy(-450);

            setTimeout(() => {
                this.canInteract = true;
            }, this.inputDelay);
        }
    }
}