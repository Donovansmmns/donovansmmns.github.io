let playerX;
let playerY;
let dy;
let playerSize = 50;
let state = "menu";
let obstacleWidth = 25;
let bottomObstacleHeight;

function setup() {
  createCanvas(windowWidth, windowHeight);
  playerX = 100;
  playerY = height/2;
  dy = 0;
  bottomObstacleHeight = height/2 - random(height/6 * -1, height/4)
}

  //Creates player
function draw() {
  background(0);
  if (mouseIsPressed) {
    state = "game";
  }
  if (state === "menu") {
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(40);
    text("Left Click to Fly!\nAvoid the obstacles to score points!\nIf you touch the ceiling or floor, you will also lose!", width/2, height/2);
  }
  else if (state = "game") {
    displayRect();
    displayBottomObstacle();
  }
}

  //Updates canvas to keep player in center regardless of browser size
function windowResized() {
  setup();
}

  //Spawns player
function displayRect(){
  fill(255);
  rect(playerX, playerY, playerSize, playerSize);
  
  //Gravity and upward momentum when clicking
  playerY += dy;
  dy += 0.4;
  if (mouseIsPressed) {
    if (mouseButton === LEFT) {
      dy = -10;
    }
  }
  if (playerY > height - playerSize - 9 || playerY < 0){
    dy = 0;
  }
}

function displayBottomObstacle(){
  fill("red");
  rect(width-100, bottomObstacleHeight, obstacleWidth, height);
}