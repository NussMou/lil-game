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
        // this.particles = this.add.particles('white');
        

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

        particles.startFollow(this.circle);

        this.stars = this.physics.add.group();

        // 定时生成随机星星
        this.time.addEvent({
            delay: 1000, // 每秒生成一个星星
            callback: this.spawnStar,
            callbackScope: this,
            loop: true
        });

        this.physics.add.overlap(this.circle, this.stars, this.collectStar, null, this);

        
    }

    spawnStar() {
        const x = Phaser.Math.Between(0, 800);
        const y = Phaser.Math.Between(0, 600);
        // const star = this.stars.create(x, y, 'star');
        // star.setBounce(Phaser.Math.FloatBetween(0.4, 0.8));
        // star.setCollideWorldBounds(true);
        const star = this.add.circle(x, y, 5, 0x000000);
        this.physics.add.existing(star);
        star.body.setBounce(Phaser.Math.FloatBetween(0.4, 0.8));
        star.body.setCollideWorldBounds(true);
        this.stars.add(star);

        const starParticle = this.add.image(x, y, 'red').setAlpha(0.5).setScale(0.2);;
        star.particles = [starParticle];

        // const starParticles = this.add.particles('red');
        // const starEmitter = starParticles.createEmitter({
        //     speed: 50,
        //     scale: { start: 0.2, end: 0 },
        //     blendMode: 'ADD'
        // });
        // starEmitter.startFollow(star);
    }

    collectStar(circle, star) {
        star.body.enable = false; // 禁用物理体
        star.setVisible(false);   // 使星星不可见
        star.setActive(false);    // 使星星失活
        if (star.particles) {
            star.particles.forEach(particle => particle.destroy()); // 销毁粒子
        }
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
        // 检测星星与黑球的距离，并让星星向黑球移动
        this.stars.children.iterate((star) => {
            const distance = Phaser.Math.Distance.Between(star.x, star.y, this.circle.x, this.circle.y);
            if (distance < 80) { // 距离小于200时，星星向黑球移动
                this.physics.moveToObject(star, this.circle, 100);
            } else {
                star.body.setVelocity(0);
            }
            if (star.particles) {
                star.particles.forEach(particle => {
                    particle.x = star.x;
                    particle.y = star.y;
                });
            }
        });
    }
}

export default GameScene;