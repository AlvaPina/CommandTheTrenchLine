export class LoadScene extends Phaser.Scene 
{
    constructor() {
        super({ key: 'LoadScene' });
    }

    preload() {
        //IMAGES
       this.load.image("gameplayBackground", "Assets/Images/GameplayBackground.png");

       //SPRITESHEETS
       this.load.spritesheet('infanterySoldierSheetRun', 'Assets/Images/SpriteSheets/Run.png', { frameWidth: 256, frameHeight: 256 });
       this.load.spritesheet('infanterySoldierSheetIdle', 'Assets/Images/SpriteSheets/Idle.png', { frameWidth: 256, frameHeight: 256 });
       this.load.spritesheet('infanterySoldierSheetShoot', 'Assets/Images/SpriteSheets/Shoot.png', { frameWidth: 256, frameHeight: 256 });
       this.load.spritesheet('infanterySoldierSheetShootCrouch', 'Assets/Images/SpriteSheets/ShootCrouch.png', { frameWidth: 256, frameHeight: 256 });
       this.load.spritesheet('infanterySoldierSheetDeadCrouch', 'Assets/Images/SpriteSheets/DeadCrouch.png', { frameWidth: 256, frameHeight: 256 });
       this.load.spritesheet('infanterySoldierSheetDead', 'Assets/Images/SpriteSheets/Dead.png', { frameWidth: 256, frameHeight: 256 });

       //AUDIOS
       this.load.audio('backgroundMusic', 'Assets/Audio/SendThemAllToTheTrench.mp3');

       //VIDEOS
       this.load.video({
        key: 'intro',
        url: ['Assets/Videos/VideoTrailer.mp4'],
        asBlob: false, // mirar -------------
        noAudio: true
        });

       let loadingBar = this.add.graphics({
        fillStyle:{
            color: 0xffffff
        }
       })

       this.load.on("progress", (percent)=>{
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
            console.log(percent);
       })

       this.load.on("complete", ()=>{
            this.scene.start('TestScene');
        })
    }
    create() {
        //ANIMS
        this.anims.create({
            key: 'infanterySoldierRun',
            frames: this.anims.generateFrameNumbers('infanterySoldierSheetRun', { start: 0, end: 5 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierIdle',
            frames: this.anims.generateFrameNumbers('infanterySoldierSheetIdle', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierShoot',
            frames: this.anims.generateFrameNumbers('infanterySoldierSheetShoot', { start: 0, end: 5 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierShootCrouch',
            frames: this.anims.generateFrameNumbers('infanterySoldierSheetShootCrouch', { start: 0, end: 5 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierReload',
            frames: this.anims.generateFrameNumbers('infanterySoldierSheetRun', { start: 0, end: 9 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierReloadCrouch',
            frames: this.anims.generateFrameNumbers('infanterySoldierSheetRun', { start: 0, end: 9 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierIdleCrouch',
            frames: this.anims.generateFrameNumbers('infanterySoldierSheetRun', { start: 0, end: 9 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierDead',
            frames: this.anims.generateFrameNumbers('infanterySoldierSheetDead', { start: 0, end: 19 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierDeadCrouch',
            frames: this.anims.generateFrameNumbers('infanterySoldierSheetDeadCrouch', { start: 0, end: 9 }),
            frameRate: 7,
            repeat: 0
        });


    }
}