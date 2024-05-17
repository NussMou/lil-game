class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.setBaseURL('https://labs.phaser.io');
        this.load.image('red', 'assets/particles/red.png');
        // this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    }

    create() {
        this.cameras.main.setBackgroundColor('#000030');

        // 创建一个可操作的黑色圆形
        this.circle = this.add.circle(400, 300, 20, 0x000000);
        this.physics.add.existing(this.circle);
        this.circle.body.setCollideWorldBounds(true);

        // 创建光标键输入
        this.cursors = this.input.keyboard.createCursorKeys();
        this.particles = this.add.particles('white');
        

        // this.tweens.add({
        //     targets: this.circle,
        //     angle: 360,
        //     duration: 1000,
        //     repeat: -1
        // });

        // 创建粒子效果
        const particles = this.add.particles(0, 0, 'red', {
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        });

        // const logo = this.physics.add.image(400, 100, 'logo');
        // logo.setVelocity(100, 200);
        // logo.setBounce(1, 1);
        // logo.setCollideWorldBounds(true);

        particles.startFollow(this.circle);
        
    }

    update() {
        const speed = 200;

        // 重置速度
        this.circle.body.setVelocity(0);

        // 根据按键设置速度
        if (this.cursors.left.isDown) {
            this.circle.body.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.circle.body.setVelocityX(speed);
        }

        if (this.cursors.up.isDown) {
            this.circle.body.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.circle.body.setVelocityY(speed);
        }
    }
}

export default GameScene;
