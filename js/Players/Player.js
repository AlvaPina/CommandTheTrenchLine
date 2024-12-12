export default class Player {
    constructor(scene, armies) {
        this.scene = scene;
        this.armies = armies;
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
                console.log(`Numero de ejercito seleccionado: ${this.selectedNumber}`);
            }
        });
    }

    update() {
        if (this.canInteract) {
            if (this.cursors.right.isDown) {
                this.canInteract = false;
                this.armies[this.selectedNumber - 1].moveArmy(400);
                setTimeout(() => this.canInteract = true, this.inputDelay);
            } else if (this.cursors.left.isDown) {
                this.canInteract = false;
                this.armies[this.selectedNumber - 1].moveArmy(-400);
                setTimeout(() => this.canInteract = true, this.inputDelay);
            }
        }
    }
}
