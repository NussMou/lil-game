class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // this.load.image('blackBall', 'assets/blackBall.png');
        // this.load.image('smallDot', 'assets/smallDot.png');
    }

    create() {
        this.scene.start('GameScene');
    }
}

export default PreloadScene;
