//Grid Assignment
//Donovan Simmons.
//Nov X, 2019
//
//Extra For Experts.


let grid;
let rows = 10;
let cols = 10 ;

function setup() {
  if (windowWidth>windowHeight){
    createCanvas(windowHeight, windowHeight);
  }
  else {
    createCanvas(windowWidth, windowWidth)
  }
  grid = createEmptyGrid(cols, rows);
}

function draw() {
  background(220);
  displayGrid(grid, rows, cols);
}

function windowResized(){
  if (windowWidth>windowHeight){
    createCanvas(windowHeight, windowHeight);
  }
  else {
    createCanvas(windowWidth, windowWidth)
  }
}
function mousePressed() {
  let cellSize = width/cols;

  let xCoord = floor(mouseX / cellSize);
  let yCoord = floor(mouseY / cellSize);
  
  if (grid[yCoord][xCoord] === 1) {
    grid[yCoord][xCoord] = 0;
  }
  else {
    grid[yCoord][xCoord] = 1;
  }
}

function createEmptyGrid(){
  let emptyGrid = [];
  for (let x = 0; x < cols; x++){
    emptyGrid.push([]);
    for (let y = 0; y < rows; y++){
      emptyGrid[x].push(0)
    }
  }
  return emptyGrid;
}

function displayGrid(grid, rows, cols) {
  let cellSize = width / cols;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 0) {
        fill(255);
      }
      else {
        fill(0);
      }
      rect(x*cellSize, y*cellSize, cellSize, cellSize);
    }
  }
}


