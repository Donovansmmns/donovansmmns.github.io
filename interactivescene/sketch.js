let playerX = 100;
let playerY;
let dy;
let playerSize = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  playerX = 100;
  playerY = height/2;
  dy = -1;
  
}

  //Creates player
function draw() {
  background(0);
  displayRect();
}

  //Updates canvas to keep player in center regardless of browser size
function windowResized() {
  setup();
}
  //Momentum of player
function moveShape(){
  playerY += dy;
}



function displayRect(){
  fill(255);
  playerY = height/2;
  rect(playerX, playerY, playerSize, playerSize);
  playerY += dy;
  
  if (playerY > height - rectSize || playerY < 0){
    dy *= -1;
  }
}