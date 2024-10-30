import Army from '../Armies/Army.js';
import Humanoid from '../Armies/Humanoid.js';
import Infantery from '../Armies/Types/InfanteryArmy.js';

export class TestScene extends Phaser.Scene{
    constructor() {
        super({ key: 'TestScene' });
    }

    preload() {
        console.log("Inicia TestScene");
    }
    create() {
        let soldier = new Humanoid(this,this.game.config.width/2, this.game.config.height/2);
        soldier.setScale(0.5);
    }
}