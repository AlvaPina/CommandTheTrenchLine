export class LoadScene extends Phaser.Scene {
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
        this.load.image("clouds", "Assets/Images/Map/Props/nube.png");
        this.load.image("trees", "Assets/Images/Map/Props/arboles.png");

        this.load.image("BaseGreen", "Assets/Images/Map/Props/BaseGreen.png");
        this.load.image("BaseGrey", "Assets/Images/Map/Props/BaseGrey.png");

        this.load.image("infanterySoldierGreen", "Assets/Images/Gui/InfanteryIconGreen.png");
        this.load.image("medicSoldierGreen", "Assets/Images/Gui/MedicIconGreen.png");
        this.load.image("infanterySoldierGrey", "Assets/Images/Gui/InfanteryIconGrey.png");
        this.load.image("medicSoldierGrey", "Assets/Images/Gui/MedicIconGreen.png");

        this.load.image("barGreen", "Assets/Images/Gui/GreenBarra.png");
        this.load.image("barGrey", "Assets/Images/Gui/GreyBarra.png");

        this.load.image("troopSelectionBackground", "Assets/Images/Gui/TroopSelector/Background.png");
        this.load.image("NoTroop", "Assets/Images/Gui/TroopSelector/NoTroop.png");
        this.load.image("Soon", "Assets/Images/Gui/TroopSelector/Soon.png");
        this.load.image("InfanterySoldierButton", "Assets/Images/Gui/TroopSelector/InfanterySoldier.png");
        this.load.image("Ready", "Assets/Images/Gui/TroopSelector/Ready.png");

        this.load.image("RectangleFrame", "Assets/Images/Gui/ButtonFrame.png");
        this.load.image("SquareFrame", "Assets/Images/Gui/SquareFrame.png");

        //SPRITESHEETS
        this.load.spritesheet('infanterySoldierGreenSheetMoving', 'Assets/Images/SpriteSheets/Green/Run.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('infanterySoldierGreenSheetIdle', 'Assets/Images/SpriteSheets/Green/Idle.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('infanterySoldierGreenAttacking', 'Assets/Images/SpriteSheets/Green/Shoot.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('infanterySoldierGreenAttackingCrouch', 'Assets/Images/SpriteSheets/Green/ShootCrouch.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('infanterySoldierGreenSheetDyingCrouch', 'Assets/Images/SpriteSheets/Green/DeadCrouch.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('infanterySoldierGreenSheetDying', 'Assets/Images/SpriteSheets/Green/Dead.png', { frameWidth: 256, frameHeight: 256 });

        this.load.spritesheet('infanterySoldierGreySheetMoving', 'Assets/Images/SpriteSheets/Grey/Run.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('infanterySoldierGreySheetIdle', 'Assets/Images/SpriteSheets/Grey/Idle.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('infanterySoldierGreyAttacking', 'Assets/Images/SpriteSheets/Grey/Shoot.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('infanterySoldierGreyAttackingCrouch', 'Assets/Images/SpriteSheets/Grey/ShootCrouch.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('infanterySoldierGreySheetDyingCrouch', 'Assets/Images/SpriteSheets/Grey/DeadCrouch.png', { frameWidth: 256, frameHeight: 256 });
        this.load.spritesheet('infanterySoldierGreySheetDying', 'Assets/Images/SpriteSheets/Grey/Dead.png', { frameWidth: 256, frameHeight: 256 });

        //AUDIOS
        this.load.audio('trailerBackgroundMusic', 'Assets/Audio/MarchOfToys.mp3');
        this.load.audio('menuBackgroundMusic', 'Assets/Audio/EchoesOfTheTrenches.mp3');
        this.load.audio('finalSoundWin', 'Assets/Audio/Effects/FinalSoundWin.wav');
        this.load.audio('finalSoundGameOver', 'Assets/Audio/Effects/FinalSoundGameOver.wav');

        this.load.audio('gunRifleShoot1', 'Assets/Audio/Effects/Shoots/Shoot1.MP3');
        this.load.audio('gunRifleShoot2', 'Assets/Audio/Effects/Shoots/Shoot2.MP3');
        this.load.audio('gunRifleShoot3', 'Assets/Audio/Effects/Shoots/Shoot3.MP3');
        this.load.audio('gunRifleShoot4', 'Assets/Audio/Effects/Shoots/Shoot4.MP3');
        this.load.audio('gunRifleShoot5', 'Assets/Audio/Effects/Shoots/Shoot5.MP3');

        this.load.audio('silbatoGuerra', 'Assets/Audio/Effects/SilbatoGuerra.MP3');

        //FONTS
        this.load.bitmapFont('SquadaOne', 'Assets/Fonts/SquadaOne.png', 'Assets/Fonts/SquadaOne.xml');

        //VIDEOS
        this.load.video({
            key: 'intro',
            url: ['Assets/Videos/VideoTrailer.mp4'],
            asBlob: false, // mirar si poner un video como un blob arregla los problemas de compatibilidad con firefox
            noAudio: true
        });
        this.load.video({
            key: 'VideoMenu',
            url: ['Assets/Videos/VideoMenu.mp4'],
            asBlob: false, // mirar si poner un video como un blob arregla los problemas de compatibilidad con firefox
            noAudio: true
        });

        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        })

        this.load.on("progress", (percent) => {
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
            //console.log(percent);
        })

        this.load.on("complete", () => {
            this.scene.start('VideoScene');
        })
    }
    create() {
        //ANIMS GREEN
        this.anims.create({
            key: 'infanterySoldierGreenMoving',
            frames: this.anims.generateFrameNumbers('infanterySoldierGreenSheetMoving', { start: 0, end: 5 }),
            frameRate: 13,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierGreenIdle',
            frames: this.anims.generateFrameNumbers('infanterySoldierGreenSheetIdle', { start: 0, end: 9 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierGreenAttacking',
            frames: this.anims.generateFrameNumbers('infanterySoldierGreenAttacking', { start: 0, end: 5 }),
            frameRate: 13,
            repeat: 0
        });

        this.anims.create({
            key: 'infanterySoldierGreenAttackingCrouch',
            frames: this.anims.generateFrameNumbers('infanterySoldierGreenAttackingCrouch', { start: 0, end: 5 }),
            frameRate: 13,
            repeat: 0
        });

        this.anims.create({
            key: 'infanterySoldierGreenIdleCrouch',
            frames: this.anims.generateFrameNumbers('infanterySoldierGreenSheetMoving', { start: 0, end: 9 }),
            frameRate: 13,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierGreenDying',
            frames: this.anims.generateFrameNumbers('infanterySoldierGreenSheetDying', { start: 0, end: 19 }),
            frameRate: 6,
            repeat: 0
        });

        this.anims.create({
            key: 'infanterySoldierGreenDyingCrouch',
            frames: this.anims.generateFrameNumbers('infanterySoldierGreenSheetDyingCrouch', { start: 0, end: 9 }),
            frameRate: 6,
            repeat: 0
        });

        //ANIMS GREY
        this.anims.create({
            key: 'infanterySoldierGreyMoving',
            frames: this.anims.generateFrameNumbers('infanterySoldierGreySheetMoving', { start: 0, end: 5 }),
            frameRate: 13,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierGreyIdle',
            frames: this.anims.generateFrameNumbers('infanterySoldierGreySheetIdle', { start: 0, end: 9 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierGreyAttacking',
            frames: this.anims.generateFrameNumbers('infanterySoldierGreyAttacking', { start: 0, end: 5 }),
            frameRate: 13,
            repeat: 0
        });

        this.anims.create({
            key: 'infanterySoldierGreyAttackingCrouch',
            frames: this.anims.generateFrameNumbers('infanterySoldierGreyAttackingCrouch', { start: 0, end: 5 }),
            frameRate: 13,
            repeat: 0
        });

        this.anims.create({
            key: 'infanterySoldierGreyIdleCrouch',
            frames: this.anims.generateFrameNumbers('infanterySoldierGreySheetMoving', { start: 0, end: 9 }),
            frameRate: 13,
            repeat: -1
        });

        this.anims.create({
            key: 'infanterySoldierGreyDying',
            frames: this.anims.generateFrameNumbers('infanterySoldierGreySheetDying', { start: 0, end: 19 }),
            frameRate: 6,
            repeat: 0
        });

        this.anims.create({
            key: 'infanterySoldierGreyDyingCrouch',
            frames: this.anims.generateFrameNumbers('infanterySoldierGreySheetDyingCrouch', { start: 0, end: 9 }),
            frameRate: 6,
            repeat: 0
        });
    }
}