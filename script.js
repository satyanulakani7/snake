const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const retryBtn = document.getElementById("retryBtn");
const scoreDisplay = document.getElementById("scoreDisplay");
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake;
let food;
let dx;
let dy;
let score;
let gameInterval;

function initGame() {
  snake = [{ x: 10, y: 10 }];
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount),
  };
  dx = 1;
  dy = 0;
  score = 0;
  updateScore();
  retryBtn.style.display = "none";

  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 100);
}

function updateScore() {
  scoreDisplay.textContent = "Score: " + score;
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp": if (dy === 0) { dx = 0; dy = -1; } break;
    case "ArrowDown": if (dy === 0) { dx = 0; dy = 1; } break;
    case "ArrowLeft": if (dx === 0) { dx = -1; dy = 0; } break;
    case "ArrowRight": if (dx === 0) { dx = 1; dy = 0; } break;
  }
});

// Get rainbow color for each segment
function getRainbowColor(index) {
  const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
  return colors[index % colors.length];
}

function gameLoop() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (
    head.x < 0 || head.x >= tileCount ||
    head.y < 0 || head.y >= tileCount ||
    snake.some((s) => s.x === head.x && s.y === head.y)
  ) {
    clearInterval(gameInterval);
    gameOverSound.play();
    retryBtn.style.display = "inline-block";
    alert("Game Over! Your final score: " + score);
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    eatSound.play();
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } else {
    snake.pop();
  }

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw rainbow-colored snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = getRainbowColor(i + score); // shift color as it grows
    ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2);
  }

  // Draw food
  ctx.fillStyle = "white";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function restartGame() {
  initGame();
}

initGame();
