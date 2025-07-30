const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

let box = 20;
let snake = [{ x: 160, y: 160 }];
let food = spawnFood();
let direction = "right";
let score = 0;
let game;
let gameOverSound = new Audio("https://www.soundjay.com/button/sounds/button-10.mp3");

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "lightgreen";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Move snake
  let head = { ...snake[0] };
  if (direction === "left") head.x -= box;
  if (direction === "right") head.x += box;
  if (direction === "up") head.y -= box;
  if (direction === "down") head.y += box;

  // Game over
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= canvas.width || head.y >= canvas.height ||
    collision(head, snake)
  ) {
    clearInterval(game);
    gameOverSound.play();
    alert("Game Over! Score: " + score);
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").innerText = "Score: " + score;
    food = spawnFood();
  } else {
    snake.pop();
  }
}

function collision(head, array) {
  return array.slice(1).some(seg => seg.x === head.x && seg.y === head.y);
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

function setDirection(dir) {
  if (dir === "left" && direction !== "right") direction = "left";
  if (dir === "right" && direction !== "left") direction = "right";
  if (dir === "up" && direction !== "down") direction = "up";
  if (dir === "down" && direction !== "up") direction = "down";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") setDirection("left");
  if (e.key === "ArrowRight") setDirection("right");
  if (e.key === "ArrowUp") setDirection("up");
  if (e.key === "ArrowDown") setDirection("down");
});

document.getElementById("retry").onclick = () => {
  snake = [{ x: 160, y: 160 }];
  direction = "right";
  score = 0;
  document.getElementById("score").innerText = "Score: 0";
  food = spawnFood();
  clearInterval(game);
  game = setInterval(draw, 120);
};

game = setInterval(draw, 120);
