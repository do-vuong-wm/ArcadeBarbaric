window.onload = function() {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container', { preload: preload, create: create, update: update });

    var platforms;

    var stars;

    var player;

    var enemy;

    var score = 0;

    var scoreText;

    var health = 5;

    var healthText;

    var music;

    var emitter;

    function preload () {

        game.load.image('sky', '/js/games/assets/sky.png');
        game.load.image('ground', '/js/games/assets/platform.png');
        game.load.image('star', '/js/games/assets/star.png');
        game.load.image('bubble', '/js/games/assets/bubble.png');
        game.load.spritesheet('dude', '/js/games/assets/dude.png', 32, 48);
        game.load.spritesheet('coin', '/js/games/assets/coin.png', 32, 32);
        game.load.spritesheet('octo', '/js/games/assets/baddie.png', 32, 32);
        game.load.audio('audio', '/js/games/assets/audio.wav');
        game.load.audio('pickup', '/js/games/assets/p-ping.mp3');
        game.load.audio('gameover', '/js/games/assets/player_death.wav');

    }

    function create () {

        music = game.add.audio('audio');

        music.loop = true;

        music.play();

        coinpick = game.add.audio('pickup');

        gameover = game.add.audio('gameover');

        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.add.sprite(0, 0, 'sky');

        emitter = game.add.emitter(game.world.centerX, 0, 5);

        emitter.width = 800;

        emitter.makeParticles('bubble', null, 5, true, true);

        emitter.minParticleSpeed.set(0, 200);
        emitter.maxParticleSpeed.set(0, 300);
        emitter.gravity = 150;
        emitter.bounce.setTo(0.5, 0.5);
        emitter.angularDrag = 30;

        emitter.start(false, 3000, 1000);

        platforms = game.add.group();

        platforms.enableBody = true;

        var ground = platforms.create(0, game.world.height - 25, 'ground');

        ground.scale.setTo(2, 2);

        ground.body.immovable = true;

        // The player and its settings
        player = game.add.sprite(32, game.world.height - 150, 'dude');
        enemy = game.add.sprite(400, 16, 'octo');

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);
        game.physics.arcade.enable(enemy);

        //  Player physics properties. Give the little guy a slight bounce.
        player.body.bounce.y = 0;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;

        enemy.body.velocity.x = game.rnd.between(200, 400);
        enemy.body.velocity.y = game.rnd.between(200, 400);
        enemy.body.gravity.y = 0;
        enemy.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        enemy.animations.add('left', [0, 1], 5, true);
        enemy.animations.add('right', [2, 3], 5, true);

        stars = game.add.group();

        stars.enableBody = true;

        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++)
        {
            //  Create a star inside of the 'stars' group
            var star = game.add.sprite(i * 70, 30 * i, 'coin', null, stars);

            //  Let gravity do its thing
            star.body.gravity.y = 300;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.7 + Math.random() * 0.2;

            star.animations.add('spin', [0, 1, 2, 3, 4, 5], 10, true, true);

            star.animations.play('spin');

        }

        scoreText = game.add.text(16, 16, 'Score: 0', { font: 'Impact', fontSize: '32px', fill: 'yellow' });

        healthText = game.add.text(game.world.height, 16, 'Oxygen: |||||', { font: 'Impact', fontSize: '32px', fill: 'blue' });

    }

    function update () {

//            console.log(" Y " + enemy.body.y);
//            console.log(" X " + enemy.body.x);

        game.physics.arcade.collide(emitter);

        //  Collide the player and the stars with the platforms
        var hitPlatform = game.physics.arcade.collide(player, platforms);

        hitPlatform = game.physics.arcade.collide(enemy, platforms);

        game.physics.arcade.collide(stars, platforms);

        game.physics.arcade.overlap(player, emitter, collectHealth, null, this);

        game.physics.arcade.overlap(player, enemy, gameOver);

        game.physics.arcade.overlap(player, stars, collectStar, null, this);

//            game.physics.arcade.overlap(player, bubbles, collectBubble, null, this);


        cursors = game.input.keyboard.createCursorKeys();

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
            //  Move to the left
            player.body.velocity.x = -150;

            player.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            player.body.velocity.x = 150;

            player.animations.play('right');
        }
        else
        {
            //  Stand still
            player.animations.stop();

            player.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown)
        {
            player.body.velocity.y = -200;
        }

        if(enemy.body.velocity.x < 0){

            enemy.animations.play('left');

        }else if(enemy.body.velocity.x > 0){

            enemy.animations.play('right');

        }

        function collectStar (player, star) {

            // Removes the star from the screen
            star.kill();

            coinpick.play();

            setTimeout(function(){

                var stargen = game.add.sprite((game.rnd.between(0, 11) * 70), (30 * (game.rnd.between(0, 11))), 'coin', null, stars);

                //  Let gravity do its thing
                stargen.body.gravity.y = 300;

                //  This just gives each star a slightly random bounce value
                stargen.body.bounce.y = 0.7 + Math.random() * 0.2;

                stargen.animations.add('spin', [0, 1, 2, 3, 4, 5], 10, true, true);

                stargen.animations.play('spin');

                //  Add and update the score
                score += 10;
                scoreText.text = 'Score: ' + score;

            }, 2000);

        }

        if(enemy.body.y < 25 || enemy.body.y > 520){

            if(enemy.body.velocity.x < 0 && enemy.body.velocity.y < 0){

                enemy.body.velocity.x = game.rnd.between(-200, -400);
                enemy.body.velocity.y = game.rnd.between(200, 400);

            }else if(enemy.body.velocity.x < 0 && enemy.body.velocity.y > 0){

                enemy.body.velocity.x = game.rnd.between(-200, -400);
                enemy.body.velocity.y = game.rnd.between(-200, -400);

            }else if(enemy.body.velocity.x > 0 && enemy.body.velocity.y > 0){

                enemy.body.velocity.x = game.rnd.between(200, 400);
                enemy.body.velocity.y = game.rnd.between(-200, -400);

            }else if(enemy.body.velocity.x > 0 && enemy.body.velocity.y < 0){

                enemy.body.velocity.x = game.rnd.between(200, 400);
                enemy.body.velocity.y = game.rnd.between(200, 400);

            }

        }

        if(enemy.body.x < 25 || enemy.body.x > 745){

            if(enemy.body.velocity.x < 0 && enemy.body.velocity.y < 0){

                enemy.body.velocity.x = game.rnd.between(200, 400);
                enemy.body.velocity.y = game.rnd.between(-200, -400);

            }else if(enemy.body.velocity.x < 0 && enemy.body.velocity.y > 0){

                enemy.body.velocity.x = game.rnd.between(200, 400);
                enemy.body.velocity.y = game.rnd.between(200, 400);

            }else if(enemy.body.velocity.x > 0 && enemy.body.velocity.y > 0){

                enemy.body.velocity.x = game.rnd.between(-200, -400);
                enemy.body.velocity.y = game.rnd.between(200, 400);

            }else if(enemy.body.velocity.x > 0 && enemy.body.velocity.y < 0){

                enemy.body.velocity.x = game.rnd.between(-200, -400);
                enemy.body.velocity.y = game.rnd.between(-200, -400);

            }

        }

        function collectHealth (player, bubble){

            bubble.kill();

        }

        function gameOver(player){

            gameover.play();

        }

    }

};