export default class LifeComponent {
    constructor(initialHealth, owner, cfg = {}) {
        this.owner = owner;
        this.scene = owner.scene;
        this.team = !!cfg.team;

        this.initialHealth = initialHealth;
        this.health = initialHealth;

        // tamaños de barrita
        this.barWidth = cfg.barWidth ?? 80;
        this.barHeight = cfg.barHeight ?? 50;
        this.offsetX = cfg.offsetX ?? 0;
        this.offsetY = cfg.offsetY ?? 0;

        // textura de barra
        this.barKey = this.team ? 'barGreen' : 'barGrey';

        // crear barra
        this.lifeBar = null;
        this._createBar();

        // si el owner NO es un container, seguir su posición (Army sí es container por ejemplo)
        this._needsFollow = !this._isOwnerContainer();
        if (this._needsFollow) {
            this._followUpdate = () => this._updateBarPosition();
            this.scene.events.on('update', this._followUpdate);
        }

        this._updateBarVisuals();
    }

    destroy() {
        if (this.lifeBar) this.lifeBar.destroy();
        if (this._needsFollow && this._followUpdate) {
            this.scene.events.off('update', this._followUpdate);
            this._followUpdate = null;
        }
    }

    // === API de vida ===
    addHealth(amount) {
        this.health += amount;
        if (this.health < 0) this.health = 0;
        if (this.health > this.initialHealth) this.health = this.initialHealth;
        this._updateBarVisuals();
    }

    setHealth(value) {
        this.health = Phaser.Math.Clamp(value, 0, this.initialHealth);
        this._updateBarVisuals();
    }

    isDead() {
        return this.health <= 0;
    }

    getRatio() {
        return this.initialHealth > 0 ? this.health / this.initialHealth : 0;
    }

    // === Metodos internos ===

    // Si es un objeto Container
    _isOwnerContainer() {
        return (this.owner instanceof Phaser.GameObjects.Container);
    }

    _createBar() {
        if (this._isOwnerContainer()) {
            // container: la barra vive dentro del container y usa coords locales
            this.lifeBar = this.scene.add.image(this.offsetX, this.offsetY, this.barKey)
                .setOrigin(0.5, 0.5)
                .setDisplaySize(this.barWidth, this.barHeight);
            this.owner.add(this.lifeBar);
        } else {
            // sprite suelto: la barra va en la escena y sigue al sprite
            this.lifeBar = this.scene.add.image(this.owner.x + this.offsetX, this.owner.y + this.offsetY, this.barKey)
                .setOrigin(0.5, 0.5)
                .setDisplaySize(this.barWidth, this.barHeight);
            this.lifeBar.setDepth(10000);
        }
    }

    _updateBarPosition() {
        if (!this.lifeBar) return;
        if (!this._isOwnerContainer()) {
            this.lifeBar.setPosition(this.owner.x + this.offsetX, this.owner.y + this.offsetY);
        }
    }

    _updateBarVisuals() {
        if (!this.lifeBar) return;
        const ratio = this.getRatio();
        this.lifeBar.setDisplaySize(Math.max(0, this.barWidth * ratio * 1.25), this.barHeight);
    }
}
