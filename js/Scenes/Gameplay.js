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
        this.army = new Army(this,100, InfanteryArmy);
        this.army.moveArmy(100);

        // Musica
        const backgroundMusic = this.sound.add('backgroundMusic');
        backgroundMusic.play({ loop: true });

        // Configurar las teclas de entrada
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.cursors.right.isDown) {
            this.army.moveArmy(100);
        } else if (this.cursors.left.isDown) {
            this.army.moveArmy(-100);
        }
    }
}