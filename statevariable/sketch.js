//Interactive Scene Assignment.
//Donovan Simmons.
//Sept 25, 2019.
//
//Extra For Experts.
let playerX;
let playerY;
let coinsCollected;

let state = "start";
let level;


function setup(){
    createCanvas(windowWidth, windowHeight);
    
} 

function draw(){
    background(255);
    if (state === "start"){
        startMenu();
    }
    else if (state === "level"){
        levelSelect();
    }
    levelOne();
}

function startMenu(){
    fill(255);
    
    rect(width/2-50, height/2 + 100, 100, 50)

    textAlign(CENTER, CENTER);
    fill(0);
    textSize(50);
    text("Welcome to  \nTHE GAME.\n Enjoy it ☺", width/2, height/2)
    if (mouseX > width/2 - 50 && mouseX < width/2 + 50 && mouseY > height/2 + 50 && mouseY < height/2 + 100){
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

function levelOne(){
    if (state === "level 1"){
        fill(0);
        rect(0, height-50, width, 50);
        rect(width - 100, height - 250, 100, 25)
        rect(width - 400, height - 400, 50, 25);
        rect(width/2-50, height/2 - 50, 100, 25)
    }
}

