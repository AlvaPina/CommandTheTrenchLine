import Trench from '../Structures/Trench.js';
import InfanteryArmy from '../Armies/Types/InfanteryArmy.js';

export class Gameplay extends Phaser.Scene {
    constructor() {
        super({ key: 'Gameplay' });
    }

    preload() {
        console.log("Inicia el Gameplay");
    }

    create() {
        this.playerArmies = [];
        this.enemyArmies = [];
        this.trenches = [];

        const gameWidth = this.game.config.width;
        const gameHeight = this.game.config.height;

        // Crear capas de fondo para parallax
        this.sky = this.add.tileSprite(0, 0, gameWidth * 1.2, gameHeight, 'sky').setOrigin(0, 0);
        this.ground = this.add.tileSprite(0, 0, gameWidth * 1.2, gameHeight, 'ground').setOrigin(0, 0);
        this.groundDecoration = this.add.tileSprite(0, 0, gameWidth * 1.2, gameHeight, 'groundDecoration').setOrigin(0, 0);

        // Crear un Army de Infanteria y otro enemigo y moverlos
        this.army = new InfanteryArmy(this, 100, true);
        this.army.moveArmy(400);
        this.playerArmies.push(this.army);

        this.enemyArmy = new InfanteryArmy(this, 600, false);
        this.enemyArmy.moveArmy(-400);
        this.enemyArmies.push(this.enemyArmy);

        // Crear trincheras
        for (let i = 0; i < 2; i++) {
            let startX = 55;
            let xPosition = startX + i * 600;
            let trench = new Trench(this, xPosition, 360);
            this.trenches.push(trench);
        }

        // Configurar camara
        this.cameraSpeed = 5; // Velocidad de movimiento de la camara
        this.cameras.main.setBounds(0, 0, gameWidth * 3, gameHeight); // Ajustar los limites de la camara

        // Configurar las teclas de entrada
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            enemyLeft: Phaser.Input.Keyboard.KeyCodes.A,
            enemyRight: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.inputDelay = 100; // Cooldown en milisegundos
        this.canInteract = true;
    }

    update() {
        // Ajustar las posiciones de las capas de fondo para crear el efecto parallax infinito
        const cameraScrollX = this.cameras.main.scrollX;
    
        const offset = -20;

        // Las capas del parallax siguen a la camara
        this.sky.x = cameraScrollX + offset;
        this.ground.x = cameraScrollX + offset;
        this.groundDecoration.x = cameraScrollX + offset;
    
        // Movimiento del parallax
        this.sky.tilePositionX = (cameraScrollX + offset) * 0.2;
        this.ground.tilePositionX = (cameraScrollX + offset) * 1;
        this.groundDecoration.tilePositionX = (cameraScrollX + offset) * 1;
    
        // Obtener la posicion del cursor
        const pointer = this.input.activePointer;
        const screenWidth = this.game.config.width;
    
        // Movimiento de la camara con el raton
        if (pointer.x <= screenWidth * 0.1) {
            this.cameras.main.scrollX = Math.max(0, this.cameras.main.scrollX - this.cameraSpeed);
        } else if (pointer.x >= screenWidth * 0.9) {
            this.cameras.main.scrollX = Math.min(this.game.config.width * 3 - screenWidth, this.cameras.main.scrollX + this.cameraSpeed);
        }
        // Input para mover ejercitos
        if (this.cursors.right.isDown && this.canInteract) {
            this.canInteract = false;
            this.army.moveArmy(400); 
            setTimeout(() => {
                this.canInteract = true;
            }, this.inputDelay);
        } else if (this.cursors.left.isDown && this.canInteract) {
            this.canInteract = false;
            this.army.moveArmy(-400);
            setTimeout(() => {
                this.canInteract = true;
            }, this.inputDelay);
        }
        if (this.keys.enemyLeft.isDown && this.canInteract) {
            this.canInteract = false;
            this.enemyArmy.moveArmy(-400);
            setTimeout(() => {
                this.canInteract = true;
            }, this.inputDelay);
        } else if (this.keys.enemyRight.isDown && this.canInteract) {
            this.canInteract = false;
            this.enemyArmy.moveArmy(400);
            setTimeout(() => {
                this.canInteract = true;
            }, this.inputDelay);
        }
    }

    getArmies(team) {
        if (team) return this.enemyArmies;
        else return this.playerArmies;
    }
}