class StartScene extends Phaser.Scene
{
    preload ()
    {
        this.load.setBaseURL('https://labs.phaser.io');
        this.load.image('red', 'assets/particles/red.png');
        // this.load.image('yellow', 'assets/particles/yellow.png');
        // this.load.image('green', 'assets/particles/green.png');
        // this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
        this.load.on('filecomplete', function (key, type, data) {
            console.log(`File loaded: ${key}`);
        });
    
        this.load.on('complete', () => {
            console.log('All files loaded');
        });
    }

    create ()
    {
        this.cameras.main.setBackgroundColor('#000030');

        const emitter = this.add.particles('red').createEmitter({
            x: 400,
            y: 150,
            lifespan: 4000,
            speed: { min: 150, max: 250 },
            scale: { start: 0.8, end: 0 },
            gravityY: 150,
            blendMode: 'ADD',
            // frequency: -1
        });
    
        this.input.on('pointerdown', pointer => {
            emitter.emitParticleAt(pointer.x, pointer.y, 16);
        });

        // this.add.text(10, 10, 'Click to explode emit particles');
        this.time.delayedCall(5000, () => {
            this.scene.start('GameScene'); // 切换场景
        }, [], this);
    }
    update(){
        let spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        if(spaceKey.isDown){
            this.scene.start('GameScene');
        }
    }
}
export default StartScene;