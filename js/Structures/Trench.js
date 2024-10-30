export default class Trench extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'trenchImage');
        this.scene = scene;
        this.scene.add.existing(this);

        this.scene.physics.add.existing(this, true); // "true" lo hace estatico

        // Ajustar el tamaño y el área del collider si es necesario
        this.setSize(this.width, this.height); // Configura el área del collider al tamaño de la imagen
        this.setOrigin(0.5, 0.5); // Establece el origen al centro (opcional)
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }
}
