// Line Art Demo
// Donovan Simmons
// Sept 9, 2019
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


let george;
let jenna;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  george = new Walker(width/2 - 20, height/2);
  jenna = new Walker(width/2 + 20, height/2);
}

function draw() {
  george.move();  
  jenna.move();

  george.display();
  jenna.display();
}


class Walker {
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.fillColor = color(random(255), random(255), random(255));
    this.stepSize = 4;
    this.radius = 3;
  }

  display(){
    fill(this.fillColor);
    noStroke();
    circle(this.x, this.y, this.radius*2);
  }

  //randomize movement for object
  move() {
    let choice = random(100);
    if (choice < 25){
      this.y -= this.stepSize;
    }
    else if (choice < 50){
      this.y += this.stepSize;
    }
    else if (choice < 75){
      this.x -= this.stepSize;
    }
    else{
      this.x += this.stepSize;
    }
  }
}