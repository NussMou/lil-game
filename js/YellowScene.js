class YellowScene extends Phaser.Scene {
    constructor() {
        super({ key: 'YellowScene' });
        this.timerRunning = false;
        this.timer = 0;
    }

    preload() {
        this.load.setBaseURL('https://labs.phaser.io');
        this.load.image('red', 'assets/particles/red.png'); // 假設你使用的是紅色的星星
        this.load.image('yellow', 'assets/particles/yellow.png'); // 黃色粒子
    }

    create() {
        this.cameras.main.setBackgroundColor('#000030');
        this.cnt = 0;
        this.myText = null;

        window.gen_cnt = 0;
        window.overlap_enable = true;

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // this.spaceKey.enabled = false;

        // subject circle
        this.circle = this.add.circle(50, 300, 10, 0x000000);
        this.physics.add.existing(this.circle);
        this.circle.body.setCollideWorldBounds(true);

        // keyboard
        this.cursors = this.input.keyboard.createCursorKeys();

        console.log("Yellow Scene");
        console.log("yellow particle create")
        window.particles = this.add.particles('red').createEmitter({
            speed: 100,
            scale: { start: 0.5, end: 0 }, // Ensure scale is an object
            blendMode: 'ADD'
        });
        particles.startFollow(this.circle);

        // this.switch_circle = this.add.circle(50, 300, 10, 0x000000);
        // this.physics.add.existing(this.switch_circle);
        // this.switch_circle.body.setCollideWorldBounds(true);
        
        const switch_circle = this.physics.add.image(400, 100, 'logo');

        switch_circle.setVelocity(100, 200);
        switch_circle.setBounce(1, 1);
        switch_circle.setCollideWorldBounds(true);

        window.switch_particle = this.add.particles('yellow').createEmitter({
            x:700,
            y:300,
            speed: 100,
            scale: { start: 1, end: 0 }, // Ensure scale is an object
            blendMode: 'ADD'
        });

        switch_particle.startFollow(switch_circle);
        

        this.stars = this.physics.add.group();

        // generate star
        this.time.addEvent({
            delay: 1000, // generate per 1 sec 
            callback: this.spawnStar,
            callbackScope: this,
            loop: true
        });
        this.physics.add.overlap(this.circle, this.stars, this.collectStar, null, this);
    }

    spawnStar(){
        const x = Phaser.Math.Between(0, 800);
        const y = Phaser.Math.Between(0, 600);
    
        // create centen circle
        const star = this.add.circle(x, y, 1, 0xffffff);
        this.physics.add.existing(star);

        star.body.setBounce(Phaser.Math.FloatBetween(0.4, 0.8));
        star.body.setCollideWorldBounds(true);
        this.stars.add(star);
    
        // add particle to star
        const starParticle = this.add.image(x, y, 'yellow').setAlpha(0.5).setScale(0.2);
        star.particles = [starParticle];
    
        // scale up or scale down
        this.tweens.add({
            targets: starParticle,
            scale: { from: 0.1, to: 0.3 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    
        // 晃一個
        this.createStarTween(star);
    }
    
    createStarTween(star) {
        const offsetX = Phaser.Math.Between(-3, 3);
        const offsetY = Phaser.Math.Between(-3, 3);
    
        this.tweens.add({
            targets: star,
            x: star.x + offsetX,
            y: star.y + offsetY,
            duration: 500,
            yoyo: true,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                if (Phaser.Math.Distance.Between(star.x, star.y, this.circle.x, this.circle.y) >= 80) 
                    this.createStarTween(star);
            }
        });
    }

    collectStar(circle, star) {
        star.body.enable = false; // unable
        star.setVisible(false);   // unvisible
        star.setActive(false);    // unactive
        this.cnt++;
        let growthValue = 10 / Math.log(1 + this.cnt);
        score += growthValue;
        if (this.mytext) {this.mytext.destroy();}
        
        this.mytext = this.add.text(30, 30, score);

        if (star.particles) {
            star.particles.forEach(particle => particle.destroy()); // destroy particle
        }

        // this.circle.setScale(this.circle.scale + 0.05);
        let particle_size = 0.5 + this.cnt*0.02 > 1 ? 1 : 0.5 + this.cnt*0.02;
        particles.setScale({
            start: particle_size, // Increased from 0.5 to 0.8
            end: 0.1    // Keep the end size or increase as needed
        });
        
        // console.log(this.cnt);
    }

    updateScoreText(){
        // Update displayed score
        if (this.mytext) {this.mytext.destroy();}
        this.mytext = this.add.text(30, 30, score);
    }

    toNextScene(){
        this.scene.start('YellowScene');
    }


    update(time,delta) {
        const speed = 200;
        this.updateScoreText();
        // shot the star
        if(this.spaceKey.isDown){
            if(score > 20 && time - this.timer > 1000){
                this.circle.body.setEnable(false); 
                score -= 20;
                console.log("shot star");
                this.shot_star();
                console.log("shot star finish");
                overlap_enable = false;
                // console.log("overlap");
                // console.log(overlap_enable);
                this.time.delayedCall(500, () => {
                    this.circle.body.setEnable(true);  // 重新启用物理碰撞体
                    overlap_enable = true;
                    // if (this.circle.y >= 250 && this.circle.y <= 350){
                    //     for(let i = 0; i < 20; i++){
                    //         this.spawnStar();
                    //     }
                    // }
                    // if()
                });
                
            }
        }

        const distance = Phaser.Math.Distance.Between(this.circle.x, this.circle.y, 700, 300);

        if(distance < 200) {
            if(!this.timerRunning){
                this.timer = time;
                this.timerRunning = true;
            } 
            else if(time - this.timer > 3000){ 
                this.generateAndExplodeStars();
                this.timerRunning = false;  // reset timer
            }
        } 
        else this.timerRunning = false; 

        // reset speed
        this.circle.body.setVelocity(0);

        // keyboard control
        if (this.cursors.left.isDown) this.circle.body.setVelocityX(-speed);
        else if (this.cursors.right.isDown) this.circle.body.setVelocityX(speed);
        if (this.cursors.up.isDown) this.circle.body.setVelocityY(-speed);
        else if (this.cursors.down.isDown) this.circle.body.setVelocityY(speed);

        // attract star

        if(overlap_enable)
        this.stars.children.iterate((star) => {
            const distance = Phaser.Math.Distance.Between(star.x, star.y, this.circle.x, this.circle.y);
            if(distance < 80){
                if (star.tween){
                    star.tween.stop();
                }
                this.physics.moveToObject(star, this.circle, 100);
            }

            else{
                if (!star.tween || !star.tween.isPlaying()) star.body.setVelocity(0);
            }
            if(star.particles){
                star.particles.forEach(particle => {
                    particle.x = star.x;
                    particle.y = star.y;
                });
            }
        });
    }

    createVerticalLine() {
        const width = this.sys.game.config.width; // 獲取遊戲畫面的寬度
        const height = this.sys.game.config.height; // 獲取遊戲畫面的高度

        // 創建粒子系統
        const particles = this.add.particles('yellowParticle');

        // 創建發射器
        const emitter = particles.createEmitter({
            x: width - 10, // 在畫面最右邊
            y: { min: 0, max: height }, // 從上到下
            lifespan: 2000, // 粒子存在時間
            speedY: { min: -100, max: 100 }, // 垂直速度範圍
            scale: { start: 0.5, end: 0 }, // 粒子從顯示到消失的大小變化
            blendMode: 'ADD', // 混合模式
            frequency: 50, // 發射頻率
            quantity: 1 // 每次發射的數量
        });
    }

    generateAndExplodeStars() {
        if(gen_cnt++ < 2)
            for(let i = 0; i < 20; i++){ // Number of stars to generate
                this.generate_star_for_switch_particle();
            }
        
        // console.log("gen_cnt");
        // console.log(gen_cnt);
    }


    shot_star() {
        let star = this.physics.add.image(400, 100, 'logo');
        star.setVelocity(800, 0);
        this.stars.add(star);

        star.setCollideWorldBounds(true);
        star.on('worldbounds', () => {
            console.log("star.destroy")
            star.destroy(); 
        });

        this.physics.add.collider(star, this.switch_circle, (star, switch_circle) => {
            console.log("shoot success");
            star.destroy();
            for(let i = 0; i < 20; i++)
            this.spawnStar();
        });


        const particles = this.add.particles('red');
        const emitter = particles.createEmitter({
            x: this.circle.x,
            y: this.circle.y,
            speed: 800, 
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            angle: 0, 
            lifespan: 1000,
            frequency: -1,
        });
    
        emitter.emitParticle();
    }

    generate_star_for_switch_particle(){
        const x = Phaser.Math.Between(650, 750);
        const y = Phaser.Math.Between(250, 350);
    
        // create centen circle
        const star = this.add.circle(x, y, 1, 0xffffff);
        this.physics.add.existing(star);
        
        star.body.setBounce(Phaser.Math.FloatBetween(0.4, 0.8));
        star.body.setCollideWorldBounds(true);
        this.stars.add(star);
    
        // add particle to star
        const starParticle = this.add.image(x, y, 'red').setAlpha(0.5).setScale(0.2);
        star.particles = [starParticle];
    
        // scale up or scale down
        this.tweens.add({
            targets: starParticle,
            scale: { from: 0.1, to: 0.3 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    
        // 晃一個
        this.createStarTween(star);
    }
}

export default YellowScene;
