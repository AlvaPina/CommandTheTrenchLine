export default class TeamBase extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, armyTeam) {
        let texture;
        if(armyTeam) texture = 'BaseGreen'
        else texture = 'BaseGrey'
        
        super(scene, x, y - 50, texture);

        this.scene = scene;
        this.scene.add.existing(this);

        this.scene.physics.add.existing(this, true); // "true" lo hace estatico

        this.setSize(this.width, this.height);
        this.setOrigin(0.5, 0.5);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }
}