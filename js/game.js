import { MenuInicial } from "./Menu.js";
import { LoadScene } from "./PantallaCarga.js";

const config = {
    type: Phaser.AUTO,
    parent: 'game-placeholder',
    width: 960,
    height: 540,
    scene: [MenuInicial , LoadScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    //backgroundColor: '#304858',
};

window.onload = function(){
    var game = new Phaser.Game(config);
}
