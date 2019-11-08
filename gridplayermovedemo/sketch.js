// WASD in Grid Demo

let grid;
let rows = 9;
let cols = 9;
let playerOneX = 0;
let playerOneY = 0;

let playerTwoX = 8;
let playerTwoY = 8;

let wall;
let breakable;

function preload(){
  wall = loadImage("assets/wall.png");
  breakable = loadImage("assets/breakable_wall.png")
}
function setup() {
  if (windowWidth > windowHeight) {
    createCanvas(windowHeight, windowHeight);
  }
  else {
    createCanvas(windowWidth, windowWidth);
  }
  grid = createEmptyGrid(cols, rows);
  grid[playerOneY][playerOneX] = "player one";
  grid[playerTwoY][playerTwoX] = "player two";
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
  if (key === "w" && playerOneY > 0 && grid[playerOneY-1][playerOneX] !== 1 && grid[playerOneY-1][playerOneX] !== "breakable object" ) { 
    playerOneY -= 1;
  }
  if (key === "s" && playerOneY < rows - 1 && grid[playerOneY+1][playerOneX] !== 1 && grid[playerOneY+1][playerOneX] !== "breakable object") {
    playerOneY += 1;
  }
  if (key === "d" && playerOneX < cols - 1 && grid[playerOneY][playerOneX+1] !== 1 && grid[playerOneY][playerOneX+1] !== "breakable object") {
    playerOneX += 1;
  }
  if (key === "a" && playerOneX > 0 && grid[playerOneY][playerOneX-1] !== 1 && grid[playerOneY][playerOneX-1] !== "breakable object") {
    playerOneX -= 1;
  }
  // put player back into grid
  grid[playerOneY][playerOneX] = "player one";
  
  // remove player from current spot
  grid[playerTwoY][playerTwoX] = 0;
}

function keyPressed(){
  // remove player from current spot
  grid[playerTwoY][playerTwoX] = 0;

  // move player two, checks if direction has obstacle ahead.
  if (keyCode === UP_ARROW && playerTwoY > 0 && grid[playerTwoY-1][playerTwoX] !== 1 && grid[playerTwoY-1][playerTwoX] !== "breakable object") { 
    playerTwoY -= 1;
  }
  if (keyCode === DOWN_ARROW && playerTwoY < rows - 1 && grid[playerTwoY+1][playerTwoX] !== 1 && grid[playerTwoY+1][playerTwoX] !== "breakable object") {
    playerTwoY += 1;
  }
  if (keyCode === RIGHT_ARROW && playerTwoX < cols - 1 && grid[playerTwoY][playerTwoX+1] !== 1 && grid[playerTwoY][playerTwoX+1] !== "breakable object") {
    playerTwoX += 1;
  }
  if (keyCode === LEFT_ARROW && playerTwoX > 0 && grid[playerTwoY][playerTwoX-1] !== 1 && grid[playerTwoY][playerTwoX-1] !== "breakable object") {
    playerTwoX -= 1;
  }

  // put player back into grid
  grid[playerTwoY][playerTwoX] = "player two";
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
      }
      else if (y === 0 && x === 0 || y === 0 && x === 1 || y === 1 && x === 0 || y === 8 && x === 8 || y === 8 && x === 7 || y === 7 && x === 8){
        grid[y][x] = "open space";
        fill(255);
        
      }
      else{
        grid[y][x] = "breakable object";  
        fill("gray");
      }
      rect(x*cellSize, y*cellSize, cellSize, cellSize);
      if (y === playerTwoY && x === playerTwoX){
        fill("red");
      }
      rect(x*cellSize, y*cellSize, cellSize, cellSize);
    }
  }
}


