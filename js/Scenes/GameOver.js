export class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    init(data) {
        // Cargamos la data previa
        this.matchResult = data.result || ["lose"];
    }

    preload() {
        console.log("Inicia el GameOver");
    }

    create() {
        // Centrar las posiciones en el canvas
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        // Crear el boton de "Back to menu"
        let returnButton = this.add.text(centerX, centerY - 25, 'Back to menu', {
            fontFamily: 'MyFont',
            fontSize: '40px',
            color: '#ffffff'
        }).setOrigin(0.5);
        returnButton.setInteractive();
        returnButton.setScale(1.5);

        returnButton.on('pointerdown', () => {
            backgroundMusic.stop();
            this.scene.start('MenuInicial');
        });

        // texto mostrando el resultado del juego
        let text;
        let musicKey;
        if(this.matchResult == 'win'){
            text = 'Victory!'
            musicKey = 'finalSoundWin'
        }
        else {
            text = 'Game Over!';
            musicKey = 'finalSoundGameOver'
        }
        this.add.text(centerX, centerY - 100, text, {
            fontFamily: 'MyFont',
            fontSize: '60px',
            color: '#a5a5a5'
        }).setOrigin(0.5);

        // Musica
        const backgroundMusic = this.sound.add(musicKey);
        backgroundMusic.play({ loop: false });
    }
}   