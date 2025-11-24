export class VideoScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VideoScene' });
    }

    create() {
        // Centrar las posiciones en el canvas
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Crear el botón "Play"
        this.ButtonFrame = this.add.image(centerX, centerY, 'RectangleFrame').setScale(0.35).setOrigin(0.5);

        let playButton = this.add.bitmapText(centerX, centerY - 10, 'SquadaOne', 'Play', 40)
            .setOrigin(0.5)
            .setTintFill(0xffffff);

        playButton.setInteractive();
        playButton.setScale(1.5);

        // Música
        const backgroundMusic = this.sound.add('trailerBackgroundMusic');

        // Evento al pulsar "Play"
        playButton.on('pointerdown', () => {
            backgroundMusic.play({ loop: true });

            // Video intro
            let introVideo = this.add.video(centerX, centerY, 'intro');
            introVideo.play(true);
            introVideo.setScale(0.5);

            // Ocultar el boton de "Play" y el texto
            playButton.setVisible(false);

            // Botón "Skip"
            let skipButton = this.add.bitmapText(centerX + 400, centerY + 200, 'SquadaOne', 'Skip', 40)
                .setOrigin(0.5)
                .setTintFill(0xffffff)
                .setInteractive();

            skipButton.on('pointerdown', () => {
                introVideo.stop();
                this.scene.start('MenuInicial');
            });

            introVideo.on('complete', () => {
                introVideo.stop();
                this.scene.start('MenuInicial');
            });
        });
    }
}
