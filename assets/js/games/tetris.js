var divframe = document.createElement("div");
divframe.setAttribute("id", "frame");
divframe.style.height = "auto";
divframe.style.display = "block";
divframe.style.margin = "auto";
divframe.style.width = "490px";
divframe.style.border = "thick solid #0000FF";
var divaudio = document.createElement("div");
divaudio.setAttribute("id", "myAudio");
var body = document.getElementsByTagName("BODY")[0];
body.appendChild(divframe);
body.appendChild(divaudio);

window.addEventListener("keydown", move);
window.addEventListener("keyup", move2);

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

var canvas = document.getElementById('frame');
var x = document.getElementById("myAudio");
var techno = document.createElement("audio");
techno.setAttribute("src", "/js/games/tetris_asset/backmusic.mp3");
techno.play();
techno.volume = .6;
techno.playbackRate = 1;
techno.loop = true;
x.appendChild(techno);

var stopGame = false;

var destroy = new Audio('/js/games/tetris_asset/zap.wav');

var canvasBlock = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1]
];

var r1;
var r2;
var r3;
var r4;
var c1;
var c2;
var c3;
var c4;
var newB1;
var newB2;
var newB3;
var newB4;
var thisone;
var idAnimate;
var idTimeout;
var id;
var fastAnim = 800;
var back = document.createElement('img');


var lineBlock = {

    color: 'black',
    ninety: [0, 1, 2, 3, 0, 0, 0, 0],
    oneeighty: [0, 0, 0, 0, 0, 1, 2, 3],
    speed: 1


};

var squareBlock = {

    color: 'yellow',
    ninety: [0, 0, 1, 1, 0, 1, 0, 1],
    oneeighty: [0, 1, 0, 1, 0, 0, 1, 1],
    speed: 1


};

var ssBlock = {

    color: 'orange',
    ninety: [1, 0, 1, 2, 0, 1, 1, 1],

    // 90deg

//        [0,2,0,0]
//        [1,3,0,0]
//        [0,4,0,0]
//        [0,0,0,0]

    // [1,2,1,0,2,1,1,1]
    // not right [1,0,1,2,2,1,1,1]

    //180 back
// [1,1,1,2,0,1,2,1]
// [0,1,2,1,1,1,1,2]

//        [0,0,0,0]
//        [1,2,3,0]
//        [0,4,0,0]
//        [0,0,0,0]

//        [0,1,0,0]
//        [0,2,4,0]
//        [0,3,0,0]
//        [0,0,0,0]

//        [0,4,0,0]
//        [0,3,1,0]
//        [0,2,0,0]
//        [0,0,0,0]

    // 180deg

//        [0,1,0,0]
//        [2,3,4,0]
//        [0,0,0,0]
//        [0,0,0,0]

//        [0,2,0,0]
//        [1,3,0,0]
//        [0,4,0,0]
//        [0,0,0,0]

    // Reverse 90deg [1,1,1,0,2,1,0,1]

//        [0,4,0,0]
//        [3,2,1,0]
//        [0,0,0,0]
//        [0,0,0,0]

    // Reverse 180deg [2,1,0,1,1,1,1,0]

//        [0,3,0,0]
//        [4,2,0,0]
//        [0,1,0,0]
//        [0,0,0,0]
    oneeighty: [0, 1, 1, 1, 1, 0, 1, 2],
    speed: 1

};

var lRBlock = {

    color: 'orange',
    ninety: [0, 1, 2, 3, 7, 7, 7, 7],
    oneeighty: [0, 1, 1, 1, 7, 6, 7, 8],
    speed: 1


};

var lLBlock = {

    color: 'orange',
    ninety: [0, 1, 2, 3, 7, 7, 7, 7],
    oneeighty: [0, 1, 1, 1, 7, 6, 7, 8],
    speed: 1


};

var zRBlock = {

    color: 'brown',
    ninety: [0, 1, 2, 3, 7, 7, 7, 7],
    oneeighty: [2, 2, 2, 2, 6, 7, 8, 9],
    speed: 1


};

var zLBlock = {

    color: 'brown',
    ninety: [0, 1, 2, 3, 7, 7, 7, 7],
    oneeighty: [2, 2, 2, 2, 6, 7, 8, 9],
    speed: 1


};

function genRan(min, max) {

    return Math.floor(Math.random() * max - min);

}

// Updates by outputing imgs again

function updateCanvas() {

    for (var i = 0; i < canvasBlock.length; i++) {

        for (var counter = 0; counter < canvasBlock[i].length; counter++) {

            if (canvasBlock[i][counter] === 0) {

                var back = document.createElement('img');
                back.src = '/js/games/tetris_asset/back.png';
                back.width = '30';
                back.height = '30';

                canvas.appendChild(back);

            } else {

                var block = document.createElement('img');
                block.src = '/js/games/tetris_asset/halloween.png';
                block.width = '30';
                block.height = '30';

                canvas.appendChild(block);

            }

            // debugging

//                canvas.appendChild(document.createElement('img')).alt = canvasBlock[i][counter];

        }

        canvas.appendChild(document.createElement('br'));

    }

}

// Clears the child nodes of parent element 'frame'

function clearCanvas() {
    var myNode = document.getElementById("frame");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

// clears previous blocks

function removeGhost() {

    newB1 = canvasBlock[r1][c1] = 0;
    newB2 = canvasBlock[r2][c2] = 0;
    newB3 = canvasBlock[r3][c3] = 0;
    newB4 = canvasBlock[r4][c4] = 0;

}

function randObject() {

    console.log('many');

    var randNum = genRan(0, 3);

    switch (randNum) {

        case 0:
            thisone = lineBlock;
            break;
        case 1:
            thisone = squareBlock;
            break;
        case 2:
            thisone = ssBlock;
            break;
        case 3:
            thisone = zBlock;

    }


    chosenBlock(thisone);

    // random chooses which block for the start

    function chosenBlock(x) {

        var noFind = true;

        r1 = x.oneeighty[0];
        r2 = x.oneeighty[1];
        r3 = x.oneeighty[2];
        r4 = x.oneeighty[3];
        c1 = x.oneeighty[4];
        c2 = x.oneeighty[5];
        c3 = x.oneeighty[6];
        c4 = x.oneeighty[7];

        for (var t = canvasBlock[0].length; t > 0; t--) {

            var run = genRan(0, canvasBlock[0].length);

            // finds a random col and check if there are any blocks if not spawn and if yes finds new
            // ends game if none found


            if (canvasBlock[r1][c1 + run] === 0 && canvasBlock[r2][c2 + run] === 0 && canvasBlock[r3][c3 + run] === 0 && canvasBlock[r4][c4 + run] === 0) {

                newB1 = canvasBlock[r1][c1 += run] = 2;
                newB2 = canvasBlock[r2][c2 += run] = 2;
                newB3 = canvasBlock[r3][c3 += run] = 2;
                newB4 = canvasBlock[r4][c4 += run] = 2;

                t = 0;
                noFind = false;

            }

        }

        if (noFind) {

            console.log('game over;');
            stopGame = true;
        }


    }

}

function right(){

    if (canvasBlock[r1][c1 + 1] === 1 || canvasBlock[r2][c2 + 1] === 1 || canvasBlock[r3][c3 + 1] === 1 || canvasBlock[r4][c4 + 1] === 1 || canvasBlock[r1].length - 1 === c1 || canvasBlock[r2].length - 1 === c2 || canvasBlock[r3].length - 1 === c3 || canvasBlock[r4].length - 1 === c4) {

        console.log('hit wall');


    } else if (stopGame) {

        clearCanvas();
        updateCanvas();

    }
    else {

        removeGhost();
        newB1 = canvasBlock[r1][c1 += 1] = 2;
        newB2 = canvasBlock[r2][c2 += 1] = 2;
        newB3 = canvasBlock[r3][c3 += 1] = 2;
        newB4 = canvasBlock[r4][c4 += 1] = 2;
        clearCanvas();
        updateCanvas();

    }

}

function left(){

    if (canvasBlock[r1][c1 - 1] === 1 || canvasBlock[r2][c2 - 1] === 1 || canvasBlock[r3][c3 - 1] === 1 || canvasBlock[r4][c4 - 1] === 1 || 0 === c1 || 0 === c2 || 0 === c3 || 0 === c4) {

        console.log('hit wall');
        clearCanvas();
        updateCanvas();

    } else if (stopGame) {

        clearCanvas();
        updateCanvas();

    }
    else {

        removeGhost();
        newB1 = canvasBlock[r1][c1 -= 1] = 2;
        newB2 = canvasBlock[r2][c2 -= 1] = 2;
        newB3 = canvasBlock[r3][c3 -= 1] = 2;
        newB4 = canvasBlock[r4][c4 -= 1] = 2;
        clearCanvas();
        updateCanvas();
    }
}

// listen for the left, up and right arrows and moves according

function move(event) {

    if (event.key === 'ArrowRight') {

        if ( !idTimeout ) {
            idTimeout = setTimeout(function() {
                idTimeout = null;
                right();
            }, 20);
        }

    } else if (event.key === 'ArrowLeft') {

        if ( !idTimeout ) {
            idTimeout = setTimeout(function() {
                idTimeout = null;
                left();
            }, 20);
        }

        // Rotates block

    } else if (event.key === 'ArrowUp') {

        //Speed downs

    }else if(event.key === 'ArrowDown') {

        fastAnim = 20;

        if ( !id ) {
            id = setTimeout(function() {
                clearTimeout(idAnimate);
                id = null;
                clearTimeout(idAnimate);
                animate();
            }, 10);
        }

    }

}

function move2(event) {

    if (event.key === 'ArrowDown') {

        fastAnim = 800;

    }

}

// Starts the game

randObject();

updateCanvas();

requestAnimationFrame(animate);

function animate() {

    idAnimate = setTimeout(function () {

        if (r4 === canvasBlock.length - 1 || r3 === canvasBlock.length - 1 || r2 === canvasBlock.length - 1 || r1 === canvasBlock.length - 1 || canvasBlock[r4 + 1][c4] === 1 || canvasBlock[r3 + 1][c3] === 1 || canvasBlock[r2 + 1][c2] === 1 || canvasBlock[r1 + 1][c1] === 1) {

            collision();

        } else {
            removeGhost();
            newB1 = canvasBlock[r1 += 1][c1] = 2;
            newB2 = canvasBlock[r2 += 1][c2] = 2;
            newB3 = canvasBlock[r3 += 1][c3] = 2;
            newB4 = canvasBlock[r4 += 1][c4] = 2;

            clearCanvas();
            updateCanvas();
            requestAnimationFrame(animate);
        }

    }, fastAnim);

}

function collision() {

    for (var r = 0; r < canvasBlock[0].length; r++) {

        if (canvasBlock[0][r] === 1) {

            console.log('game over;');
            stopGame = true;

        }

    }

    if (stopGame) {

        clearTimeout(idAnimate);
        cancelAnimationFrame(collision);
        cancelAnimationFrame(animate);

    } else {

        newB1 = canvasBlock[r1][c1] = 1;
        newB2 = canvasBlock[r2][c2] = 1;
        newB3 = canvasBlock[r3][c3] = 1;
        newB4 = canvasBlock[r4][c4] = 1;

        var rowCount = 0;

        for (var c = 0; c < canvasBlock.length; c++) {

            for (var h = 0; h < canvasBlock[c].length; h++) {

                for (var a = 0; a < canvasBlock[c][h]; a++) {

                    rowCount += canvasBlock[c][h];
                    console.log(rowCount);

                }

                // Clears the rows if all the arr values equals row length

                if (canvasBlock[c].length === rowCount) {

                    // Loops through the canvasBlock row and set it to 0

                    for (var f = 0; f < canvasBlock[c].length; f++) {

                        canvasBlock[c][f] = 0;

                    }

                    for (var v = c - 1; v > 0; v--) {

                        for (var p = 0; p < canvasBlock[v].length; p++) {

                            console.log('here');

                            canvasBlock[v + 1][p] = canvasBlock[v][p];
                            destroy.play();

                        }

                    }

                    rowCount = 0;

                }

            }

            rowCount = 0;

        }

        // Get new random blocks

        randObject();

        clearCanvas();
        updateCanvas();
        requestAnimationFrame(animate);

    }

}


//    canvasBlock[1][2] = 1;
//    canvasBlock[1][1] = 1;
//    canvasBlock[1][0] = 1;
