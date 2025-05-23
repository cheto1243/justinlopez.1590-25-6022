const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const paddleWidth = 10, paddleHeight = 100;
let upArrow = false, downArrow = false;

const user = {
  x: 0,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: "white",
  score: 0
};

const computer = {
  x: canvas.width - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: "white",
  score: 0
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 5,
  velocityX: 5,
  velocityY: 5,
  color: "white"
};

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function drawText(text, x, y) {
  ctx.fillStyle = "white";
  ctx.font = "45px Arial";
  ctx.fillText(text, x, y);
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.velocityX = -ball.velocityX;
  ball.speed = 5;
}

function collision(b, p) {
  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  return (
    p.left < b.right &&
    p.top < b.bottom &&
    p.right > b.left &&
    p.bottom > b.top
  );
}

function update() {
  if (upArrow && user.y > 0) {
    user.y -= 8;
  } else if (downArrow && user.y + user.height < canvas.height) {
    user.y += 8;
  }

  computer.y += (ball.y - (computer.y + computer.height / 2)) * 0.1;

  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }

  let player = (ball.x < canvas.width / 2) ? user : computer;

  if (collision(ball, player)) {
    let collidePoint = ball.y - (player.y + player.height / 2);
    collidePoint = collidePoint / (player.height / 2);
    let angle = collidePoint * Math.PI / 4;
    let direction = (ball.x < canvas.width / 2) ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(angle);
    ball.velocityY = ball.speed * Math.sin(angle);
    ball.speed += 0.2;
  }

  if (ball.x - ball.radius < 0) {
    computer.score++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++;
    resetBall();
  }
}

function render() {
  drawRect(0, 0, canvas.width, canvas.height, "#000");
  drawText(user.score, canvas.width / 4, 50);
  drawText(computer.score, (3 * canvas.width) / 4, 50);
  drawRect(user.x, user.y, user.width, user.height, user.color);
  drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function game() {
  update();
  render();
}

setInterval(game, 1000 / 60);

document.addEventListener("keydown", event => {
  if (event.key === "ArrowUp") upArrow = true;
  if (event.key === "ArrowDown") downArrow = true;
});

document.addEventListener("keyup", event => {
  if (event.key === "ArrowUp") upArrow = false;
  if (event.key === "ArrowDown") downArrow = false;
});
