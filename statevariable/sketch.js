//State Variable Assignment.
//Donovan Simmons.
//Oct 21, 2019.
//
//Extra For Experts.

//Player variables for movement and spawn location.
let playerX;
let playerY;
let dx;
let dy;
let movingUp = false;
let movingLeft = false;
let movingRight = false;

//Variables for start menu, level select, level end, platform detection, and a bonus for coins the player has collected.
let state = "start";
let level;
let end;
let onPlatform = false;
let star;
let starscollected;
//Loading images for platforms and end goal.
function preload(){
    end = loadImage("assets/end.png");
    //star = loadImage("assets/star.png");
}

//Player spawn location and speed.
function setup(){
    createCanvas(windowWidth, windowHeight);
    playerX = width/2;
    playerY = height-150;
    dx = 9;
    dy = 9;
} 

//Start menu which turns into a level select.
function draw(){
    background(255);
    if (state === "start"){
        startMenu();
    }
    else if (state === "level"){
        levelSelect();
    }
    border();
    levelOne();
    onPlatform1();
    
    
    player();
    gravity();

    
}

//Start screen to welcome players into game, when player clicks it turns into level select.
function startMenu(){
    fill(255);
    rect(width/2-50, height/2 + 100, 100, 50)
    textAlign(CENTER, CENTER);
    fill(0);
    textSize(40);
    text("PLAY", width/2, height/2+125)

    textAlign(CENTER, CENTER);
    fill(0);
    textSize(50);
    text("Welcome to  \nTHE GAME.\n Enjoy it ☺", width/2, height/2)
    if (mouseX > width/2 - 50 && mouseX < width/2 + 50 && mouseY > height/2 + 100 && mouseY < height/2 + 150){
        if (mouseIsPressed){
            state = "level";

        }
    }
}

//Level select, player can choose any level and it will load corresponding level.
function levelSelect(){
    if (state === "level"){
        fill(255);
        rect(width/4, height/5, 100, 100)
       
        textAlign(CENTER, TOP)
        fill(0);
        textSize(80);
        text("LEVEL SELECT", width/2, height/11);
        text("01", width/4+55, height/5+15)
       
        //Detection for player mouse clicking a certain level.
        if (mouseX <width/4+100 && mouseX > width/4 && mouseY < height/5+100 && mouseY > height/5){
            if (mouseIsPressed){
                if (state === "level"){
                    state = "level 1"
                }
            }
        }
          
    }
}

//Prevents player from going off screen.
function border(){
    if (playerX < 0){
        playerX = 1;
    }
    if (playerX > width - 50){
        playerX = width - 51;
    }
}

//If selected, loads level one with the image for the goal that was preloaded,
//this is supposed to be the level players use to get used to the controls.
function levelOne(){
    if (state === "level 1"){
        fill(0);
        rect(0, height-50, width, 50);
        rect(width - 100, height - 250, 100, 25)
        rect(width - 400, height - 400, 50, 25);
        rect(width/2-50, height/2 - 50, 100, 25);
        //image(star, width-100, height - 350, 100, 100)
        image(end, width/2 - 50, height/2 - 145, 100, 100)    
        
    }
}

//Loads player with set dimensions to begin with, checks if movement is detected and moves corresponding to direction player pressed.
function player(){
    if (state === "level 1"){
        fill("red");
        rect(playerX, playerY, 50, 100)
        if (movingUp) {
            playerY -= 3;
            // dy -= 3;
          }
        if (movingLeft) {
            playerX -= 5;
          }
        if (movingRight) {
            playerX += 5;         
        }
        if (key === "r"){
            playerX = width/2
            playerY = height - 150;
            dy = 0;
        }
    }
}


//Level one platform detection, if player is on platform it will stop player from phasing through it.
function onPlatform1() {
    if (playerX < width && playerX > width - 150 && playerY <= height - 330 && playerY >= height - 350){
        onPlatform = true;
    }
    
    else if (playerX >= width - 450 && playerX <= width - 350 && playerY <= height - 400 && playerY >= height - 500){
        onPlatform = true;
    }
    else if (playerX >= width/2 -100 && playerX <= width/2 + 50 && playerY <= height/2 - 125 && playerY >= height/2 - 150 ){
        onPlatform = true;
        if (key === " "){
            state = "level";
            playerX = width/2;
            playerY = height-150;
        }
    }
    else {
        onPlatform = false;
    }
}

//Constant function to simulate gravity and pull player down when not on a platform.
function gravity(){
    if (onPlatform){
        dy = 0;
    }
    else if (playerY < height-151 ){
        dy -=0.3;
        playerY -= dy;
    }
    if (playerY > height - 151 || onPlatform){
        dy = 9; 
    }
}


//Detects if key is pressed, activates variable to make player move.
  function keyPressed(){
    if (key === "w"){
      movingUp = true;
    }
    if (key === "a"){
      movingLeft = true;
    }
    if (key === "d"){
      movingRight = true;
    }
  }
  
  //Detects if key is released, reverts the variable back to false, stopping character from moving that direction.
  function keyReleased(){
    if (key === "w"){
      movingUp = false;
    }
    if (key === "a"){
      movingLeft = false;
    }
    if (key === "d"){
      movingRight = false;
    }
  }