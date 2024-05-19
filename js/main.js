import StartScene from '../js/StartScene.js';
import GameScene from '../js/GameScene.js';
import ExchangeScene from '../js/ExchangeScene.js';

console.log("main.js test")

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    scene: [StartScene, GameScene, ExchangeScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
};

const game = new Phaser.Game(config);
