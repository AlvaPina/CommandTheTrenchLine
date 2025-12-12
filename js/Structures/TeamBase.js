import LifeComponent from '../Armies/LifeComponent.js';

export default class TeamBase extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, armyTeam) {
        let texture;
        if(armyTeam) texture = 'BaseGreen'
        else texture = 'BaseGrey'
        
        super(scene, x, y - 50, texture);

        this.scene = scene;
        this.scene.add.existing(this);

        this.scene.physics.add.existing(this, true); // "true" lo hace estatico

        this.setOrigin(0.5, 0.5);

        this.armyTeam = armyTeam;
        this.isDestroyed = false;

        const baseHealth = 2500;
        this.lifeComponent = new LifeComponent(baseHealth, this, {
            team: this.armyTeam,
            barWidth: 120,
            barHeight: 40,
            offsetX: armyTeam ? 80 : -80,
            offsetY: -190,
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }

    addHealth(amount) {
        if (this.isDestroyed) return;

        this.lifeComponent.addHealth(amount);
        if (this.lifeComponent.isDead()) {
            this._onDestroyed();
        }
    }

    _onDestroyed() {
        if (this.isDestroyed) return;
        this.isDestroyed = true;

        this.setTint(0x555555);

        // avisamos a la escena para que haga el game over
        if (this.scene && this.scene.onBaseDestroyed) {
            this.scene.onBaseDestroyed(this);
        }
    }
}
