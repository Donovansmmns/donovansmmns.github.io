let spongebob;
let scalar =1;
function preload() {
  spongebob = loadImage("assets/spongebob.png");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  
}

function draw() {
  background(255);

  if (keyIsPressed){
    if (keyCode === UP_ARROW){
      console.log("Up arrow pressed.");
      scalar *= 1.02;
      
    }
    else if (keyCode === DOWN_ARROW) {
      console.log("Down arrow pressed.");
      scalar /= 1.02;
  }
}
  imageMode(CENTER);
  image(spongebob, mouseX, mouseY, spongebob.width * scalar, spongebob.height * scalar);
  
}


