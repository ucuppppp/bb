const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 400;

let paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  width: 80,
  height: 10,
  velocity: 0,
  speed: 4,
};

let brickRows = 4
let brickCols = 7
let brickWidth = 60
let brickHeight = 25
let padding = 10

let keys = {ArrowLeft: false, ArrowRight: false};

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowRight") {
    keys.ArrowRight = true;
    paddle.velocity = paddle.speed;
  }
  if (e.code === "ArrowLeft") {
    keys.ArrowLeft = true;
    paddle.velocity = -paddle.speed;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowRight") keys.ArrowRight = false;
  if (e.code === "ArrowLeft") keys.ArrowLeft = false;

  if (!keys.ArrowRight && !keys.ArrowLeft) {
    paddle.velocity = 0;
  } else if (keys.ArrowRight) {
    paddle.velocity = paddle.speed;
  } else if (keys.ArrowLeft) {
    paddle.velocity = -paddle.speed;
  }
});

function renderPaddle() {
  paddle.x += paddle.velocity;

  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width)
    paddle.x = canvas.width - paddle.width;

  c.fillStyle = "blue";
  c.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function renderBricks() {
  c.fillStyle = "blue";
  for (let i = 0; i < brickRows; i++) {
    for (let j = 0; j < brickCols; j++) {
      c.fillRect(
        padding + j * (brickWidth + padding),
        padding + i * (brickHeight + padding),
        brickWidth,
        brickHeight 
      );
    }
  }
}

function renderBall(){
  c.fillStyle='red'
  c.arc(canvas.width / 2, canvas.height - 30, 10, 0, Math.PI * 2)
  c.fill()
}

function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  renderPaddle();
  renderBricks()
  renderBall()
  requestAnimationFrame(animate);
}

animate();
