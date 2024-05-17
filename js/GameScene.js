class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // 動態生成黑球
        this.blackBalls = this.physics.add.group();

        for (let i = 0; i < 20; i++) {
            this.createBlackBall(
                Phaser.Math.Between(100, 700),
                Phaser.Math.Between(100, 500),
                0x000000,
                0xff0000
            );
        }

        // 延遲呼叫，清除黑球，並生成主角黑球
        this.time.delayedCall(2000, () => {
            this.blackBalls.clear(true, true);
            this.playerBall = this.createBlackBall(400, 300, 0x000000, 0xff0000);
            this.addSmallDots();
        }, [], this);
    }

    createBlackBall(x, y, fillColor, outlineColor) {
        const ball = this.add.graphics({ x: x, y: y });
        ball.fillStyle(fillColor, 1);
        ball.fillCircle(0, 0, 20);
        ball.lineStyle(2, outlineColor, 1);
        ball.strokeCircle(0, 0, 20);

        // 添加物理屬性
        this.physics.add.existing(ball);
        ball.body.setCircle(20);
        ball.body.setCollideWorldBounds(true);
        ball.body.setBounce(1);

        this.blackBalls.add(ball);
        ball.body.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));

        return ball;
    }

    addSmallDots() {
        this.smallDots = this.physics.add.group();

        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(50, 750);
            const y = Phaser.Math.Between(50, 550);
            const dot = this.createSmallDot(x, y);
            this.smallDots.add(dot);
        }

        this.physics.add.overlap(this.playerBall, this.smallDots, this.collectDot, null, this);
    }

    createSmallDot(x, y) {
        const dot = this.add.graphics({ x: x, y: y });
        dot.fillStyle(0x00ff00, 1);
        dot.fillCircle(0, 0, 5);

        this.physics.add.existing(dot);
        dot.body.setCircle(5);
        dot.body.setCollideWorldBounds(true);
        dot.body.setBounce(1);

        return dot;
    }

    collectDot(player, dot) {
        dot.destroy();
        // 增加經驗值的邏輯
    }

    update() {
        // 更新遊戲邏輯
    }
}

export default GameScene;
