class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.setBaseURL('https://labs.phaser.io');
        this.load.image('red', 'assets/particles/red.png');
    }

    create() {
        this.cameras.main.setBackgroundColor('#000030');
        window.get_star_num = 0;
        window.score = 0;
        this.myText = null;

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // this.spaceKey.enabled = false;

        // subject circle
        this.circle = this.add.circle(400, 300, 10, 0x000000);
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
        console.log("gamescene");
        window.particles = this.add.particles('red').createEmitter({
            speed: 100,
            scale: { start: 0.5, end: 0 }, // Ensure scale is an object
            blendMode: 'ADD'
        });

        // particles.setScale({
        //     start: 0.8, // Increased from 0.5 to 0.8
        //     end: 0.1    // Keep the end size or increase as needed
        // });

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
        get_star_num++;
        let growthValue = 10 / Math.log(1 + get_star_num);
        score += growthValue;
        if (this.mytext) {this.mytext.destroy();console.log("destroy");}
        this.registry.set('score', score);
        this.registry.set('get_star_num', get_star_num);

        
        this.mytext = this.add.text(30, 30, score);

        if (star.particles) {
            star.particles.forEach(particle => particle.destroy()); // destroy particle
        }

        this.circle.setScale(this.circle.scale + 0.1);
        particles.setScale({
            start: 0.5 + get_star_num*0.02, // Increased from 0.5 to 0.8
            end: 0.1    // Keep the end size or increase as needed
        });
        
        console.log(get_star_num);
    }

    update() {
        const speed = 200;

        if (score >= 60){
            this.myText = this.add.text(400, 550, 'Press Space to go to next scene');
            // this.myText.setVisible(true); 
            this.spaceKey.enabled = true; 
        }

        if(this.spaceKey.isDown && this.spaceKey.enabled){
            this.scene.start('ExchangeScene');
        }

        // reset speed
        this.circle.body.setVelocity(0);

        // keyboard control
        if (this.cursors.left.isDown) this.circle.body.setVelocityX(-speed);
        else if (this.cursors.right.isDown) this.circle.body.setVelocityX(speed);
        if (this.cursors.up.isDown) this.circle.body.setVelocityY(-speed);
        else if (this.cursors.down.isDown) this.circle.body.setVelocityY(speed);

        // attract star
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
}

export default GameScene;