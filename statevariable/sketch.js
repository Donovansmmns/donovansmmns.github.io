//Interactive Scene Assignment.
//Donovan Simmons.
//Sept 25, 2019.
//
//Extra For Experts.
let playerX;
let playerY;
let dx;
let dy;
let coinsCollected;

let state = "start";
let level;


function setup(){
    createCanvas(windowWidth, windowHeight);
    playerX = width/2;
    playerY = height-150;
    dx = 9;
    dy = 9;
} 

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
    player()
    onPlatform1();
    gravity();
    
}

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

function levelSelect(){
    if (state === "level"){
        fill(255);
        rect(width/4, height/5, 100, 100)
       
        textAlign(CENTER, TOP)
        fill(0);
        textSize(80);
        text("LEVEL SELECT", width/2, height/11);
        text("01", width/4+55, height/5+15)
       
        if (mouseX <width/4+100 && mouseX > width/4 && mouseY < height/5+100 && mouseY > height/5){
            if (mouseIsPressed){
                if (state === "level"){
                    state = "level 1"
                }
            }
        }  
    }
}

function border(){
    if (playerX < 0){
        playerX = 1;
    }
    if (playerX > width - 50){
        playerX = width - 51;
    }
}

function levelOne(){
    if (state === "level 1"){
        fill(0);
        rect(0, height-50, width, 50);
        rect(width - 100, height - 250, 100, 25)
        rect(width - 400, height - 400, 50, 25);
        rect(width/2-50, height/2 - 50, 100, 25)
        
    }
}

function player(){
    if (state === "level 1"){
        fill(0);
        rect(playerX, playerY, 50, 100)
        if (keyIsPressed){
            if (key === "d"){
                playerX += dx;
            }
            if (key === "a"){
                playerX -= dx;
            }
            if (key === "w"){
                playerY -= dy;
            }
            if (key === "r"){
                playerX = width/2;
                playerY = height-150;
                dy = 9;
            }   
        }   
    }
}


function gravity(){
    if (playerY < height-150){
        dy -=0.3;
        playerY -= dy;
    }
    if (playerY > height - 150 || (!onPlatform1)){
        dy = 9;
    }
}

function onPlatform1() {
    if (playerY <= height - 350 && playerY >= 250 && playerX < width && playerX > width - 125){
        dy = 0;
    }
}