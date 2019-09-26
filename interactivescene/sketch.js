let playerX;
let playerY;
let playerSize = 50;
let dy;
let obstacleX;
let obstacleDX;
let obstacleWidth = 25;
let obstacleHeight;
let state = "menu";
let score = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  playerX = 100;
  playerY = height/2;
  dy = 0;
  obstacleHeight = height/2 - random(height/6 * -1, height/4);
  obstacleX = width - 100;
  obstacleDX = -3;
}

  //Begins game when clicking.
function draw() {
  background(0);
  if (mouseIsPressed) {
    state = "game";
  }
  //Start screen when opening game.
  if (state === "menu") {
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(40);
    text("Left Click to Fly!\nAvoid the obstacles to score points!\nIf you touch the ceiling or floor, you will also lose!", width/2, height/2);
  }
  //Calls function for player, obstacles, and score.
  else if (state = "game") {
    displayRect();
    displayObstacle();
    displayScore();
  }
}

  //Updates canvas to keep player in center regardless of browser size.
function windowResized() {
  setup();
}

  //Spawns player
function displayRect(){
  fill(255);
  rect(playerX, playerY, playerSize, playerSize);
  
  //Gravity and upward momentum when clicking.
  playerY += dy;
  dy += 0.4;
  if (mouseIsPressed) {
    if (mouseButton === LEFT) {
      dy = -10;
    }
  }
  
  //Ceiling and floor interaction stops player.
  if (playerY > height - playerSize - 9 || playerY < 0){
    dy = 0;
    obstacleDX = 0;
  }
  //Game ends if player touches obstacle
  if (playerX >= obstacleX || playerX + playerSize >= obstacleX){
    if (playerY >= obstacleHeight || playerY + playerSize >= obstacleHeight){
    dy = 0;
    obstacleDX = 0;      
    }

    
  }
  
}
  
  //Spawns obstacle making it have a random height, resets to original position with a new height if it passes the whole screen.
function displayObstacle(){
  fill("red");
  rect(obstacleX, obstacleHeight, obstacleWidth, height);
  obstacleX += obstacleDX;
  if (obstacleX <= 0){
    obstacleX = width - 100;
    obstacleHeight = height/2 - random(height/6 * -1, height/4);
  }
}
  
//Resets game, back to menu screen with score reset.
function keyTyped(){
  if (key === "r"){
    score = 0;
    obstacleX = width - 100;
    obstacleHeight = height/2 - random(height/6 * -1, height/4);
    obstacleDX = -3;
    playerY = height/2;
    state = "menu";

  }

  //Work in progress, rarely counts towards player score because the x position does not pass the point needed within 60 frames and gravity shift needs extra variable.
  if (key === "w"){
    obstacleDX += -5.5;
    dy += 5.5;
  }
  if (key === "s"){
    if (obstacleDX < -1.5){
      obstacleDX += 1.5;
     dy += -5.5;      
    }
  }
}
 
  //Text display of score.
function displayScore(){
  textAlign(CENTER, TOP);
  fill(255);
  textSize(50);
  text(score, width-100, 50);
  
  //Adds 1 point to the player's score
  if (playerX > (obstacleX + obstacleWidth + 72)){
    score += 1;
  }
}

