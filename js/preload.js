class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {

    }

    create() {
        this.scene.start('StartScene');
    }
}

export default PreloadScene;
