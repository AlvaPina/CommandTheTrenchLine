import Army from '../Armies/Army.js';
import Infantery from '../Armies/Soldiers/Infantery.js';

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
        this.army = new Army(this,100, Infantery);
        this.army.moveArmy(300);


        // Musica
        const backgroundMusic = this.sound.add('backgroundMusic');
        backgroundMusic.play({ loop: true });
    }
}