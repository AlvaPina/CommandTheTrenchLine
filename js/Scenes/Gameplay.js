import Trench from '../Structures/Trench.js';
import InfanteryArmy from '../Armies/Types/InfanteryArmy.js';

export class Gameplay extends Phaser.Scene{
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

        //Background Image
        let sky = this.add.image(gameWidth / 2, gameHeight / 2, 'sky').setOrigin(0.5, 0.5);
        let ground = this.add.image(gameWidth / 2, gameHeight / 2, 'ground').setOrigin(0.5, 0.5);
        let groundDecoration = this.add.image(gameWidth / 2, gameHeight / 2, 'groundDecoration').setOrigin(0.5, 0.5);

        // Crear un Army de Infanteria y otro enemigo y moverlos
        this.army = new InfanteryArmy(this, 100, true);
        this.army.moveArmy(400);
        this.playerArmies.push(this.army);

        this.enemyArmy = new InfanteryArmy(this, 600, false);
        this.enemyArmy.moveArmy(-400);
        this.enemyArmies.push(this.enemyArmy);


        //Crear trincheras
        for (let i = 0; i < 2; i++) {
            let startX = 55;
            let xPosition = startX + i * 600;
            let trench = new Trench(this, xPosition, 360);
            this.trenches.push(trench);
        }
        
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
        //Input flechas
        if (this.cursors.right.isDown && this.canInteract) {
            this.canInteract = false;
            this.army.moveArmy(400); 

            // Temporizador antes de poner canInteract = true
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

            // Temporizador antes de poner canInteract = true
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

    getArmies(team){
        if(team) return this.enemyArmies;
        else return this.playerArmies;
    }
}