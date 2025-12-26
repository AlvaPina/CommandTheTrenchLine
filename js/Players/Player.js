export default class Player {
    constructor(scene) {
        this.scene = scene;
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.numberKeys = this.scene.input.keyboard.addKeys({
            one: Phaser.Input.Keyboard.KeyCodes.ONE,
            two: Phaser.Input.Keyboard.KeyCodes.TWO,
            three: Phaser.Input.Keyboard.KeyCodes.THREE,
            four: Phaser.Input.Keyboard.KeyCodes.FOUR,
            five: Phaser.Input.Keyboard.KeyCodes.FIVE,
            six: Phaser.Input.Keyboard.KeyCodes.SIX,
            seven: Phaser.Input.Keyboard.KeyCodes.SEVEN,
            eight: Phaser.Input.Keyboard.KeyCodes.EIGHT,
            nine: Phaser.Input.Keyboard.KeyCodes.NINE,
        });

        this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.selectedNumber = 1; // Numero seleccionado
        this.inputDelay = 100; // Cooldown en milisegundos
        this.canInteract = true;

        this.setupNumberInput();
    }

    // Guardar el numero de ejercito seleccionado
    setupNumberInput() {
        this.scene.input.keyboard.on('keydown', (event) => {
            if (event.keyCode >= Phaser.Input.Keyboard.KeyCodes.ONE && event.keyCode <= Phaser.Input.Keyboard.KeyCodes.NINE) {
                this.selectedNumber = parseInt(event.key);
            }
        });
    }

    update() {
        this.armies = this.scene.getArmies(false);

        // Si te quedas con un número fuera de rango (porque ha el army), clamp:
        if (this.selectedNumber < 1) this.selectedNumber = 1;
        if (this.selectedNumber > this.armies.length) this.selectedNumber = this.armies.length;

        // Pintar highlight en el seleccionado
        for (let i = 0; i < this.armies.length; i++) {
            const a = this.armies[i];
            if (a && a.setSelected) a.setSelected(i === this.selectedNumber - 1);
        }

        const selectedArmy = this.armies[this.selectedNumber - 1];
        if (!selectedArmy) return;

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            selectedArmy.setState('Fleeing');
        }

        if (this.canInteract) {
            let moved = false;

            if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
                moved = selectedArmy.moveArmyWithArrows('right');
            } else if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
                moved = selectedArmy.moveArmyWithArrows('left');
            }

            if (moved) {
                this.canInteract = false;
                this.scene.sound.play('silbatoGuerra', { volume: 0.5 });
                setTimeout(() => this.canInteract = true, this.inputDelay);
            }
        }
    }
}
