export class MenuInicial extends Phaser.Scene{
    constructor() {
        super({ key: 'MenuInicial' });
    }

    preload() {
        console.log("Inicia el menu");
    }
    create() {
    // Video
    let introVideo = this.add.video(400, 300, 'intro');
    introVideo.play(true);
    introVideo.setScale(0.93);
    introVideo.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);

    // Musica
    const backgroundMusic = this.sound.add('backgroundMusic');
    backgroundMusic.play({ loop: true });
    }
}