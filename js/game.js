import { MenuInicial } from "./Scenes/Menu.js";
import { LoadScene } from "./Scenes/PantallaCarga.js";
import { VideoScene } from "./Scenes/VideoScene.js";
import { SelectTroopsScene } from "./Scenes/SelectTroopsScene.js";
import { Gameplay } from "./Scenes/Gameplay.js";
import { GameOver } from "./Scenes/GameOver.js";
import { TestScene } from "./Scenes/TestScene.js";

const config = {
    type: Phaser.AUTO,
    parent: 'game-placeholder',
    width: 960,
    height: 540,
    scene: [LoadScene, VideoScene, MenuInicial, SelectTroopsScene, Gameplay, GameOver, TestScene],
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
    window.game = new Phaser.Game(config); // para poder acceder de forma global a game con window.game
}
