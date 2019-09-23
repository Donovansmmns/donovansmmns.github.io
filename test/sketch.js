let rectX = 0;
let rectY = 0;
let rectSpeed;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectSpeed = 5;
}

function draw() {
  background(255);
  fill("black");
  rect(rectX,rectY,50,50);
  moveRect();
}

function moveRect() {
  if (rectY === 0) {
    if (rectX < width - 50) {
      rectX += rectSpeed
    }
  }
  if (rectX === width - 50) {
    if (rectY < height) {
      rectY += rectSpeed;
    }
  }
    if (rectY === height - 50) {
      //if (rectX <= width - 50) {
      rectX -= rectSpeed
    //}
  }
  if (rectX === 0) {
    if (rectY <= height - 50) {
      rectY -= rectSpeed;
    }
  }
}