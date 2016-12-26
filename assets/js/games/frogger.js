/* Resources.js
 * This is simply an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 */
(function() {
    var resourceCache = {

        stone: '/js/games/frogger_asset/stone-block.png',
        grass: '/js/games/frogger_asset/grass-block.png',
        water: '/js/games/frogger_asset/water-block.png'

    };
    var loading = [[resourceCache.water],[resourceCache.stone],[resourceCache.stone],[resourceCache.stone],[resourceCache.grass],[resourceCache.grass]];
    var readyCallbacks = [];

    /* This is the publicly accessible image loading function. It accepts
     * an array of strings pointing to image files or a string for a single
     * image. It will then call our private image loading function accordingly.
     */
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            /* If the developer passed in an array of frogger_asset
             * loop through each value and call our image
             * loader on that image file
             */
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        } else {
            /* The developer did not pass an array to this function,
             * assume the value is a string and call our image loader
             * directly.
             */
            _load(urlOrArr);
        }
    }

    /* This is our private image loader function, it is
     * called by the public image loader function.
     */
    function _load(url) {
        if(resourceCache[url]) {
            /* If this URL has been previously loaded it will exist within
             * our resourceCache array. Just return that image rather
             * re-loading the image.
             */
            return resourceCache[url];
        } else {
            /* This URL has not been previously loaded and is not present
             * within our cache; we'll need to load this image.
             */
            var img = new Image();
            img.onload = function() {
                /* Once our image has properly loaded, add it to our cache
                 * so that we can simply return this image if the developer
                 * attempts to load this file in the future.
                 */
                resourceCache[url] = img;

                /* Once the image is actually loaded and properly cached,
                 * call all of the onReady() callbacks we have defined.
                 */
                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };

            /* Set the initial cache value to false, this will change when
             * the image's onload event handler is called. Finally, point
             * the image's src attribute to the passed in URL.
             */
            resourceCache[url] = false;
            img.src = url;
        }
    }

    /* This is used by developers to grab references to frogger_asset they know
     * have been previously loaded. If an image is cached, this functions
     * the same as calling load() on that URL.
     */
    function get(url) {
        return resourceCache[url];
    }

    /* This function determines if all of the frogger_asset that have been requested
     * for loading have in fact been properly loaded.
     */
    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
                !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    /* This function will add a function to the callback stack that is called
     * when all requested frogger_asset are properly loaded.
     */
    function onReady(func) {
        readyCallbacks.push(func);
    }

    /* This object defines the publicly accessible functions available to
     * developers by creating a global Resources object.
     */
    window.Resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load frogger_asset
    this.sprite = '/js/games/frogger_asset/enemy-bug.png';
    this.x = -101;
    this.y = 225; //Change row
    this.genRan = Math.floor(Math.random() * 3);
    this.speed = 10;
    this.gameStart = true;
    this.walk = true;
    this.count = 0;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if(this.gameStart){

        this.speed = Math.ceil(Math.random() * 5);

        if(this.genRan == 0){

            this.y = this.y - 83;

        }else if(this.genRan == 1){

            this.y = this.y - (83 * 2);

        }

        this.gameStart = false;

    }

    if(this.x <= 599) {
        this.x += this.speed;
        if (player.x < this.x + 50 && player.x + 50 > this.x && player.y < this.y + 50 && 50 + player.y > this.y){

            player.x = 202;
            player.y = 400;

        }
    }else{

        this.x = -101;
        this.y = 225;
        this.speed = Math.ceil(Math.random() * 5);
        if(this.genRan == 0){

            this.y = this.y - 83;

        }else if(this.genRan == 1){

            this.y = this.y - (83 * 2);

        }

    }



};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    if(this.walk) {

        //console.log('1');

        this.sprite = '/js/games/frogger_asset/enemy-bug2.png';
        this.count ++;

        if(this.count == 20){
            this.walk = false;
            this.count = 0;
        }

    }else{

        //console.log('2');

        this.sprite = '/js/games/frogger_asset/enemy-bug.png';

        this.count ++;

        if(this.count == 20){
            this.walk = true;
            this.count = 0;
        }

    }
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){

    this.sprite = '/js/games/frogger_asset/char-horn-girl.png';
    this.x = 202;
    this.y = 400;

};

Player.prototype.update = function(dt){


};

Player.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [new Enemy(),new Enemy(),new Enemy()];
var player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
window.addEventListener('keyup', function(e){

    if(e.key === 'ArrowRight') {

        if(player.x + 101 >= 505){

        }else {

            player.x += 101;
            player.render();

        }

    }else if(e.key === 'ArrowLeft'){

        if(player.x - 101 < 0){

        }else {

            player.x -= 101;
            player.render();

        }

    }else if(e.key === 'ArrowUp'){

        if(player.y - 83 < 59){

            player.x = 202;
            player.y = 400;

        }else{

            player.y -= 83;
            player.render();

        }

    }else if(e.key === 'ArrowDown'){

        if(player.y + 83 > 400){

        }else{

            player.y += 83;
            player.render();

        }

    }

});

/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();

    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */

    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                '/js/games/frogger_asset/water-block.png',   // Top row is water
                '/js/games/frogger_asset/stone-block.png',   // Row 1 of 3 of stone
                '/js/games/frogger_asset/stone-block.png',   // Row 2 of 3 of stone
                '/js/games/frogger_asset/stone-block.png',   // Row 3 of 3 of stone
                '/js/games/frogger_asset/grass-block.png',   // Row 1 of 2 of grass
                '/js/games/frogger_asset/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our frogger_asset
                 * so that we get the benefits of caching these frogger_asset, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the frogger_asset we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these frogger_asset are properly loaded our game will start.
     */
    Resources.load([
        '/js/games/frogger_asset/stone-block.png',
        '/js/games/frogger_asset/water-block.png',
        '/js/games/frogger_asset/grass-block.png',
        '/js/games/frogger_asset/enemy-bug.png',
        '/js/games/frogger_asset/enemy-bug2.png',
        '/js/games/frogger_asset/char-boy.png',
        '/js/games/frogger_asset/char-horn-girl.png',
        '/js/games/frogger_asset/char-cat-girl.png',
        '/js/games/frogger_asset/char-pink-girl.png',
        '/js/games/frogger_asset/char-princess-girl.png',
        '/js/games/frogger_asset/Star.png',
        '/js/games/frogger_asset/Gem Blue.png',
        '/js/games/frogger_asset/Gem Green.png',
        '/js/games/frogger_asset/Gem Orange.png',
        '/js/games/frogger_asset/Rock.png',
        '/js/games/frogger_asset/Key.png'

    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
