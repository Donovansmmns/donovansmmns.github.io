// WASD in Grid Demo

let grid;
let rows = 9;
let cols = 9;
let playerOneX = 0;
let playerOneY = 0;

let playerTwoX = 8;
let playerTwoY = 8;

function setup() {
  if (windowWidth > windowHeight) {
    createCanvas(windowHeight, windowHeight);
  }
  else {
    createCanvas(windowWidth, windowWidth);
  }
  grid = createEmptyGrid(cols, rows);
  grid[playerOneY][playerOneX] = "guy one";
  grid[playerTwoY][playerTwoX] = "guy two";
}

function draw() {
  background(220);
  displayGrid(grid, rows, cols);
}

function windowResized() {
  if (windowWidth > windowHeight) {
    createCanvas(windowHeight, windowHeight);
  }
  else {
    createCanvas(windowWidth, windowWidth);
  }
}

function keyTyped() {
  // remove player from current spot
  grid[playerOneY][playerOneX] = 0;

  // move player one, checks if direction has obstacle ahead.
  if (key === "w" && playerOneY > 0 && grid[playerOneY-1][playerOneX] !== 1 && grid[playerOneY-1][playerOneX] !== 2 ) { 
    playerOneY -= 1;
  }
  if (key === "s" && playerOneY < rows - 1 && grid[playerOneY+1][playerOneX] !== 1 && grid[playerOneY+1][playerOneX] !== 2) {
    playerOneY += 1;
  }
  if (key === "d" && playerOneX < cols - 1 && grid[playerOneY][playerOneX+1] !== 1 && grid[playerOneY][playerOneX+1] !== 2) {
    playerOneX += 1;
  }
  if (key === "a" && playerOneX > 0 && grid[playerOneY][playerOneX-1] !== 1 && grid[playerOneY][playerOneX-1] !== 2) {
    playerOneX -= 1;
  }
  // put player back into grid
  grid[playerOneY][playerOneX] = "guy one";
  
  // remove player from current spot
  grid[playerTwoY][playerTwoX] = 0;
}

function keyPressed(){
  // remove player from current spot
  grid[playerTwoY][playerTwoX] = 0;

  // move player two, checks if direction has obstacle ahead.
  if (keyCode === UP_ARROW && playerTwoY > 0 && grid[playerTwoY-1][playerTwoX] !== 1) { 
    playerTwoY -= 1;
  }
  if (keyCode === DOWN_ARROW && playerTwoY < rows - 1 && grid[playerTwoY+1][playerTwoX] !== 1) {
    playerTwoY += 1;
  }
  if (keyCode === RIGHT_ARROW && playerTwoX < cols - 1 && grid[playerTwoY][playerTwoX+1] !== 1) {
    playerTwoX += 1;
  }
  if (keyCode === LEFT_ARROW && playerTwoX > 0 && grid[playerTwoY][playerTwoX-1] !== 1) {
    playerTwoX -= 1;
  }

  // put player back into grid
  grid[playerTwoY][playerTwoX] = "guy two";
}

function createEmptyGrid() {
  let emptyGrid = [];
  for (let x = 0; x < cols; x++) {
    emptyGrid.push([]);
    for (let y = 0; y < rows; y++) {
      emptyGrid[x].push(0);
    }
  }
  return emptyGrid;
}

function displayGrid(grid, rows, cols) {
  let cellSize = width / cols;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (y === playerOneY && x === playerOneX) {
        fill("blue");
      }
      else if (y % 2 !== 0 && x % 2 !== 0){
        grid[y][x] = 1;
        fill(0);
      }
      else if (y === 0 && x === 2 || y === 2 && x === 0){
        grid[y][x] = 2;
        fill("gray");
      }
      else{
        fill(255);
      }
      rect(x*cellSize, y*cellSize, cellSize, cellSize);
      if (y === playerTwoY && x === playerTwoX){
        fill("red");
      }
      rect(x*cellSize, y*cellSize, cellSize, cellSize);
    }
  }
}
