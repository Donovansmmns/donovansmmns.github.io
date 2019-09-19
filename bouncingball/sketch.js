
let y;

let dy;
let radius = 100;
let rectSize = 100;
let mode = "square";

function setup() {
  createCanvas(windowWidth, windowHeight);

  y = height/2;

  dy = random(-100, 100);
}

function draw() {
  background(0);


    //Bounces a square
  if (mode === "square"){
    displayRect();
  }
}

function windowResized() {
  setup();
}

function moveShape(){

  y += dy;
}


function displayRect(){
  fill(255);
  rect(500, y, rectSize, rectSize);

  y += dy;

  
  if (y > height - rectSize || y < 0){
    dy *= -1;
  }
}