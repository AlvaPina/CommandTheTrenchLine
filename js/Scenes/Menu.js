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

        // Crear el boton de "New Game"
        let playButton = this.add.text(centerX, centerY - 25, 'New Game', {
            fontFamily: 'MyFont',
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);
        playButton.setInteractive();
        playButton.setScale(1.5);

        // Boton de continuar partida que no se implementara funcion por el momento
        let continueButton = this.add.text(centerX, centerY + 40, 'Continue Game', {
            fontFamily: 'MyFont',
            fontSize: '40px',
            color: '#a5a5a5'
        }).setOrigin(0.5);

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