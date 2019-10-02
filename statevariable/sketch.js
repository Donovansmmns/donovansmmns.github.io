//Interactive Scene Assignment.
//Donovan Simmons.
//Sept 25, 2019.
//
//Extra For Experts.
let playerX;
let playerY;

let state = "start";
let level;


function setup(){
    createCanvas(windowWidth, windowHeight);
    
} 

function draw(){
    background(255);
    startMenu();
    levelSelect();
    levelOne();
}

function startMenu(){
    if (state === "start"){
        textAlign(CENTER, CENTER);
        fill(0);
        textSize(50);
        text("Welcome to  \nTHE GAME.\n Enjoy it ☺", width/2, height/2)
    }

    if (mouseIsPressed){
        state = "level";
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
    }
}