export class MenuInicial extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuInicial' });
    }

    preload() {
        console.log("Inicia el menu");
    }
    create() {
        // Centrar las posiciones en el canvas
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Mostrar y reproducir el video
        let videoMenu = this.add.video(centerX, centerY + 50, 'VideoMenu');
        videoMenu.play(true);
        videoMenu.setScale(0.6);

        // Crear el botón "New Game"
        let playButton = this.add.image(centerX, centerY- 45, 'RectangleFrame').setScale(0.35).setOrigin(0.5);

        let text = this.add.bitmapText(centerX, centerY - 50, 'SquadaOne', 'New Game', 50)
            .setOrigin(0.5)
            .setTintFill(0xffffff);

        playButton.setInteractive();

        // Boton de continuar partida que no se implementara funcion por el momento
        let continueButton = this.add.image(centerX, centerY+ 80, 'RectangleFrame').setScale(0.35).setOrigin(0.5);

        let text2 = this.add.bitmapText(centerX, centerY + 72, 'SquadaOne', 'Continue Game', 35)
            .setOrigin(0.5)
            .setTintFill(0xa37e48);

        // Cuando se haga clic en el boton de "New Game"
        playButton.on('pointerdown', () => {
            // Ocultar el boton de "New Game"
            playButton.setVisible(false);

            // Saltar a la siguiente escena al hacer clic en "New Game"
            videoMenu.stop();

            // Detenemos (o hacemos fade) de la música del tráiler justo aquí
            const trailerBgm = this.sound.get('trailerBackgroundMusic');
            if (trailerBgm) {
                trailerBgm.stop()
            }

            this.scene.start('SelectTroopsScene');
        });
    }
}   