let x;
let y;
let dx;
let dy;
let radius = 100;
let rectSize = 100;
let state = "menu";

function setup() {
  createCanvas(windowWidth, windowHeight);
  x = width/2;
  y = height/2;
  dx = random(-100, 100);
  dy = random(-100, 100);
}

function draw() {
  background(255);

  if (state === "menu"){
    showMenu();
    checkIfButtonClicked();
  }
    //Bounces a square
  if (state === "square"){
    displayRect();
    moveShape()
  }
    //Bounces a circle
  else if (state === "circle"){
    displayCircle();
    moveShape()
   }  
}

  function showMenu(){
    //show rect button
    fill(255, 0, 0, 125);
    rectMode(CENTER)
    rect(width/2, height/2, 400, 150);
    textAlign(CENTER, CENTER);
    textSize(50);
    fill(0);
    text("Square", width/2, height/2 - 100)
    

  }


function checkIfButtonClicked(){}
  if (mouseIsPressed) {
    //check for rectangle button
    if (mouseX > width/2 - 200 && mouseX < width/2 +  200 && mouseY > height/2 - 75 && mouseY < height/2 + 75){
      state = "square";
    }
    if (mouseX > width/2 - 200 && mouseX < width/2 +  200 && mouseY > height/2 - 175 && mouseY < height/2 + 175){
      state = "circle";
    }
  }


function windowResized() {
  setup();
}

function moveShape(){
  x += dx;
  y += dy;
}

function displayCircle(){
  fill(255);
  circle(x, y, radius);
  x += dx;
  y += dy;
  if (x > width - radius/2 || x < 0 + radius/2){
    dx *= -1;
  }
  
  if (y > height - radius/2 || y < 0 + radius/2){
    dy *= -1;
  } 
}

function displayRect(){
  fill(255);
  rect(x, y, rectSize, rectSize);
  x += dx;
  y += dy;
  if (x > width - rectSize || x < 0 ){
    dx *= -1;
  }
  
  if (y > height - rectSize || y < 0){
    dy *= -1;
  }
}