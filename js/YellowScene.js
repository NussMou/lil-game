class YellowScene extends Phaser.Scene {
    constructor() {
        super({ key: 'YellowScene' });
    }

    preload() {
        this.load.setBaseURL('https://labs.phaser.io');
        this.load.image('red', 'assets/particles/red.png'); // 假設你使用的是紅色的星星
        this.load.image('yellowParticle', 'assets/particles/yellow.png'); // 黃色粒子
    }

    create() {
        this.cameras.main.setBackgroundColor('#000030');

        // subject circle，允許發射星星
        this.circle = this.add.circle(100, 300, 10, 0x000000);
        this.physics.add.existing(this.circle);
        this.circle.body.setCollideWorldBounds(true);

        // 為subject添加發射星星的功能
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // 創建黃色粒子
        this.yellowParticle = this.add.circle(300, 300, 10, 0xFFFF00);
        this.physics.add.existing(this.yellowParticle);
        this.yellowParticle.body.setCollideWorldBounds(true);
        this.yellowParticle.body.setBounce(1, 1); // 讓粒子能夠反彈
        this.yellowParticle.body.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100)); // 初始隨機速度

        // 星星群組
        this.stars = this.physics.add.group();

        // 檢測星星和黃色粒子的碰撞
        this.physics.add.collider(this.stars, this.yellowParticle, this.handleCollision, null, this);
    }

    handleCollision(star, yellowParticle) {
        // 碰撞後讓黃色粒子速度減慢，直到為0
        yellowParticle.body.velocity.scale(0.5);
        if (yellowParticle.body.speed < 10) { // 速度小於一定值時停止並生成星星
            yellowParticle.body.setVelocity(0);
            this.spawnStarAt(yellowParticle.x, yellowParticle.y);
        }
    }

    spawnStarAt(x, y) {
        // 在指定位置生成星星
        let star = this.stars.create(x, y, 'red');
        star.body.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
    }

    update() {
        // 控制發射星星
        if (this.spaceKey.isDown) {
            this.shootStar();
        }
    }

    shootStar() {
        let star = this.stars.create(this.circle.x, this.circle.y, 'red');
        // 射出星星的路徑設置為隨機弧線
        let angle = Phaser.Math.DegToRad(Phaser.Math.Between(0, 360));
        star.body.setVelocity(300 * Math.cos(angle), 300 * Math.sin(angle));
    }
}

export default YellowScene;
