//Interactive Scene Assignment.
//Donovan Simmons.
//Sept 25, 2019.
//
//Extra For Experts.
function setup(){
  createCanvas(windowWidth, windowHeight);
}

function draw(){
  for (let i=0; i<width; i+=5){
    for (let j=0; j<height; j+= 5){
      fill(int(random(255)), int(random(255)), int(random(255)));
      noStroke();
      rect(i, j, 500, 500)
    }
  }
}