// Select the game canvas and set its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set the initial settings for the game
canvas.width = 400;
canvas.height = 400;
const grid = 20;
let count = 0;
let snake = [{ x: 160, y: 160 }, { x: 140, y: 160 }, { x: 120, y: 160 }, { x: 100, y: 160 }];
let apple = { x: 320, y: 320 };
let dx = grid;
let dy = 0;
let score = 0;
let changingDirection = false;
let gameSpeed = 100;
let gameOver = false; // Track game over state

// Function to start the game
function startGame() {
  gameOver = false; // Reset game over state
  const difficulty = document.getElementById('difficulty').value;
  
  switch(difficulty) {
    case 'easy':
      gameSpeed = 150;
      break;
    case 'medium':
      gameSpeed = 100;
      break;
    case 'hard':
      gameSpeed = 50;
      break;
  }

  document.removeEventListener('keydown', changeDirection); // Remove event listener before adding
  document.addEventListener('keydown', changeDirection);
  main();
  document.getElementById('startBtn').style.display = 'none'; // Hide start button
  document.getElementById('restartBtn').style.display = 'none'; // Hide restart button
  document.getElementById('score').textContent = score; // Reset score display
}

// Function to restart the game
function restartGame() {
  // Reset game variables
  snake = [{ x: 160, y: 160 }, { x: 140, y: 160 }, { x: 120, y: 160 }, { x: 100, y: 160 }];
  apple = { x: 320, y: 320 };
  dx = grid;
  dy = 0;
  score = 0;
  changingDirection = false;
  gameSpeed = 100;
  gameOver = false;

  startGame(); // Start the game again
}

// Main game loop
function main() {
  if (didGameEnd()) {
    gameOver = true; // Set game over state
    // Display game over message
    ctx.fillStyle = 'red';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
    document.getElementById('restartBtn').style.display = 'block'; // Show restart button
    return;
  }

  changingDirection = false;
  setTimeout(() => {
    clearCanvas();
    drawApple();
    advanceSnake();
    drawSnake();
    updateScore(); // Update score display

    // Call main again
    main();
  }, gameSpeed);
}

// Function to clear the canvas
function clearCanvas() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Function to draw the snake
function drawSnake() {
  ctx.fillStyle = 'lightgreen';
  ctx.strokestyle = 'darkgreen';
  snake.forEach(part => {
    ctx.fillRect(part.x, part.y, grid, grid);
    ctx.strokeRect(part.x, part.y, grid, grid);
  });
}

// Function to advance the snake
function advanceSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Wrap snake around the canvas edges for easy difficulty
  if (gameSpeed === 150) {
    if (head.x < 0) head.x = canvas.width - grid;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - grid;
    if (head.y >= canvas.height) head.y = 0;
  }

  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    score += 10;
    createApple();
  } else {
    snake.pop();
  }
}

// Function to change the direction of the snake
function changeDirection(event) {
  if (changingDirection || gameOver) return;
  changingDirection = true;

  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;
  const goingUp = dy === -grid;
  const goingDown = dy === grid;
  const goingRight = dx === grid;
  const goingLeft = dx === -grid;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -grid;
    dy = 0;
  }

  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -grid;
  }

  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = grid;
    dy = 0;
  }

  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = grid;
  }
}

// Function to draw the apple
function drawApple() {
  ctx.fillStyle = 'red';
  ctx.strokestyle = 'darkred';
  ctx.fillRect(apple.x, apple.y, grid, grid);
  ctx.strokeRect(apple.x, apple.y, grid, grid);
}

// Function to create a new apple
function createApple() {
  apple.x = getRandomInt(0, canvas.width / grid) * grid;
  apple.y = getRandomInt(0, canvas.height / grid) * grid;
  snake.forEach(part => {
    if (part.x === apple.x && part.y === apple.y) createApple();
  });
}

// Function to get a random integer
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Function to check if the game has ended
function didGameEnd() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }

  const hitLeftWall = snake[0].x < 0 && gameSpeed !== 150; // Check collision only for medium and hard
  const hitRightWall = snake[0].x >= canvas.width && gameSpeed !== 150;
  const hitTopWall = snake[0].y < 0 && gameSpeed !== 150;
  const hitBottomWall = snake[0].y >= canvas.height && gameSpeed !== 150;

  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

// Function to update the score display
function updateScore() {
  document.getElementById('score').textContent = snake.length - 4;
}
