export class SelectTroopsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SelectTroopsScene' });
        this.equipedTroops = [];
    }

    preload() {
        console.log("Inicia el TroopSelection");
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.add.image(centerX, centerY, 'troopSelectionBackground');

        // Infantery Button
        let infanteryButton = this.add.image(centerX - 175, centerY + 190, 'InfanterySoldierButton').setScale(0.35);
        infanteryButton.setInteractive();

        infanteryButton.on('pointerdown', () => {
            this.addTroop("InfanterySoldierButton");
            console.log("EquipedTroops: " + this.equipedTroops);
        });

        // Soon Troops
        let i = 1;
        while (i < 4) {
            this.add.image(centerX - 175 + 130*i, centerY + 190, 'Soon').setScale(0.35);
            i++;
        }

        //ReadyButton
        this.readyButton = this.add.image(centerX * 2 - 50, centerY * 2 - 50, 'Ready').setScale(0.35);
        this.readyButton.on('pointerdown', () => {
            this.scene.start('Gameplay', { equippedTroops: this.equipedTroops });
        });
        infanteryButton.setInteractive()

        this.gridGroup = this.add.group();
        this.renderGrid();
    }

    addTroop(type) {
        if (this.equipedTroops.length >= 10) return
        this.equipedTroops.push(type); // Use push to add to the array
        this.renderGrid();
    }

    removeTroop(pos) {
        this.equipedTroops.pop(pos)
        this.renderGrid();
    }

    // create a grid of buttons reading the equipedTroops
    renderGrid() {
        let index = 0
        this.gridGroup.clear(true, true);

        // Initial render
        while (index < 10) {
            let empty = this.add.image(index % 5 * 100 + 300, Phaser.Math.FloorTo(index / 5) * 100 + 200, 'NoTroop').setScale(0.3);
            this.gridGroup.add(empty);
            index++;
        }

        index = 0

        // Render of troops
        this.equipedTroops.forEach(troop => {
            let infanteryButton = this.add.image(index % 5 * 100 + 300, Phaser.Math.FloorTo(index / 5) * 100 + 200, troop).setScale(0.3);
            infanteryButton.setInteractive();
            this.gridGroup.add(infanteryButton);

            infanteryButton.on('pointerdown', () => {
                this.removeTroop(index);
                console.log("EquipedTroops: " + this.equipedTroops);
                infanteryButton.destroy();
            });
            index++;
        });

        // Render ReadyButton
        if (this.equipedTroops.length < 1) {
            this.readyButton.disableInteractive()
            this.readyButton.setTint(0x555555);
        }
        else {
            this.readyButton.setInteractive()
            this.readyButton.clearTint();
        }
    }
}