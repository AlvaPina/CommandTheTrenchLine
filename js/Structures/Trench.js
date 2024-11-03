export default class Trench extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'trenchImage');
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
