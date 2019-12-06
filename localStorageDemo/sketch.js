// Local Storage Demo

let numberOfClicks = 0;
let allTimeHighestClicks;

function setup() {
  createCanvas(windowWidth, windowHeight);
  if (getItem("highestClicks") !== null){
    allTimeHighestClicks = getItem("highestClicks");
  }
  else{
    allTimeHighestClicks = 0;
  }
}

function draw() {
  background(255);  

  textSize(72)
  fill(0);
  text(numberOfClicks, 50, 100);

  fill("green");
  text(allTimeHighestClicks, 50, 200);
}

function mousePressed(){
  numberOfClicks++;

  if (numberOfClicks > allTimeHighestClicks){
    allTimeHighestClicks = numberOfClicks;
    storeItem("highestClicks", allTimeHighestClicks)
  }
}
