export class LoadScene extends Phaser.Scene 
{
    constructor() {
        super({ key: 'LoadScene' });
    }

    preload() {
        //IMAGES
       this.load.image("ground", "Assets/Images/Map/Parallax/Ground.png");
       this.load.image("groundDecoration", "Assets/Images/Map/Parallax/GroundDecoration.png");
       this.load.image("sky", "Assets/Images/Map/Parallax/Sky.png");

       this.load.image("trench", "Assets/Images/Map/Props/Trench.png");
       this.load.image("trench2", "Assets/Images/Map/Props/Trench2.png");
       this.load.image("fence", "Assets/Images/Map/Props/Fence.png");

       //SPRITESHEETS
       this.load.spritesheet('infanterySoldierSheetMoving', 'Assets/Images/SpriteSheets/Run.png', { frameWidth: 256, frameHeight: 256 });
       this.load.spritesheet('infanterySoldierSheetIdle', 'Assets/Images/SpriteSheets/Idle.png', { frameWidth: 256, frameHeight: 256 });
       this.load.spritesheet('infanterySoldierAttacking', 'Assets/Images/SpriteSheets/Shoot.png', { frameWidth: 256, frameHeight: 256 });
       this.load.spritesheet('infanterySoldierAttackingCrouch', 'Assets/Images/SpriteSheets/ShootCrouch.png', { frameWidth: 256, frameHeight: 256 });
       this.load.spritesheet('infanterySoldierSheetDeadCrouch', 'Assets/Images/SpriteSheets/DeadCrouch.png', { frameWidth: 256, frameHeight: 256 });
       this.load.spritesheet('infanterySoldierSheetDead', 'Assets/Images/SpriteSheets/Dead.png', { frameWidth: 256, frameHeight: 256 });

       //AUDIOS
       this.load.audio('backgroundMusic', 'Assets/Audio/SendThemAllToTheTrench.mp3');
       this.load.audio('gunRifleShoot', 'Assets/Audio/Effects/GunRifleShoot.mp3');

       //VIDEOS
       this.load.video({
        key: 'intro',
        url: ['Assets/Videos/VideoTrailer.mp4'],
        asBlob: false, // mirar si poner un video como un blob arregla los problemas de compatibilidad con firefox
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
            this.scene.start('Gameplay');
        })
    }
    create() {
        //ANIMS
        this.anims.create({
            key: 'infanterySoldierMoving',
            frames: this.anims.generateFrameNumbers('infanterySoldierSheetMoving', { start: 0, end: 5 }),
            frameRate: 13,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierIdle',
            frames: this.anims.generateFrameNumbers('infanterySoldierSheetIdle', { start: 0, end: 9 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierAttacking',
            frames: this.anims.generateFrameNumbers('infanterySoldierAttacking', { start: 0, end: 5 }),
            frameRate: 13,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierAttackingCrouch',
            frames: this.anims.generateFrameNumbers('infanterySoldierAttackingCrouch', { start: 0, end: 5 }),
            frameRate: 13,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierReload',
            frames: this.anims.generateFrameNumbers('infanterySoldierSheetMoving', { start: 0, end: 9 }),
            frameRate: 13,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierReloadCrouch',
            frames: this.anims.generateFrameNumbers('infanterySoldierSheetMoving', { start: 0, end: 9 }),
            frameRate: 13,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierIdleCrouch',
            frames: this.anims.generateFrameNumbers('infanterySoldierSheetMoving', { start: 0, end: 9 }),
            frameRate: 13,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierDead',
            frames: this.anims.generateFrameNumbers('infanterySoldierSheetDead', { start: 0, end: 19 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierDeadCrouch',
            frames: this.anims.generateFrameNumbers('infanterySoldierSheetDeadCrouch', { start: 0, end: 9 }),
            frameRate: 6,
            repeat: 0
        });


    }
}