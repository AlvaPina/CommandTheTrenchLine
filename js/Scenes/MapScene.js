export class MapScene extends Phaser.Scene{
    constructor() {
        super({ key: 'MapScene' });
    }

    preload() {
        console.log("Inicia el MapScene");
    }
    create() {

    // Musica
    const backgroundMusic = this.sound.add('backgroundMusic');
    backgroundMusic.play({ loop: true });
    }
}