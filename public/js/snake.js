var variables = getCookie("variables") ? JSON.parse(getCookie("variables")) : {};
var highscore = variables.hssnake ? variables.hssnake : 0
var speed = 10;

var keypressed = false;

document.getElementById('highscore').innerText = highscore;
document.getElementById('highscore').textContent = highscore;

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var grid = 16;
var count = 0;

var snake = {
    x: 160,
    y: 160,

    // snake velocity. moves one grid length every frame in either the x or y direction
    dx: grid,
    dy: 0,

    // keep track of all grids the snake body occupies
    cells: [],

    // length of the snake. grows when eating an apple
    maxCells: 4
};
var apple = {
    x: 320,
    y: 320
};

// get random whole numbers in a specific range
// @see https://stackoverflow.com/a/1527820/2124254
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
// game loop
function loop() {
    let score = snake.cells.length - 4
    if (score >= 0) {
        var scoreBar = document.getElementById('score');
        scoreBar.innerText = score;
        scoreBar.textContent = score;
        if (score > highscore) {
            var highscoreBar = document.getElementById('highscore');
            highscoreBar.innerText = score;
            highscoreBar.textContent = score;
            variables.hssnake = score
            document.cookie = `variables=${JSON.stringify(variables)}`
        }
    }


    requestAnimationFrame(loop);

    // slow game loop to 15 fps instead of 60 (60/15 = 4)
    if (++count < speed) {
        return;
    }
    
    keypressed = false
    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);

    
        // move snake by it's velocity
    snake.x += snake.dx;
    snake.y += snake.dy;

    // wrap snake position horizontally on edge of screen
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    // wrap snake position vertically on edge of screen
    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    // keep track of where snake has been. front of the array is always the head
    snake.cells.unshift({ x: snake.x, y: snake.y });

    // remove cells as we move away from them
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // draw apple
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // draw snake one cell at a time
    context.fillStyle = 'green';
    snake.cells.forEach(function(cell, index) {

        // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        // snake ate apple
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;

            // canvas is 400x400 which is 25x25 grids 
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
        }

        // check collision with all cells after this one (modified bubble sort)
        for (var i = index + 1; i < snake.cells.length; i++) {

            // snake occupies same space as a body part. reset game
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                snake.x = 160;
                snake.y = 160;
                snake.cells = [];
                snake.maxCells = 4;
                snake.dx = grid;
                snake.dy = 0;

                apple.x = getRandomInt(0, 25) * grid;
                apple.y = getRandomInt(0, 25) * grid;
            }
        }
    });
}

// listen to keyboard events to move the snake
document.addEventListener('keydown', function(e) {
    // prevent snake from backtracking on itself by checking that it's 
    // not already moving on the same axis (pressing left while moving
    // left won't do anything, and pressing right while moving left
    // shouldn't let you collide with your own body)
    if (keypressed) return
        // left arrow key
    if (e.which === 37 && snake.dx === 0) {
        keypressed = true
        snake.dx = -grid;
        snake.dy = 0;
    }
    // up arrow key
    else if (e.which === 38 && snake.dy === 0) {
        keypressed = true
        snake.dy = -grid;
        snake.dx = 0;
    }
    // right arrow key
    else if (e.which === 39 && snake.dx === 0) {
        keypressed = true
        snake.dx = grid;
        snake.dy = 0;
    }
    // down arrow key
    else if (e.which === 40 && snake.dy === 0) {
        keypressed = true
        snake.dy = grid;
        snake.dx = 0;
    }
});

var tsx
var tsy
var difference = 100;

document.addEventListener('touchstart', function(e) {
    tsx = e.touches[0].clientX
    tsy = e.touches[0].clientY
});

document.addEventListener('touchend', function(e) {
    var tex = e.changedTouches[0].clientX
    var tey = e.changedTouches[0].clientY
    var drc

    if (tsx + difference < tex) drc = "right"

    else if (tsx - difference > tex) drc = "left"

    else if (tsy + difference < tey) drc = "down"

    else if (tsy - difference > tey) drc = "up"

    // left arrow key
    if (drc === "left" && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    }
    // up arrow key
    else if (drc === "up" && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
    // right arrow key
    else if (drc === "right" && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
    // down arrow key
    else if (drc === "down" && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

// start the game
requestAnimationFrame(loop);

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return undefined;
}