export class LoadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadScene' });
    }

    preload() {
        //IMAGES
        this.load.image("ground", "Assets/Images/Map/Parallax/Ground.png");
        this.load.image("groundDecoration", "Assets/Images/Map/Parallax/GroundDecoration.png");
        this.load.image("sky", "Assets/Images/Map/Parallax/Sky.png");
        this.load.image("rockLine", "Assets/Images/Map/Parallax/RockLine.png");

        this.load.image("trench", "Assets/Images/Map/Props/Trench.png");
        this.load.image("trench2", "Assets/Images/Map/Props/Trench2.png");
        this.load.image("fence", "Assets/Images/Map/Props/Fence.png");
        this.load.image("clouds", "Assets/Images/Map/Props/nube.png");
        this.load.image("trees", "Assets/Images/Map/Props/arboles.png");
        this.load.image("hospitalGreen", "Assets/Images/Map/Props/HospitalGreen.png");
        this.load.image("hospitalGrey", "Assets/Images/Map/Props/HospitalGrey.png");

        this.load.image("BaseGreen", "Assets/Images/Map/Props/BaseGreen.png");
        this.load.image("BaseGrey", "Assets/Images/Map/Props/BaseGrey.png");

        this.load.image("infanterySoldierGreen", "Assets/Images/Gui/InfanteryIconGreen.png");
        this.load.image("medicSoldierGreen", "Assets/Images/Gui/MedicIconGreen.png");
        this.load.image("sniperSoldierGreen", "Assets/Images/Gui/SniperIconGreen.png");
        this.load.image("assaultSoldierGreen", "Assets/Images/Gui/AssaultIconGreen.png");
        this.load.image("tankSoldierGreen", "Assets/Images/Gui/TankIconGreen.png");

        this.load.image("infanterySoldierGrey", "Assets/Images/Gui/InfanteryIconGrey.png");
        this.load.image("medicSoldierGrey", "Assets/Images/Gui/MedicIconGrey.png");
        this.load.image("sniperSoldierGrey", "Assets/Images/Gui/SniperIconGrey.png");
        this.load.image("assaultSoldierGrey", "Assets/Images/Gui/AssaultIconGrey.png");
        this.load.image("tankSoldierGrey", "Assets/Images/Gui/TankIconGrey.png");

        this.load.image("barGreen", "Assets/Images/Gui/GreenBarra.png");
        this.load.image("barGrey", "Assets/Images/Gui/GreyBarra.png");

        this.load.image("troopSelectionBackground", "Assets/Images/Gui/TroopSelector/Background.png");
        this.load.image("NoTroop", "Assets/Images/Gui/TroopSelector/NoTroop.png");
        this.load.image("Soon", "Assets/Images/Gui/TroopSelector/Soon.png");
        this.load.image("InfanterySoldierButton", "Assets/Images/Gui/TroopSelector/InfanterySoldier.png");
        this.load.image("SniperSoldierButton", "Assets/Images/Gui/TroopSelector/SniperSoldier.png");
        this.load.image("AssaultSoldierButton", "Assets/Images/Gui/TroopSelector/AssaultSoldier.png");
        this.load.image("TankSoldierButton", "Assets/Images/Gui/TroopSelector/TankSoldier.png");
        this.load.image("Ready", "Assets/Images/Gui/TroopSelector/Ready.png");

        this.load.image("RectangleFrame", "Assets/Images/Gui/ButtonFrame.png");
        this.load.image("SquareFrame", "Assets/Images/Gui/SquareFrame.png");
        this.load.image("shield", "Assets/Images/Gui/Shield.png");
        this.load.image("flee", "Assets/Images/Gui/Flee.png");
        this.load.image("healing", "Assets/Images/Gui/healing.png");
        this.load.image("inCombat", "Assets/Images/Gui/InCombat.png");

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

        this.load.spritesheet('lightTankGreenMovingSheet', 'Assets/Images/SpriteSheets/Green/Tank/TankMoving.png', { frameWidth: 512, frameHeight: 512 });
        this.load.spritesheet('lightTankGreenShootSheet', 'Assets/Images/SpriteSheets/Green/Tank/LightTankShoot.png', { frameWidth: 512, frameHeight: 512 });
        this.load.spritesheet('lightTankGreenOpenSheet', 'Assets/Images/SpriteSheets/Green/Tank/LightTankOpen.png', { frameWidth: 512, frameHeight: 512 });
        this.load.spritesheet('lightTankGreenDeadSheet', 'Assets/Images/SpriteSheets/Green/Tank/LightTankDead.png', { frameWidth: 1024, frameHeight: 512 });
        this.load.spritesheet('lightTankGreenDeadLoopSheet', 'Assets/Images/SpriteSheets/Green/Tank/LightTankDeadLoop.png', { frameWidth: 1024, frameHeight: 512 });

        this.load.spritesheet('lightTankGreyMovingSheet', 'Assets/Images/SpriteSheets/Grey/Tank/TankMoving.png', { frameWidth: 512, frameHeight: 512 });
        this.load.spritesheet('lightTankGreyShootSheet', 'Assets/Images/SpriteSheets/Grey/Tank/LightTankShoot.png', { frameWidth: 512, frameHeight: 512 });
        this.load.spritesheet('lightTankGreyOpenSheet', 'Assets/Images/SpriteSheets/Grey/Tank/LightTankOpen.png', { frameWidth: 512, frameHeight: 512 });
        this.load.spritesheet('lightTankGreyDeadSheet', 'Assets/Images/SpriteSheets/Grey/Tank/LightTankDead.png', { frameWidth: 512, frameHeight: 512 });
        this.load.spritesheet('lightTankGreyDeadLoopSheet', 'Assets/Images/SpriteSheets/Grey/Tank/LightTankDeadLoop.png', { frameWidth: 512, frameHeight: 512 });

        //AUDIOS
        this.load.audio('trailerBackgroundMusic', 'Assets/Audio/MarchOfToys.mp3');
        this.load.audio('menuBackgroundMusic', 'Assets/Audio/EchoesOfTheTrenches.mp3');
        this.load.audio('finalSoundWin', 'Assets/Audio/Effects/FinalSoundWin.wav');
        this.load.audio('finalSoundGameOver', 'Assets/Audio/Effects/FinalSoundGameOver.wav');
        this.load.audio('gameplayBackgroundMusic', 'Assets/Audio/MusicAmbienceGameplay.m4a');

        this.load.audio('gunRifleShoot1', 'Assets/Audio/Effects/Shoots/Shoot1.MP3');
        this.load.audio('gunRifleShoot2', 'Assets/Audio/Effects/Shoots/Shoot2.MP3');
        this.load.audio('gunRifleShoot3', 'Assets/Audio/Effects/Shoots/Shoot3.MP3');
        this.load.audio('gunRifleShoot4', 'Assets/Audio/Effects/Shoots/Shoot4.MP3');
        this.load.audio('gunRifleShoot5', 'Assets/Audio/Effects/Shoots/Shoot5.MP3');

        this.load.audio('silbatoGuerra', 'Assets/Audio/Effects/SilbatoGuerra.MP3');
        this.load.audio('explosion', 'Assets/Audio/Effects/explosion.mp3');

        // VOCES
        // Ataques
        this.load.audio('voiceAttack1', 'Assets/Audio/Effects/Voices/Ataque1.m4a');
        this.load.audio('voiceAttack2', 'Assets/Audio/Effects/Voices/Ataque2.m4a');
        this.load.audio('voiceAttack3', 'Assets/Audio/Effects/Voices/Ataque3.m4a');
        this.load.audio('voiceAttack4', 'Assets/Audio/Effects/Voices/Ataque4.m4a');
        this.load.audio('voiceAttack5', 'Assets/Audio/Effects/Voices/Ataque5.m4a');
        // Avanzar
        this.load.audio('voiceAdvance1', 'Assets/Audio/Effects/Voices/avanzar1.m4a');
        this.load.audio('voiceAdvance2', 'Assets/Audio/Effects/Voices/avanzar2.m4a');
        this.load.audio('voiceAdvance3', 'Assets/Audio/Effects/Voices/avanzar3.m4a');
        this.load.audio('voiceAdvance4', 'Assets/Audio/Effects/Voices/avanzar4.m4a');
        // Muertes
        this.load.audio('voiceDeath1', 'Assets/Audio/Effects/Voices/muerte1.m4a');
        this.load.audio('voiceDeath2', 'Assets/Audio/Effects/Voices/muerte2.m4a');
        this.load.audio('voiceDeath3', 'Assets/Audio/Effects/Voices/muerte3.m4a');
        this.load.audio('voiceDeath4', 'Assets/Audio/Effects/Voices/muerte4.m4a');
        // Retirada
        this.load.audio('voiceRetreat', 'Assets/Audio/Effects/Voices/retirada.m4a');
        // Ya avanzando
        this.load.audio('voiceAlreadyAdvancing', 'Assets/Audio/Effects/Voices/ya_avanzando.m4a');


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

        //////

        this.anims.create({
            key: 'lightTankGreenMoving',
            frames: this.anims.generateFrameNumbers('lightTankGreenMovingSheet', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'lightTankGreenAttacking',
            frames: this.anims.generateFrameNumbers('lightTankGreenShootSheet', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'lightTankGreenOpen',
            frames: this.anims.generateFrameNumbers('lightTankGreenOpenSheet', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'lightTankGreenDying',
            frames: this.anims.generateFrameNumbers('lightTankGreenDeadSheet', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'lightTankGreenDeadLoop',
            frames: this.anims.generateFrameNumbers('lightTankGreenDeadLoopSheet', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: -1
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

        //////

        this.anims.create({
            key: 'lightTankGreyMoving',
            frames: this.anims.generateFrameNumbers('lightTankGreyMovingSheet', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'lightTankGreyAttacking',
            frames: this.anims.generateFrameNumbers('lightTankGreyShootSheet', { start: 0, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'lightTankGreyOpen',
            frames: this.anims.generateFrameNumbers('lightTankGreyOpenSheet', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'lightTankGreyDying',
            frames: this.anims.generateFrameNumbers('lightTankGreyDeadSheet', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: 0
        });

        this.anims.create({
            key: 'lightTankGreyDeadLoop',
            frames: this.anims.generateFrameNumbers('lightTankGreyDeadLoopSheet', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });
    }
}