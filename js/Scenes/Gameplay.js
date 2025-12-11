import Trench from '../Structures/Trench.js';
import TeamBase from '../Structures/TeamBase.js';
import InfanteryArmy from '../Armies/Types/InfanteryArmy.js';
import SniperArmy from '../Armies/Types/SniperArmy.js';
import AssaultArmy from '../Armies/Types/AssaultArmy.js';
import Player from '../Players/Player.js';
import AI from '../Players/AI.js';
import Checkpoint from '../Armies/Movement/Checkpoint.js';
import CheckpointManager from '../Armies/Movement/CheckpointManager.js';

export class Gameplay extends Phaser.Scene {
    constructor() {
        super({ key: 'Gameplay' });
        this.equippedTroops = [];
    }

    init(data) {
        // Cargamos la data previa
        this.equippedTroops = data.equippedTroops || ["InfanterySoldierButton"];
        console.log(this.equippedTroops)
    }

    preload() {
        console.log("Inicia el Gameplay");
    }

    spawnArmy(nameType, posX, number, team) {
        if (nameType === 'InfanterySoldierButton') {
            let playerArmy = new InfanteryArmy(this, posX, number, team);
            this.playerArmies.push(playerArmy);
        }
        else if (nameType === 'SniperSoldierButton') {
            let playerArmy = new SniperArmy(this, posX, number, team);
            this.playerArmies.push(playerArmy);
        }
        else if (nameType === 'AssaultSoldierButton') {
            let playerArmy = new AssaultArmy(this, posX, number, team);
            this.playerArmies.push(playerArmy);
        }
    }

    create() {
        this.playerArmies = [];
        this.enemyArmies = [];
        this.trenches = [];
        this.teamBases = [];

        const gameWidth = this.game.config.width;
        const gameHeight = this.game.config.height;

        //Musica ambiente
        const backgroundMusic = this.sound.add('gameplayBackgroundMusic');
        backgroundMusic.setVolume(0.5);
        backgroundMusic.play({ loop: true });

        // Crear capas de fondo para parallax
        this.sky = this.add.tileSprite(0, 0, gameWidth * 1.2, gameHeight, 'sky').setOrigin(0, 0);
        this.clouds = this.add.tileSprite(0, 20, gameWidth * 1.2, gameHeight, 'clouds').setOrigin(0, 0);
        this.trees = this.add.tileSprite(0, 40, gameWidth * 1.2, gameHeight, 'trees').setOrigin(0, 0);
        this.ground = this.add.tileSprite(0, 0, gameWidth * 1.2, gameHeight, 'ground').setOrigin(0, 0);
        this.groundDecoration = this.add.tileSprite(0, 0, gameWidth * 1.2, gameHeight, 'groundDecoration').setOrigin(0, 0);

        // Checkpoint Manager
        this.checkpointMan = new CheckpointManager();

        // Crear los dos checkpoints de reaparicion
        this.greenRespawnCheckpoint = new Checkpoint(100, this.checkpointMan);
        this.greyRespawnCheckpoint = new Checkpoint(2800, this.checkpointMan);

        // Crear Army de player y moverlos
        for (let i = 0; i < this.equippedTroops.length; i++) {
            this.spawnArmy(this.equippedTroops[i], 300 + i * 25, i + 1, true)
        }

        this.numberOfEnemyArmies = 1;
        // Crear Army de enemigo y moverlos
        for (let i = 0; i < this.numberOfEnemyArmies; i++) {
            let enemyArmy = new InfanteryArmy(this, 2800 + i * 25, i + 1, false);
            this.enemyArmies.push(enemyArmy);
        }

        // Player y AI
        this.player = new Player(this);
        this.ai = new AI(this);

        // Crear trincheras
        for (let i = 0; i < 4; i++) {
            let startX = 500;
            let xPosition = startX + i * 630;
            let trench = new Trench(this, xPosition, 360);
            new Checkpoint(xPosition, this.checkpointMan, 30, 3);
            this.trenches.push(trench);
        }

        // Crear las dos bases
        let PlayerBase = new TeamBase(this, 100, 360, true);
        this.teamBases.push(PlayerBase);
        let EnemyBase = new TeamBase(this, 2800, 360, false);
        this.teamBases.push(EnemyBase);

        // Configurar camara
        this.cameraSpeed = 7; // Velocidad de movimiento de la camara
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
        this.clouds.x = cameraScrollX + offset;
        this.trees.x = cameraScrollX + offset;

        // Movimiento del parallax
        this.sky.tilePositionX = (cameraScrollX + offset) * 0.3;
        this.ground.tilePositionX = (cameraScrollX + offset) * 1;
        this.groundDecoration.tilePositionX = (cameraScrollX + offset) * 1;
        this.clouds.tilePositionX = (cameraScrollX + offset) * 0.2;
        this.trees.tilePositionX = (cameraScrollX + offset) * 0.8;

        // Obtener la posicion del cursor
        const pointer = this.input.activePointer;
        const screenWidth = this.game.config.width;

        // Movimiento de la camara con el raton
        if (pointer.x <= screenWidth * 0.1) {
            this.cameras.main.scrollX = Math.max(0, this.cameras.main.scrollX - this.cameraSpeed);
        } else if (pointer.x >= screenWidth * 0.9) {
            this.cameras.main.scrollX = Math.min(this.game.config.width * 3 - screenWidth, this.cameras.main.scrollX + this.cameraSpeed);
        }

        // Actualizar jugador y IA
        this.player.update();
        this.ai.update();
    }

    getArmies(team) {
        if (team) return this.enemyArmies;
        else return this.playerArmies;
    }

    checkGameOver() {
        let gameOver = "no"
        if (this.enemyArmies.length <= 0) gameOver = "win"
        if (this.playerArmies.length <= 0) gameOver = "lose"
        if (gameOver != "no")
            this.time.delayedCall(2000, () => { // 2 segundos de delay antes de saltar de pantalla
                this.scene.start('GameOver', { result: gameOver });
            });
    }

    onBaseDestroyed(base) {
        const result = base.armyTeam ? 'lose' : 'win';

        this.time.delayedCall(2000, () => { // 2 segundos de delay
            this.scene.start('GameOver', { result });
        });

        const explosionSound = this.sound.add('explosion');
        explosionSound.setVolume(0.7);
        explosionSound.play();
    }


    getRespawnCheckpoint(team) {
        return team ? this.greenRespawnCheckpoint : this.greyRespawnCheckpoint;
    }

    getCheckpointManager() {
        return this.checkpointMan;
    }
}