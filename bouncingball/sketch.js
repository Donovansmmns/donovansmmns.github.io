let x;
let y;
let dx;
let dy;
let radius = 100;
let rectSize = 100;
let mode = "square";

function setup() {
  createCanvas(windowWidth, windowHeight);
  x = width/2;
  y = height/2;
  dx = random(-100, 100);
  dy = random(-100, 100);
}

function draw() {
  background(0);


    //Bounces a square
  if (mode === "square"){
    displayRect();
  }
    //Bounces a circle
  else if (mode === "circle"){
    displayCircle();
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