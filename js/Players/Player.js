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
        if (this.canInteract) {
            this.armies = this.scene.getArmies(false);
            const selectedArmy = this.armies[this.selectedNumber - 1];
            if (!selectedArmy) return;
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
            else{
                // "Ya estamos intentando avanzar señor!"
            }
        }
    }
}
