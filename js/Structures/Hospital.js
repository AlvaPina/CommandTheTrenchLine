import LifeComponent from '../Armies/LifeComponent.js';

export default class Hospital extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, armyTeam) {
        let texture;
        if(armyTeam) texture = 'hospitalGreen';
        else texture = 'hospitalGrey';
        
        super(scene, x, y - 50, texture);

        this.scene = scene;
        this.scene.add.existing(this);

        this.scene.physics.add.existing(this, true); // "true" lo hace estatico

        this.setOrigin(0.5, 0.5);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }
}
