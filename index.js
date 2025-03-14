const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 400;

let paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  // Buat tingkat kesusahan dengan lebar dan speed paddle yang bervariasi
  width: 80,
  height: 10,
  velocity: 0,
  speed: 4,
};

let padding = 10;
let brickRows = 4;
let brickCols = 9;
let totalPadding = (brickCols + 1) * padding;
let brickWidth = (canvas.width - totalPadding) / brickCols;
let brickHeight = 25;
let isPlay = false
let ball = {
  x:canvas.width / 2,
  y:canvas.height - 30,
  velocityY: 0,
  velocityX:0,
  speed:1,
  radius:5
}
let health = 3
let negativeX = false
let negativeY = true


let bricks = []
for (let y = 0; y < brickRows; y++) {
  for (let x = 0; x < brickCols; x++) {
    bricks.push({
      x: padding + x * (brickWidth + padding),
      y: padding + y * (brickHeight + padding),
      width: brickWidth,
      height: brickHeight
    })
  }
}


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

canvas.onclick = () => isPlay=true

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
  bricks.forEach(brick => {
    c.fillRect(brick.x, brick.y, brick.width, brick.height)
  })
}

function paddleBounce(){
  if((ball.y + ball.radius) === paddle.y && (ball.x + ball.radius) >= paddle.x && (ball.x - ball.radius) <= (paddle.x + paddle.width)){
    negativeY = true
  }
}

function renderBall() {
  c.beginPath();
  c.fillStyle = "red";
  if (ball.y - ball.radius > canvas.height) {
    if (health > 0) {
      health--;
      ball.y = canvas.height - 220;
      ball.x = canvas.width / 2;
    } else {
      gameOver();
    }
  }
  paddleBounce()
  if(isPlay){
    if((ball.x + ball.radius) >= 0 && ball.x <= (canvas.width - ball.radius)){
      if(ball.x === canvas.width - ball.radius){
        negativeX = true
      }else if(ball.x === ball.radius){
        negativeX = false
      }
      if(negativeX){
        ball.velocityX = -ball.speed
      }else{
        ball.velocityX = ball.speed
      }
    }
    if((ball.y + ball.radius) >= 0 && ball.y <= (canvas.height - ball.radius)){
      console.log(ball.y);
      if (ball.y === ball.radius) {
        negativeY = false;
      }
      if (!negativeY) {
        ball.velocityY = ball.speed;
      }else{
        ball.velocityY = -ball.speed;
      }
    }
  }
  ball.y += ball.velocityY;
  ball.x += ball.velocityX;
  c.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  c.fill();
  c.closePath();
}

function brickCollision() {
  bricks.forEach((brick, index) => {
    if (
      ball.x + ball.radius >= brick.x &&
      ball.x - ball.radius <= brick.x + brick.width &&
      ball.y + ball.radius >= brick.y &&
      ball.y - ball.radius <= brick.y + brick.height
    ) {
      const leftDist = Math.abs(ball.x - ball.radius - (brick.x + brick.width));
      const rightDist = Math.abs(ball.x + ball.radius - brick.x);
      const topDist = Math.abs(ball.y - ball.radius - (brick.y + brick.height));
      const bottomDist = Math.abs(ball.y + ball.radius - brick.y);

      const minDist = Math.min(leftDist, rightDist, topDist, bottomDist);

      if (minDist === leftDist || minDist === rightDist) {
        negativeX = !negativeX;
      } else {
        negativeY = !negativeY;
      }

      bricks.splice(index, 1);
    }
  });
}

function gameOver(){
  console.log("gameOver")
}

function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  renderPaddle();
  brickCollision()
  renderBricks();
  renderBall();
  requestAnimationFrame(animate);
}

animate();
