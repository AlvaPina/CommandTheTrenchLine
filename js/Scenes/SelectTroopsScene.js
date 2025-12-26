import { getTroopStatsFromButtonKey } from '../Armies/TroopRegistry.js'

export class SelectTroopsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SelectTroopsScene' });
        this.equipedTroops = [];
        this.buttons = [];
    }

    preload() {
        console.log("Inicia el TroopSelection");
    }

    createButton(typeName, index, params) {
        let soldierButton = this.add.image(params.centerX - params.offsetX + 130 * index, params.centerY + 190, typeName).setScale(0.35);
        soldierButton.setInteractive();
        this.attachTooltipToGameObject(soldierButton, typeName); // Tooltip (hover)
        soldierButton.on('pointerdown', () => {
            this.addTroop(typeName);
        });
        this.buttons.push(soldierButton);
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        let offsetX = 195

        this.add.image(centerX, centerY, 'troopSelectionBackground').setScale(0.65);

        let params = { centerX, centerY, offsetX };

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

        this.createTroopTooltip();

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

    createTroopTooltip() {
        // Container para agrupar rect + texto
        this.troopTooltip = this.add.container(0, 0).setDepth(9999).setVisible(false);

        this.troopTooltipBg = this.add.graphics();
        this.troopTooltipText = this.add.text(0, 0, '', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ffffff',
            align: 'left',
            wordWrap: { width: 260 }
        });

        this.troopTooltip.add([this.troopTooltipBg, this.troopTooltipText]);

        // para seguir el ratón mientras está visible
        this.input.on('pointermove', (pointer) => {
            if (!this.troopTooltip.visible) return;
            this.positionTooltip(pointer);
        });
    }

    formatTroopStats(buttonKey) {
        const s = getTroopStatsFromButtonKey(buttonKey);
        if (!s) return `Sin datos para: ${buttonKey}`;

        const totalHealth = s.SoldierHealth * s.NumberOfSoldiers;

        return [
            `${s.DisplayName ?? buttonKey}`,
            ``,
            `HP soldado: ${s.SoldierHealth}`,
            `Soldados: ${s.NumberOfSoldiers}`,
            `HP total: ${totalHealth}`,
            `Daño: ${s.ArmyDamage}`,
            `Velocidad: ${s.ArmySpeed}`,
            `Rango visión: ${s.DistanceView}`,
        ].join('\n');
    }

    showTroopTooltip(pointer, buttonKey) {
        const text = this.formatTroopStats(buttonKey);

        this.troopTooltipText.setText(text);

        // dibujar rect según el tamaño del texto
        const pad = 10;
        const bounds = this.troopTooltipText.getBounds();

        this.troopTooltipBg.clear();
        this.troopTooltipBg.fillStyle(0x000000, 0.85);
        this.troopTooltipBg.lineStyle(2, 0xffffff, 0.9);

        // rect redondeado
        const w = bounds.width + pad * 2;
        const h = bounds.height + pad * 2;
        this.troopTooltipBg.fillRoundedRect(0, 0, w, h, 10);
        this.troopTooltipBg.strokeRoundedRect(0, 0, w, h, 10);

        // coloca texto dentro
        this.troopTooltipText.setPosition(pad, pad);

        this.troopTooltip.setVisible(true);
        this.positionTooltip(pointer);
    }

    hideTroopTooltip() {
        this.troopTooltip.setVisible(false);
    }

    positionTooltip(pointer) {
        const margin = 12;
        const cam = this.cameras.main;

        // posición “ideal” al lado del cursor (en pantalla)
        let x = pointer.x + margin;
        let y = pointer.y + margin;

        // tamaño del tooltip
        const b = this.troopTooltip.getBounds();
        const w = b.width;
        const h = b.height;

        // clamp dentro de la pantalla
        const maxX = cam.width - w - margin;
        const maxY = cam.height - h - margin;

        x = Phaser.Math.Clamp(x, margin, maxX);
        y = Phaser.Math.Clamp(y, margin, maxY);

        // IMPORTANTE: el tooltip está en coords de pantalla (UI), no del mundo
        this.troopTooltip.setScrollFactor(0);
        this.troopTooltip.setPosition(x, y);
    }

    attachTooltipToGameObject(go, buttonKey) {
        // hover
        go.on('pointerover', (pointer) => this.showTroopTooltip(pointer, buttonKey));
        go.on('pointerout', () => this.hideTroopTooltip());

        // opcional: si quieres que al hacer click también se oculte
        go.on('pointerdown', () => this.hideTroopTooltip());
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
            let infanteryButton = this.add.image(index % 5 * gridSpace + offsetX, Phaser.Math.FloorTo(index / 5) * gridSpace + 200, troop).setScale(0.3);
            infanteryButton.setInteractive();
            this.attachTooltipToGameObject(infanteryButton, troop); // Tooltip (hover)
            this.gridGroup.add(infanteryButton);

            infanteryButton.on('pointerdown', () => {
                this.removeTroop(i);
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