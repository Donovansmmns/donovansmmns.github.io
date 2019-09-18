let playerX = 100;
let playerY;
let dy;
let player = "square";
let playerSize = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  playerX = 100;
  playerY = height/2;
  dy = -1
  
}

  //Creates player
function draw() {
  background(0);

  if (player === "square"){
    displayRect();
  } 
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
  playerY = windowHeight/2;
  rect(playerX, playerY, playerSize, playerSize);
  playerY += dy;

  if (playerY > height - playerSize || playerY < 0){
  dy *= -1;
}
  
}