class EndScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EndScene' });
    }

    create() {
        this.add.text(400, 300, 'Game Over', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5);
        this.input.on('pointerdown', () => this.scene.start('GameScene'));
    }
}

export default EndScene;
