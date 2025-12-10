export class SelectTroopsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SelectTroopsScene' });
        this.equipedTroops = [];
        this.buttons = [];
    }

    preload() {
        console.log("Inicia el TroopSelection");
    }

    createButton(typeName, index, params){
        console.log(params)
        let soldierButton = this.add.image(params.centerX - params.offsetX + 130 * index, params.centerY + 190, typeName).setScale(0.35);
        soldierButton.setInteractive();
        soldierButton.on('pointerdown', () => {
            this.addTroop(typeName);
            console.log("EquipedTroops: " + this.equipedTroops);
        });
        this.buttons.push(soldierButton);
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        let offsetX = 195

        this.add.image(centerX, centerY, 'troopSelectionBackground').setScale(0.65);

        let params = {centerX, centerY, offsetX};

        // Army Buttons
        this.createButton('InfanterySoldierButton', 0, params);
        this.createButton('SniperSoldierButton', 1, params);
        this.createButton('AssaultSoldierButton', 2, params);

        // Soon Troops
        let i = 3;
        while (i < 4) {
            this.add.image(centerX - offsetX + 130 * i, centerY + 190, 'SquareFrame').setScale(0.35);
            this.add.bitmapText(centerX - offsetX + 130 * i, centerY + 185, 'SquadaOne', 'Soon', 40)
                .setOrigin(0.5)
                .setTintFill(0xa37e48);
            i++;
        }

        //ReadyButton

        this.readyButton = this.add.image(centerX * 2 - 40, centerY * 2 - 40, 'Ready').setScale(0.35);
        this.readyButton.on('pointerdown', () => {
            this.scene.start('Gameplay', { equippedTroops: this.equipedTroops });
        });
        this.readyText = this.add.bitmapText(centerX * 2 - 45, centerY * 2 - 65, 'SquadaOne', 'Ready!', 30)
            .setOrigin(0.5)
            .setTintFill(0xffffff);

        this.gridGroup = this.add.group();
        this.renderGrid();

        // Tittle
        this.add.image(centerX, centerY - 190, 'RectangleFrame').setScale(0.6, 0.3);
        this.add.bitmapText(centerX, centerY - 195, 'SquadaOne', 'Troop Selector', 60)
            .setOrigin(0.5)
            .setTintFill(0xffffff);
    }

    addTroop(type) {
        if (this.equipedTroops.length >= 10) return
        this.equipedTroops.push(type); // Use push to add to the array
        this.renderGrid();
    }

    removeTroop(pos) {
        this.equipedTroops.splice(pos, 1);
        this.renderGrid();
    }

    // create a grid of buttons reading the equipedTroops
    renderGrid() {
        let index = 0
        this.gridGroup.clear(true, true);

        let gridSpace = 105;
        let offsetX = 270;

        // Initial render
        while (index < 10) {
            let empty = this.add.image(index % 5 * gridSpace + offsetX, Phaser.Math.FloorTo(index / 5) * gridSpace + 200, 'NoTroop').setScale(0.3);
            this.gridGroup.add(empty);
            index++;
        }

        index = 0

        // Render of troops
        this.equipedTroops.forEach((troop, i) => {
            console.log(troop)
            let infanteryButton = this.add.image(index % 5 * gridSpace + offsetX, Phaser.Math.FloorTo(index / 5) * gridSpace + 200, troop).setScale(0.3);
            infanteryButton.setInteractive();
            this.gridGroup.add(infanteryButton);

            infanteryButton.on('pointerdown', () => {
                this.removeTroop(i);
                console.log("EquipedTroops: " + this.equipedTroops);
                infanteryButton.destroy();
            });
            index++;
        });

        // Render ReadyButton
        if (this.equipedTroops.length < 1) {
            this.readyButton.disableInteractive()
            this.readyButton.setTint(0x555555);
            this.readyText.setTintFill(0x555555);
        }
        else {
            this.readyButton.setInteractive()
            this.readyButton.clearTint();
            this.readyText.setTintFill(0xffffff);
        }
    }
}