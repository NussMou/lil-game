class ExchangeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ExchangeScene' });
        this.timerRunning = false;
        this.timer = 0;
    }

    preload() {
        this.load.setBaseURL('https://labs.phaser.io');
        this.load.image('red', 'assets/particles/red.png');
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

        // // particle
        // const particles = this.add.particles(0, 0, 'red', {
        //     speed: 100,
        //     scale: { start: 0.5, end: 0 },
        //     blendMode: 'ADD'
        // });
        console.log("exchangescene");
        window.particles = this.add.particles('red').createEmitter({
            speed: 100,
            scale: { start: 0.5, end: 0 }, // Ensure scale is an object
            blendMode: 'ADD'
        });

        window.switch_particle = this.add.particles('red').createEmitter({
            x:700,
            y:300,
            speed: 100,
            scale: { start: 1, end: 0 }, // Ensure scale is an object
            blendMode: 'ADD'
        });

        particles.startFollow(this.circle);

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
        if (this.mytext) {this.mytext.destroy();console.log("destroy");}
        
        this.mytext = this.add.text(30, 30, score);

        if (star.particles) {
            star.particles.forEach(particle => particle.destroy()); // destroy particle
        }

        this.circle.setScale(this.circle.scale + 0.1);
        let particle_size = 0.5 + this.cnt*0.02 > 1 ? 1 : 0.5 + this.cnt*0.02;
        particles.setScale({
            start: particle_size, // Increased from 0.5 to 0.8
            end: 0.1    // Keep the end size or increase as needed
        });
        
        console.log(this.cnt);
    }

    updateScoreText(){
        // Update displayed score
        if (this.mytext) {this.mytext.destroy();console.log("destroy");}
        this.mytext = this.add.text(30, 30, score);
    }

    update(time,delta) {
        const speed = 200;
        console.log("overlap_enable");
        console.log(overlap_enable);

        if (score >= 200){
            this.myText = this.add.text(400, 550, 'Press Space to go to next scene');
            // this.myText.setVisible(true); 
            this.spaceKey.enabled = true; 
        }

        // shot the star
        if(this.spaceKey.isDown){
            if(score > 20 && time - this.timer > 1000){
                this.circle.body.setEnable(false); 
                score -= 20;
                this.updateScoreText();
                this.shot_star();
                overlap_enable = false;
                console.log("overlap");
                console.log(overlap_enable);
                this.time.delayedCall(500, () => {
                    this.circle.body.setEnable(true);  // 重新启用物理碰撞体
                    overlap_enable = true;
                    if (this.circle.y >= 250 && this.circle.y <= 350){
                        for(let i = 0; i < 20; i++){
                            this.spawnStar();
                        }
                    }
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

    generateAndExplodeStars() {
        if(gen_cnt++ < 2)
            for(let i = 0; i < 20; i++){ // Number of stars to generate
                this.generate_star_for_switch_particle();
            }
        
        console.log("gen_cnt");
        console.log(gen_cnt);
    }


    shot_star() {
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

export default ExchangeScene;