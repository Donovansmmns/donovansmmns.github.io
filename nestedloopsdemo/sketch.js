//Interactive Scene Assignment.
//Donovan Simmons.
//Sept 25, 2019.
//
//Extra For Experts.
function setup(){
  createCanvas(400, 400);
}

//function draw(){
  //for (let i=0; i<width; i+=5){
    //for (let j=0; j<height; j+= 5){
      //fill(int(random(255)), int(random(255)), int(random(255)));
      //noStroke();
      //rect(i, j, 500, 500)
    //}
  //}
//}

function draw(){
  drawChessBoard();


}

function drawChessBoard(){
  let cellSize;
  if (width >= height){
    cellSize = height/8;
  }
  else if (height > width){
    cellSize = width/8;
  }
  let isWhite = true;
  for (let x = 0; x<8; x++){
    for (let y = 0; y<8; y++){
      if (isWhite){
        fill(255);
      }
      else{
        fill(0);
      }
      rect(x * cellSize, y * cellSize, cellSize, cellSize);
      isWhite = !isWhite;
    }
    isWhite = !isWhite;
  }
}