import PreloadScene from './preload.js';
import GameScene from './GameScene.js';
import EndScene from './EndScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000', 
    scene: [PreloadScene, GameScene, EndScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
