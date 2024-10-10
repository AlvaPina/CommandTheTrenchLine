import Army from '../Armies/Army.js';
import Infantery from '../Armies/Soldiers/Infantery.js';

export class TestScene extends Phaser.Scene{
    constructor() {
        super({ key: 'TestScene' });
    }

    preload() {
        console.log("Inicia TestScene");
    }
    create() {
        let soldier = new Infantery(this,this.game.config.width/2, this.game.config.height/2);
        soldier.setScale(0.5);
    }
}