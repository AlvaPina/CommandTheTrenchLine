export class MenuInicial extends Phaser.Scene{
    constructor() {
        super({ key: 'MenuInicial' });
    }

    preload() {
        console.log("Inicia el menu");
    }
    create() {

    // Musica
    const backgroundMusic = this.sound.add('backgroundMusic');
    backgroundMusic.play({ loop: true });
    }
}