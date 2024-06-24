const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverScreen = document.getElementById('gameOverScreen');
const scoreDisplay = document.getElementById('score');
const gridSize = 20;
let snake = [{ x: 200, y: 200 }];
let food = { x: 0, y: 0 };
let dx = gridSize;
let dy = 0;
let score = 0;
let changingDirection = false;
let gameRunning = true;

// Initial setup
function startGame() {
    createFood();
    main();
}

function main() {
    if (!gameRunning) return;

    changingDirection = false;
    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        checkCollision();
        main();
    }, 100);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'darkwhite';
    ctx.fillRect(snakePart.x, snakePart.y, gridSize, gridSize);
    ctx.strokeRect(snakePart.x, snakePart.y, gridSize, gridSize);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    const didEatFood = snake[0].x === food.x && snake[0].y === food.y;
    if (didEatFood) {
        score += 1;
        scoreDisplay.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
}

function createFood() {
    food.x = getRandomNumber(0, canvas.width - gridSize);
    food.y = getRandomNumber(0, canvas.height - gridSize);
    // Check if food spawns on snake, if so, recreate it
    if (snake.some(part => part.x === food.x && part.y === food.y)) {
        createFood();
    }
}

function drawFood() {
    ctx.fillStyle = 'black';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;

    if (keyPressed === LEFT_KEY && dx === 0) {
        dx = -gridSize;
        dy = 0;
    }

    if (keyPressed === RIGHT_KEY && dx === 0) {
        dx = gridSize;
        dy = 0;
    }

    if (keyPressed === UP_KEY && dy === 0) {
        dx = 0;
        dy = -gridSize;
    }

    if (keyPressed === DOWN_KEY && dy === 0) {
        dx = 0;
        dy = gridSize;
    }
}

function checkCollision() {
    // Check if snake hits walls or itself
    if (snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height || checkSnakeCollision()) {
        gameOver();
    }
}

function checkSnakeCollision() {
    // Check if snake collides with itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

function gameOver() {
    gameRunning = false;
    gameOverScreen.style.display = 'block';
}

function restartGame() {
    snake = [{ x: 20, y: 20 }];
    dx = gridSize;
    dy = 0;
    score = 0;
    scoreDisplay.textContent = score;
    gameRunning = true;
    gameOverScreen.style.display = 'none';
    startGame();
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) / gridSize) * gridSize + min;
}

// Event listeners
document.addEventListener('keydown', changeDirection);
startGame();