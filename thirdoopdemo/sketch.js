// Line Art Demo
// Donovan Simmons
// Sept 9, 2019
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let theFireworks = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
}

function draw() {
  background(0);
  for (let i = theFireworks.length-1; i >= 0; i--){
    theFireworks[i].move();
    if (theFireworks[i].isDone()){
      theFireworks.splice(i, 1);
    }
    else{
      theFireworks[i].display();
    }
  }

  if (mouseIsPressed){
  let myFirework = new Particle(mouseX, mouseY, random(-5, 5), random(-5, 5), 10);
  for (let i = 0; i < 100; i++){
    let myFirework = new Particle(mouseX, mouseY, random(-5, 5), random(-5, 5), 10);
    theFireworks.push(myFirework); 
    }
  }
}

function mousePressed(){
  for (let i = 0; i < 100; i++){
  let xDir = map(cos(i*4), -1, 1, -3, 3);
  let yDir = map(sin(i*4), -1, 1, -3, 3)
  let myFirework = new Particle(mouseX, mouseY, random(-3, 3), random(-3, 3), 10);
  theFireworks.push(myFirework); 
  }
  
}


class Particle {
  constructor(x, y, dx, dy, radius){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.alpha = 255;
    this.gravity = -.5;
    this.expand = .1;
  }

  display(){
    noStroke();
    fill(random(255), random(255), random(255), this.alpha);
    circle(this.x, this.y, this.radius * 2);
  }

  move(){
    if (this.gravity <= 0.05){
      this.gravity += .05;
    }
    else if(this.gravity >= .6) {
      this.gravty *= -1;
    }
    this.dy += this.gravity
    this.x += this.dx;
    this.y += this.dy;
    this.alpha -= 2;
    if (this.x > mouseX){
      this.x += this.expand
    }
    else{
      this.x -= this.expand
    }
  }


  isDone(){
    return this.alpha <=0;
  }
}