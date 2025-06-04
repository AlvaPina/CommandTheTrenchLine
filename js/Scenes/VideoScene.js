export class VideoScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VideoScene' });
    }

    preload() {

    }

    create() {
        // Centrar las posiciones en el canvas
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Crear el boton de "Play"
        let playButton = this.add.text(centerX, centerY - 10, 'Play', {
            fontFamily: 'MyFont',
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Crear el boton de "Play"
        playButton.setInteractive();
        playButton.setScale(1.5);

        // Musica
        const backgroundMusic = this.sound.add('trailerBackgroundMusic');

        // Cuando se haga clic en el boton de "Play"
        playButton.on('pointerdown', () => {
            // Reproducir música de fondo en bucle
            backgroundMusic.play({ loop: true });

            // Ocultar el boton de "Play" y el texto
            playButton.setVisible(false);

            // Mostrar y reproducir el video
            let introVideo = this.add.video(centerX, centerY, 'intro');
            introVideo.play(true);
            introVideo.setScale(0.93);

            // Crear el boton de "Skip"
            let skipButton = this.add.text(centerX + 400, centerY + 200, 'Skip', {
                fontFamily: 'MyFont',
                fontSize: '40px',
                color: '#ffffff'
            }).setOrigin(0.5);
            skipButton.setInteractive();

            // Saltar a la siguiente escena al hacer clic en "Skip"
            skipButton.on('pointerdown', () => {
                introVideo.stop();
                backgroundMusic.stop();
                this.scene.start('MenuInicial');
            });

            // Si el video termina, siguiente escena
            introVideo.on('complete', () => {
                introVideo.stop();
                backgroundMusic.stop();
                this.scene.start('MenuInicial');
            });
        });
    }
}
